import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET } from "@/app/api/export/csv/route";
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

describe("API Routes: /api/export/csv", () => {
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
      type: "Checking",
      balance: 1000,
    });
    accountId = accountRes.data!._id;
  });

  it("GET /api/export/csv - should return transaction log export payload", async () => {
    await createTransactionService(mockSession.user.id, {
      accountId,
      amount: 45,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
      description: "Apples",
    });

    const res = await request(server)
      .get("/api/export/csv?format=csv")
      .expect(200);

    expect(res.headers["content-type"]).toContain("text/csv");
    expect(res.text).toContain("Apples");
  });
});
