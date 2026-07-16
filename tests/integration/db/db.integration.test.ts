import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { connect, disconnect, clearDatabase } from "../db.helper";
import { ensureAccountIndexes } from "@/lib/models/Account";
import { ensureTransactionIndexes } from "@/lib/models/Transaction";

describe("Database Integration and Index Tests", () => {
  let db: any;

  beforeAll(async () => {
    db = await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  it("should successfully ensure account indexes and register them in system tables", async () => {
    await ensureAccountIndexes(db);
    const indexes = await db.collection("financial_accounts").listIndexes().toArray();
    
    // Default index on _id + our custom indices
    expect(indexes.length).toBeGreaterThanOrEqual(2);

    const indexNames = indexes.map((idx: any) => idx.name);
    expect(indexNames.some((name: string) => name.includes("userId"))).toBe(true);
  });

  it("should successfully ensure transaction indexes and register them in system tables", async () => {
    await ensureTransactionIndexes(db);
    const indexes = await db.collection("transactions").listIndexes().toArray();

    expect(indexes.length).toBeGreaterThanOrEqual(2);
    
    const indexNames = indexes.map((idx: any) => idx.name);
    expect(indexNames.some((name: string) => name.includes("accountId") || name.includes("userId"))).toBe(true);
  });
});
