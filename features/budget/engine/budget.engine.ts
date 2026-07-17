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
  const currentDay = now.getDate(); // Day of month (1-31)
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate total days in current month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Elapsed days is the current day (e.g., if today is the 16th, elapsed = 16)
  const elapsedDays = Math.max(1, currentDay);
  
  // Days remaining in month
  const daysRemaining = Math.max(0, totalDaysInMonth - currentDay);

  return budgets.map((b) => {
    // 1. Resolve spent amount dynamically from analytics
    const analytics = categoryMap.get(b.category);
    const spent = analytics ? analytics.spent : 0;

    // 2. Process indicators
    const progress = calculateProgress(spent, b.budgetAmount);
    const status = calculateBudgetStatus(progress.progressPercentage);

    // 3. Projections based on current month
    const forecast = calculateForecast(spent, b.budgetAmount, elapsedDays, totalDaysInMonth);

    // 4. Threshold checks
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
