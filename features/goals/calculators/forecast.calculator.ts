export interface ForecastCalculationResult {
  requiredMonthlySavings: number;
  projectedCompletionDate: string;
  expectedDelayDays: number;
}

export function calculateGoalForecast(
  remainingAmount: number,
  daysRemaining: number,
  savingsRate: number,
  avgMonthlySavings: number
): ForecastCalculationResult {
  const monthsRemaining = Math.max(0.1, daysRemaining / 30.4);
  const requiredMonthlySavings = Math.round(remainingAmount / monthsRemaining);

  // Projected speed based on historical average monthly savings
  const speed = Math.max(100, avgMonthlySavings || savingsRate || 5000);
  const projectedMonths = remainingAmount / speed;
  const projectedDays = Math.ceil(projectedMonths * 30.4);

  const now = new Date();
  const projectedDate = new Date(now.getTime() + projectedDays * (1000 * 60 * 60 * 24));

  const expectedDelayDays = Math.max(0, projectedDays - daysRemaining);

  return {
    requiredMonthlySavings,
    projectedCompletionDate: projectedDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
    expectedDelayDays,
  };
}
