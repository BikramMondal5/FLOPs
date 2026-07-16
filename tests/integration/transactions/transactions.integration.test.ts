import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  createTransactionService,
  getTransactionsService,
  getTransactionByIdService,
  updateTransactionService,
  archiveTransactionService,
} from "@/features/transactions/services/transaction.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { ObjectId } from "mongodb";

// Mock cache functions to avoid dependencies
vi.mock("@/features/analytics/services/analytics.service", () => ({ invalidateAnalyticsCache: vi.fn() }));
vi.mock("@/features/budget/services/budget.service", () => ({ invalidateBudgetCache: vi.fn() }));
vi.mock("@/features/goals/services/goal.service", () => ({ invalidateGoalsCache: vi.fn() }));
vi.mock("@/features/ai/services/ai.service", () => ({ invalidateAICache: vi.fn() }));
vi.mock("@/features/reports/services/report.service", () => ({ invalidateReportsCache: vi.fn() }));
vi.mock("@/features/notifications/services/notification.service", () => ({ invalidateNotificationsCache: vi.fn() }));

describe("Transactions Integration Tests", () => {
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

    // Create a base account for transactions
    const accountRes = await createAccountService(mockUserId, {
      name: "Standard Checking",
      type: "Checking",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("should create an income transaction and increment account balance", async () => {
    const txData = {
      accountId,
      amount: 250,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
      description: "Monthly salary bonus",
    };

    const createRes = await createTransactionService(mockUserId, txData);
    expect(createRes.success).toBe(true);
    expect(createRes.data).toBeDefined();
    expect(createRes.data?.amount).toBe(250);
    expect(createRes.data?.type).toBe("Income");

    // Verify account balance is incremented (1000 + 250 = 1250)
    const accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(1250);
  });

  it("should create an expense transaction and decrement account balance", async () => {
    const txData = {
      accountId,
      amount: 150,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
      description: "Dinner out",
    };

    const createRes = await createTransactionService(mockUserId, txData);
    expect(createRes.success).toBe(true);

    // Verify account balance is decremented (1000 - 150 = 850)
    const accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(850);
  });

  it("should update transaction details and adjust account balance correctly", async () => {
    // 1. Create a transaction of 200 Expense (1000 -> 800 balance)
    const createRes = await createTransactionService(mockUserId, {
      accountId,
      amount: 200,
      type: "Expense",
      category: "Utilities",
      transactionDate: new Date().toISOString(),
    });
    const txId = createRes.data!._id;

    // Verify balance
    let accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(800);

    // 2. Update to 50 Expense (balance should rollback 200 Expense -> 1000, apply 50 Expense -> 950)
    const updateRes = await updateTransactionService(txId, mockUserId, {
      amount: 50,
    });
    expect(updateRes.success).toBe(true);

    accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(950);
  });

  it("should archive a transaction and rollback balance changes", async () => {
    // 1. Create transaction of 300 Income (1000 -> 1300 balance)
    const createRes = await createTransactionService(mockUserId, {
      accountId,
      amount: 300,
      type: "Income",
      category: "Freelance",
      transactionDate: new Date().toISOString(),
    });
    const txId = createRes.data!._id;

    let accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(1300);

    // 2. Archive transaction (should rollback balance to 1000)
    const archiveRes = await archiveTransactionService(txId, mockUserId);
    expect(archiveRes.success).toBe(true);

    accountDoc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountDoc.balance).toBe(1000);

    // Verify transaction is archived in db
    const txDoc = await db.collection("transactions").findOne({ _id: new ObjectId(txId) });
    expect(txDoc.isArchived).toBe(true);
  });

  it("should query transactions with filters and pagination", async () => {
    await createTransactionService(mockUserId, { accountId, amount: 10, type: "Income", category: "Salary", transactionDate: "2026-01-01T00:00:00.000Z" });
    await createTransactionService(mockUserId, { accountId, amount: 20, type: "Expense", category: "Food", transactionDate: "2026-01-02T00:00:00.000Z" });
    await createTransactionService(mockUserId, { accountId, amount: 30, type: "Expense", category: "Transport", transactionDate: "2026-01-03T00:00:00.000Z" });

    const getRes = await getTransactionsService(mockUserId, { type: "Expense" });
    expect(getRes.success).toBe(true);
    expect(getRes.data?.transactions.length).toBe(2);
    expect(getRes.data?.pagination.totalCount).toBe(2);
  });
});
