import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateProgress } from '@/features/budget/calculators/progress.calculator';
import { calculateBudgetStatus } from '@/features/budget/calculators/health.calculator';
import { calculateForecast } from '@/features/budget/calculators/forecast.calculator';
import { checkBudgetAlert } from '@/features/budget/calculators/alert.calculator';
import { evaluateSmartBudgets } from '@/features/budget/engine/budget.engine';
import { mapEngineResultsToDashboardDTO } from '@/features/budget/mappers/budget.mapper';
import { budgetsFixture } from '../../fixtures/budgets';

describe('Budget Engine - Calculators', () => {

  describe('calculateProgress', () => {
    test('calculates correct progress values', () => {
      const res = calculateProgress(4000, 10000);
      expect(res.spent).toBe(4000);
      expect(res.remaining).toBe(6000);
      expect(res.progressPercentage).toBe(40);
    });

    test('handles zero limit gracefully', () => {
      const res = calculateProgress(100, 0);
      expect(res.remaining).toBe(-100);
      expect(res.progressPercentage).toBe(0);
    });
  });

  describe('calculateBudgetStatus', () => {
    test('classifies progress percentages correctly', () => {
      expect(calculateBudgetStatus(120)).toBe('Exceeded');
      expect(calculateBudgetStatus(100)).toBe('Exceeded');
      expect(calculateBudgetStatus(85)).toBe('Near Limit');
      expect(calculateBudgetStatus(79)).toBe('On Track');
      expect(calculateBudgetStatus(0)).toBe('On Track');
    });
  });

  describe('calculateForecast', () => {
    test('makes linear projections based on elapsed days', () => {
      const res = calculateForecast(3000, 10000, 10, 30);
      expect(res.projectedSpend).toBe(9000);
      expect(res.projectedRemaining).toBe(1000);
      expect(res.projectedStatus).toBe('Near Limit');
    });

    test('handles zero values and divisions cleanly', () => {
      const res = calculateForecast(0, 0, 0, 0);
      expect(res.projectedSpend).toBe(0);
      expect(res.projectedRemaining).toBe(0);
      expect(res.projectedStatus).toBe('On Track');
    });
  });

  describe('checkBudgetAlert', () => {
    test('triggers critical alerts on overrun', () => {
      const res = checkBudgetAlert('Food', 12000, 10000, 120, 80);
      expect(res.triggered).toBe(true);
      expect(res.message).toBe('Exceeded! Food budget is overallocated by ₹2,000.');
    });

    test('triggers warning alerts when past threshold', () => {
      const res = checkBudgetAlert('Food', 8500, 10000, 85, 80);
      expect(res.triggered).toBe(true);
      expect(res.message).toBe('Warning: Food budget utilization is at 85%.');
    });

    test('does not trigger alerts when safe', () => {
      const res = checkBudgetAlert('Food', 5000, 10000, 50, 80);
      expect(res.triggered).toBe(false);
    });
  });
});

describe('Budget Engine - Core Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('evaluates smart budgets cleanly', () => {
    const categoryBreakdown = [
      { category: 'Food & Dining', spent: 8500, percentage: 85, count: 5, averageSpend: 1700 },
      { category: 'Housing', spent: 45000, percentage: 90, count: 1, averageSpend: 45000 },
    ];

    const results = evaluateSmartBudgets(budgetsFixture, categoryBreakdown);
    
    // We expect active budgets evaluated
    const foodEvaluated = results.find(r => r.budget._id === 'budget-food');
    expect(foodEvaluated).toEqual({
      budget: budgetsFixture[0],
      spent: 8500,
      remaining: 1500,
      progressPercentage: 85,
      status: 'Near Limit',
      daysRemaining: 18, // 31 July - 14 July = 17 days + partial day = 18 days
      projectedSpend: 18821,
      projectedRemaining: -8821,
      projectedStatus: 'Exceeded',
      alertTriggered: true,
      alertMessage: 'Warning: Monthly Food & Dining budget utilization is at 85%.',
    });
  });
});

describe('Budget Engine - Mapper', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('maps smart budgets to Dashboard DTO successfully with different statuses', () => {
    const categoryBreakdown = [
      { category: 'Food & Dining', spent: 12000, percentage: 120, count: 5, averageSpend: 2400 }, // Exceeded
      { category: 'Housing', spent: 45000, percentage: 90, count: 1, averageSpend: 45000 }, // Near limit
      { category: 'Shopping', spent: 100, percentage: 100, count: 1, averageSpend: 100 }, // Exceeded because amount limit is 0
    ];
    const evaluated = evaluateSmartBudgets(budgetsFixture, categoryBreakdown);
    const dto = mapEngineResultsToDashboardDTO(evaluated);

    expect(dto.summary).toEqual({
      totalBudgetLimit: 80000,
      totalSpent: 57100,
      exceededBudgetsCount: 1,
      nearLimitBudgetsCount: 1,
      onTrackBudgetsCount: 2,
      activeBudgetsCount: 3,
      totalRemaining: 22900,
      overallHealthProgress: 71.375,
    });
    expect(dto.alerts).toEqual([
      'Exceeded! Monthly Food & Dining budget is overallocated by ₹2,000.',
      'Warning: Rent and Housing budget utilization is at 90%.',
      'Exceeded! Zero Limit Category budget is overallocated by ₹100.',
    ]);
    expect(dto.insights).toEqual([
      'Action Required: 1 budget categories have exceeded limits.',
      'Budget Warning: 1 categories are nearing utilization limits.',
    ]);
  });

  test('generates healthy insight if utilization is low', () => {
    const evaluated = evaluateSmartBudgets(budgetsFixture, []);
    const dto = mapEngineResultsToDashboardDTO(evaluated);
    expect(dto.insights).toEqual([
      'Utilization Healthy: Total spending remains comfortably below active limits.',
    ]);
  });

  test('generates default insight if no budgets provided', () => {
    const dto = mapEngineResultsToDashboardDTO([]);
    expect(dto.insights).toEqual([
      'Status Healthy: Create category trackers to monitor spending habits.',
    ]);
  });

  describe('Calculator Edge Cases', () => {
    test('handles edge case inputs gracefully', () => {
      // Negative spent or negative limit
      const progressNeg = calculateProgress(-100, -1000);
      expect(progressNeg).toEqual({ spent: -100, remaining: -900, progressPercentage: 0 });

      // Division by zero in alert (should trigger if spent > 0)
      const alertDiv = checkBudgetAlert('Food', 100, 0, 0, 80);
      expect(alertDiv).toEqual({
        triggered: true,
        message: 'Exceeded! Food budget is overallocated by ₹100.',
      });

      // Forecast days elapsed exceeding total period days
      const forecastElapsed = calculateForecast(5000, 10000, 45, 30);
      expect(forecastElapsed).toEqual({
        projectedSpend: 3333,
        projectedRemaining: 6667,
        projectedStatus: 'On Track',
      });
    });
  });
});
