import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateGoalProgress } from '@/features/goals/calculators/progress.calculator';
import { calculateGoalCompletion } from '@/features/goals/calculators/completion.calculator';
import { calculateGoalForecast } from '@/features/goals/calculators/forecast.calculator';
import { calculateGoalHealth } from '@/features/goals/calculators/health.calculator';
import { calculateGoalProbability } from '@/features/goals/calculators/probability.calculator';
import { generateGoalRecommendations } from '@/features/goals/calculators/recommendation.calculator';
import { evaluateSmartGoals } from '@/features/goals/engine/goal.engine';
import { mapEngineResultsToGoalsDashboardDTO } from '@/features/goals/mappers/goal.mapper';
import { goalsFixture } from '../../fixtures/goals';

describe('Goals Engine - Calculators', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('calculateGoalProgress', () => {
    test('calculates saved, remaining, and percentage correctly', () => {
      const res = calculateGoalProgress(50000, 200000);
      expect(res.saved).toBe(50000);
      expect(res.remaining).toBe(150000);
      expect(res.progressPercentage).toBe(25);
    });

    test('caps progressPercentage between 0 and 100', () => {
      const res1 = calculateGoalProgress(250000, 200000);
      expect(res1.progressPercentage).toBe(100);

      const res2 = calculateGoalProgress(-50, 100);
      expect(res2.progressPercentage).toBe(0);
    });

    test('handles edge case: zero target amount and negative values', () => {
      const res = calculateGoalProgress(100, 0);
      expect(res.remaining).toBe(0);
      expect(res.progressPercentage).toBe(0);

      const negativeRes = calculateGoalProgress(-100, -500);
      expect(negativeRes.remaining).toBe(0);
      expect(negativeRes.progressPercentage).toBe(0);
    });
  });

  describe('calculateGoalCompletion', () => {
    test('computes remaining days correctly', () => {
      const targetDate = new Date('2026-07-24T12:00:00.000Z');
      const res = calculateGoalCompletion(targetDate.toISOString(), 50);
      expect(res.daysRemaining).toBe(10);
      expect(res.completionPercentage).toBe(50);
    });

    test('handles past deadline correctly', () => {
      const pastDate = new Date('2026-07-04T12:00:00.000Z');
      const res = calculateGoalCompletion(pastDate.toISOString(), 30);
      expect(res.daysRemaining).toBe(0);
    });
  });

  describe('calculateGoalForecast', () => {
    test('project monthly savings required and delay days', () => {
      const res = calculateGoalForecast(150000, 304, 5000, 5000);
      expect(res.requiredMonthlySavings).toBe(15000);
      expect(res.expectedDelayDays).toBe(608);
    });

    test('handles division by zero and zero values', () => {
      const res = calculateGoalForecast(0, 0, 0, 0);
      expect(res.requiredMonthlySavings).toBe(0);
      expect(res.expectedDelayDays).toBe(0);
    });
  });

  describe('calculateGoalHealth', () => {
    test('classifies health statuses appropriately', () => {
      expect(calculateGoalHealth(0, 'Completed')).toBe('Completed');
      expect(calculateGoalHealth(10, 'Paused')).toBe('Behind Schedule');
      expect(calculateGoalHealth(100, 'Active')).toBe('At Risk');
      expect(calculateGoalHealth(45, 'Active')).toBe('Behind Schedule');
      expect(calculateGoalHealth(5, 'Active')).toBe('On Track');
    });

    test('handles extreme expected delay days', () => {
      expect(calculateGoalHealth(100000, 'Active')).toBe('At Risk');
      expect(calculateGoalHealth(-5, 'Active')).toBe('On Track');
    });
  });

  describe('calculateGoalProbability', () => {
    test('gives correct probabilities under conditions', () => {
      // Completed goal -> 100%
      expect(calculateGoalProbability(100, 'Completed', 0, 80)).toBe(100);

      // Active goal calculations
      const prob = calculateGoalProbability(50, 'On Track', 100, 80);
      expect(prob).toBe(100);
    });

    test('applies runway bonus for long timeline', () => {
      const prob = calculateGoalProbability(50, 'On Track', 400, 80);
      expect(prob).toBe(100); // 50 (base) + 13 (progress) + 25 (health) + 20 (budget) + 10 (runway) -> caps at 100
    });

    test('applies penalty for tight timeline', () => {
      const prob = calculateGoalProbability(50, 'On Track', 15, 80);
      expect(prob).toBe(88); // 50 (base) + 13 (progress) + 25 (health) + 20 (budget) - 20 (penalty)
    });

    test('handles negative progress and zero inputs', () => {
      const prob = calculateGoalProbability(0, 'At Risk', 0, 0);
      expect(prob).toBe(15); // 50 (base) + 0 - 15 (At Risk penalty) + 0 - 20 (days < 30 penalty) = 15
    });
  });

  describe('generateGoalRecommendations', () => {
    test('returns correct recommendations lists', () => {
      const completedRecs = generateGoalRecommendations('Trip', 5000, 0, 0, 'Completed', 100);
      expect(completedRecs).toEqual([
        'Congratulations! You achieved your Trip plan!'
      ]);

      const atRiskRecs = generateGoalRecommendations('House', 50000, 40000, 5000, 'At Risk', 30);
      expect(atRiskRecs).toEqual([
        'At Risk: Increase monthly contributions by 15% to bridge the target gap.',
        'Timeline constraint: Save an extra ₹5,000 monthly to meet the deadline.'
      ]);
    });
  });
});

