import { connectDB } from "@/lib/mongodb";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { FullProfileDTO, UpdateProfileDTO, UpdatePreferencesDTO } from "../dto/profile.dto";
import { getAccountsService } from "@/features/accounts/services/account.service";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import { getGoalsDashboardService } from "@/features/goals/services/goal.service";
import { getReportsHistoryService } from "@/features/reports/services/report.service";
import { getNotificationsService } from "@/features/notifications/services/notification.service";
import {
  findProfileByUserId,
  createProfile,
  updateProfile,
  findPreferencesByUserId,
  createPreferences,
  updatePreferences,
  findRecentActivity,
  logActivity,
} from "../repositories/profile.repository";
import { logger } from "@/lib/logger";

export async function getFullProfileService(
  userId: string,
  userName: string,
  userEmail: string
): Promise<ApiResponse<FullProfileDTO>> {
  try {
    const db = await connectDB();

    // Get or create profile
    let profile = await findProfileByUserId(db, userId);
    if (!profile) {
      profile = await createProfile(db, userId, {
        name: userName,
        email: userEmail,
        currency: "INR",
        language: "en",
      });
    }

    // Get or create preferences
    let preferences = await findPreferencesByUserId(db, userId);
    if (!preferences) {
      preferences = await createPreferences(db, userId);
    }

    // Fetch stats from various modules
    const [accountsRes, analyticsRes, budgetsRes, goalsRes, reportsRes, notificationsRes] = await Promise.all([
      getAccountsService(userId, { archived: "false" }),
      getDashboardAnalyticsService(userId, "This Month"),
      getBudgetDashboardService(userId),
      getGoalsDashboardService(userId),
      getReportsHistoryService(userId),
      getNotificationsService(userId),
    ]);

    const stats = {
      accountsCount: accountsRes.success && accountsRes.data ? accountsRes.data.length : 0,
      transactionsCount: 0, // Would need transaction count service
      budgetsCount: budgetsRes.success && budgetsRes.data ? budgetsRes.data.budgets.length : 0,
      goalsCount: goalsRes.success && goalsRes.data ? goalsRes.data.goals.length : 0,
      reportsCount: reportsRes.success && reportsRes.data ? reportsRes.data.length : 0,
      notificationsCount: notificationsRes.success && notificationsRes.data ? notificationsRes.data.totalUnread : 0,
      aiChatsCount: 0, // Would need AI chat history count
    };

    // Calculate financial snapshot
    const netWorth =
      accountsRes.success && accountsRes.data
        ? accountsRes.data.reduce((sum, acc) => sum + acc.balance, 0)
        : 0;

    const monthlyIncome = analyticsRes.success && analyticsRes.data ? analyticsRes.data.summary.totalIncome : 0;
    const monthlyExpenses = analyticsRes.success && analyticsRes.data ? analyticsRes.data.summary.totalExpenses : 0;
    const savingsRate = analyticsRes.success && analyticsRes.data ? analyticsRes.data.summary.savingsRate : 0;
    const financialScore = analyticsRes.success && analyticsRes.data ? analyticsRes.data.health.score : null;
    const connectedBanks = stats.accountsCount;

    // Determine risk profile based on savings rate
    let riskProfile: "Conservative" | "Moderate" | "Aggressive" = "Moderate";
    if (savingsRate > 50) riskProfile = "Conservative";
    else if (savingsRate < 20) riskProfile = "Aggressive";

    const financialSnapshot = {
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      financialScore,
      connectedBanks,
      riskProfile,
    };

    // Get recent activity
    const recentActivity = await findRecentActivity(db, userId, 10);

    const fullProfile: FullProfileDTO = {
      profile,
      preferences,
      stats,
      financialSnapshot,
      recentActivity,
      joinedDate: profile.createdAt,
      lastLogin: new Date().toISOString(), // Would come from auth session
    };

    return {
      success: true,
      message: "Profile retrieved successfully",
      data: fullProfile,
    };
  } catch (error) {
    logger.error("Failed to get full profile", error, { userId });
    return {
      success: false,
      message: "Failed to retrieve profile",
    };
  }
}

export async function updateProfileService(
  userId: string,
  data: UpdateProfileDTO
): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    const updated = await updateProfile(db, userId, data);

    if (!updated) {
      return { success: false, message: "Profile not found" };
    }

    await logActivity(db, userId, "profile", "Profile updated");

    return {
      success: true,
      message: "Profile updated successfully",
      data: null,
    };
  } catch (error) {
    logger.error("Failed to update profile", error, { userId });
    return {
      success: false,
      message: "Failed to update profile",
    };
  }
}

export async function updatePreferencesService(
  userId: string,
  data: UpdatePreferencesDTO
): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    
    // Get existing preferences
    let preferences = await findPreferencesByUserId(db, userId);
    if (!preferences) {
      preferences = await createPreferences(db, userId);
    }

    // Merge updates
    const updates: any = {};
    if (data.notifications) {
      updates.notifications = { ...preferences.notifications, ...data.notifications };
    }
    if (data.appearance) {
      updates.appearance = { ...preferences.appearance, ...data.appearance };
    }
    if (data.privacy) {
      updates.privacy = { ...preferences.privacy, ...data.privacy };
    }

    const updated = await updatePreferences(db, userId, updates);

    if (!updated) {
      return { success: false, message: "Preferences not found" };
    }

    await logActivity(db, userId, "profile", "Preferences updated");

    return {
      success: true,
      message: "Preferences updated successfully",
      data: null,
    };
  } catch (error) {
    logger.error("Failed to update preferences", error, { userId });
    return {
      success: false,
      message: "Failed to update preferences",
    };
  }
}
