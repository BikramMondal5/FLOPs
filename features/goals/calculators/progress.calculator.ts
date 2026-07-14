export interface ProgressCalculationResult {
  saved: number;
  remaining: number;
  progressPercentage: number;
}

export function calculateGoalProgress(
  currentContribution: number,
  targetAmount: number
): ProgressCalculationResult {
  const remaining = Math.max(0, targetAmount - currentContribution);
  const progressPercentage = targetAmount > 0 ? Math.max(0, Math.min(100, (currentContribution / targetAmount) * 100)) : 0;

  return {
    saved: currentContribution,
    remaining,
    progressPercentage,
  };
}
