import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { compileDynamicNotifications } from '@/features/notifications/engine/notification.engine';
import { transactionsMedium } from '../../fixtures/transactions';
import { budgetsFixture } from '../../fixtures/budgets';
import { goalsFixture } from '../../fixtures/goals';
import type { TransactionDTO } from '@/features/transactions/types/transaction.types';

describe('Notification Engine - compiler', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('compiles notifications appropriately on normal ledger conditions', () => {
    const alerts = compileDynamicNotifications(
      userId,
      budgetsFixture,
      goalsFixture,
      transactionsMedium
    );

    // Food budget has spent 0 in transactionsMedium, Housing has spent 45000 which is 90% of 50000, threshold is 90
    // So warning budget should be active
    const housingAlert = alerts.find(a => a.type === 'Budget' && a.targetId === 'budget-housing');
    expect(housingAlert).toEqual({
      id: 'budget-budget-housing-2026-7',
      type: 'Budget',
      severity: 'warning',
      message: 'Budget Warning: You have used 90% of your 50000 budget for Housing.',
      targetId: 'budget-housing',
      createdAt: '2026-07-14T12:00:00.000Z',
      isRead: false,
    });

    // Past target deadline goal
    const expiredGoalAlert = alerts.find(a => a.type === 'Goal' && a.targetId === 'goal-expired');
    expect(expiredGoalAlert).toEqual({
      id: 'goal-goal-expired-2026-7',
      type: 'Goal',
      severity: 'critical',
      message: 'Goal Deadline Passed: "Old Laptop purchase" has passed its target deadline of 2026-06-30T23:59:59.000Z and is only 38% funded.',
      targetId: 'goal-expired',
      createdAt: '2026-07-14T12:00:00.000Z',
      isRead: false,
    });
  });

  test('triggers CashFlow alert on negative cash flow', () => {
    // Expense only transaction list
    const negativeCashflowTx: TransactionDTO[] = [
      {
        _id: 'tx-neg-1',
        userId,
        accountId: 'acc-1',
        type: 'Expense',
        category: 'Food & Dining',
        amount: 2000,
        merchant: 'Grocery Store',
        paymentMethod: 'Cash',
        transactionDate: '2026-07-02T10:00:00.000Z',
        isArchived: false,
        createdAt: '2026-07-02T10:00:00.000Z',
        updatedAt: '2026-07-02T10:00:00.000Z',
      },
      {
        _id: 'tx-neg-2',
        userId,
        accountId: 'acc-1',
        type: 'Income',
        category: 'Salary',
        amount: 500, // less than expense
        merchant: 'Freelance Task',
        paymentMethod: 'Net Banking',
        transactionDate: '2026-07-02T11:00:00.000Z',
        isArchived: false,
        createdAt: '2026-07-02T11:00:00.000Z',
        updatedAt: '2026-07-02T11:00:00.000Z',
      }
    ];

    const alerts = compileDynamicNotifications(
      userId,
      [],
      [],
      negativeCashflowTx
    );

    const cashflowAlert = alerts.find(a => a.type === 'CashFlow');
    expect(cashflowAlert).toEqual({
      id: 'cashflow-user-123-2026-7',
      type: 'CashFlow',
      severity: 'warning',
      message: 'Negative cash flow: You have spent more than you earned this month by 1500.',
      createdAt: '2026-07-14T12:00:00.000Z',
      isRead: false,
    });
  });

  test('handles edge case: completely empty budgets, goals, and transactions list', () => {
    const alerts = compileDynamicNotifications(userId, [], [], []);
    expect(alerts).toEqual([]);
  });
});

