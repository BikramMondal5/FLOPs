import type { GoalDTO } from "../types/goal.types";
import type { SmartGoalDetailsDTO } from "../dto/goal-dashboard.dto";
import { calculateGoalProgress } from "../calculators/progress.calculator";
import { calculateGoalCompletion } from "../calculators/completion.calculator";
import { calculateGoalForecast } from "../calculators/forecast.calculator";
import { calculateGoalHealth } from "../calculators/health.calculator";
import { calculateGoalProbability } from "../calculators/probability.calculator";
import { generateGoalRecommendations } from "../calculators/recommendation.calculator";

export function evaluateSmartGoals(
  goals: GoalDTO[],
  avgMonthlySavings: number,
  budgetHealthScore: number
): SmartGoalDetailsDTO[] {
  return goals.map((g) => {
    // 1. Progress indicators
    const progress = calculateGoalProgress(g.currentContribution, g.targetAmount);

    // 2. Timeline calculations
    const completion = calculateGoalCompletion(g.targetDate, progress.progressPercentage);

    // 3. Projections
    const forecast = calculateGoalForecast(
      progress.remaining,
      completion.daysRemaining,
      avgMonthlySavings,
      avgMonthlySavings
    );

    // 4. Health indicators (based on progress percentage)
    const health = calculateGoalHealth(progress.progressPercentage, g.status);

    // 5. Probability
    const probability = calculateGoalProbability(
      progress.progressPercentage,
      health,
      completion.daysRemaining,
      budgetHealthScore
    );

    // 6. Alert recommendations
    const recommendations = generateGoalRecommendations(
      g.name,
      g.targetAmount,
      progress.remaining,
      forecast.requiredMonthlySavings,
      health,
      probability
    );

    return {
      goal: g,
      saved: progress.saved,
      remaining: progress.remaining,
      progressPercentage: progress.progressPercentage,
      daysRemaining: completion.daysRemaining,
      estimatedCompletionDate: completion.estimatedCompletionDate,
      completionPercentage: completion.completionPercentage,
      requiredMonthlySavings: forecast.requiredMonthlySavings,
      projectedCompletionDate: forecast.projectedCompletionDate,
      expectedDelayDays: forecast.expectedDelayDays,
      health,
      successProbability: probability,
      recommendations,
    };
  });
}
