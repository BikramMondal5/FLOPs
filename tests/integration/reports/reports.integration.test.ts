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
      type: "Checking",
      balance: 10000,
    });
    accountId = accountRes.data!._id;
  });

  it("should compile reports successfully with accurate transaction aggregations", async () => {
    // Create budget
    await createBudgetService(mockUserId, {
      category: "Food",
      limit: 1000,
      period: "monthly",
    });

    // Create goal
    await createGoalService(mockUserId, {
      name: "Vacation",
      targetAmount: 20000,
      currentAmount: 1000,
      category: "Travel",
      targetDate: "2027-12-31T00:00:00.000Z",
    });

    // Create income (Salary) and expense (Food)
    await createTransactionService(mockUserId, {
      accountId,
      amount: 4000,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
    });

    await createTransactionService(mockUserId, {
      accountId,
      amount: 150,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
    });

    const reportRes = await getReportDashboardService(mockUserId, "Monthly");
    expect(reportRes.success).toBe(true);
    expect(reportRes.data).toBeDefined();

    const summary = reportRes.data!.summary;
    expect(summary.totalIncome).toBe(4000);
    expect(summary.totalExpenses).toBe(150);
    expect(summary.netSavings).toBe(3850);
    expect(reportRes.data!.budgets.length).toBe(1);
    expect(reportRes.data!.goals.length).toBe(1);
  });

  it("should return empty summary structure if no records exist", async () => {
    const reportRes = await getReportDashboardService(mockUserId, "Daily");
    expect(reportRes.success).toBe(true);
    expect(reportRes.data?.summary.totalIncome).toBe(0);
    expect(reportRes.data?.summary.totalExpenses).toBe(0);
  });
});
