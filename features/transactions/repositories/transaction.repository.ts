import { Db, ObjectId, ClientSession, Sort } from "mongodb";
import { TRANSACTIONS_COLLECTION, ensureTransactionIndexes, serializeTransaction } from "@/lib/models/Transaction";
import { FINANCIAL_ACCOUNTS_COLLECTION } from "@/lib/models/Account";
import type { CreateTransactionInput, UpdateTransactionInput, TransactionQueryParams } from "../types/transaction.types";

function buildSort(sortOption?: string): Sort {
  switch (sortOption) {
    case "date_asc":
      return { transactionDate: 1, _id: 1 };
    case "amount_desc":
      return { amount: -1, transactionDate: -1 };
    case "amount_asc":
      return { amount: 1, transactionDate: -1 };
    case "merchant_asc":
      return { merchant: 1, transactionDate: -1 };
    case "date_desc":
    default:
      return { transactionDate: -1, _id: -1 };
  }
}

function buildFilter(userId: string, params: TransactionQueryParams): Record<string, unknown> {
  const filter: Record<string, unknown> = {
    userId: new ObjectId(userId),
  };

  if (!params.archived || params.archived === "false") {
    filter.isArchived = false;
  } else if (params.archived === "true") {
    filter.isArchived = true;
  }

  if (params.type && params.type !== "all") {
    filter.type = params.type;
  }
  if (params.category && params.category !== "all") {
    filter.category = params.category;
  }
  if (params.paymentMethod && params.paymentMethod !== "all") {
    filter.paymentMethod = params.paymentMethod;
  }
  if (params.accountId && params.accountId !== "all") {
    try {
      filter.accountId = new ObjectId(params.accountId);
    } catch {
      filter.accountId = new ObjectId("000000000000000000000000");
    }
  }

  if (params.dateFrom || params.dateTo) {
    const range: Record<string, Date> = {};
    if (params.dateFrom) range.$gte = new Date(params.dateFrom);
    if (params.dateTo) range.$lte = new Date(params.dateTo);
    filter.transactionDate = range;
  }

  if (params.search && params.search.trim()) {
    const regex = { $regex: params.search.trim(), $options: "i" };
    filter.$or = [{ merchant: regex }, { notes: regex }, { location: regex }];
  }

  return filter;
}

// ─────────────────────────────────────────────
// Session-capable Database Operations
// ─────────────────────────────────────────────

export async function createTransactionWithSession(
  db: Db,
  userId: string,
  data: CreateTransactionInput,
  session?: ClientSession
) {
  await ensureTransactionIndexes(db);
  const now = new Date();

  const doc = {
    userId: new ObjectId(userId),
    accountId: new ObjectId(data.accountId),
    type: data.type,
    category: data.category,
    amount: data.amount,
    merchant: data.merchant.trim(),
    paymentMethod: data.paymentMethod,
    transactionDate: new Date(data.transactionDate),
    notes: data.notes?.trim() || undefined,
    location: data.location?.trim() || undefined,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  };

  const col = db.collection(TRANSACTIONS_COLLECTION);
  const result = await col.insertOne(doc, { session });
  const created = await col.findOne({ _id: result.insertedId }, { session });
  if (!created) throw new Error("Database insertion failure");

  return serializeTransaction(created);
}

export async function findTransactionByIdWithSession(
  db: Db,
  id: string,
  userId: string,
  session?: ClientSession
) {
  let objId: ObjectId;
  try {
    objId = new ObjectId(id);
  } catch {
    return null;
  }

  const pipeline = [
    { $match: { _id: objId, userId: new ObjectId(userId) } },
    {
      $lookup: {
        from: FINANCIAL_ACCOUNTS_COLLECTION,
        localField: "accountId",
        foreignField: "_id",
        as: "accountDetails",
      },
    },
    {
      $addFields: {
        accountName: { $arrayElemAt: ["$accountDetails.name", 0] },
      },
    },
    { $project: { accountDetails: 0 } },
  ];

  const col = db.collection(TRANSACTIONS_COLLECTION);
  const results = await col.aggregate(pipeline, { session }).toArray();
  if (!results || results.length === 0) return null;

  return serializeTransaction(results[0]);
}

export async function findTransactions(db: Db, userId: string, params: TransactionQueryParams) {
  await ensureTransactionIndexes(db);

  const filter = buildFilter(userId, params);
  const sort = buildSort(params.sort);

  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = Math.max(1, parseInt(params.limit || "20", 10));
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: filter },
    { $sort: sort },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: FINANCIAL_ACCOUNTS_COLLECTION,
        localField: "accountId",
        foreignField: "_id",
        as: "accountDetails",
      },
    },
    {
      $addFields: {
        accountName: { $arrayElemAt: ["$accountDetails.name", 0] },
      },
    },
    { $project: { accountDetails: 0 } },
  ];

  const col = db.collection(TRANSACTIONS_COLLECTION);
  const docs = await col.aggregate(pipeline).toArray();
  return docs.map((doc) => serializeTransaction(doc));
}

export async function countTransactions(db: Db, userId: string, params: TransactionQueryParams): Promise<number> {
  const filter = buildFilter(userId, params);
  return db.collection(TRANSACTIONS_COLLECTION).countDocuments(filter);
}

export async function updateTransactionWithSession(
  db: Db,
  id: string,
  userId: string,
  data: UpdateTransactionInput,
  session?: ClientSession
) {
  let objId: ObjectId;
  try {
    objId = new ObjectId(id);
  } catch {
    return null;
  }

  const setFields: Record<string, unknown> = { updatedAt: new Date() };

  if (data.accountId !== undefined)       setFields.accountId = new ObjectId(data.accountId);
  if (data.type !== undefined)            setFields.type = data.type;
  if (data.category !== undefined)        setFields.category = data.category;
  if (data.amount !== undefined)          setFields.amount = data.amount;
  if (data.merchant !== undefined)        setFields.merchant = data.merchant.trim();
  if (data.paymentMethod !== undefined)   setFields.paymentMethod = data.paymentMethod;
  if (data.transactionDate !== undefined) setFields.transactionDate = new Date(data.transactionDate);
  if (data.notes !== undefined)           setFields.notes = data.notes.trim() || undefined;
  if (data.location !== undefined)        setFields.location = data.location.trim() || undefined;

  const col = db.collection(TRANSACTIONS_COLLECTION);
  const result = await col.findOneAndUpdate(
    { _id: objId, userId: new ObjectId(userId), isArchived: false },
    { $set: setFields },
    { returnDocument: "after", session }
  );

  if (!result) return null;
  return serializeTransaction(result);
}

export async function archiveTransactionWithSession(
  db: Db,
  id: string,
  userId: string,
  session?: ClientSession
): Promise<boolean> {
  let objId: ObjectId;
  try {
    objId = new ObjectId(id);
  } catch {
    return false;
  }

  const col = db.collection(TRANSACTIONS_COLLECTION);
  const result = await col.updateOne(
    { _id: objId, userId: new ObjectId(userId), isArchived: false },
    { $set: { isArchived: true, updatedAt: new Date() } },
    { session }
  );

  return result.matchedCount > 0;
}
