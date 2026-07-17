import { connectDB } from "@/lib/mongodb";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { FullReportDTO, ReportSummaryDTO } from "../dto/report-dashboard.dto";
import type { ReportDTO } from "../types/report.types";
import { getAccountsService } from "@/features/accounts/services/account.service";
import { getTransactionsService } from "@/features/transactions/services/transaction.service";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import { buildFinancialContext } from "@/features/ai/services/context-builder.service";
import { callGroq } from "@/features/ai/services/groq.service";
import {
  findReportsByUserId,
  findReportById,
  createReport,
  deleteReport,
} from "../repositories/report.repository";
import { generateReportSchema } from "../schemas/report.schema";
import { logger } from "@/lib/logger";

// Placeholder cache invalidation (reports are generated on-demand, not cached)
export function invalidateReportsCache(userId: string) {
  logger.info("Reports cache invalidation requested (no-op)", { userId });
}

// ─────────────────────────────────────────────
// Get Reports Dashboard Summary
// ─────────────────────────────────────────────
export async function getReportsSummaryService(
  userId: string
): Promise<ApiResponse<ReportSummaryDTO>> {
  try {
    const db = await connectDB();
    const reports = await findReportsByUserId(db, userId);

    // Get current financial metrics
    const [accountsRes, analyticsRes] = await Promise.all([
      getAccountsService(userId, { archived: "false" }),
      getDashboardAnalyticsService(userId, "This Month"),
    ]);

    const currentNetWorth =
      accountsRes.success && accountsRes.data
        ? accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0)
        : 0;

    const currentFinancialScore =
      analyticsRes.success && analyticsRes.data && analyticsRes.data.health.score !== null
        ? analyticsRes.data.health.score
        : null;

    const summary: ReportSummaryDTO = {
      totalReportsGenerated: reports.length,
      latestReportDate: reports.length > 0 ? reports[0].generatedAt : null,
      currentFinancialScore,
      currentNetWorth,
    };

    return {
      success: true,
      message: "Reports summary retrieved successfully",
      data: summary,
    };
  } catch (error) {
    logger.error("Failed to get reports summary", error, { userId });
    return {
      success: false,
      message: "Failed to retrieve reports summary",
    };
  }
}

