import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { getDashboardAnalyticsService, invalidateAnalyticsCache } from "@/features/analytics/services/analytics.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import { ObjectId } from "mongodb";

describe("Analytics Integration Tests", () => {
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
    invalidateAnalyticsCache(mockUserId);

    // Setup an account
    const accountRes = await createAccountService(mockUserId, {
      name: "Checking Account",
      type: "Current",
      balance: 2000,
    });
    accountId = accountRes.data!._id;
  });

  it("should calculate correct summary totals and category distributions", async () => {
    // Log income transaction of 1500
    await createTransactionService(mockUserId, {
      accountId,
      amount: 1500,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
      merchant: "Employer",
      paymentMethod: "Net Banking",
    });

    // Log expense transaction of 300
    await createTransactionService(mockUserId, {
      accountId,
      amount: 300,
      type: "Expense",
      category: "Food & Dining",
      transactionDate: new Date().toISOString(),
      merchant: "Restaurant",
      paymentMethod: "Cash",
    });

    const analyticsRes = await getDashboardAnalyticsService(mockUserId, "This Month");
    expect(analyticsRes.success).toBe(true);
    expect(analyticsRes.data).toBeDefined();

    const summary = analyticsRes.data!.summary;
    expect(summary.totalIncome).toBe(1500);
    expect(summary.totalExpenses).toBe(300);
    expect(summary.netSavings).toBe(1200);

    const categories = analyticsRes.data!.categories;
    const foodCat = categories.find((c) => c.category === "Food & Dining");
    expect(foodCat).toBeDefined();
    expect(foodCat?.spent).toBe(300);
  });

  it("should serve dashboard analytics from cache and fetch from DB after cache invalidation", async () => {
    // 1. Log transaction
    await createTransactionService(mockUserId, {
      accountId,
      amount: 100,
      type: "Income",
      category: "Salary",
      transactionDate: new Date().toISOString(),
      merchant: "Employer",
      paymentMethod: "Net Banking",
    });

    // First fetch
    const firstRes = await getDashboardAnalyticsService(mockUserId, "This Month");
    expect(firstRes.message).toBe("Dashboard analytics retrieved successfully");
    expect(firstRes.data?.summary.totalIncome).toBe(100);

    // 2. Log another transaction without invalidating cache (just in DB)
    // We modify database directly to avoid the automatic cache invalidation in createTransactionService
    await db.collection("transactions").insertOne({
      userId: new ObjectId(mockUserId),
      accountId: new ObjectId(accountId),
      amount: 400,
      type: "Income",
      category: "Salary",
      merchant: "Employer",
      paymentMethod: "Net Banking",
      isArchived: false,
      transactionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Second fetch should serve cached DTO where totalIncome is still 100
    const secondRes = await getDashboardAnalyticsService(mockUserId, "This Month");
    expect(secondRes.message).toContain("cached");
    expect(secondRes.data?.summary.totalIncome).toBe(100);

    // 3. Invalidate cache manually
    invalidateAnalyticsCache(mockUserId);

    // Third fetch should query the DB and reflect the updated total (500)
    const thirdRes = await getDashboardAnalyticsService(mockUserId, "This Month");
    expect(thirdRes.message).toBe("Dashboard analytics retrieved successfully");
    expect(thirdRes.data?.summary.totalIncome).toBe(500);
  });
});
