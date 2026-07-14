import { Db, ObjectId } from "mongodb";
import { FINANCIAL_ACCOUNTS_COLLECTION } from "@/lib/models/Account";
import { TRANSACTIONS_COLLECTION } from "@/lib/models/Transaction";

export interface RawSummaryAggregation {
  totalIncome: number;
  totalExpense: number;
  largestIncome: number;
  largestExpense: number;
  count: number;
}

export interface RawCategoryAggregation {
  _id: string;
  total: number;
  count: number;
}

export interface RawMonthlyAggregation {
  _id: { year: number; month: number };
  income: number;
  expense: number;
  count: number;
}

export interface RawCashflowSparkline {
  _id: string; // date string YYYY-MM-DD
  amount: number;
}

export async function fetchRawAccounts(db: Db, userId: string) {
  return db
    .collection(FINANCIAL_ACCOUNTS_COLLECTION)
    .find({ userId: new ObjectId(userId), isArchived: false })
    .toArray();
}

export async function fetchRawTransactionsRange(
  db: Db,
  userId: string,
  startDate: Date,
  endDate: Date
) {
  return db
    .collection(TRANSACTIONS_COLLECTION)
    .find({
      userId: new ObjectId(userId),
      isArchived: false,
      transactionDate: { $gte: startDate, $lte: endDate },
    })
    .toArray();
}

export async function aggregateRawSummary(
  db: Db,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<RawSummaryAggregation> {
  const result = await db
    .collection(TRANSACTIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] },
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] },
          },
          largestIncome: {
            $max: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] },
          },
          largestExpense: {
            $max: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] },
          },
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  if (result.length === 0) {
    return { totalIncome: 0, totalExpense: 0, largestIncome: 0, largestExpense: 0, count: 0 };
  }

  return result[0] as RawSummaryAggregation;
}

export async function aggregateRawCategories(
  db: Db,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<RawCategoryAggregation[]> {
  return db
    .collection(TRANSACTIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ])
    .toArray() as Promise<RawCategoryAggregation[]>;
}

export async function aggregateRawMonthly(
  db: Db,
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<RawMonthlyAggregation[]> {
  return db
    .collection(TRANSACTIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$transactionDate" },
            month: { $month: "$transactionDate" },
          },
          income: {
            $sum: { $cond: [{ $eq: ["$type", "Income"] }, "$amount", 0] },
          },
          expense: {
            $sum: { $cond: [{ $eq: ["$type", "Expense"] }, "$amount", 0] },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])
    .toArray() as Promise<RawMonthlyAggregation[]>;
}

export async function aggregateRawSparkline(
  db: Db,
  userId: string,
  limitDays = 7
): Promise<RawCashflowSparkline[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - limitDays);

  return db
    .collection(TRANSACTIONS_COLLECTION)
    .aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          isArchived: false,
          type: "Expense",
          transactionDate: { $gte: cutoff },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$transactionDate" } },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray() as Promise<RawCashflowSparkline[]>;
}

export async function fetchRawRecentTransactions(db: Db, userId: string, limit = 10) {
  // Leverage transaction pipeline format to auto join account nicknames
  return db
    .collection(TRANSACTIONS_COLLECTION)
    .aggregate([
      { $match: { userId: new ObjectId(userId), isArchived: false } },
      { $sort: { transactionDate: -1, _id: -1 } },
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
    ])
    .toArray();
}