// ─────────────────────────────────────────────
// Generate Full Financial Report
// ─────────────────────────────────────────────
export async function generateReportService(
  userId: string,
  userName: string,
  body: unknown
): Promise<ApiResponse<FullReportDTO>> {
  const parsed = generateReportSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return { success: false, message: "Validation failed.", errors };
  }

  const { reportType, startDate: customStart, endDate: customEnd } = parsed.data;

  try {
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (reportType === "Monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (reportType === "Annual") {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31);
    } else {
      // Custom
      startDate = customStart ? new Date(customStart) : new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = customEnd ? new Date(customEnd) : now;
    }

    // Fetch all financial data
    const [accountsRes, analyticsRes, budgetsRes, goalsRes] = await Promise.all([
      getAccountsService(userId, { archived: "false" }),
      getDashboardAnalyticsService(userId, "This Month"),
      getBudgetDashboardService(userId),
      getGoalsDashboardService(userId),
    ]);

    // Build report DTO
    const accounts = accountsRes.success && accountsRes.data
      ? {
          totalAccounts: accountsRes.data.length,
          totalBalance: accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0),
          accountsList: accountsRes.data.slice(0, 10).map((acc) => ({
            name: acc.name,
            type: acc.type,
            balance: acc.balance,
          })),
          largestAccount:
            accountsRes.data.length > 0
              ? accountsRes.data.reduce((max, acc) => (acc.balance > max.balance ? acc : max)).name
              : "N/A",
          inactiveAccountsCount: accountsRes.data.filter((acc) => acc.balance === 0).length,
        }
      : {
          totalAccounts: 0,
          totalBalance: 0,
          accountsList: [],
          largestAccount: "N/A",
          inactiveAccountsCount: 0,
        };

    const analytics = analyticsRes.success && analyticsRes.data
      ? {
          totalIncome: analyticsRes.data.summary.totalIncome,
          totalExpenses: analyticsRes.data.summary.totalExpenses,
          netSavings: analyticsRes.data.summary.netSavings,
          savingsRate: analyticsRes.data.summary.savingsRate,
          avgDailySpending: analyticsRes.data.summary.avgDailySpending,
          topCategories: analyticsRes.data.categories.slice(0, 5),
          highestTransaction: analyticsRes.data.summary.largestExpense,
        }
      : {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          savingsRate: 0,
          avgDailySpending: 0,
          topCategories: [],
          highestTransaction: 0,
        };

    const budgets = budgetsRes.success && budgetsRes.data
      ? {
          totalBudgetLimit: budgetsRes.data.summary.totalBudgetLimit,
          totalSpent: budgetsRes.data.summary.totalSpent,
          totalRemaining: budgetsRes.data.summary.totalRemaining,
          overallUtilization: budgetsRes.data.summary.overallHealthProgress,
          exceededCount: budgetsRes.data.summary.exceededBudgetsCount,
          healthyCount: budgetsRes.data.summary.onTrackBudgetsCount,
          budgets: budgetsRes.data.budgets.slice(0, 10).map((b) => ({
            name: b.budget.name,
            category: b.budget.category,
            limit: b.budget.budgetAmount,
            spent: b.spent,
            remaining: b.remaining,
            utilization: b.progressPercentage,
            status: b.status,
          })),
        }
      : {
          totalBudgetLimit: 0,
          totalSpent: 0,
          totalRemaining: 0,
          overallUtilization: 0,
          exceededCount: 0,
          healthyCount: 0,
          budgets: [],
        };

    const goals = goalsRes.success && goalsRes.data
      ? {
          totalGoals: goalsRes.data.summary.totalGoalsCount,
          completedGoals: goalsRes.data.summary.completedGoalsCount,
          activeGoals: goalsRes.data.summary.activeGoalsCount,
          totalTargetAmount: goalsRes.data.summary.totalTargetAmount,
          totalSaved: goalsRes.data.summary.totalSaved,
          totalRemaining: goalsRes.data.summary.totalRemaining,
          averageProgress: goalsRes.data.summary.averageProgressPercentage,
          nearestGoal:
            goalsRes.data.goals.length > 0
              ? goalsRes.data.goals.reduce((max, g) => (g.progressPercentage > max.progressPercentage ? g : max)).goal
                  .name
              : null,
          goals: goalsRes.data.goals.slice(0, 10).map((g) => ({
            name: g.goal.name,
            target: g.goal.targetAmount,
            saved: g.saved,
            remaining: g.remaining,
            progress: g.progressPercentage,
            etaMonths: Math.ceil(g.daysRemaining / 30.4),
            status: g.health,
          })),
        }
      : {
          totalGoals: 0,
          completedGoals: 0,
          activeGoals: 0,
          totalTargetAmount: 0,
          totalSaved: 0,
          totalRemaining: 0,
          averageProgress: 0,
          nearestGoal: null,
          goals: [],
        };

    const health =
      analyticsRes.success && analyticsRes.data
        ? {
            score: analyticsRes.data.health.score,
            rating: analyticsRes.data.health.rating,
            positiveFactors: [],
            riskFactors: [],
          }
        : {
            score: null,
            rating: "No Data",
            positiveFactors: [],
            riskFactors: [],
          };

    // Generate AI Executive Summary
    let aiSummary = "";
    try {
      const context = await buildFinancialContext(userId, userName);
      const prompt = `You are a financial advisor. Generate a concise executive summary (max 200 words) for this financial report.

Financial Data:
- Net Worth: ₹${accounts.totalBalance.toLocaleString("en-IN")}
- Income: ₹${analytics.totalIncome.toLocaleString("en-IN")}
- Expenses: ₹${analytics.totalExpenses.toLocaleString("en-IN")}
- Savings Rate: ${analytics.savingsRate.toFixed(1)}%
- Budget Utilization: ${budgets.overallUtilization.toFixed(1)}%
- Active Goals: ${goals.activeGoals}
- Financial Health Score: ${health.score || "N/A"}

Provide:
1. Overall financial summary
2. Key achievements
3. Risk factors (if any)
4. Actionable recommendations

Keep it professional and concise.`;

      const aiResponse = await callGroq([
        { role: "system", content: "You are a professional financial advisor providing executive summaries." },
        { role: "user", content: prompt },
      ]);

      aiSummary = aiResponse || "AI summary unavailable at this time.";
    } catch (error) {
      logger.error("Failed to generate AI summary for report", error, { userId });
      aiSummary = "AI analysis temporarily unavailable. Please review the detailed metrics below.";
    }

    const fullReport: FullReportDTO = {
      reportType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      generatedAt: new Date().toISOString(),
      summary: {
        netWorth: accounts.totalBalance,
        totalIncome: analytics.totalIncome,
        totalExpenses: analytics.totalExpenses,
        savingsRate: analytics.savingsRate,
        dailyAverageSpending: analytics.avgDailySpending,
        financialHealthScore: health.score,
        budgetUtilization: budgets.overallUtilization,
        goalProgress: goals.averageProgress,
      },
      accounts,
      analytics,
      budgets,
      goals,
      health,
      aiSummary,
    };

    // Save report to database
    const db = await connectDB();
    const fileName = `Financial_Report_${new Date().toISOString().split("T")[0]}.pdf`;
    await createReport(db, userId, {
      reportType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      fileName,
      summary: fullReport.summary,
      aiSummary,
      fullData: fullReport, // Store complete report for downloads
    });

    return {
      success: true,
      message: "Report generated successfully",
      data: fullReport,
    };
  } catch (error) {
    logger.error("Failed to generate report", error, { userId });
    return {
      success: false,
      message: "Failed to generate financial report",
    };
  }
}

