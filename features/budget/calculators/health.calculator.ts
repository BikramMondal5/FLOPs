import { BudgetStatus } from "../types/budget.types";

export function calculateBudgetStatus(progressPercentage: number): BudgetStatus {
  if (progressPercentage >= 100) {
    return "Exceeded";
  }
  if (progressPercentage >= 80) {
    return "Warning";
  }
  if (progressPercentage >= 60) {
    return "Watch";
  }
  return "Healthy";
}
