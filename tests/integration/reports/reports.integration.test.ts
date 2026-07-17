import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { getReportDashboardService, invalidateReportsCache } from "@/features/reports/services/report.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { createBudgetService } from "@/features/budget/services/budget.service";
import { createGoalService } from "@/features/goals/services/goal.service";
import { ObjectId } from "mongodb";

describe("Reports Integration Tests", () => {
  let db: any;
  const mockUserId = new ObjectId().toString();
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    invalidateReportsCache(mockUserId);

    const accountRes = await createAccountService(mockUserId, {
      name: "Checking",
      type: "Current",
      balance: 10000,
    });
    accountId = accountRes.data!._id;
  });

  it("should compile reports successfully with accurate transaction aggregations", async () => {
    await createBudgetService(mockUserId, {
      name: "Monthly Food",
      category: "Food & Dining",
      budgetAmount: 1000,
      period: "Monthly",
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-31T23:59:59.000Z",
    });

    // Create goal
    await createGoalService(mockUserId, {
      name: "Vacation Fund",
      targetAmount: 20000,
      currentContribution: 1000,
      category: "Vacation",
      targetDate: "2027-12-31T00:00:00.000Z",
    });

    // Create income (Salary) and expense (Food)
    await createTransactionService(mockUserId, {
      accountId,
      amount: 4000,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
      merchant: "Employer",
      paymentMethod: "Net Banking",
    });

    await createTransactionService(mockUserId, {
      accountId,
      amount: 150,
      type: "Expense",
      category: "Food & Dining",
      transactionDate: new Date().toISOString(),
      merchant: "Restaurant",
      paymentMethod: "Cash",
    });

    const reportRes = await getReportDashboardService(mockUserId, "Monthly");
    expect(reportRes.success).toBe(true);
    expect(reportRes.data).toBeDefined();

    const summary = reportRes.data!.summary;
    expect(summary.totalIncome).toBe(4000);
    expect(summary.totalExpense).toBe(150);
    expect(summary.netSavings).toBe(3850);
    expect(reportRes.data!.budgetPerformance.length).toBe(1);
    expect(reportRes.data!.goalsProgress.length).toBe(1);
  });

  it("should return empty summary structure if no records exist", async () => {
    const reportRes = await getReportDashboardService(mockUserId, "Daily");
    expect(reportRes.success).toBe(true);
    expect(reportRes.data?.summary.totalIncome).toBe(0);
    expect(reportRes.data?.summary.totalExpense).toBe(0);
  });
});
