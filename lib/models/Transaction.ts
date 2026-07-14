import { Db, ObjectId } from "mongodb";

export const TRANSACTIONS_COLLECTION = "transactions";

// ─────────────────────────────────────────────
// Ensure Index helper
// ─────────────────────────────────────────────
export async function ensureTransactionIndexes(db: Db): Promise<void> {
  const col = db.collection(TRANSACTIONS_COLLECTION);

  await Promise.all([
    col.createIndex({ userId: 1 }, { background: true }),
    col.createIndex({ accountId: 1 }, { background: true }),
    col.createIndex({ transactionDate: -1 }, { background: true }),
    col.createIndex({ isArchived: 1 }, { background: true }),
    // Compounded index commonly used in ledger searches & pagination sorting
    col.createIndex({ userId: 1, isArchived: 1, transactionDate: -1 }, { background: true }),
  ]);
}

// ─────────────────────────────────────────────
// Serialization parser helper
// ─────────────────────────────────────────────
export function serializeTransaction(doc: Record<string, unknown>) {
  return {
    ...doc,
    _id: (doc._id as ObjectId).toString(),
    userId: (doc.userId as ObjectId).toString(),
    accountId: (doc.accountId as ObjectId).toString(),
    transactionDate: (doc.transactionDate as Date).toISOString(),
    createdAt: (doc.createdAt as Date).toISOString(),
    updatedAt: (doc.updatedAt as Date).toISOString(),
  };
}
