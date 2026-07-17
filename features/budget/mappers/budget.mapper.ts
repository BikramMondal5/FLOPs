import type { SmartBudgetDetailsDTO, BudgetDashboardDTO, BudgetSummaryDTO, BudgetForecastDTO } from "../dto/budget-dashboard.dto";

export function mapEngineResultsToDashboardDTO(
  evaluatedBudgets: SmartBudgetDetailsDTO[]
): BudgetDashboardDTO {
  let totalBudgetLimit = 0;
  let totalSpent = 0;
  let exceededBudgetsCount = 0;
  let warningBudgetsCount = 0;
  let watchBudgetsCount = 0;
  let healthyBudgetsCount = 0;
  
  let projectedEndSpend = 0;

  const alerts: string[] = [];

  // Sort budgets by status priority: Exceeded > Warning > Watch > Healthy
  const sortedBudgets = [...evaluatedBudgets].sort((a, b) => {
    const priority = { Exceeded: 0, Warning: 1, Watch: 2, Healthy: 3 };
    return priority[a.status] - priority[b.status];
  });

  sortedBudgets.forEach((eb) => {
    totalBudgetLimit += eb.budget.budgetAmount;
    totalSpent += eb.spent;
    projectedEndSpend += eb.projectedSpend;

    // Count by status
    if (eb.status === "Exceeded") exceededBudgetsCount++;
    else if (eb.status === "Warning") warningBudgetsCount++;
    else if (eb.status === "Watch") watchBudgetsCount++;
    else healthyBudgetsCount++;

    // Generate specific alerts
    if (eb.status === "Exceeded") {
      const overage = eb.spent - eb.budget.budgetAmount;
      alerts.push(`${eb.budget.name} budget exceeded by ₹${overage.toLocaleString("en-IN")}.`);
    } else if (eb.status === "Warning") {
      alerts.push(`${eb.budget.name} budget has reached ${eb.progressPercentage.toFixed(0)}%.`);
    } else if (eb.projectedStatus === "Exceeded" && (eb.status === "Healthy" || eb.status === "Watch")) {
      alerts.push(`${eb.budget.name} budget will likely exceed limit by month end.`);
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
    onTrackBudgetsCount: healthyBudgetsCount,
    nearLimitBudgetsCount: warningBudgetsCount + watchBudgetsCount,
  };

  const expectedOverspending = Math.max(0, projectedEndSpend - totalBudgetLimit);
  const expectedSavings = Math.max(0, totalBudgetLimit - projectedEndSpend);

  const forecast: BudgetForecastDTO = {
    projectedEndSpend,
    expectedOverspending,
    expectedSavings,
  };

  // Generate rule-based insights
  const insights: string[] = [];
  
  if (exceededBudgetsCount > 0) {
    insights.push(`Action Required: ${exceededBudgetsCount} budget ${exceededBudgetsCount === 1 ? 'category has' : 'categories have'} exceeded limits.`);
  }
  
  if (warningBudgetsCount > 0) {
    insights.push(`${warningBudgetsCount} ${warningBudgetsCount === 1 ? 'budget is' : 'budgets are'} approaching utilization limits (80%+).`);
  }
  
  if (watchBudgetsCount > 0) {
    insights.push(`${watchBudgetsCount} ${watchBudgetsCount === 1 ? 'budget requires' : 'budgets require'} monitoring (60-80% utilized).`);
  }

  // Add projection-based insights
  const projectedExceededCount = evaluatedBudgets.filter(
    (eb) => eb.projectedStatus === "Exceeded" && eb.status !== "Exceeded"
  ).length;
  
  if (projectedExceededCount > 0) {
    insights.push(`${projectedExceededCount} ${projectedExceededCount === 1 ? 'budget is' : 'budgets are'} projected to exceed limits by month end.`);
  }

  if (healthyBudgetsCount === evaluatedBudgets.length && evaluatedBudgets.length > 0) {
    insights.push("All budget categories are performing well and within healthy utilization ranges.");
  }

  if (insights.length === 0 && evaluatedBudgets.length === 0) {
    insights.push("Create your first budget tracker to unlock projections and budget alerts.");
  }

  return {
    summary,
    budgets: sortedBudgets,
    alerts,
    forecast,
    insights,
  };
}
