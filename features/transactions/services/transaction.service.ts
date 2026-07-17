import clientPromise, { connectDB } from "@/lib/mongodb";
import {
  findAccountsByUserId,
  findAccountByIdWithSession,
} from "@/features/accounts/repositories/account.repository";
import {
  createTransactionWithSession,
  findTransactionByIdWithSession,
  findTransactions,
  countTransactions,
  updateTransactionWithSession,
  archiveTransactionWithSession,
} from "../repositories/transaction.repository";
import {
  applyTransactionEffect,
  rollbackTransactionEffect,
  validateAccountOwnership,
} from "./ledger.service";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "../schemas/transaction.schema";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryParams,
  PaginatedTransactions,
  TransactionDTO,
} from "../types/transaction.types";
import type { ApiResponse, AccountDTO } from "@/features/accounts/types/account.types";
import { logger } from "@/lib/logger";
import { invalidateAnalyticsCache } from "@/features/analytics/services/analytics.service";
import { invalidateBudgetCache } from "@/features/budget/services/budget.service";
import { invalidateGoalsCache } from "@/features/goals/services/goal.service";
import { invalidateAICache } from "@/features/ai/services/ai.service";
import { invalidateReportsCache } from "@/features/reports/services/report.service";
import { invalidateNotificationsCache } from "@/features/notifications/services/notification.service";

// ─────────────────────────────────────────────
// Get Paginated / Filtered Transactions
// ─────────────────────────────────────────────
export async function getTransactionsService(
  userId: string,
  rawParams: Record<string, string>
): Promise<ApiResponse<PaginatedTransactions>> {
  try {
    const parsed = transactionQuerySchema.safeParse(rawParams);
    const params: TransactionQueryParams = parsed.success
      ? (parsed.data as TransactionQueryParams)
      : {};

    const db = await connectDB();
    const [transactions, totalCount] = await Promise.all([
      findTransactions(db, userId, params),
      countTransactions(db, userId, params),
    ]);

    const page = Math.max(1, parseInt(params.page || "1", 10));
    const limit = Math.max(1, parseInt(params.limit || "20", 10));
    const totalPages = Math.ceil(totalCount / limit);

    return {
      success: true,
      message: "Transactions retrieved successfully",
      data: {
        transactions: transactions as TransactionDTO[],
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    };
  } catch (error) {
    logger.error("Failed to fetch transactions logs", error, { userId });
    return {
      success: false,
      message: "Failed to load transactions list.",
    };
  }
}

// ─────────────────────────────────────────────
// Get Single Transaction details
// ─────────────────────────────────────────────
export async function getTransactionByIdService(
  transactionId: string,
  userId: string
): Promise<ApiResponse<TransactionDTO>> {
  try {
    const db = await connectDB();
    const transaction = (await findTransactionByIdWithSession(db, transactionId, userId)) as TransactionDTO | null;

    if (!transaction || transaction.isArchived) {
      return {
        success: false,
        message: "Transaction not found or access denied.",
      };
    }

    return {
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction as TransactionDTO,
    };
  } catch (error) {
    logger.error("Failed to retrieve transaction", error, { transactionId, userId });
    return {
      success: false,
      message: "Failed to retrieve transaction.",
    };
  }
}

// ─────────────────────────────────────────────
// Create Transaction — WITH TRANSACTIONS & BALANCE SYNC
// ─────────────────────────────────────────────
export async function createTransactionService(
  userId: string,
  body: unknown
): Promise<ApiResponse<TransactionDTO>> {
  const parsed = createTransactionSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return {
      success: false,
      message: "Validation failed. Check your input.",
      errors,
    };
  }

  // Check if MONGODB_URI exists. If not, use local-data storage (which does not support startTransaction)
  if (!process.env.MONGODB_URI) {
    try {
      const db = await connectDB();
      const valid = await validateAccountOwnership(db, parsed.data.accountId, userId);
      if (!valid) {
        return { success: false, message: "Access Denied: Selected account is invalid or unauthorized." };
      }
      
      const transaction = await createTransactionWithSession(db, userId, parsed.data as CreateTransactionInput);
      await applyTransactionEffect(db, userId, parsed.data.accountId, parsed.data.type as "Income" | "Expense", parsed.data.amount);
      
      // Invalidate cache
      invalidateAnalyticsCache(userId);
      invalidateBudgetCache(userId);
      invalidateGoalsCache(userId);
      invalidateAICache(userId);
      invalidateReportsCache(userId);
      invalidateNotificationsCache(userId);

      logger.info("Transaction Created (Local Dev Mode)", { transactionId: transaction._id });
      return { success: true, message: "Transaction logged successfully", data: transaction as TransactionDTO };
    } catch (err) {
      logger.error("Create transaction failure in local dev mode", err);
      return { success: false, message: "Failed to save transaction record." };
    }
  }

  // Real MongoDB connection with ACID Transactions
  const client = await clientPromise;
  const session = client!.startSession();

  try {
    let createdTx: TransactionDTO | null = null;

    await session.withTransaction(async () => {
      const db = client!.db("flops");

      // 1. Verify account exists, is active, and is owned by the user
      const valid = await validateAccountOwnership(db, parsed.data.accountId, userId, session);
      if (!valid) {
        throw new Error("UNAUTHORIZED_ACCOUNT");
      }

      // 2. Insert transaction log
      createdTx = (await createTransactionWithSession(
        db,
        userId,
        parsed.data as CreateTransactionInput,
        session
      )) as TransactionDTO;

      // 3. Atomically update linked account balance
      await applyTransactionEffect(db, userId, parsed.data.accountId, parsed.data.type as "Income" | "Expense", parsed.data.amount, session);
      
      logger.info("Transaction Committed Successfully", { transactionId: createdTx._id });
    });

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Transaction logged successfully",
      data: createdTx!,
    };
  } catch (error: any) {
    logger.error("Transaction Aborted due to failure during creation", error);
    if (error.message === "UNAUTHORIZED_ACCOUNT") {
      return {
        success: false,
        message: "Access Denied: Selected account is unauthorized or invalid.",
      };
    }
    return {
      success: false,
      message: "Failed to save transaction record.",
    };
  } finally {
    await session.endSession();
  }
}

