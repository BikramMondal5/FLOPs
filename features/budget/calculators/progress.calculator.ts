export interface ProgressCalculationResult {
  spent: number;
  remaining: number;
  progressPercentage: number;
}

export function calculateProgress(spent: number, limit: number): ProgressCalculationResult {
  const remaining = limit - spent;
  const progressPercentage = limit > 0 ? (spent / limit) * 100 : 0;

  return {
    spent,
    remaining,
    progressPercentage,
  };
}
