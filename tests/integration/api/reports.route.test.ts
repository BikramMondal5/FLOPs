import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET } from "@/app/api/reports/dashboard/route";
import { createAccountService } from "@/features/accounts/services/account.service";
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

describe("API Routes: /api/reports/dashboard", () => {
  let db: any;
  let server: any;
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
    server = createRouteServer({ GET });
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
      type: "Current",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("GET /api/reports/dashboard - should return compiled report summary details", async () => {
    await createTransactionService(mockSession.user.id, {
      accountId,
      amount: 50,
      type: "Expense",
      category: "Food & Dining",
      transactionDate: new Date().toISOString(),
      merchant: "Restaurant",
      paymentMethod: "Cash",
    });

    const res = await request(server)
      .get("/api/reports/dashboard?period=Monthly")
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.summary.totalExpense).toBe(50);
  });
});