// ─────────────────────────────────────────────
// Update Transaction — WITH REVERSAL & TRANSACTIONS
// ─────────────────────────────────────────────
export async function updateTransactionService(
  transactionId: string,
  userId: string,
  body: unknown
): Promise<ApiResponse<TransactionDTO>> {
  const parsed = updateTransactionSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    return {
      success: false,
      message: "Validation failed. Check your input.",
      errors,
    };
  }

  // Local dev mode fallback (no transactions support)
  if (!process.env.MONGODB_URI) {
    try {
      const db = await connectDB();
      const oldTx = (await findTransactionByIdWithSession(db, transactionId, userId)) as TransactionDTO | null;
      if (!oldTx) {
        return { success: false, message: "Transaction not found or access denied." };
      }

      // Validate new account if account is moving
      const targetAccountId = parsed.data.accountId || oldTx.accountId;
      const valid = await validateAccountOwnership(db, targetAccountId, userId);
      if (!valid) {
        return { success: false, message: "Access Denied: Target account is invalid or unauthorized." };
      }

      // Rollback old effect
      await rollbackTransactionEffect(db, userId, oldTx.accountId, oldTx.type, oldTx.amount);

      // Perform update mutation
      const updatedTx = (await updateTransactionWithSession(db, transactionId, userId, parsed.data as UpdateTransactionInput)) as TransactionDTO | null;
      if (!updatedTx) throw new Error("Update operation returned null");

      // Apply new effect
      await applyTransactionEffect(db, userId, updatedTx.accountId, updatedTx.type, updatedTx.amount);

      // Invalidate cache
      // Invalidate cache
      invalidateAnalyticsCache(userId);
      invalidateBudgetCache(userId);
      invalidateGoalsCache(userId);
      invalidateAICache(userId);
      invalidateReportsCache(userId);
      invalidateNotificationsCache(userId);

      logger.info("Transaction Updated (Local Dev Mode)", { transactionId });
      return { success: true, message: "Transaction updated successfully", data: updatedTx as TransactionDTO };
    } catch (err) {
      logger.error("Update transaction failure in local dev mode", err);
      return { success: false, message: "Failed to update transaction record." };
    }
  }

  // ACID transaction implementation
  const client = await clientPromise;
  const session = client!.startSession();

  try {
    let updatedTxResult: TransactionDTO | null = null;

    await session.withTransaction(async () => {
      const db = client!.db("flops");

      // Fetch existing transaction details
      const oldTx = (await findTransactionByIdWithSession(db, transactionId, userId, session)) as TransactionDTO | null;
      if (!oldTx) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      // Validate target account selection if modified
      const targetAccountId = parsed.data.accountId || oldTx.accountId;
      const valid = await validateAccountOwnership(db, targetAccountId, userId, session);
      if (!valid) {
        throw new Error("UNAUTHORIZED_ACCOUNT");
      }

      // 1. Rollback old impact from the old account
      await rollbackTransactionEffect(db, userId, oldTx.accountId, oldTx.type, oldTx.amount, session);

      // 2. Perform the update
      updatedTxResult = (await updateTransactionWithSession(
        db,
        transactionId,
        userId,
        parsed.data as UpdateTransactionInput,
        session
      )) as TransactionDTO;

      if (!updatedTxResult) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      // 3. Apply the new effect to the target account
      await applyTransactionEffect(
        db,
        userId,
        updatedTxResult.accountId,
        updatedTxResult.type,
        updatedTxResult.amount,
        session
      );

      logger.info("Transaction Update Committed Successfully", { transactionId });
    });

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Transaction updated successfully",
      data: updatedTxResult!,
    };
  } catch (error: any) {
    logger.error("Transaction Update Aborted due to failure", error);
    if (error.message === "TRANSACTION_NOT_FOUND") {
      return {
        success: false,
        message: "Transaction not found or unauthorized for edits.",
      };
    }
    if (error.message === "UNAUTHORIZED_ACCOUNT") {
      return {
        success: false,
        message: "Access Denied: Target account is unauthorized or invalid.",
      };
    }
    return {
      success: false,
      message: "Failed to update transaction record.",
    };
  } finally {
    await session.endSession();
  }
}

