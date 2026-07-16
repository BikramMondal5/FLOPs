import { describe, test, expect, vi, beforeEach } from 'vitest';
import {
  getAdjustmentAmount,
  validateAccountOwnership,
  applyTransactionEffect,
  rollbackTransactionEffect,
} from '@/features/transactions/services/ledger.service';
import {
  findAccountByIdWithSession,
  updateBalanceAtomic,
} from '@/features/accounts/repositories/account.repository';
import type { Db } from 'mongodb';

// Mock the account repository functions
vi.mock('@/features/accounts/repositories/account.repository', () => ({
  findAccountByIdWithSession: vi.fn(),
  updateBalanceAtomic: vi.fn(),
}));

describe('Ledger Engine Services', () => {
  const mockDb = {} as Db;
  const userId = 'user-123';
  const accountId = 'account-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAdjustmentAmount', () => {
    test('returns positive value for Income', () => {
      expect(getAdjustmentAmount('Income', 500)).toBe(500);
      expect(getAdjustmentAmount('Income', 0)).toBe(0);
      expect(getAdjustmentAmount('Income', 100000000)).toBe(100000000);
    });

    test('returns negative value for Expense', () => {
      expect(getAdjustmentAmount('Expense', 500)).toBe(-500);
      expect(getAdjustmentAmount('Expense', 0)).toBe(-0);
      expect(getAdjustmentAmount('Expense', 100000000)).toBe(-100000000);
    });

    test('handles edge cases: negative amount inputs and decimal values', () => {
      expect(getAdjustmentAmount('Income', -250)).toBe(-250);
      expect(getAdjustmentAmount('Expense', -250)).toBe(250);
      expect(getAdjustmentAmount('Income', 123.45)).toBe(123.45);
      expect(getAdjustmentAmount('Expense', 123.45)).toBe(-123.45);
    });
  });

  describe('validateAccountOwnership', () => {
    test('returns true if active account exists and owned by user', async () => {
      vi.mocked(findAccountByIdWithSession).mockResolvedValue({
        _id: accountId,
        userId,
        name: 'Savings',
        type: 'Savings',
        currency: 'INR',
        balance: 1000,
        isArchived: false,
        createdAt: '',
        updatedAt: '',
      });

      const isValid = await validateAccountOwnership(mockDb, accountId, userId);
      expect(isValid).toBe(true);
      expect(findAccountByIdWithSession).toHaveBeenCalledWith(mockDb, accountId, userId, undefined);
    });

    test('returns false if account is archived', async () => {
      vi.mocked(findAccountByIdWithSession).mockResolvedValue({
        _id: accountId,
        userId,
        name: 'Savings',
        type: 'Savings',
        currency: 'INR',
        balance: 1000,
        isArchived: true,
        createdAt: '',
        updatedAt: '',
      });

      const isValid = await validateAccountOwnership(mockDb, accountId, userId);
      expect(isValid).toBe(false);
    });

    test('returns false if account does not exist', async () => {
      vi.mocked(findAccountByIdWithSession).mockResolvedValue(null);

      const isValid = await validateAccountOwnership(mockDb, accountId, userId);
      expect(isValid).toBe(false);
    });
  });

  describe('applyTransactionEffect', () => {
    test('successfully updates balance for Income', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(true);

      await expect(
        applyTransactionEffect(mockDb, userId, accountId, 'Income', 1500)
      ).resolves.not.toThrow();

      expect(updateBalanceAtomic).toHaveBeenCalledWith(mockDb, accountId, userId, 1500, undefined);
    });

    test('successfully updates balance for Expense', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(true);

      await expect(
        applyTransactionEffect(mockDb, userId, accountId, 'Expense', 500)
      ).resolves.not.toThrow();

      expect(updateBalanceAtomic).toHaveBeenCalledWith(mockDb, accountId, userId, -500, undefined);
    });

    test('throws error if updateBalanceAtomic returns false', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(false);

      await expect(
        applyTransactionEffect(mockDb, userId, accountId, 'Income', 500)
      ).rejects.toThrow('Failed to adjust balance for account account-123. Active account may not exist.');
    });
  });

  describe('rollbackTransactionEffect', () => {
    test('successfully rolls back balance for Income (reduces balance)', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(true);

      await expect(
        rollbackTransactionEffect(mockDb, userId, accountId, 'Income', 1500)
      ).resolves.not.toThrow();

      expect(updateBalanceAtomic).toHaveBeenCalledWith(mockDb, accountId, userId, -1500, undefined);
    });

    test('successfully rolls back balance for Expense (increases balance)', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(true);

      await expect(
        rollbackTransactionEffect(mockDb, userId, accountId, 'Expense', 500)
      ).resolves.not.toThrow();

      expect(updateBalanceAtomic).toHaveBeenCalledWith(mockDb, accountId, userId, 500, undefined);
    });

    test('throws error if updateBalanceAtomic returns false during rollback', async () => {
      vi.mocked(updateBalanceAtomic).mockResolvedValue(false);

      await expect(
        rollbackTransactionEffect(mockDb, userId, accountId, 'Income', 500)
      ).rejects.toThrow('Failed to rollback balance for account account-123. Account may not exist.');
    });
  });
});
