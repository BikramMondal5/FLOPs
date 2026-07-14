import { BudgetStatus } from "../types/budget.types";

export function calculateBudgetStatus(progressPercentage: number): BudgetStatus {
  if (progressPercentage >= 100) {
    return "Exceeded";
  }
  if (progressPercentage >= 80) {
    return "Near Limit";
  }
  return "On Track";
}
