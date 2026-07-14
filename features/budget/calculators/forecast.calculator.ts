import { BudgetStatus } from "../types/budget.types";
import { calculateBudgetStatus } from "./health.calculator";

export interface ForecastCalculationResult {
  projectedSpend: number;
  projectedRemaining: number;
  projectedStatus: BudgetStatus;
}

export function calculateForecast(
  spent: number,
  limit: number,
  daysElapsed: number,
  totalDays: number
): ForecastCalculationResult {
  const elapsed = Math.max(1, daysElapsed);
  const total = Math.max(1, totalDays);

  // Linear projection spending speed
  const dailyRate = spent / elapsed;
  const projectedSpend = Math.round(dailyRate * total);
  const projectedRemaining = limit - projectedSpend;
  
  const projectedProgress = limit > 0 ? (projectedSpend / limit) * 100 : 0;
  const projectedStatus = calculateBudgetStatus(projectedProgress);

  return {
    projectedSpend,
    projectedRemaining,
    projectedStatus,
  };
}
