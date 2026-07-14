import type { SmartBudgetDetailsDTO, BudgetDashboardDTO, BudgetSummaryDTO, BudgetForecastDTO } from "../dto/budget-dashboard.dto";

export function mapEngineResultsToDashboardDTO(
  evaluatedBudgets: SmartBudgetDetailsDTO[]
): BudgetDashboardDTO {
  let totalBudgetLimit = 0;
  let totalSpent = 0;
  let exceededBudgetsCount = 0;
  let nearLimitBudgetsCount = 0;
  let onTrackBudgetsCount = 0;
  
  let projectedEndSpend = 0;

  const alerts: string[] = [];

  evaluatedBudgets.forEach((eb) => {
    totalBudgetLimit += eb.budget.budgetAmount;
    totalSpent += eb.spent;
    projectedEndSpend += eb.projectedSpend;

    if (eb.status === "Exceeded") exceededBudgetsCount++;
    else if (eb.status === "Near Limit") nearLimitBudgetsCount++;
    else onTrackBudgetsCount++;

    if (eb.alertTriggered && eb.alertMessage) {
      alerts.push(eb.alertMessage);
    }
  });

  const totalRemaining = totalBudgetLimit - totalSpent;
  const overallHealthProgress = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;

  const summary: BudgetSummaryDTO = {
    totalBudgetLimit,
    totalSpent,
    totalRemaining,
    overallHealthProgress,
    activeBudgetsCount: evaluatedBudgets.filter((b) => b.budget.isActive).length,
    exceededBudgetsCount,
    onTrackBudgetsCount,
    nearLimitBudgetsCount,
  };

  const expectedOverspending = Math.max(0, projectedEndSpend - totalBudgetLimit);
  const expectedSavings = Math.max(0, totalBudgetLimit - projectedEndSpend);

  const forecast: BudgetForecastDTO = {
    projectedEndSpend,
    expectedOverspending,
    expectedSavings,
  };

  // Formulate rule-based dynamic dashboard insights
  const insights: string[] = [];
  if (exceededBudgetsCount > 0) {
    insights.push(`Action Required: ${exceededBudgetsCount} budget categories have exceeded limits.`);
  }
  if (nearLimitBudgetsCount > 0) {
    insights.push(`Budget Warning: ${nearLimitBudgetsCount} categories are nearing utilization limits.`);
  }
  if (totalBudgetLimit > 0 && overallHealthProgress < 60) {
    insights.push("Utilization Healthy: Total spending remains comfortably below active limits.");
  }

  if (insights.length === 0) {
    insights.push("Status Healthy: Create category trackers to monitor spending habits.");
  }

  return {
    summary,
    budgets: evaluatedBudgets,
    alerts,
    forecast,
    insights,
  };
}
