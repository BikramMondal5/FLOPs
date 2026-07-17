import { connectDB } from "@/lib/mongodb";
import {
  findAccountsByUserId,
  findAccountByIdWithSession,
  createAccount,
  updateAccount,
  archiveAccount,
} from "../repositories/account.repository";
import { createAccountSchema, updateAccountSchema, accountQuerySchema } from "../schemas/account.schema";
import type { CreateAccountInput, UpdateAccountInput, AccountQueryParams, ApiResponse, AccountDTO } from "../types/account.types";
import { invalidateAnalyticsCache } from "@/features/analytics/services/analytics.service";
import { invalidateBudgetCache } from "@/features/budget/services/budget.service";
import { invalidateGoalsCache } from "@/features/goals/services/goal.service";
import { invalidateAICache } from "@/features/ai/services/ai.service";
import { invalidateReportsCache } from "@/features/reports/services/report.service";
import { invalidateNotificationsCache } from "@/features/notifications/services/notification.service";

// ─────────────────────────────────────────────
// Get All Accounts
// ─────────────────────────────────────────────
export async function getAccountsService(
  userId: string,
  rawParams: Record<string, string>
): Promise<ApiResponse<AccountDTO[]>> {
  try {
    const parsed = accountQuerySchema.safeParse(rawParams);
    const params: AccountQueryParams = parsed.success ? (parsed.data as AccountQueryParams) : {};

    const db = await connectDB();
    const accounts = await findAccountsByUserId(db, userId, params);

    return {
      success: true,
      message: "Accounts fetched successfully",
      data: accounts as AccountDTO[],
    };
  } catch (error) {
    console.error("[AccountService] getAccountsService error:", error);
    return {
      success: false,
      message: "Failed to fetch accounts. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────
// Get Single Account
// ─────────────────────────────────────────────
export async function getAccountByIdService(
  accountId: string,
  userId: string
): Promise<ApiResponse<AccountDTO>> {
  try {
    const db = await connectDB();
    const account = (await findAccountByIdWithSession(db, accountId, userId)) as AccountDTO | null;

    if (!account || account.isArchived) {
      return {
        success: false,
        message: "Account not found or you do not have permission to view it.",
      };
    }

    return {
      success: true,
      message: "Account fetched successfully",
      data: account as AccountDTO,
    };
  } catch (error) {
    console.error("[AccountService] getAccountByIdService error:", error);
    return {
      success: false,
      message: "Failed to fetch account. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────
// Create Account
// ─────────────────────────────────────────────
export async function createAccountService(
  userId: string,
  body: unknown
): Promise<ApiResponse<AccountDTO>> {
  // Validate
  const parsed = createAccountSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return {
      success: false,
      message: "Validation failed. Please check the fields below.",
      errors,
    };
  }

  try {
    const db = await connectDB();
    const account = await createAccount(db, userId, parsed.data as CreateAccountInput);

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Account created successfully",
      data: account as AccountDTO,
    };
  } catch (error) {
    console.error("[AccountService] createAccountService error:", error);
    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────
// Update Account
// ─────────────────────────────────────────────
export async function updateAccountService(
  accountId: string,
  userId: string,
  body: unknown
): Promise<ApiResponse<AccountDTO>> {
  // Validate
  const parsed = updateAccountSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return {
      success: false,
      message: "Validation failed. Please check the fields below.",
      errors,
    };
  }

  try {
    const db = await connectDB();
    const account = await updateAccount(db, accountId, userId, parsed.data as UpdateAccountInput);

    if (!account) {
      return {
        success: false,
        message: "Account not found or you do not have permission to update it.",
      };
    }

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Account updated successfully",
      data: account as AccountDTO,
    };
  } catch (error) {
    console.error("[AccountService] updateAccountService error:", error);
    return {
      success: false,
      message: "Failed to update account. Please try again.",
    };
  }
}

// ─────────────────────────────────────────────
// Archive Account (Soft Delete)
// ─────────────────────────────────────────────
export async function archiveAccountService(
  accountId: string,
  userId: string
): Promise<ApiResponse<null>> {
  try {
    const db = await connectDB();
    const success = await archiveAccount(db, accountId, userId);

    if (!success) {
      return {
        success: false,
        message: "Account not found or you do not have permission to delete it.",
      };
    }

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Account archived successfully",
      data: null,
    };
  } catch (error) {
    console.error("[AccountService] archiveAccountService error:", error);
    return {
      success: false,
      message: "Failed to archive account. Please try again.",
    };
  }
}
