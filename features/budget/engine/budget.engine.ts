import type { CategoryBreakdownItem } from "@/features/analytics/dto/dashboard.dto";
import type { BudgetDTO } from "../types/budget.types";
import type { SmartBudgetDetailsDTO } from "../dto/budget-dashboard.dto";
import { calculateProgress } from "../calculators/progress.calculator";
import { calculateBudgetStatus } from "../calculators/health.calculator";
import { calculateForecast } from "../calculators/forecast.calculator";
import { checkBudgetAlert } from "../calculators/alert.calculator";

export function evaluateSmartBudgets(
  budgets: BudgetDTO[],
  categoryAnalytics: CategoryBreakdownItem[]
): SmartBudgetDetailsDTO[] {
  // Map analytics list to dictionary for category mapping lookup
  const categoryMap = new Map<string, CategoryBreakdownItem>();
  categoryAnalytics.forEach((item) => {
    categoryMap.set(item.category, item);
  });

  const now = new Date();

  return budgets.map((b) => {
    // 1. Resolve spent amount dynamically from analytics
    const analytics = categoryMap.get(b.category);
    const spent = analytics ? analytics.spent : 0;

    // 2. Dates calculations
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const totalDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 30;
    const elapsedDays = Math.ceil(Math.abs(now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    // 3. Process indicators
    const progress = calculateProgress(spent, b.budgetAmount);
    const status = calculateBudgetStatus(progress.progressPercentage);

    // 4. Projections
    const forecast = calculateForecast(spent, b.budgetAmount, elapsedDays, totalDays);

    // 5. Threshold checks
    const alertResult = checkBudgetAlert(
      b.name,
      spent,
      b.budgetAmount,
      progress.progressPercentage,
      b.alertThreshold ?? 80
    );

    return {
      budget: b,
      spent,
      remaining: progress.remaining,
      progressPercentage: progress.progressPercentage,
      status,
      daysRemaining,
      projectedSpend: forecast.projectedSpend,
      projectedRemaining: forecast.projectedRemaining,
      projectedStatus: forecast.projectedStatus,
      alertTriggered: alertResult.triggered,
      alertMessage: alertResult.message,
    };
  });
}
