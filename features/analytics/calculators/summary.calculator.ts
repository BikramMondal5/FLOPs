import type { RawSummaryAggregation } from "../repositories/analytics.repository";

export interface SummaryCalculationResult {
  netSavings: number;
  savingsRate: number;
  avgDailySpending: number;
}

export function calculateSummary(
  raw: RawSummaryAggregation,
  daysCount: number
): SummaryCalculationResult {
  const netSavings = raw.totalIncome - raw.totalExpense;
  
  const savingsRate =
    raw.totalIncome > 0 ? Math.max(0, Math.min(100, (netSavings / raw.totalIncome) * 100)) : 0;

  const denominator = Math.max(1, daysCount);
  const avgDailySpending = raw.totalExpense / denominator;

  return {
    netSavings,
    savingsRate,
    avgDailySpending,
  };
}
