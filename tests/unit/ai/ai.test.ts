import { describe, test, expect, vi, beforeEach } from 'vitest';
import { buildChatPrompt } from '@/features/ai/prompt-builders/chat.prompt';
import { buildDashboardPrompt } from '@/features/ai/prompt-builders/financial-summary.prompt';
import { safeJsonParse } from '@/features/ai/parsers/response.parser';
import { generateDeterministicRecommendations } from '@/features/ai/services/recommendation.service';
import { getAIDashboardService, askAIChatService } from '@/features/ai/services/ai.service';
import { getDashboardAnalyticsService } from '@/features/analytics/services/analytics.service';
import { getBudgetDashboardService } from '@/features/budget/services/budget.service';
import { getGoalsDashboardService } from '@/features/goals/services/goal.service';
import { askGemini } from '@/features/ai/providers/llm.provider';
import type { FinancialDashboardDTO } from '@/features/analytics/dto/dashboard.dto';
import type { BudgetDashboardDTO } from '@/features/budget/dto/budget-dashboard.dto';
import type { GoalDashboardDTO } from '@/features/goals/dto/goal-dashboard.dto';

// Setup Mock services
vi.mock('@/features/analytics/services/analytics.service', () => ({
  getDashboardAnalyticsService: vi.fn(),
}));

vi.mock('@/features/budget/services/budget.service', () => ({
  getBudgetDashboardService: vi.fn(),
}));

vi.mock('@/features/goals/services/goal.service', () => ({
  getGoalsDashboardService: vi.fn(),
}));

vi.mock('@/features/ai/providers/llm.provider', () => ({
  askGemini: vi.fn(),
}));

describe('AI Engine - Prompt Builders & Parsers', () => {
  const mockAnalytics = {
    summary: { totalBalance: 120000, totalIncome: 100000, totalExpenses: 40000, netSavings: 60000, savingsRate: 60, avgDailySpending: 1333 },
    categories: [{ category: 'Food & Dining', spent: 5000, percentage: 12.5 }],
    health: { score: 75, rating: 'Good' },
    insights: [],
  } as unknown as FinancialDashboardDTO;

  const mockBudget = {
    summary: { overallHealthProgress: 42 },
    budgets: [{ budget: { name: 'Rent', budgetAmount: 15000, category: 'Housing' }, spent: 15000, status: 'Exceeded' }],
  } as unknown as BudgetDashboardDTO;

  const mockGoals = {
    summary: { averageProgressPercentage: 25 },
    goals: [{ goal: { name: 'Emergency', targetAmount: 200000, category: 'Emergency Fund' }, saved: 50000, successProbability: 60, health: 'On Track', requiredMonthlySavings: 15000 }],
  } as unknown as GoalDashboardDTO;

  describe('buildChatPrompt', () => {
    test('constructs chat prompt with data points', () => {
      const history = [
        { role: 'user' as const, content: 'hello' },
        { role: 'assistant' as const, content: 'how can I help you?' }
      ];
      const prompt = buildChatPrompt(mockAnalytics, mockBudget, mockGoals, history, 'explain laptop');
      expect(prompt).toContain('120000');
      expect(prompt).toContain('Rent');
      expect(prompt).toContain('Emergency');
      expect(prompt).toContain('explain laptop');
      expect(prompt).toContain('Assistant: how can I help you?');
    });
  });

  describe('buildDashboardPrompt', () => {
    test('constructs dashboard prompt with data points', () => {
      const prompt = buildDashboardPrompt(mockAnalytics, mockBudget, mockGoals);
      expect(prompt).toContain('120000');
      expect(prompt).toContain('Rent');
      expect(prompt).toContain('Emergency');
    });
  });

  describe('safeJsonParse', () => {
    test('parses clean JSON', () => {
      const parsed = safeJsonParse('{"a": 1}', { fallback: true });
      expect(parsed).toEqual({ a: 1 });
    });

    test('strips markdown code block wrappers', () => {
      const parsed = safeJsonParse('```json\n{"a": 2}\n```', { fallback: true });
      expect(parsed).toEqual({ a: 2 });
    });

    test('strips generic code block wrappers without json prefix', () => {
      const parsed = safeJsonParse('```\n{"a": 3}\n```', { fallback: true });
      expect(parsed).toEqual({ a: 3 });
    });

    test('uses fallback on parser error', () => {
      const parsed = safeJsonParse('invalid-json', { fallback: true });
      expect(parsed).toEqual({ fallback: true });
    });
  });

  describe('generateDeterministicRecommendations', () => {
    test('generates warning on high spending category percentage', () => {
      const analyticsHigh = {
        categories: [{ category: 'Shopping', spent: 5000, percentage: 50 }],
      } as unknown as FinancialDashboardDTO;

      const recs = generateDeterministicRecommendations(analyticsHigh, mockBudget, mockGoals);
      expect(recs).toEqual([
        {
          category: 'Shopping',
          type: 'warning',
          message: 'Shopping util represents 50% of total category spending. Target reducing by 10% next month.',
        },
        {
          category: 'Housing',
          type: 'warning',
          message: 'Budget Exceeded: Tracker Rent has overruns of ₹0.',
        }
      ]);
    });

    test('generates warning on exceeded budget', () => {
      const recs = generateDeterministicRecommendations(mockAnalytics, mockBudget, mockGoals);
      expect(recs).toEqual([
        {
          category: 'Housing',
          type: 'warning',
          message: 'Budget Exceeded: Tracker Rent has overruns of ₹0.',
        }
      ]);
    });
  });
});