describe('Goals Engine - Core Engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-14T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('evaluates smart goals cleanly', () => {
    const evaluated = evaluateSmartGoals(goalsFixture, 10000, 85);
    expect(evaluated).toHaveLength(goalsFixture.length);

    const emergencyGoal = evaluated.find(e => e.goal._id === 'goal-emergency');
    expect(emergencyGoal).toEqual({
      goal: goalsFixture[0],
      saved: 50000,
      remaining: 150000,
      progressPercentage: 25,
      completionPercentage: 25,
      daysRemaining: 171,
      estimatedCompletionDate: expect.any(String),
      projectedCompletionDate: 'Oct 2027',
      requiredMonthlySavings: 26667,
      expectedDelayDays: 285,
      health: 'At Risk',
      successProbability: 62,
      recommendations: [
        'At Risk: Increase monthly contributions by 15% to bridge the target gap.'
      ]
    });
  });
});

describe('Goals Engine - Mapper', () => {
  test('maps evaluated goals to Dashboard DTO correctly', () => {
    const evaluated = evaluateSmartGoals(goalsFixture, 10000, 85);
    const dto = mapEngineResultsToGoalsDashboardDTO(evaluated, 10000);

    expect(dto.summary).toEqual({
      totalGoalsCount: 5,
      completedGoalsCount: 1,
      activeGoalsCount: 3,
      pausedGoalsCount: 1,
      cancelledGoalsCount: 0,
      averageProgressPercentage: 38.3,
      totalTargetAmount: 9330000,
      totalSaved: 1330000,
      totalRemaining: 8000000,
      averageMonthlyContribution: 10000,
    });
    expect(dto.recommendations).toHaveLength(5);
  });

  test('handles cancelled goals and empty collections', () => {
    const cancelledGoal = { ...goalsFixture[0], status: 'Cancelled' as const };
    const evaluated = evaluateSmartGoals([cancelledGoal], 10000, 85);
    const dto = mapEngineResultsToGoalsDashboardDTO(evaluated, 10000);
    expect(dto.summary.cancelledGoalsCount).toBe(1);

    const dtoEmpty = mapEngineResultsToGoalsDashboardDTO([], 0);
    expect(dtoEmpty.summary).toEqual({
      totalGoalsCount: 0,
      completedGoalsCount: 0,
      activeGoalsCount: 0,
      pausedGoalsCount: 0,
      cancelledGoalsCount: 0,
      averageProgressPercentage: 0,
      totalTargetAmount: 0,
      totalSaved: 0,
      totalRemaining: 0,
      averageMonthlyContribution: 0,
    });
  });
});
