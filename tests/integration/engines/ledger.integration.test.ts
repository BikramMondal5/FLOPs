import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import {
  applyTransactionEffect,
  rollbackTransactionEffect,
  validateAccountOwnership,
  getAdjustmentAmount,
} from "@/features/transactions/services/ledger.service";
import { createAccountService } from "@/features/accounts/services/account.service";
import { ObjectId } from "mongodb";

describe("Ledger Engine Integration Tests", () => {
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

    const accountRes = await createAccountService(mockUserId, {
      name: "Ledger Test Account",
      type: "Savings",
      balance: 5000,
    });
    accountId = accountRes.data!._id;
  });

  describe("getAdjustmentAmount", () => {
    it("should return positive value for Income and negative for Expense", () => {
      expect(getAdjustmentAmount("Income", 100)).toBe(100);
      expect(getAdjustmentAmount("Expense", 100)).toBe(-100);
    });
  });

  describe("validateAccountOwnership", () => {
    it("should validate ownership for active account owned by user", async () => {
      const isValid = await validateAccountOwnership(db, accountId, mockUserId);
      expect(isValid).toBe(true);
    });

    it("should invalidate ownership for non-existent account", async () => {
      const nonExistentId = new ObjectId().toString();
      const isValid = await validateAccountOwnership(db, nonExistentId, mockUserId);
      expect(isValid).toBe(false);
    });

    it("should invalidate ownership for account owned by another user", async () => {
      const otherUserId = new ObjectId().toString();
      const isValid = await validateAccountOwnership(db, accountId, otherUserId);
      expect(isValid).toBe(false);
    });
  });

  describe("applyTransactionEffect & rollbackTransactionEffect", () => {
    it("should apply and rollback income transaction balance atomically", async () => {
      // Balance is 5000
      await applyTransactionEffect(db, mockUserId, accountId, "Income", 1500);
      let doc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
      expect(doc.balance).toBe(6500);

      await rollbackTransactionEffect(db, mockUserId, accountId, "Income", 1500);
      doc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
      expect(doc.balance).toBe(5000);
    });

    it("should apply and rollback expense transaction balance atomically", async () => {
      // Balance is 5000
      await applyTransactionEffect(db, mockUserId, accountId, "Expense", 800);
      let doc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
      expect(doc.balance).toBe(4200);

      await rollbackTransactionEffect(db, mockUserId, accountId, "Expense", 800);
      doc = await db.collection("financial_accounts").findOne({ _id: new ObjectId(accountId) });
      expect(doc.balance).toBe(5000);
    });

    it("should throw error if account does not exist when applying effect", async () => {
      const badAccountId = new ObjectId().toString();
      await expect(
        applyTransactionEffect(db, mockUserId, badAccountId, "Income", 100)
      ).rejects.toThrow();
    });
  });
});
