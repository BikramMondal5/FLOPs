import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  createBudgetService,
  getBudgetsListService,
  updateBudgetService,
  deleteBudgetService,
  getBudgetDashboardService,
  invalidateBudgetCache,
} from "@/features/budget/services/budget.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { ObjectId } from "mongodb";

// Mock cache functions to avoid dependencies
vi.mock("@/features/goals/services/goal.service", () => ({ invalidateGoalsCache: vi.fn() }));
vi.mock("@/features/ai/services/ai.service", () => ({ invalidateAICache: vi.fn() }));

describe("Budgets Integration Tests", () => {
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
    invalidateBudgetCache(mockUserId);

    // Setup an account for logging budget transactions
    const accountRes = await createAccountService(mockUserId, {
      name: "Checking Account",
      type: "Checking",
      balance: 5000,
    });
    accountId = accountRes.data!._id;
  });

  it("should create, list, update, and delete a budget record", async () => {
    // 1. Create
    const budgetData = {
      category: "Food",
      limit: 1000,
      period: "monthly",
    };

    const createRes = await createBudgetService(mockUserId, budgetData);
    expect(createRes.success).toBe(true);
    expect(createRes.data).toBeDefined();
    expect(createRes.data?.category).toBe("Food");
    expect(createRes.data?.limit).toBe(1000);
    const budgetId = createRes.data!._id;

    // 2. List
    const listRes = await getBudgetsListService(mockUserId);
    expect(listRes.success).toBe(true);
    expect(listRes.data?.length).toBe(1);

    // 3. Update
    const updateRes = await updateBudgetService(budgetId, mockUserId, {
      limit: 1500,
    });
    expect(updateRes.success).toBe(true);
    expect(updateRes.data?.limit).toBe(1500);

    // 4. Delete
    const deleteRes = await deleteBudgetService(budgetId, mockUserId);
    expect(deleteRes.success).toBe(true);

    const listResAfter = await getBudgetsListService(mockUserId);
    expect(listResAfter.data?.length).toBe(0);
  });

  it("should calculate correct budget utilization metrics", async () => {
    // Create a budget of 500 for Food
    await createBudgetService(mockUserId, {
      category: "Food",
      limit: 500,
      period: "monthly",
    });

    // Create an Expense of 200 in Food category
    await createTransactionService(mockUserId, {
      accountId,
      amount: 200,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
    });

    const dashboardRes = await getBudgetDashboardService(mockUserId);
    expect(dashboardRes.success).toBe(true);
    expect(dashboardRes.data).toBeDefined();

    const budgetItem = dashboardRes.data!.budgets.find((b) => b.category === "Food");
    expect(budgetItem).toBeDefined();
    expect(budgetItem?.spent).toBe(200);
    expect(budgetItem?.remaining).toBe(300);
    expect(budgetItem?.utilizationPercentage).toBe(40);
    expect(budgetItem?.status).toBe("normal"); // 40% spent is normal
  });

  it("should mark budget status as warning or exceeded when spending limits are reached", async () => {
    // Create a budget of 500 for Entertainment
    await createBudgetService(mockUserId, {
      category: "Entertainment",
      limit: 500,
      period: "monthly",
    });

    // Create an Expense of 420 in Entertainment (84% - warning threshold is usually 80%)
    await createTransactionService(mockUserId, {
      accountId,
      amount: 420,
      type: "Expense",
      category: "Entertainment",
      transactionDate: new Date().toISOString(),
    });

    let dashboardRes = await getBudgetDashboardService(mockUserId);
    let budgetItem = dashboardRes.data!.budgets.find((b) => b.category === "Entertainment");
    expect(budgetItem?.status).toBe("warning");

    // Create another Expense of 100 (total 520 - exceeds limit)
    await createTransactionService(mockUserId, {
      accountId,
      amount: 100,
      type: "Expense",
      category: "Entertainment",
      transactionDate: new Date().toISOString(),
    });

    // Invalidate budget cache because transaction triggers invalidation but we want to make sure it runs freshly
    invalidateBudgetCache(mockUserId);

    dashboardRes = await getBudgetDashboardService(mockUserId);
    budgetItem = dashboardRes.data!.budgets.find((b) => b.category === "Entertainment");
    expect(budgetItem?.status).toBe("exceeded");
  });
});
