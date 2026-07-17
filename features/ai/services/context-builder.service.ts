import { getAccountsService } from "@/features/accounts/services/account.service";
import { getTransactionsService } from "@/features/transactions/services/transaction.service";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import { logger } from "@/lib/logger";

export interface FinancialContext {
  version: number;
  generatedAt: number;
  profile: {
    name: string;
  };
  accounts: {
    totalAccounts: number;
    totalBalance: number;
    netWorth: number;
    accountsList: Array<{
      name: string;
      type: string;
      balance: number;
    }>;
  };
  transactions: {
    recentCount: number;
    totalIncome: number;
    totalExpenses: number;
    recentTransactions: Array<{
      merchant: string;
      amount: number;
      type: string;
      category: string;
      date: string;
    }>;
  };
  analytics: {
    monthlySpending: number;
    savingsRate: number;
    avgDailySpending: number;
    topCategories: Array<{
      category: string;
      spent: number;
      percentage: number;
    }>;
  };
  budgets: Array<{
    name: string;
    category: string;
    budgetAmount: number;
    spent: number;
    remaining: number;
    utilization: number;
    status: string;
    projectedSpend: number;
    projectedOverspending: number;
    daysRemaining: number;
  }>;
  goals: Array<{
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    progress: number;
  }>;
}

/**
 * Build comprehensive financial context for the authenticated user
 * This function is the single source of truth for AI context
 */
export async function buildFinancialContext(
  userId: string,
  userName?: string
): Promise<FinancialContext> {
  logger.info("Building financial context for AI", { userId });

  try {
    // Fetch all financial data in parallel
    const [accountsRes, transactionsRes, analyticsRes, budgetsRes, goalsRes] =
      await Promise.all([
        getAccountsService(userId, { archived: "false" }),
        getTransactionsService(userId, { page: "1", limit: "20" }),
        getDashboardAnalyticsService(userId, "This Month"),
        getBudgetDashboardService(userId),
        getGoalsDashboardService(userId),
      ]);

    // Build profile
    const profile = {
      name: userName || "User",
    };

    // Build accounts summary
    const accounts = accountsRes.success && accountsRes.data
      ? {
          totalAccounts: accountsRes.data.length,
          totalBalance: accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0),
          netWorth: accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0),
          accountsList: accountsRes.data.map((acc) => ({
            name: acc.name,
            type: acc.type,
            balance: acc.balance,
          })),
        }
      : {
          totalAccounts: 0,
          totalBalance: 0,
          netWorth: 0,
          accountsList: [],
        };

    // Build transactions summary
    const transactions =
      transactionsRes.success && transactionsRes.data
        ? {
            recentCount: transactionsRes.data.transactions.length,
            totalIncome: transactionsRes.data.transactions
              .filter((t) => t.type === "Income")
              .reduce((sum, t) => sum + t.amount, 0),
            totalExpenses: transactionsRes.data.transactions
              .filter((t) => t.type === "Expense")
              .reduce((sum, t) => sum + t.amount, 0),
            recentTransactions: transactionsRes.data.transactions
              .slice(0, 10)
              .map((t) => ({
                merchant: t.merchant,
                amount: t.amount,
                type: t.type,
                category: t.category,
                date: new Date(t.transactionDate).toISOString().split("T")[0],
              })),
          }
        : {
            recentCount: 0,
            totalIncome: 0,
            totalExpenses: 0,
            recentTransactions: [],
          };

    // Build analytics summary
    const analytics =
      analyticsRes.success && analyticsRes.data
        ? {
            monthlySpending: analyticsRes.data.summary.totalExpenses,
            savingsRate: analyticsRes.data.summary.savingsRate,
            avgDailySpending: analyticsRes.data.summary.avgDailySpending,
            topCategories: analyticsRes.data.categories.slice(0, 5).map((cat) => ({
              category: cat.category,
              spent: cat.spent,
              percentage: cat.percentage,
            })),
          }
        : {
            monthlySpending: 0,
            savingsRate: 0,
            avgDailySpending: 0,
            topCategories: [],
          };

    // Build budgets summary
    const budgets =
      budgetsRes.success && budgetsRes.data && budgetsRes.data.budgets
        ? budgetsRes.data.budgets.map((b) => ({
            name: b.budget.name,
            category: b.budget.category,
            budgetAmount: b.budget.budgetAmount,
            spent: b.spent,
            remaining: b.remaining,
            utilization: b.progressPercentage,
            status: b.status,
            projectedSpend: b.projectedSpend,
            projectedOverspending: Math.max(0, b.projectedSpend - b.budget.budgetAmount),
            daysRemaining: b.daysRemaining,
          }))
        : [];

    // Build goals summary
    const goals =
      goalsRes.success && goalsRes.data && goalsRes.data.goals
        ? goalsRes.data.goals.map((g) => ({
            name: g.goal.name,
            targetAmount: g.goal.targetAmount,
            currentAmount: g.saved,
            targetDate: g.goal.targetDate,
            progress: g.progressPercentage,
          }))
        : [];

    const context: FinancialContext = {
      version: 1,
      generatedAt: Date.now(),
      profile,
      accounts,
      transactions,
      analytics,
      budgets,
      goals,
    };

    logger.info("Financial context built successfully", {
      userId,
      accountsCount: accounts.totalAccounts,
      transactionsCount: transactions.recentCount,
      budgetsCount: budgets.length,
      goalsCount: goals.length,
    });

    return context;
  } catch (error) {
    logger.error("Failed to build financial context", error, { userId });
    
    // Return empty context on error
    return {
      version: 1,
      generatedAt: Date.now(),
      profile: { name: userName || "User" },
      accounts: {
        totalAccounts: 0,
        totalBalance: 0,
        netWorth: 0,
        accountsList: [],
      },
      transactions: {
        recentCount: 0,
        totalIncome: 0,
        totalExpenses: 0,
        recentTransactions: [],
      },
      analytics: {
        monthlySpending: 0,
        savingsRate: 0,
        avgDailySpending: 0,
        topCategories: [],
      },
      budgets: [],
      goals: [],
    };
  }
}
