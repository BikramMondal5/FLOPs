import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getTransactions, POST as postTransaction } from "@/app/api/transactions/route";
import { GET as getTransactionDetail, PATCH as patchTransaction, DELETE as deleteTransaction } from "@/app/api/transactions/[id]/route";
import { createAccount } from "@/features/accounts/repositories/account.repository";
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

describe("API Routes: /api/transactions", () => {
  let db: any;
  let txServer: any;
  let txDetailServer: any;
  let accountId: string;

  beforeAll(async () => {
    db = await connect();
    txServer = createRouteServer({ GET: getTransactions, POST: postTransaction });
    txDetailServer = createRouteServer({
      GET: getTransactionDetail,
      PATCH: patchTransaction,
      DELETE: deleteTransaction,
    }, (url) => {
      const parts = url.split("/");
      const id = parts[parts.length - 1] || "";
      return { id };
    });
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

    // Create an account
    const account = await createAccount(db, mockSession.user.id, {
      name: "Checking",
      type: "Checking",
      balance: 1000,
    });
    accountId = account._id;
  });

  it("POST & GET /api/transactions - should log a transaction and list logs", async () => {
    const payload = {
      accountId,
      amount: 150,
      type: "Expense",
      category: "Food",
      transactionDate: new Date().toISOString(),
    };

    const postRes = await request(txServer)
      .post("/api/transactions")
      .send(payload)
      .expect(201);

    expect(postRes.body.success).toBe(true);
    expect(postRes.body.data.amount).toBe(150);
    const txId = postRes.body.data._id;

    const getRes = await request(txServer)
      .get("/api/transactions")
      .expect(200);

    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.transactions.length).toBe(1);
    expect(getRes.body.data.transactions[0]._id).toBe(txId);
  });

  it("PATCH & DELETE /api/transactions/:id - should modify and archive transaction", async () => {
    // Create transaction first
    const createRes = await request(txServer)
      .post("/api/transactions")
      .send({
        accountId,
        amount: 200,
        type: "Income",
        category: "Freelance",
        transactionDate: new Date().toISOString(),
      })
      .expect(201);
    const txId = createRes.body.data._id;

    // PATCH
    const patchRes = await request(txDetailServer)
      .patch(`/api/transactions/${txId}`)
      .send({ amount: 250 })
      .expect(200);
    expect(patchRes.body.data.amount).toBe(250);

    // DELETE
    await request(txDetailServer)
      .delete(`/api/transactions/${txId}`)
      .expect(200);

    // Verify 404 after deletion
    await request(txDetailServer)
      .get(`/api/transactions/${txId}`)
      .expect(404);
  });
});
