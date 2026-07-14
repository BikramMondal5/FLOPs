import { Db, ObjectId } from "mongodb";

// ─────────────────────────────────────────────
// Collection Name
// Using "financial_accounts" to avoid collision with
// NextAuth's internal "accounts" collection (OAuth links).
// ─────────────────────────────────────────────
export const FINANCIAL_ACCOUNTS_COLLECTION = "financial_accounts";

// ─────────────────────────────────────────────
// Ensure Indexes
// Call once per request lifecycle (idempotent in MongoDB).
// ─────────────────────────────────────────────
export async function ensureAccountIndexes(db: Db): Promise<void> {
  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);

  await Promise.all([
    // Primary filter: always query by userId
    col.createIndex({ userId: 1 }, { background: true }),

    // Filter by type
    col.createIndex({ type: 1 }, { background: true }),

    // Soft-delete filter
    col.createIndex({ isArchived: 1 }, { background: true }),

    // Compound: userId + isArchived (most common query pattern)
    col.createIndex({ userId: 1, isArchived: 1 }, { background: true }),

    // Compound: userId + createdAt (for sorting)
    col.createIndex({ userId: 1, createdAt: -1 }, { background: true }),
  ]);
}

// ─────────────────────────────────────────────
// Serialize ObjectId fields for API responses
// ─────────────────────────────────────────────
export function serializeAccount(doc: Record<string, unknown>) {
  return {
    ...doc,
    _id: (doc._id as ObjectId).toString(),
    userId: (doc.userId as ObjectId).toString(),
    createdAt: (doc.createdAt as Date).toISOString(),
    updatedAt: (doc.updatedAt as Date).toISOString(),
  };
}
