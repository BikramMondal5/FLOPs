import { connectDB } from "@/lib/mongodb";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { GoalDashboardDTO } from "../dto/goal-dashboard.dto";
import type { GoalDTO } from "../types/goal.types";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import { getBudgetDashboardService } from "@/features/budget/services/budget.service";
import {
  findGoalsByUserId,
  findGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../repositories/goal.repository";
import { evaluateSmartGoals } from "../engine/goal.engine";
import { mapEngineResultsToGoalsDashboardDTO } from "../mappers/goal.mapper";
import { createGoalSchema, updateGoalSchema } from "../schemas/goal.schema";
import { logger } from "@/lib/logger";
import { invalidateAICache } from "@/features/ai/services/ai.service";
import { invalidateNotificationsCache } from "@/features/notifications/services/notification.service";

interface CacheBlock {
  userId: string;
  dto: GoalDashboardDTO;
  timestamp: number;
}

let goalsCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000;

export function invalidateGoalsCache(userId: string) {
  logger.info("Invalidating goals dashboard cache", { userId });
  goalsCache = goalsCache.filter((c) => c.userId !== userId);
}

// ─────────────────────────────────────────────
// Get Smart Goal Dashboard DTO
// ─────────────────────────────────────────────
export async function getGoalsDashboardService(
  userId: string
): Promise<ApiResponse<GoalDashboardDTO>> {
  const nowTime = Date.now();
  const cached = goalsCache.find((c) => c.userId === userId && nowTime - c.timestamp < CACHE_TTL_MS);

  if (cached) {
    logger.info("Serving smart goals analytics from cache", { userId });
    return {
      success: true,
      message: "Goals dashboard retrieved successfully (cached)",
      data: cached.dto,
    };
  }

  try {
    const db = await connectDB();

    // 1. Fetch user custom goals list from DB
    const goals = await findGoalsByUserId(db, userId);

    // 2. Fetch budget scores from Smart Budget Engine
    const budgetResponse = await getBudgetDashboardService(userId);
    const budgetHealthScore = budgetResponse.success && budgetResponse.data 
      ? budgetResponse.data.summary.overallHealthProgress 
      : 50;

    // 3. Fetch savings speed from Financial Analytics Engine
    const analyticsResponse = await getDashboardAnalyticsService(userId, "This Month");
    const avgMonthlySavings = analyticsResponse.success && analyticsResponse.data
      ? analyticsResponse.data.summary.netSavings
      : 5000;

    // 4. Process goals health predictions dynamically
    const evaluated = evaluateSmartGoals(goals, avgMonthlySavings, budgetHealthScore);

    // 5. Map to dashboard DTO
    const dto = mapEngineResultsToGoalsDashboardDTO(evaluated, avgMonthlySavings);

    // Save cache
    goalsCache = goalsCache.filter((c) => c.userId !== userId);
    goalsCache.push({
      userId,
      dto,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "Goals dashboard compiled successfully",
      data: dto,
    };
  } catch (error) {
    logger.error("Failed to compile smart goal planner dashboard", error, { userId });
    return {
      success: false,
      message: "Failed to compile active goal plans.",
    };
  }
}

// ─────────────────────────────────────────────
// CRUD Operations
// ─────────────────────────────────────────────

export async function getGoalsListService(userId: string): Promise<ApiResponse<GoalDTO[]>> {
  try {
    const db = await connectDB();
    const list = await findGoalsByUserId(db, userId);
    return { success: true, message: "Goals list retrieved", data: list };
  } catch (err) {
    logger.error("Failed to load goals list", err, { userId });
    return { success: false, message: "Failed to load goals." };
  }
}

export async function createGoalService(userId: string, body: unknown): Promise<ApiResponse<GoalDTO>> {
  const parsed = createGoalSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return { success: false, message: "Validation failed.", errors };
  }

  try {
    const db = await connectDB();
    const goal = await createGoal(db, userId, parsed.data);

    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateNotificationsCache(userId);

    return { success: true, message: "Goal created successfully", data: goal };
  } catch (err) {
    logger.error("Failed to create goal entry", err, { userId });
    return { success: false, message: "Failed to save goal plan." };
  }
}

export async function updateGoalService(
  goalId: string,
  userId: string,
  body: unknown
): Promise<ApiResponse<GoalDTO>> {
  const parsed = updateGoalSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return { success: false, message: "Validation failed.", errors };
  }

  try {
    const db = await connectDB();
    const updated = await updateGoal(db, goalId, userId, parsed.data);

    if (!updated) {
      return { success: false, message: "Goal not found or access denied." };
    }

    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateNotificationsCache(userId);

    return { success: true, message: "Goal updated successfully", data: updated };
  } catch (err) {
    logger.error("Failed to update goal entry", err, { goalId, userId });
    return { success: false, message: "Failed to update goal plan." };
  }
}

export async function deleteGoalService(goalId: string, userId: string): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    const success = await deleteGoal(db, goalId, userId);

    if (!success) {
      return { success: false, message: "Goal not found or access denied." };
    }

    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateNotificationsCache(userId);

    return { success: true, message: "Goal deleted successfully", data: null };
  } catch (err) {
    logger.error("Failed to delete goal entry", err, { goalId, userId });
    return { success: false, message: "Failed to delete goal plan." };
  }
}
