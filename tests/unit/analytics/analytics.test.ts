import { describe, test, expect } from 'vitest';
import { calculateSummary } from '@/features/analytics/calculators/summary.calculator';
import { calculateSparkline } from '@/features/analytics/calculators/cashflow.calculator';
import { calculateCategories } from '@/features/analytics/calculators/category.calculator';
import { calculateHealthScore } from '@/features/analytics/calculators/health.calculator';
import { generateRuleInsights } from '@/features/analytics/calculators/insight.calculator';
import { calculateMoMVariance } from '@/features/analytics/calculators/trend.calculator';
import { mapRawDashboardToDTO } from '@/features/analytics/mappers/financial-summary.mapper';
import { accountsFixture } from '../../fixtures/accounts';
import { transactionsSmall } from '../../fixtures/transactions';

describe('Analytics Engine - Calculators', () => {
  
  describe('calculateSummary', () => {
    test('calculates correct summary numbers', () => {
      const raw = {
        totalIncome: 100000,
        totalExpense: 40000,
        count: 10,
        largestIncome: 100000,
        largestExpense: 20000,
      };
      const res = calculateSummary(raw, 30);
      expect(res.netSavings).toBe(60000);
      expect(res.savingsRate).toBe(60);
      expect(res.avgDailySpending).toBe(40000 / 30);
    });

    test('handles division by zero/edge cases', () => {
      const raw = {
        totalIncome: 0,
        totalExpense: 0,
        count: 0,
        largestIncome: 0,
        largestExpense: 0,
      };
      const res = calculateSummary(raw, 0);
      expect(res.netSavings).toBe(0);
      expect(res.savingsRate).toBe(0);
      expect(res.avgDailySpending).toBe(0);
    });
  });

  describe('calculateSparkline', () => {
    test('maps raw points to last limitDays correctly', () => {
      const rawPoints = [
        { _id: new Date().toISOString().split('T')[0], amount: 500 },
      ];
      const sparkline = calculateSparkline(rawPoints, 7);
      expect(sparkline.length).toBe(7);
      expect(sparkline[6]).toBe(500); // Today's points
    });
  });

  describe('calculateCategories', () => {
    test('computes category breakdowns correctly', () => {
      const rawCategories = [
        { _id: 'Food & Dining', total: 4000, count: 2 },
        { _id: 'Housing', total: 6000, count: 1 },
      ];
      const breakdown = calculateCategories(rawCategories, 10000);
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0]).toEqual({
        category: 'Food & Dining',
        spent: 4000,
        percentage: 40,
        count: 2,
        averageSpend: 2000,
      });
    });

    test('handles zero total expense gracefully', () => {
      const rawCategories = [{ _id: 'Housing', total: 0, count: 0 }];
      const breakdown = calculateCategories(rawCategories, 0);
      expect(breakdown[0].percentage).toBe(0);
      expect(breakdown[0].averageSpend).toBe(0);
    });
  });

  describe('calculateHealthScore', () => {
    test('evaluates score and rating appropriately', () => {
      const res = calculateHealthScore(100000, 40000, 60, 4, 10);
      expect(res).toEqual({
        score: 100,
        rating: 'Excellent',
        savingsRate: 60,
        incomeExpenseRatio: 2.5,
        burnRate: 40000,
        healthInsights: [
          'Excellent savings pattern! You are building assets stable and fast.',
          'Healthy flow: Your earnings cleanly cover active expenses.'
        ]
      });
    });

    test('penalizes deficit spending', () => {
      const res = calculateHealthScore(10000, 50000, -400, 1, 5);
      expect(res).toEqual({
        score: 37,
        rating: 'Needs Attention',
        savingsRate: -400,
        incomeExpenseRatio: 0.2,
        burnRate: 50000,
        healthInsights: [
          'Your savings rate is low. Try trimming shopping or entertainment expenses.',
          'Alert: You spent more than you earned this month. Review your subscription bills.',
          'Tip: Create a separate cash wallet or savings account for better tracking.'
        ]
      });
    });

    test('handles moderate values and low accounts count', () => {
      const res = calculateHealthScore(50000, 40000, 5, 1, 3);
      expect(res).toEqual({
        score: 66,
        rating: 'Good',
        savingsRate: 5,
        incomeExpenseRatio: 1.25,
        burnRate: 40000,
        healthInsights: [
          'Your savings rate is low. Try trimming shopping or entertainment expenses.',
          'Tip: Create a separate cash wallet or savings account for better tracking.'
        ]
      });
    });

    test('returns No Data state when insufficient data', () => {
      const res = calculateHealthScore(0, 0, 0, 0, 0);
      expect(res).toEqual({
        score: null,
        rating: 'No Data',
        savingsRate: 0,
        incomeExpenseRatio: 0,
        burnRate: 0,
        healthInsights: []
      });
    });
  });

  describe('generateRuleInsights', () => {
    test('generates positive savings insight', () => {
      const insights = generateRuleInsights(10000, 2000, 80, [], 1000);
      expect(insights).toContainEqual({
        type: 'positive',
        message: 'Great job! You saved 80.0% of your earnings.',
      });
    });

    test('generates neutral savings insight', () => {
      const insights = generateRuleInsights(10000, 9000, 10, [], 1000);
      expect(insights).toContainEqual({
        type: 'neutral',
        message: 'You saved ₹1,000 this month. Try to aim for 20%.',
      });
    });

    test('generates top category concentrations alert', () => {
      const categories = [{ category: 'Shopping', spent: 5000, percentage: 50, count: 1, averageSpend: 5000 }];
      const insights = generateRuleInsights(10000, 10000, 0, categories, 5000);
      expect(insights).toContainEqual({
        type: 'warning',
        message: 'High concentration: Shopping represents 50% of your expenses.',
      });
    });

    test('generates neutral top category alert if concentration is low', () => {
      const categories = [{ category: 'Shopping', spent: 1000, percentage: 10, count: 1, averageSpend: 1000 }];
      const insights = generateRuleInsights(10000, 10000, 0, categories, 5000);
      expect(insights).toContainEqual({
        type: 'neutral',
        message: 'Your highest spending category this period is Shopping.',
      });
    });

    test('generates large transaction warning', () => {
      const insights = generateRuleInsights(10000, 10000, 0, [], 25000);
      expect(insights).toContainEqual({
        type: 'warning',
        message: 'Large expense warning: Single largest spending event was ₹25,000.',
      });
    });

    test('generates fallback default insight', () => {
      const insights = generateRuleInsights(0, 0, 0, [], 0);
      expect(insights).toEqual([
        {
          type: 'neutral',
          message: 'Ledger syncing is running successfully. Start logging cashflows to see insights.',
        }
      ]);
    });
  });

  describe('calculateMoMVariance', () => {
    test('computes mom variance and percentage changes', () => {
      expect(calculateMoMVariance(120, 100)).toEqual({ difference: 20, percentageChange: 20 });
      expect(calculateMoMVariance(80, 100)).toEqual({ difference: -20, percentageChange: -20 });
      expect(calculateMoMVariance(100, 0)).toEqual({ difference: 100, percentageChange: 100 });
      expect(calculateMoMVariance(0, 0)).toEqual({ difference: 0, percentageChange: 0 });
    });
  });
});