// ─────────────────────────────────────────────
// Archive Transaction — WITH REVERSAL & TRANSACTIONS
// ─────────────────────────────────────────────
export async function archiveTransactionService(
  transactionId: string,
  userId: string
): Promise<ApiResponse<null>> {
  // Local dev mode fallback (no transactions support)
  if (!process.env.MONGODB_URI) {
    try {
      const db = await connectDB();
      const oldTx = (await findTransactionByIdWithSession(db, transactionId, userId)) as TransactionDTO | null;
      if (!oldTx) {
        return { success: false, message: "Transaction not found or access denied." };
      }

      // Soft delete
      const success = await archiveTransactionWithSession(db, transactionId, userId);
      if (!success) {
        return { success: false, message: "Transaction not found or access denied." };
      }

      // Rollback balance impact
      await rollbackTransactionEffect(db, userId, oldTx.accountId, oldTx.type, oldTx.amount);

      // Invalidate cache
      invalidateAnalyticsCache(userId);
      invalidateBudgetCache(userId);
      invalidateGoalsCache(userId);
      invalidateAICache(userId);
      invalidateReportsCache(userId);
      invalidateNotificationsCache(userId);

      logger.info("Transaction Archived (Local Dev Mode)", { transactionId });
      return { success: true, message: "Transaction archived successfully", data: null };
    } catch (err) {
      logger.error("Archive transaction failure in local dev mode", err);
      return { success: false, message: "Failed to archive transaction." };
    }
  }

  // ACID transaction implementation
  const client = await clientPromise;
  const session = client!.startSession();

  try {
    await session.withTransaction(async () => {
      const db = client!.db("flops");

      // Fetch transaction
      const oldTx = (await findTransactionByIdWithSession(db, transactionId, userId, session)) as TransactionDTO | null;
      if (!oldTx) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      // 1. Soft delete
      const success = await archiveTransactionWithSession(db, transactionId, userId, session);
      if (!success) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      // 2. Rollback balance impact
      await rollbackTransactionEffect(db, userId, oldTx.accountId, oldTx.type, oldTx.amount, session);

      logger.info("Transaction Archive Committed Successfully", { transactionId });
    });

    // Invalidate cache
    invalidateAnalyticsCache(userId);
    invalidateBudgetCache(userId);
    invalidateGoalsCache(userId);
    invalidateAICache(userId);
    invalidateReportsCache(userId);
    invalidateNotificationsCache(userId);

    return {
      success: true,
      message: "Transaction record soft-deleted (archived).",
      data: null,
    };
  } catch (error: any) {
    logger.error("Transaction Archive Aborted due to failure", error);
    if (error.message === "TRANSACTION_NOT_FOUND") {
      return {
        success: false,
        message: "Transaction not found or access denied.",
      };
    }
    return {
      success: false,
      message: "Failed to archive transaction.",
    };
  } finally {
    await session.endSession();
  }
}
