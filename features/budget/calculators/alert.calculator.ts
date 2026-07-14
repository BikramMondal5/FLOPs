export interface AlertCheckResult {
  triggered: boolean;
  message?: string;
}

export function checkBudgetAlert(
  budgetName: string,
  spent: number,
  limit: number,
  progressPercentage: number,
  threshold: number
): AlertCheckResult {
  if (spent > limit) {
    const diff = spent - limit;
    return {
      triggered: true,
      message: `Exceeded! ${budgetName} budget is overallocated by ₹${diff.toLocaleString("en-IN")}.`,
    };
  }

  if (progressPercentage >= threshold) {
    return {
      triggered: true,
      message: `Warning: ${budgetName} budget utilization is at ${progressPercentage.toFixed(0)}%.`,
    };
  }

  return { triggered: false };
}
