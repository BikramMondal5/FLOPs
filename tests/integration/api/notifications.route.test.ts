import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getNotifications } from "@/app/api/notifications/route";
import { PATCH as patchReadAll } from "@/app/api/notifications/read-all/route";
import { createAccountService } from "@/features/accounts/services/account.service";
import { createBudgetService } from "@/features/budget/services/budget.service";
import { createTransactionService } from "@/features/transactions/services/transaction.service";
import request from "supertest";
import { ObjectId } from "mongodb";

let mockSession: any = {
  user: {
    id: new ObjectId().toString(),
  },
};

vi.mock("@/lib/auth", () => ({
  auth: () => mockSession,
}));

describe("API Routes: /api/notifications", () => {
  let db: any;
  let notificationsServer: any;
  let readAllServer: any;
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
    notificationsServer = createRouteServer({ GET: getNotifications });
    readAllServer = createRouteServer({ PATCH: patchReadAll });
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
    mockSession = {
      user: {
        id: new ObjectId().toString(),
      },
    };

    const accountRes = await createAccountService(mockSession.user.id, {
      name: "Checking",
      type: "Checking",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("should compile and mark notifications read-all", async () => {
    // Create exceeded budget to trigger notification
    await createBudgetService(mockSession.user.id, {
      category: "Food",
      limit: 100,
      period: "monthly",
    });
    await createTransactionService(mockSession.user.id, {
      accountId,
      amount: 150,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
    });

    // 1. GET Notifications
    const resGet = await request(notificationsServer)
      .get("/api/notifications")
      .expect(200);
    expect(resGet.body.success).toBe(true);
    expect(resGet.body.data.some((n: any) => !n.isRead)).toBe(true);

    // 2. PATCH read-all
    const resPatch = await request(readAllServer)
      .patch("/api/notifications/read-all")
      .expect(200);
    expect(resPatch.body.success).toBe(true);

    // 3. Verify read state
    const resGetAfter = await request(notificationsServer)
      .get("/api/notifications")
      .expect(200);
    expect(resGetAfter.body.data.every((n: any) => n.isRead)).toBe(true);
  });
});
