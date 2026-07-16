import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  createAccountService,
  getAccountsService,
  getAccountByIdService,
  updateAccountService,
  archiveAccountService,
} from "@/features/accounts/services/account.service";
import { ObjectId } from "mongodb";

// Mock cache functions to avoid dependencies on empty/other modules
vi.mock("@/features/analytics/services/analytics.service", () => ({ invalidateAnalyticsCache: vi.fn() }));
vi.mock("@/features/budget/services/budget.service", () => ({ invalidateBudgetCache: vi.fn() }));
vi.mock("@/features/goals/services/goal.service", () => ({ invalidateGoalsCache: vi.fn() }));
vi.mock("@/features/ai/services/ai.service", () => ({ invalidateAICache: vi.fn() }));
vi.mock("@/features/reports/services/report.service", () => ({ invalidateReportsCache: vi.fn() }));
vi.mock("@/features/notifications/services/notification.service", () => ({ invalidateNotificationsCache: vi.fn() }));

describe("Accounts Integration Tests", () => {
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
  });

  it("should create and retrieve a new account", async () => {
    const createData = {
      name: "Savings Account",
      institution: "HDFC Bank",
      type: "Savings",
      currency: "INR",
      balance: 10000,
      color: "#00FF00",
      description: "My primary savings account",
    };

    const createRes = await createAccountService(mockUserId, createData);
    expect(createRes.success).toBe(true);
    expect(createRes.data).toBeDefined();
    expect(createRes.data?.name).toBe("Savings Account");
    expect(createRes.data?._id).toBeDefined();

    const accountId = createRes.data!._id;

    // Fetch the account back
    const getRes = await getAccountByIdService(accountId, mockUserId);
    expect(getRes.success).toBe(true);
    expect(getRes.data).toBeDefined();
    expect(getRes.data?.name).toBe("Savings Account");
    expect(getRes.data?.balance).toBe(10000);
  });

  it("should return false when retrieving non-existent account or unauthorized owner", async () => {
    const otherUserId = new ObjectId().toString();
    const createData = {
      name: "Private Wallet",
      type: "Cash",
      balance: 500,
    };

    const createRes = await createAccountService(mockUserId, createData);
    expect(createRes.success).toBe(true);

    const accountId = createRes.data!._id;

    // Attempt to access from other user
    const getRes = await getAccountByIdService(accountId, otherUserId);
    expect(getRes.success).toBe(false);
    expect(getRes.data).toBeUndefined();
  });

  it("should update account fields correctly", async () => {
    const createRes = await createAccountService(mockUserId, {
      name: "Original Name",
      type: "Savings",
      balance: 1000,
    });
    const accountId = createRes.data!._id;

    const updateRes = await updateAccountService(accountId, mockUserId, {
      name: "Updated Name",
      balance: 1500,
    });
    expect(updateRes.success).toBe(true);
    expect(updateRes.data?.name).toBe("Updated Name");
    expect(updateRes.data?.balance).toBe(1500);

    // Verify change persists
    const getRes = await getAccountByIdService(accountId, mockUserId);
    expect(getRes.data?.name).toBe("Updated Name");
  });

  it("should archive an account (soft delete)", async () => {
    const createRes = await createAccountService(mockUserId, {
      name: "To Archive",
      type: "Credit",
      balance: -200,
    });
    const accountId = createRes.data!._id;

    const archiveRes = await archiveAccountService(accountId, mockUserId);
    expect(archiveRes.success).toBe(true);

    // After archiving, direct get should not return archived by default or service flags it as not found
    const getRes = await getAccountByIdService(accountId, mockUserId);
    expect(getRes.success).toBe(false);

    // It should exist in DB but marked as archived
    const accountsInDb = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
    expect(accountsInDb.isArchived).toBe(true);
  });

  it("should query and filter accounts correctly", async () => {
    await createAccountService(mockUserId, { name: "HDFC Savings", type: "Savings", balance: 5000 });
    await createAccountService(mockUserId, { name: "SBI Savings", type: "Savings", balance: 2000 });
    await createAccountService(mockUserId, { name: "ICICI Credit Card", type: "Credit", balance: -1000 });

    // Query active savings accounts
    const savingsList = await getAccountsService(mockUserId, { type: "Savings" });
    expect(savingsList.success).toBe(true);
    expect(savingsList.data?.length).toBe(2);

    // Query search term
    const searchList = await getAccountsService(mockUserId, { search: "ICICI" });
    expect(searchList.success).toBe(true);
    expect(searchList.data?.length).toBe(1);
    expect(searchList.data?.[0].name).toBe("ICICI Credit Card");
  });
});
