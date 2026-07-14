import { Db, ClientSession } from "mongodb";
import { findAccountByIdWithSession, updateBalanceAtomic } from "@/features/accounts/repositories/account.repository";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import { logger } from "@/lib/logger";

/**
 * Calculates the balance adjustment multiplier based on transaction properties
 */
export function getAdjustmentAmount(type: "Income" | "Expense", amount: number): number {
  return type === "Income" ? amount : -amount;
}

/**
 * Verifies account existence, active state, and user ownership
 */
export async function validateAccountOwnership(
  db: Db,
  accountId: string,
  userId: string,
  session?: ClientSession
): Promise<boolean> {
  const account = (await findAccountByIdWithSession(db, accountId, userId, session)) as AccountDTO | null;
  if (!account || account.isArchived) {
    logger.warn("Account validation failed or account archived", { accountId, userId });
    return false;
  }
  return true;
}

/**
 * Applies transaction balance adjustments atomically
 */
export async function applyTransactionEffect(
  db: Db,
  userId: string,
  accountId: string,
  type: "Income" | "Expense",
  amount: number,
  session?: ClientSession
): Promise<void> {
  const adjustment = getAdjustmentAmount(type, amount);

  logger.info("Applying transaction balance adjustment", { accountId, adjustment });
  const success = await updateBalanceAtomic(db, accountId, userId, adjustment, session);

  if (!success) {
    throw new Error(`Failed to adjust balance for account ${accountId}. Active account may not exist.`);
  }

  logger.info("Balance adjustment successfully applied", { accountId, adjustment });
}

/**
 * Reverses transaction balance adjustments atomically
 */
export async function rollbackTransactionEffect(
  db: Db,
  userId: string,
  accountId: string,
  type: "Income" | "Expense",
  amount: number,
  session?: ClientSession
): Promise<void> {
  // Reversal is the exact negative of adjustment
  const adjustment = -getAdjustmentAmount(type, amount);

  logger.info("Rolling back transaction balance adjustment", { accountId, adjustment });
  const success = await updateBalanceAtomic(db, accountId, userId, adjustment, session);

  if (!success) {
    throw new Error(`Failed to rollback balance for account ${accountId}. Account may not exist.`);
  }

  logger.info("Balance rollback successfully applied", { accountId, adjustment });
}
