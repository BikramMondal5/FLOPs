import { Db, ObjectId, Sort, ClientSession } from "mongodb";
import {
  FINANCIAL_ACCOUNTS_COLLECTION,
  ensureAccountIndexes,
  serializeAccount,
} from "@/lib/models/Account";
import type { CreateAccountInput, UpdateAccountInput, AccountQueryParams } from "../types/account.types";

// ─────────────────────────────────────────────
// Build Sort object from query param
// ─────────────────────────────────────────────
function buildSort(sort?: string): Sort {
  switch (sort) {
    case "createdAt_asc":  return { createdAt: 1 };
    case "balance_desc":   return { balance: -1 };
    case "balance_asc":    return { balance: 1 };
    case "name_asc":       return { name: 1 };
    case "createdAt_desc":
    default:               return { createdAt: -1 };
  }
}

// ─────────────────────────────────────────────
// Build filter object from query params
// ─────────────────────────────────────────────
function buildFilter(
  userId: string,
  params: AccountQueryParams
): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    userId: new ObjectId(userId),
  };

  // Archived filter
  if (!params.archived || params.archived === "false") {
    filter.isArchived = false;
  } else if (params.archived === "true") {
    filter.isArchived = true;
  }

  // Type filter
  if (params.type && params.type !== "all") {
    filter.type = params.type;
  }

  // Case-insensitive search on name + institution + type
  if (params.search && params.search.trim()) {
    const regex = { $regex: params.search.trim(), $options: "i" };
    filter.$or = [{ name: regex }, { institution: regex }, { type: regex }];
  }

  return filter;
}

// ─────────────────────────────────────────────
// Repository Functions
// ─────────────────────────────────────────────

export async function findAccountsByUserId(
  db: Db,
  userId: string,
  params: AccountQueryParams = {}
) {
  await ensureAccountIndexes(db);

  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);
  const filter = buildFilter(userId, params);
  const sort = buildSort(params.sort);

  const docs = await col
    .find(filter)
    .sort(sort)
    .project({
      _id: 1,
      userId: 1,
      name: 1,
      institution: 1,
      type: 1,
      currency: 1,
      balance: 1,
      color: 1,
      icon: 1,
      description: 1,
      isArchived: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .toArray();

  return docs.map((doc) => serializeAccount(doc as Record<string, unknown>));
}

export async function findAccountById(db: Db, id: string, userId: string) {
  await ensureAccountIndexes(db);

  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const doc = await col.findOne({ _id: objectId, userId: new ObjectId(userId) });
  if (!doc) return null;

  return serializeAccount(doc as Record<string, unknown>);
}

export async function findAccountByIdWithSession(
  db: Db,
  id: string,
  userId: string,
  session?: ClientSession
) {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);
  const doc = await col.findOne(
    { _id: objectId, userId: new ObjectId(userId) },
    { session }
  );
  if (!doc) return null;

  return serializeAccount(doc as Record<string, unknown>);
}

export async function createAccount(
  db: Db,
  userId: string,
  data: CreateAccountInput
) {
  await ensureAccountIndexes(db);

  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);
  const now = new Date();

  const doc = {
    userId: new ObjectId(userId),
    name: data.name.trim(),
    institution: data.institution?.trim() || undefined,
    type: data.type,
    currency: data.currency ?? "INR",
    balance: data.balance,
    color: data.color || undefined,
    icon: data.icon || undefined,
    description: data.description?.trim() || undefined,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await col.insertOne(doc);

  const inserted = await col.findOne({ _id: result.insertedId });
  if (!inserted) throw new Error("Failed to retrieve created account");

  return serializeAccount(inserted as Record<string, unknown>);
}

export async function updateAccount(
  db: Db,
  id: string,
  userId: string,
  data: UpdateAccountInput
) {
  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return null;
  }

  const updateFields: Record<string, unknown> = { updatedAt: new Date() };

  if (data.name !== undefined)        updateFields.name = data.name.trim();
  if (data.institution !== undefined) updateFields.institution = data.institution.trim() || undefined;
  if (data.type !== undefined)        updateFields.type = data.type;
  if (data.currency !== undefined)    updateFields.currency = data.currency;
  if (data.balance !== undefined)     updateFields.balance = data.balance;
  if (data.color !== undefined)       updateFields.color = data.color || undefined;
  if (data.icon !== undefined)        updateFields.icon = data.icon;
  if (data.description !== undefined) updateFields.description = data.description.trim() || undefined;

  const result = await col.findOneAndUpdate(
    { _id: objectId, userId: new ObjectId(userId), isArchived: false },
    { $set: updateFields },
    { returnDocument: "after" }
  );

  if (!result) return null;

  return serializeAccount(result as Record<string, unknown>);
}

export async function archiveAccount(db: Db, id: string, userId: string) {
  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return false;
  }

  const result = await col.updateOne(
    { _id: objectId, userId: new ObjectId(userId), isArchived: false },
    { $set: { isArchived: true, updatedAt: new Date() } }
  );

  return result.matchedCount > 0;
}

export async function updateBalanceAtomic(
  db: Db,
  accountId: string,
  userId: string,
  adjustment: number,
  session?: ClientSession
): Promise<boolean> {
  let objectId: ObjectId;
  try {
    objectId = new ObjectId(accountId);
  } catch {
    return false;
  }

  const col = db.collection(FINANCIAL_ACCOUNTS_COLLECTION);
  const result = await col.updateOne(
    { _id: objectId, userId: new ObjectId(userId), isArchived: false },
    {
      $inc: { balance: adjustment },
      $set: { updatedAt: new Date() },
    },
    { session }
  );

  return result.matchedCount > 0;
}
