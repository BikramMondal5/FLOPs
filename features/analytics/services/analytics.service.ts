import { connectDB } from "@/lib/mongodb";
import type { AnalyticsDateRange } from "../types/analytics.types";
import { parseDateRange } from "../types/analytics.types";
import type { FinancialDashboardDTO } from "../dto/dashboard.dto";
import type { ApiResponse, AccountDTO } from "@/features/accounts/types/account.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import {
  fetchRawAccounts,
  fetchRawRecentTransactions,
  aggregateRawSummary,
  aggregateRawCategories,
  aggregateRawMonthly,
  aggregateRawSparkline,
} from "../repositories/analytics.repository";
import { calculateSparkline } from "../calculators/cashflow.calculator";
import { mapRawDashboardToDTO } from "../mappers/financial-summary.mapper";
import { logger } from "@/lib/logger";

// In-Memory cache block for dashboard responses to minimize db queries
interface CacheBlock {
  userId: string;
  range: AnalyticsDateRange;
  customStart?: string;
  customEnd?: string;
  dto: FinancialDashboardDTO;
  timestamp: number;
}

let dashboardCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export function invalidateAnalyticsCache(userId: string) {
  logger.info("Invalidating analytics dashboard cache", { userId });
  dashboardCache = dashboardCache.filter((c) => c.userId !== userId);
}

export async function getDashboardAnalyticsService(
  userId: string,
  range: AnalyticsDateRange = "This Month",
  customStart?: string,
  customEnd?: string
): Promise<ApiResponse<FinancialDashboardDTO>> {
  // Check active cache first
  const nowTime = Date.now();
  const cached = dashboardCache.find(
    (c) =>
      c.userId === userId &&
      c.range === range &&
      c.customStart === customStart &&
      c.customEnd === customEnd &&
      nowTime - c.timestamp < CACHE_TTL_MS
  );

  if (cached) {
    logger.info("Serving overview analytics from cache", { userId, range });
    return {
      success: true,
      message: "Dashboard analytics retrieved successfully (cached)",
      data: cached.dto,
    };
  }

  try {
    const db = await connectDB();
    const { startDate, endDate } = parseDateRange(range, customStart, customEnd);

    // Calculate days range boundary
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Run parallel aggregation calls to prevent N+1 waterfall requests
    const [
      accountsRaw,
      recentRaw,
      summaryRaw,
      categoriesRaw,
      monthlyRaw,
      sparklineRaw,
    ] = await Promise.all([
      fetchRawAccounts(db, userId),
      fetchRawRecentTransactions(db, userId, 10),
      aggregateRawSummary(db, userId, startDate, endDate),
      aggregateRawCategories(db, userId, startDate, endDate),
      aggregateRawMonthly(db, userId, startDate, endDate),
      aggregateRawSparkline(db, userId, 7),
    ]);

    // Format serialized accounts & transaction lists safely
    const serializedAccounts: AccountDTO[] = accountsRaw.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
    })) as AccountDTO[];

    const serializedRecent: TransactionDTO[] = recentRaw.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      userId: doc.userId.toString(),
      accountId: doc.accountId.toString(),
      transactionDate: doc.transactionDate instanceof Date ? doc.transactionDate.toISOString() : String(doc.transactionDate),
      createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt),
      updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : String(doc.updatedAt),
    })) as TransactionDTO[];

    // Parse sparkline mapping
    const sparkline = calculateSparkline(sparklineRaw, 7);

    // Orchestrate mapping
    const dto = mapRawDashboardToDTO(
      serializedAccounts,
      serializedRecent,
      summaryRaw,
      categoriesRaw,
      monthlyRaw,
      sparkline,
      daysCount
    );

    // Save back to local cache
    dashboardCache = dashboardCache.filter((c) => !(c.userId === userId && c.range === range));
    dashboardCache.push({
      userId,
      range,
      customStart,
      customEnd,
      dto,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "Dashboard analytics retrieved successfully",
      data: dto,
    };
  } catch (error) {
    logger.error("Failed to build dashboard analytics summary", error, { userId, range });
    return {
      success: false,
      message: "Failed to compile financial stats overview.",
    };
  }
}