// ─────────────────────────────────────────────
// Get Report History
// ─────────────────────────────────────────────
export async function getReportsHistoryService(userId: string): Promise<ApiResponse<ReportDTO[]>> {
  try {
    const db = await connectDB();
    const reports = await findReportsByUserId(db, userId);
    return { success: true, message: "Reports history retrieved", data: reports };
  } catch (err) {
    logger.error("Failed to load reports history", err, { userId });
    return { success: false, message: "Failed to load reports." };
  }
}

// ─────────────────────────────────────────────
// Get Report by ID
// ─────────────────────────────────────────────
export async function getReportByIdService(
  reportId: string,
  userId: string
): Promise<ApiResponse<FullReportDTO>> {
  try {
    const db = await connectDB();
    const report = await findReportById(db, reportId, userId);

    if (!report) {
      return { success: false, message: "Report not found" };
    }

    if (!report.fullData) {
      return { success: false, message: "Report data not available" };
    }

    return {
      success: true,
      message: "Report retrieved successfully",
      data: report.fullData,
    };
  } catch (error) {
    logger.error("Failed to get report by ID", error, { reportId, userId });
    return { success: false, message: "Failed to retrieve report" };
  }
}

// ─────────────────────────────────────────────
// Delete Report
// ─────────────────────────────────────────────
export async function deleteReportService(reportId: string, userId: string): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    const success = await deleteReport(db, reportId, userId);

    if (!success) {
      return { success: false, message: "Report not found or access denied." };
    }

    return { success: true, message: "Report deleted successfully", data: null };
  } catch (err) {
    logger.error("Failed to delete report", err, { reportId, userId });
    return { success: false, message: "Failed to delete report." };
  }
}
