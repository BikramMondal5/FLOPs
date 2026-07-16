import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  getNotificationsService,
  readAllNotificationsService,
  invalidateNotificationsCache,
} from "@/features/notifications/services/notification.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { createBudgetService } from "@/features/budget/services/budget.service";
import { createGoalService } from "@/features/goals/services/goal.service";
import { ObjectId } from "mongodb";

describe("Notifications Integration Tests", () => {
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
    invalidateNotificationsCache(mockUserId);

    const accountRes = await createAccountService(mockUserId, {
      name: "Checking",
      type: "Checking",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("should compile and sort notifications appropriately based on alerts triggered", async () => {
    // Create an exceeded budget to trigger a warning notification
    await createBudgetService(mockUserId, {
      category: "Food",
      limit: 100,
      period: "monthly",
    });

    await createTransactionService(mockUserId, {
      accountId,
      amount: 150, // exceeds budget
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
    });

    const notifRes = await getNotificationsService(mockUserId);
    expect(notifRes.success).toBe(true);
    expect(notifRes.data).toBeDefined();
    
    // There should be a notification about the budget status
    const budgetAlert = notifRes.data?.find((n) => n.title.includes("Budget"));
    expect(budgetAlert).toBeDefined();
    expect(budgetAlert?.isRead).toBe(false);
  });

  it("should mark all compiled notifications as read upon calling read-all service", async () => {
    // Exceed a budget
    await createBudgetService(mockUserId, {
      category: "Transport",
      limit: 50,
      period: "monthly",
    });
    await createTransactionService(mockUserId, {
      accountId,
      amount: 60,
      type: "Expense",
      category: "Transport",
      transactionDate: new Date().toISOString(),
    });

    let notifRes = await getNotificationsService(mockUserId);
    expect(notifRes.data?.some(n => !n.isRead)).toBe(true);

    // Call read all
    const readAllRes = await readAllNotificationsService(mockUserId);
    expect(readAllRes.success).toBe(true);

    // Check again
    notifRes = await getNotificationsService(mockUserId);
    expect(notifRes.data?.every(n => n.isRead)).toBe(true);
  });
});
