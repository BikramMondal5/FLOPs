import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { createRouteServer } from "../api-wrapper";
import { GET as getAccounts, POST as postAccount } from "@/app/api/accounts/route";
import { GET as getAccountDetail, PATCH as patchAccount, DELETE as deleteAccount } from "@/app/api/accounts/[id]/route";
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

describe("API Routes: /api/accounts", () => {
  let db: any;
  let accountsServer: any;
  let accountDetailServer: any;

  beforeAll(async () => {
    db = await connect();
    accountsServer = createRouteServer({ GET: getAccounts, POST: postAccount });
    accountDetailServer = createRouteServer({
      GET: getAccountDetail,
      PATCH: patchAccount,
      DELETE: deleteAccount,
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
  });

  it("should enforce authorization", async () => {
    mockSession = null; // Unauthenticated

    await request(accountsServer)
      .get("/api/accounts")
      .expect(401);
  });

  it("GET & POST /api/accounts - should create and list accounts", async () => {
    const payload = {
      name: "Savings Wallet",
      type: "Savings",
      balance: 1000,
    };

    // 1. Create Account
    const postRes = await request(accountsServer)
      .post("/api/accounts")
      .send(payload)
      .expect(201);

    expect(postRes.body.success).toBe(true);
    expect(postRes.body.data.name).toBe("Savings Wallet");
    const accountId = postRes.body.data._id;

    // 2. List Accounts
    const getRes = await request(accountsServer)
      .get("/api/accounts")
      .expect(200);

    expect(getRes.body.success).toBe(true);
    expect(getRes.body.data.length).toBe(1);
    expect(getRes.body.data[0]._id).toBe(accountId);
  });

  it("GET, PATCH, DELETE /api/accounts/:id - should get details, update, and archive account", async () => {
    const payload = {
      name: "Checking Wallet",
      type: "Checking",
      balance: 500,
    };

    // Create account directly in DB or via API
    const postRes = await request(accountsServer)
      .post("/api/accounts")
      .send(payload)
      .expect(201);
    const accountId = postRes.body.data._id;

    // 1. Get Details
    const getDetailRes = await request(accountDetailServer)
      .get(`/api/accounts/${accountId}`)
      .expect(200);
    expect(getDetailRes.body.data.name).toBe("Checking Wallet");

    // 2. Update Account
    const patchRes = await request(accountDetailServer)
      .patch(`/api/accounts/${accountId}`)
      .send({ name: "Updated Wallet", balance: 600 })
      .expect(200);
    expect(patchRes.body.data.name).toBe("Updated Wallet");
    expect(patchRes.body.data.balance).toBe(600);

    // 3. Delete Account
    await request(accountDetailServer)
      .delete(`/api/accounts/${accountId}`)
      .expect(200);

    // After deleting, fetch should return 404
    await request(accountDetailServer)
      .get(`/api/accounts/${accountId}`)
      .expect(404);
  });
});
