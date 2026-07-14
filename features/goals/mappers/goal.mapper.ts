import type { SmartGoalDetailsDTO, GoalDashboardDTO, GoalSummaryDTO } from "../dto/goal-dashboard.dto";

export function mapEngineResultsToGoalsDashboardDTO(
  evaluatedGoals: SmartGoalDetailsDTO[],
  avgMonthlySavings: number
): GoalDashboardDTO {
  let completedGoalsCount = 0;
  let activeGoalsCount = 0;
  let pausedGoalsCount = 0;
  let cancelledGoalsCount = 0;
  
  let totalTargetAmount = 0;
  let totalSaved = 0;

  const recommendations: string[] = [];

  evaluatedGoals.forEach((eg) => {
    totalTargetAmount += eg.goal.targetAmount;
    totalSaved += eg.saved;

    if (eg.goal.status === "Completed") completedGoalsCount++;
    else if (eg.goal.status === "Paused") pausedGoalsCount++;
    else if (eg.goal.status === "Cancelled") cancelledGoalsCount++;
    else activeGoalsCount++;

    if (eg.recommendations.length > 0) {
      recommendations.push(...eg.recommendations);
    }
  });

  const totalRemaining = totalTargetAmount - totalSaved;
  const averageProgressPercentage = evaluatedGoals.length > 0
    ? evaluatedGoals.reduce((acc, g) => acc + g.progressPercentage, 0) / evaluatedGoals.length
    : 0;

  const summary: GoalSummaryDTO = {
    totalGoalsCount: evaluatedGoals.length,
    completedGoalsCount,
    activeGoalsCount,
    pausedGoalsCount,
    cancelledGoalsCount,
    totalTargetAmount,
    totalSaved,
    totalRemaining,
    averageProgressPercentage,
    averageMonthlyContribution: avgMonthlySavings,
  };

  return {
    summary,
    goals: evaluatedGoals,
    recommendations: recommendations.slice(0, 5), // return top 5
  };
}