describe('AI Engine - Service Layer', () => {
  const userId = 'user-123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getAIDashboardService compiles AI suggestions', async () => {
    vi.mocked(getDashboardAnalyticsService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { totalBalance: 120000, totalIncome: 100000, totalExpenses: 40000, netSavings: 60000, savingsRate: 60, avgDailySpending: 1333 },
        categories: [{ category: 'Food & Dining', spent: 5000, percentage: 12.5 }],
      } as unknown as FinancialDashboardDTO,
    });

    vi.mocked(getBudgetDashboardService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { overallHealthProgress: 42 },
        budgets: [],
      } as unknown as BudgetDashboardDTO,
    });

    vi.mocked(getGoalsDashboardService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { averageProgressPercentage: 25 },
        goals: [],
      } as unknown as GoalDashboardDTO,
    });

    vi.mocked(askGemini).mockResolvedValue('{"financialSummary": {"overallStance": "Good Stance", "achievements": [], "primaryConcerns": [], "actionableStep": ""}, "monthlyReview": {"summaryParagraph": "", "topExpenseCategory": "", "topIncomeSource": "", "budgetPerformanceNotice": "", "goalHealthNotice": ""}, "recommendations": [], "risks": [], "opportunities": [], "financialHealthExplanation": "" }');

    const res = await getAIDashboardService(userId);
    expect(res.success).toBe(true);
    expect(res.data?.financialSummary.overallStance).toBe('Good Stance');
  });

  test('askAIChatService answers user questions using conversation logs', async () => {
    vi.mocked(getDashboardAnalyticsService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { totalBalance: 120000, totalIncome: 100000, totalExpenses: 40000, netSavings: 60000, savingsRate: 60, avgDailySpending: 1333 },
        categories: [{ category: 'Food & Dining', spent: 5000, percentage: 12.5 }],
      } as unknown as FinancialDashboardDTO,
    });

    vi.mocked(getBudgetDashboardService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { overallHealthProgress: 42 },
        budgets: [],
      } as unknown as BudgetDashboardDTO,
    });

    vi.mocked(getGoalsDashboardService).mockResolvedValue({
      success: true,
      message: 'success',
      data: {
        summary: { averageProgressPercentage: 25 },
        goals: [],
      } as unknown as GoalDashboardDTO,
    });

    vi.mocked(askGemini).mockResolvedValue('{"response": "Test reply", "suggestedPrompts": []}');

    const res = await askAIChatService(userId, [], 'my query');
    expect(res.success).toBe(true);
    expect(res.data?.response).toBe('Test reply');
  });
});
