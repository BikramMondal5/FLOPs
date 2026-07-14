import { connectDB } from "@/lib/mongodb";
import { logger } from "@/lib/logger";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { NotificationDTO } from "../types/notification.types";
import { compileDynamicNotifications } from "../engine/notification.engine";
import { findBudgetsByUserId } from "@/features/budget/repositories/budget.repository";
import { findGoalsByUserId } from "@/features/goals/repositories/goal.repository";
import {
  findReadNotificationIds,
  findUserLastReadTimestamp,
  updateLastReadAllTimestamp,
} from "../repositories/notification.repository";
import { TRANSACTIONS_COLLECTION } from "@/lib/models/Transaction";
import { serializeTransaction } from "@/lib/models/Transaction";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import { ObjectId } from "mongodb";

interface CacheBlock {
  userId: string;
  notifications: NotificationDTO[];
  timestamp: number;
}

let notificationsCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000;

export function invalidateNotificationsCache(userId: string) {
  logger.info("Invalidating notifications cache", { userId });
  notificationsCache = notificationsCache.filter((c) => c.userId !== userId);
}

export async function getNotificationsService(
  userId: string
): Promise<ApiResponse<NotificationDTO[]>> {
  const nowTime = Date.now();
  const cached = notificationsCache.find((c) => c.userId === userId && nowTime - c.timestamp < CACHE_TTL_MS);

  if (cached) {
    logger.info("Serving notifications from cache", { userId });
    return {
      success: true,
      message: "Notifications retrieved successfully (cached)",
      data: cached.notifications,
    };
  }

  try {
    const db = await connectDB();

    // Calculate current month's start/end dates for transactions query
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 1. Fetch budgets, goals, transactions, and read markers
    const txCol = db.collection(TRANSACTIONS_COLLECTION);
    const [budgets, goals, currentTxRaw, readIds, lastReadDate] = await Promise.all([
      findBudgetsByUserId(db, userId),
      findGoalsByUserId(db, userId),
      txCol
        .find({
          userId: new ObjectId(userId),
          isArchived: false,
          transactionDate: { $gte: startOfMonth, $lte: endOfMonth },
        })
        .toArray(),
      findReadNotificationIds(db, userId),
      findUserLastReadTimestamp(db, userId),
    ]);

    const currentTx = currentTxRaw.map(serializeTransaction) as unknown as TransactionDTO[];

    // 2. Generate dynamic notifications
    const rawNotifications = compileDynamicNotifications(userId, budgets, goals, currentTx);

    // 3. Apply read histories
    const finalized = rawNotifications.map((n) => {
      let isRead = false;
      if (readIds.includes(n.id)) {
        isRead = true;
      } else if (lastReadDate && new Date(n.createdAt).getTime() <= lastReadDate.getTime()) {
        isRead = true;
      }
      return { ...n, isRead };
    });

    // Sort: Unread first, then severity (critical -> warning -> info), then date
    const sorted = finalized.sort((a, b) => {
      if (a.isRead !== b.isRead) {
        return a.isRead ? 1 : -1;
      }
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      const sevA = severityOrder[a.severity] ?? 3;
      const sevB = severityOrder[b.severity] ?? 3;
      if (sevA !== sevB) return sevA - sevB;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Save to cache
    notificationsCache = notificationsCache.filter((c) => c.userId !== userId);
    notificationsCache.push({
      userId,
      notifications: sorted,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "Notifications compiled successfully",
      data: sorted,
    };
  } catch (error) {
    logger.error("Failed to compile user notifications", error, { userId });
    return {
      success: false,
      message: "Failed to compile active account notifications.",
    };
  }
}

export async function readAllNotificationsService(userId: string): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    await updateLastReadAllTimestamp(db, userId);

    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "All alerts reset successfully",
      data: null,
    };
  } catch (error) {
    logger.error("Failed to mark notifications read-all", error, { userId });
    return {
      success: false,
      message: "Failed to update alert statuses.",
    };
  }
}
