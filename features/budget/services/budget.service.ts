import { connectDB } from "@/lib/mongodb";
import { getDashboardAnalyticsService } from "@/features/analytics/services/analytics.service";
import type { ApiResponse } from "@/features/accounts/types/account.types";
import type { BudgetDashboardDTO, SmartBudgetDetailsDTO } from "../dto/budget-dashboard.dto";
import type { BudgetDTO } from "../types/budget.types";
import {
  findBudgetsByUserId,
  findBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../repositories/budget.repository";
import { evaluateSmartBudgets } from "../engine/budget.engine";
import { mapEngineResultsToDashboardDTO } from "../mappers/budget.mapper";
import { createBudgetSchema, updateBudgetSchema } from "../schemas/budget.schema";
import { logger } from "@/lib/logger";
import { invalidateGoalsCache } from "@/features/goals/services/goal.service";
import { invalidateAICache } from "@/features/ai/services/ai.service";

interface CacheBlock {
  userId: string;
  dto: BudgetDashboardDTO;
  timestamp: number;
}

let budgetCache: CacheBlock[] = [];
const CACHE_TTL_MS = 60 * 1000;

export function invalidateBudgetCache(userId: string) {
  logger.info("Invalidating smart budget dashboard cache", { userId });
  budgetCache = budgetCache.filter((c) => c.userId !== userId);
}

// ─────────────────────────────────────────────
// Get Smart Budget Dashboard DTO
// ─────────────────────────────────────────────
export async function getBudgetDashboardService(
  userId: string
): Promise<ApiResponse<BudgetDashboardDTO>> {
  const nowTime = Date.now();
  const cached = budgetCache.find((c) => c.userId === userId && nowTime - c.timestamp < CACHE_TTL_MS);

  if (cached) {
    logger.info("Serving smart budget analytics from cache", { userId });
    return {
      success: true,
      message: "Budget dashboard retrieved successfully (cached)",
      data: cached.dto,
    };
  }

  try {
    const db = await connectDB();

    // 1. Fetch user custom budget records
    const budgets = await findBudgetsByUserId(db, userId);

    // 2. Fetch category spending from the Analytics Engine
    const analyticsResponse = await getDashboardAnalyticsService(userId, "This Month");
    const categoryAnalytics = analyticsResponse.success && analyticsResponse.data 
      ? analyticsResponse.data.categories 
      : [];

    // 3. Process budget health calculations dynamically
    const evaluated = evaluateSmartBudgets(budgets, categoryAnalytics);

    // 4. Map to dashboard DTO
    const dto = mapEngineResultsToDashboardDTO(evaluated);

    // Save to local cache
    budgetCache = budgetCache.filter((c) => c.userId !== userId);
    budgetCache.push({
      userId,
      dto,
      timestamp: nowTime,
    });

    return {
      success: true,
      message: "Budget dashboard compiled successfully",
      data: dto,
    };
  } catch (error) {
    logger.error("Failed to compile smart budget engine dashboard", error, { userId });
    return {
      success: false,
      message: "Failed to compile active budget metrics.",
    };
  }
}

// ─────────────────────────────────────────────
// Standard CRUD Operations
// ─────────────────────────────────────────────

export async function getBudgetsListService(userId: string): Promise<ApiResponse<BudgetDTO[]>> {
  try {
    const db = await connectDB();
    const list = await findBudgetsByUserId(db, userId);
    return { success: true, message: "Budgets loaded successfully", data: list };
  } catch (err) {
    logger.error("Failed to load budgets list", err, { userId });
    return { success: false, message: "Failed to load budget entries." };
  }
}

export async function createBudgetService(userId: string, body: unknown): Promise<ApiResponse<BudgetDTO>> {
  const parsed = createBudgetSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return { success: false, message: "Validation failed.", errors };
  }

  try {
    const db = await connectDB();
    const budget = await createBudget(db, userId, parsed.data);

    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);

    return { success: true, message: "Budget created successfully", data: budget };
  } catch (err) {
    logger.error("Failed to create budget record", err, { userId });
    return { success: false, message: "Failed to save budget entry." };
  }
}

export async function updateBudgetService(
  budgetId: string,
  userId: string,
  body: unknown
): Promise<ApiResponse<BudgetDTO>> {
  const parsed = updateBudgetSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return { success: false, message: "Validation failed.", errors };
  }

  try {
    const db = await connectDB();
    const updated = await updateBudget(db, budgetId, userId, parsed.data);

    if (!updated) {
      return { success: false, message: "Budget not found or access denied." };
    }

    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);

    return { success: true, message: "Budget updated successfully", data: updated };
  } catch (err) {
    logger.error("Failed to update budget record", err, { budgetId, userId });
    return { success: false, message: "Failed to update budget entry." };
  }
}

export async function deleteBudgetService(budgetId: string, userId: string): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    const success = await deleteBudget(db, budgetId, userId);

    if (!success) {
      return { success: false, message: "Budget not found or access denied." };
    }

    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);

    return { success: true, message: "Budget deleted successfully", data: null };
  } catch (err) {
    logger.error("Failed to delete budget record", err, { budgetId, userId });
    return { success: false, message: "Failed to delete budget entry." };
  }
}
