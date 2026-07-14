import { connectDB } from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { ReportDashboardDTO, ReportPeriod } from "../types/report.types";
import { compileReportDashboard } from "../engine/report.engine";
import { findBudgetsByUserId } from "@/features/budget/repositories/budget.repository";
import { findGoalsByUserId } from "@/features/goals/repositories/goal.repository";
import { TRANSACTIONS_COLLECTION } from "@/lib/models/Transaction";
import { serializeTransaction } from "@/lib/models/Transaction";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import { ObjectId } from "mongodb";

interface CacheBlock {
  userId: string;
  period: ReportPeriod;
  dto: ReportDashboardDTO;
  timestamp: number;
}

let reportsCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000;

export function invalidateReportsCache(userId: string) {
  logger.info("Invalidating reports dashboard cache", { userId });
  reportsCache = reportsCache.filter((c) => c.userId !== userId);
}

function getReportDateRanges(period: ReportPeriod): {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
} {
  const now = new Date();
  const currentEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  let currentStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  let previousStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  let previousEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  if (period === "Daily") {
    currentStart.setHours(0, 0, 0, 0);
    previousStart.setDate(previousStart.getDate() - 1);
    previousStart.setHours(0, 0, 0, 0);
    previousEnd.setDate(previousEnd.getDate() - 1);
    previousEnd.setHours(23, 59, 59, 999);
  } else if (period === "Weekly") {
    // Current week starts Monday
    const currentDay = now.getDay();
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    currentStart.setDate(now.getDate() + distanceToMonday);
    currentStart.setHours(0, 0, 0, 0);

    // Previous week starts Monday of last week, ends Sunday of last week
    previousStart.setDate(currentStart.getDate() - 7);
    previousStart.setHours(0, 0, 0, 0);
    previousEnd.setDate(currentStart.getDate() - 1);
    previousEnd.setHours(23, 59, 59, 999);
  } else {
    // Monthly
    currentStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    previousStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    previousEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  }

  return { currentStart, currentEnd, previousStart, previousEnd };
}

export async function getReportDashboardService(
  userId: string,
  period: ReportPeriod = "Monthly"
): Promise<ApiResponse<ReportDashboardDTO>> {
  const nowTime = Date.now();
  const cached = reportsCache.find(
    (c) => c.userId === userId && c.period === period && nowTime - c.timestamp < CACHE_TTL_MS
  );

  if (cached) {
    logger.info("Serving report dashboard from cache", { userId, period });
    return {
      success: true,
      message: "Report dashboard retrieved successfully (cached)",
      data: cached.dto,
    };
  }

  try {
    const db = await connectDB();
    const { currentStart, currentEnd, previousStart, previousEnd } = getReportDateRanges(period);

    // 1. Fetch current and previous transactions
    const txCol = db.collection(TRANSACTIONS_COLLECTION);
    const [currentTxRaw, previousTxRaw, budgets, goals] = await Promise.all([
      txCol
        .find({
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: currentStart, $lte: currentEnd },
        })
        .toArray(),
      txCol
        .find({
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: previousStart, $lte: previousEnd },
        })
        .toArray(),
      findBudgetsByUserId(db, userId),
      findGoalsByUserId(db, userId),
    ]);

    const currentTx = currentTxRaw.map(serializeTransaction) as unknown as TransactionDTO[];
    const previousTx = previousTxRaw.map(serializeTransaction) as unknown as TransactionDTO[];

    // 2. Compile dashboard with report engine
    const dto = compileReportDashboard(
      period,
      currentStart,
      currentEnd,
      currentTx,
      previousTx,
      budgets,
      goals
    );

    // Save to cache
    reportsCache = reportsCache.filter((c) => !(c.userId === userId && c.period === period));
    reportsCache.push({
      userId,
      period,
      dto,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "Report dashboard compiled successfully",
      data: dto,
    };
  } catch (error) {
    logger.error("Failed to compile report dashboard", error, { userId, period });
    return {
      success: false,
      message: "Failed to compile reporting data indicators.",
    };
  }
}
