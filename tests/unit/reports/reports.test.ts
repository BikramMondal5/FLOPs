import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { compileReportDashboard } from '@/features/reports/engine/report.engine';
import { transactionsSmall, transactionsMedium } from '../../fixtures/transactions';
import { budgetsFixture } from '../../fixtures/budgets';
import { goalsFixture } from '../../fixtures/goals';

describe('Reports Engine - Report Compiler', () => {
  beforeEach(() => {
    // Freeze system time at 2026-07-14T12:00:00.000Z for determinism in date comparisons
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('compiles report dashboard metrics correctly', () => {
    const startDate = new Date('2026-07-01T00:00:00.000Z');
    const endDate = new Date('2026-07-30T00:00:00.000Z');

    const report = compileReportDashboard(
      'Monthly',
      startDate,
      endDate,
      transactionsMedium, // current transactions
      transactionsSmall,  // previous transactions
      budgetsFixture,
      goalsFixture
    );

    expect(report.period).toBe('Monthly');
    expect(report.summary.totalIncome).toBe(100500); // 100000 (income) + 500 (refund)
    expect(report.summary.totalExpense).toBe(52500); // 2500 (expense) + 5000 (transfer out) + 45000 (high value rent)
    expect(report.summary.netSavings).toBe(48000);
    expect(report.summary.averageDailySpending).toBeCloseTo(52500 / 29);
    expect(report.summary.savingsRate).toBe(47.76); // 48000 / 100500 * 100

    // Exact health scores assertions under fixed system time
    expect(report.healthScores).toEqual({
      financialHealth: 48, // (75 + 20 + 48) / 3 = 47.66 -> 48
      budgetAdherence: 75,
      goalVelocity: 20,
      cashFlowRatio: 48,
    });

    // Explicit tabular comparisons check
    expect(report.tabularComparisons).toHaveLength(3); // Housing, Food & Dining, Other
    // Let's check explicit elements
    const housingComparison = report.tabularComparisons.find(t => t.category === 'Housing');
    expect(housingComparison).toEqual({
      category: 'Housing',
      currentAmount: 45000,
      previousAmount: 0,
      diffAmount: 45000,
      changePercent: 0,
    });

    const otherComparison = report.tabularComparisons.find(t => t.category === 'Other');
    expect(otherComparison).toEqual({
      category: 'Other',
      currentAmount: 5000,
      previousAmount: 0,
      diffAmount: 5000,
      changePercent: 0,
    });
  });

  test('handles empty collections gracefully', () => {
    const startDate = new Date('2026-07-01T00:00:00.000Z');
    const endDate = new Date('2026-07-30T00:00:00.000Z');

    const report = compileReportDashboard(
      'Monthly',
      startDate,
      endDate,
      [],
      [],
      [],
      []
    );

    expect(report.summary).toEqual({
      totalIncome: 0,
      totalExpense: 0,
      netSavings: 0,
      averageDailySpending: 0,
      savingsRate: 0,
    });
    expect(report.healthScores).toEqual({
      financialHealth: 67, // (100 + 100 + 0) / 3 = 66.6 -> 67
      budgetAdherence: 100,
      goalVelocity: 100,
      cashFlowRatio: 0,
    });
    expect(report.tabularComparisons).toEqual([]);
  });

  test('handles edge case: single day duration (end date equals start date)', () => {
    const startDate = new Date('2026-07-01T12:00:00.000Z');
    const report = compileReportDashboard(
      'Daily',
      startDate,
      startDate,
      [],
      [],
      [],
      []
    );
    expect(report.summary.averageDailySpending).toBe(0);
  });

  test('handles edge case: end date before start date', () => {
    const startDate = new Date('2026-07-30T00:00:00.000Z');
    const endDate = new Date('2026-07-01T00:00:00.000Z');
    const report = compileReportDashboard(
      'Monthly',
      startDate,
      endDate,
      transactionsSmall,
      [],
      [],
      []
    );
    // duration absolute diff ensures daysCount is positive
    expect(report.summary.averageDailySpending).toBeGreaterThan(0);
  });
});

