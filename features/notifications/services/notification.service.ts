import { connectDB } from "@/lib/mongodb";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { NotificationDTO, NotificationSummaryDTO } from "../dto/notification.dto";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { generateBudgetNotifications } from "../generators/budget.generator";
import { generateGoalNotifications } from "../generators/goal.generator";
import { generateHealthNotifications } from "../generators/health.generator";
import { generateAINotifications } from "../generators/ai.generator";
import {
  findReadStatusByUserId,
  markNotificationRead,
  markAllNotificationsRead,
} from "../repositories/notification.repository";
import { logger } from "@/lib/logger";

// Placeholder cache invalidation
export function invalidateNotificationsCache(userId: string) {
  logger.info("Notifications cache invalidation requested", { userId });
}

// ─────────────────────────────────────────────
// Get Notifications
// ─────────────────────────────────────────────
export async function getNotificationsService(
  userId: string
): Promise<ApiResponse<NotificationSummaryDTO>> {
  try {
    // Fetch data from all modules (reuse existing services)
    const [budgetsRes, goalsRes, analyticsRes] = await Promise.all([
      getBudgetDashboardService(userId),
      getGoalsDashboardService(userId),
      getDashboardAnalyticsService(userId, "This Month"),
    ]);

    const allNotifications: NotificationDTO[] = [];

    // Generate budget notifications
    if (budgetsRes.success && budgetsRes.data && budgetsRes.data.budgets.length > 0) {
      const budgetNotifs = generateBudgetNotifications(budgetsRes.data.budgets);
      allNotifications.push(...budgetNotifs);
    }

    // Generate goal notifications
    if (goalsRes.success && goalsRes.data && goalsRes.data.goals.length > 0) {
      const goalNotifs = generateGoalNotifications(goalsRes.data.goals);
      allNotifications.push(...goalNotifs);
    }

    // Generate health notifications
    if (analyticsRes.success && analyticsRes.data) {
      const healthNotifs = generateHealthNotifications(analyticsRes.data.health);
      allNotifications.push(...healthNotifs);

      // Generate AI notifications
      const aiNotifs = generateAINotifications(
        analyticsRes.data.categories,
        analyticsRes.data.summary.savingsRate
      );
      allNotifications.push(...aiNotifs);
    }

    // Fetch read status
    const db = await connectDB();
    const readStatuses = await findReadStatusByUserId(db, userId);
    const readMap = new Map(readStatuses.map((s) => [s.notificationId, s.read]));

    // Apply read status
    allNotifications.forEach((notif) => {
      notif.read = readMap.get(notif.id) || false;
    });

    // Sort by severity and recency
    const severityOrder = { critical: 0, warning: 1, success: 2, info: 3 };
    allNotifications.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    const totalUnread = allNotifications.filter((n) => !n.read).length;

    return {
      success: true,
      message: "Notifications retrieved successfully",
      data: {
        totalUnread,
        notifications: allNotifications,
      },
    };
  } catch (error) {
    logger.error("Failed to get notifications", error, { userId });
    return {
      success: false,
      message: "Failed to retrieve notifications",
    };
  }
}

// ─────────────────────────────────────────────
// Mark Notification as Read
// ─────────────────────────────────────────────
export async function markNotificationReadService(
  userId: string,
  notificationId: string
): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    await markNotificationRead(db, userId, notificationId);

    return {
      success: true,
      message: "Notification marked as read",
      data: null,
    };
  } catch (error) {
    logger.error("Failed to mark notification as read", error, { userId, notificationId });
    return {
      success: false,
      message: "Failed to mark notification as read",
    };
  }
}

// ─────────────────────────────────────────────
// Mark All Notifications as Read
// ─────────────────────────────────────────────
export async function markAllNotificationsReadService(
  userId: string
): Promise<ApiResponse<null>> {
  try {
    // Get all current notifications
    const notificationsRes = await getNotificationsService(userId);
    if (!notificationsRes.success || !notificationsRes.data) {
      return { success: false, message: "Failed to fetch notifications" };
    }

    const notificationIds = notificationsRes.data.notifications.map((n) => n.id);
    if (notificationIds.length === 0) {
      return { success: true, message: "No notifications to mark as read", data: null };
    }

    const db = await connectDB();
    await markAllNotificationsRead(db, userId, notificationIds);

    return {
      success: true,
      message: "All notifications marked as read",
      data: null,
    };
  } catch (error) {
    logger.error("Failed to mark all notifications as read", error, { userId });
    return {
      success: false,
      message: "Failed to mark all notifications as read",
    };
  }
}
