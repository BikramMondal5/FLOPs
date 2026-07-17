import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createAccountService, getAccountByIdService } from "@/features/accounts/services/account.service";
import { createTransactionService, archiveTransactionService } from "@/features/transactions/services/transaction.service";
import { getDashboardAnalyticsService, invalidateAnalyticsCache } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService, createBudgetService, invalidateBudgetCache } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService, createGoalService, invalidateGoalsCache } from "@/features/goals/services/goal.service";
import { getAIDashboardService, invalidateAICache } from "@/features/ai/services/ai.service";
import { getReportDashboardService, invalidateReportsCache } from "@/features/reports/services/report.service";
import { getNotificationsService, invalidateNotificationsCache } from "@/features/notifications/services/notification.service";
import { askGemini } from "@/features/ai/providers/llm.provider";
import { ObjectId } from "mongodb";

// Mock the Gemini Provider to avoid external network calls
vi.mock("@/features/ai/providers/llm.provider", () => ({
  askGemini: vi.fn(),
}));

describe("Cross-Engine Integration Workflows", () => {
  let db: any;
  const mockUserId = new ObjectId().toString();

  beforeAll(async () => {
    db = await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    vi.clearAllMocks();

    invalidateAnalyticsCache(mockUserId);
    invalidateBudgetCache(mockUserId);
    invalidateGoalsCache(mockUserId);
    invalidateAICache(mockUserId);
    invalidateReportsCache(mockUserId);
    invalidateNotificationsCache(mockUserId);
  });

  it("Workflow 1: Account -> Income -> Ledger -> Analytics -> Budget -> Goal -> AI -> Report -> Notifications", async () => {
    // 1. Setup account
    const accountRes = await createAccountService(mockUserId, {
      name: "Main Wallet",
      type: "Cash",
      balance: 1000,
    });
    const accountId = accountRes.data!._id;

    // 2. Setup budget
    await createBudgetService(mockUserId, {
      name: "Monthly Transport",
      category: "Transportation",
      budgetAmount: 200,
      period: "Monthly",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-31T23:59:59.000Z",
    });

    // 3. Setup goal
    await createGoalService(mockUserId, {
      name: "Holiday Trip",
      targetAmount: 50000,
      currentContribution: 2000,
      category: "Vacation",
      targetDate: "2029-05-01T00:00:00.000Z",
    });

    // 4. Log Income (creates transaction, runs ledger update)
    const incomeRes = await createTransactionService(mockUserId, {
      accountId,
      amount: 1500,
      type: "Income",
      category: "Other",
      transactionDate: new Date().toISOString(),
      merchant: "Bonus Client",
      paymentMethod: "Net Banking",
    });
    expect(incomeRes.success).toBe(true);

    // Verify Ledger updated account balance (1000 + 1500 = 2500)
    const accountVerify = await getAccountByIdService(accountId, mockUserId);
    expect(accountVerify.data?.balance).toBe(2500);

    // 5. Query Analytics (should propagate salary income)
    const analyticsRes = await getDashboardAnalyticsService(mockUserId, "This Month");
    expect(analyticsRes.data?.summary.totalIncome).toBe(1500);

    // 6. Query Budget utilization
    const budgetRes = await getBudgetDashboardService(mockUserId);
    expect(budgetRes.success).toBe(true);

    // 7. Query Goals progress (overall monthly savings pace matches net savings)
    const goalsRes = await getGoalsDashboardService(mockUserId);
    expect(goalsRes.success).toBe(true);

    // 8. Query AI Recommendations (inject mock LLM output)
    vi.mocked(askGemini).mockResolvedValueOnce(JSON.stringify({
      financialSummary: { overallStance: "Growing Savings", achievements: [], primaryConcerns: [], actionableStep: "Save more" },
      monthlyReview: { summaryParagraph: "", topExpenseCategory: "", topIncomeSource: "", budgetPerformanceNotice: "", goalHealthNotice: "" },
      recommendations: [], risks: [], opportunities: [], financialHealthExplanation: ""
    }));
    const aiRes = await getAIDashboardService(mockUserId);
    expect(aiRes.success).toBe(true);

    // 9. Query Report Compilation
    const reportRes = await getReportDashboardService(mockUserId, "Monthly");
    expect(reportRes.data?.summary.totalIncome).toBe(1500);

    // 10. Query Compiled notifications
    const notificationsRes = await getNotificationsService(mockUserId);
    expect(notificationsRes.success).toBe(true);
  });

  it("Workflow 2: Expense Workflow & Budget Alert Triggering", async () => {
    const accountRes = await createAccountService(mockUserId, {
      name: "Checking",
      type: "Current",
      balance: 1000,
    });
    const accountId = accountRes.data!._id;

    // Create budget
    await createBudgetService(mockUserId, {
      name: "Monthly Food",
      category: "Food & Dining",
      budgetAmount: 100,
      period: "Monthly",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-31T23:59:59.000Z",
    });

    // Create expense of 110 (exceeds budget)
    await createTransactionService(mockUserId, {
      accountId,
      amount: 110,
      type: "Expense",
      category: "Food & Dining",
      transactionDate: new Date().toISOString(),
      merchant: "Restaurant",
      paymentMethod: "Cash",
    });

    // Verify balance debited
    const accountVerify = await getAccountByIdService(accountId, mockUserId);
    expect(accountVerify.data?.balance).toBe(890);

    // Verify budget exceeded status
    const budgetRes = await getBudgetDashboardService(mockUserId);
    const foodBudget = budgetRes.data?.budgets.find(b => b.budget.category === "Food & Dining");
    expect(foodBudget?.status).toBe("Exceeded");

    // Verify notifications compile an exceeded warning
    const notificationsRes = await getNotificationsService(mockUserId);
    const alert = notificationsRes.data?.find(n => n.message.includes("Budget Exceeded"));
    expect(alert).toBeDefined();
    expect(alert?.severity).toBe("critical");
  });

  it("Workflow 3: Rollback on Archiving", async () => {
    const accountRes = await createAccountService(mockUserId, {
      name: "Checking",
      type: "Current",
      balance: 1000,
    });
    const accountId = accountRes.data!._id;

    // Log Expense
    const expenseRes = await createTransactionService(mockUserId, {
      accountId,
      amount: 200,
      type: "Expense",
      category: "Entertainment",
      transactionDate: new Date().toISOString(),
      merchant: "Cinema",
      paymentMethod: "Cash",
    });
    const txId = expenseRes.data!._id;

    // Balance should be 800
    let accountVerify = await getAccountByIdService(accountId, mockUserId);
    expect(accountVerify.data?.balance).toBe(800);

    // Archive transaction
    await archiveTransactionService(txId, mockUserId);

    // Balance should rollback to 1000
    accountVerify = await getAccountByIdService(accountId, mockUserId);
    expect(accountVerify.data?.balance).toBe(1000);
  });
});