describe('Analytics Engine - Mapper', () => {
  test('maps Raw Dashboard data to DTO successfully', () => {
    const rawSummary = {
      totalIncome: 150000,
      totalExpense: 12500,
      count: 2,
      largestIncome: 150000,
      largestExpense: 12500,
    };
    const rawCategories = [
      { _id: 'Food & Dining', total: 12500, count: 2 },
    ];
    const rawMonthly = [
      { _id: { year: 2026, month: 7 }, income: 150000, expense: 12500, count: 2 },
    ];

    const dto = mapRawDashboardToDTO(
      accountsFixture,
      transactionsSmall,
      rawSummary,
      rawCategories,
      rawMonthly,
      [100, 200, 300],
      30
    );

    expect(dto.summary.totalBalance).toBe(137500);
    expect(dto.summary.totalIncome).toBe(150000);
    expect(dto.summary.totalExpenses).toBe(12500);
    expect(dto.summary.avgDailySpending).toBeCloseTo(12500 / 30);
    expect(dto.monthlyTrends).toHaveLength(1);
    expect(dto.monthlyTrends[0].month).toBe('July 2026');
    expect(dto.categories).toHaveLength(1);
    expect(dto.categories[0].category).toBe('Food & Dining');
    expect(dto.cashFlow.sparkline).toEqual([100, 200, 300]);
    expect(dto.health.score).toBeGreaterThan(0);
    expect(dto.insights.length).toBeGreaterThan(0);
  });

  test('maps with empty raw monthly trends and uses default month fallback', () => {
    const rawSummary = { totalIncome: 0, totalExpense: 0, count: 0, largestIncome: 0, largestExpense: 0 };
    const dto = mapRawDashboardToDTO(accountsFixture, [], rawSummary, [], [], [], 30);
    expect(dto.monthlyTrends).toHaveLength(1);
    expect(dto.monthlyTrends[0].month).toMatch(/^[A-Za-z]+ \d{4}$/); // e.g. "July 2026"
  });
});
