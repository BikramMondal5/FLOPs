import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  createGoalService,
  getGoalsListService,
  updateGoalService,
  deleteGoalService,
  getGoalsDashboardService,
  invalidateGoalsCache,
} from "@/features/goals/services/goal.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { ObjectId } from "mongodb";

// Mock cache functions to avoid dependencies
vi.mock("@/features/ai/services/ai.service", () => ({ invalidateAICache: vi.fn() }));

describe("Goals Integration Tests", () => {
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
    invalidateGoalsCache(mockUserId);

    // Setup an account for logging savings transactions
    const accountRes = await createAccountService(mockUserId, {
      name: "Savings Vault",
      type: "Savings",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("should create, list, update, and delete a goal record", async () => {
    // 1. Create
    const goalData = {
      name: "New Car Fund",
      targetAmount: 500000,
      currentAmount: 10000,
      category: "Transport",
      targetDate: "2030-12-31T00:00:00.000Z",
    };

    const createRes = await createGoalService(mockUserId, goalData);
    expect(createRes.success).toBe(true);
    expect(createRes.data).toBeDefined();
    expect(createRes.data?.name).toBe("New Car Fund");
    expect(createRes.data?.targetAmount).toBe(500000);
    const goalId = createRes.data!._id;

    // 2. List
    const listRes = await getGoalsListService(mockUserId);
    expect(listRes.success).toBe(true);
    expect(listRes.data?.length).toBe(1);

    // 3. Update
    const updateRes = await updateGoalService(goalId, mockUserId, {
      currentAmount: 25000,
    });
    expect(updateRes.success).toBe(true);
    expect(updateRes.data?.currentAmount).toBe(25000);

    // 4. Delete
    const deleteRes = await deleteGoalService(goalId, mockUserId);
    expect(deleteRes.success).toBe(true);

    const listResAfter = await getGoalsListService(mockUserId);
    expect(listResAfter.data?.length).toBe(0);
  });

  it("should compile dashboard metrics incorporating current savings pace", async () => {
    // 1. Create a Goal with 10000 target and 1000 current
    await createGoalService(mockUserId, {
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 1000,
      category: "Savings",
      targetDate: "2028-12-31T00:00:00.000Z",
    });

    // 2. Add an Income transaction of 3000 to increase netSavings pace
    await createTransactionService(mockUserId, {
      accountId,
      amount: 3000,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
    });

    const dashboardRes = await getGoalsDashboardService(mockUserId);
    expect(dashboardRes.success).toBe(true);
    expect(dashboardRes.data).toBeDefined();

    const goalItem = dashboardRes.data!.goals[0];
    expect(goalItem).toBeDefined();
    expect(goalItem.name).toBe("Emergency Fund");
    expect(goalItem.progressPercentage).toBe(10); // 1000 / 10000
    expect(goalItem.prediction).toBeDefined();
  });
});
