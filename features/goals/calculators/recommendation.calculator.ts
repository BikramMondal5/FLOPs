import { GoalHealth } from "../types/goal.types";

export function generateGoalRecommendations(
  goalName: string,
  targetAmount: number,
  remainingAmount: number,
  requiredMonthlySavings: number,
  health: GoalHealth,
  successProbability: number
): string[] {
  const recs: string[] = [];

  if (health === "Completed") {
    recs.push(`Congratulations! You achieved your ${goalName} plan!`);
    return recs;
  }

  if (health === "At Risk") {
    recs.push(`At Risk: Increase monthly contributions by 15% to bridge the target gap.`);
  }

  if (successProbability < 50) {
    recs.push(`Timeline constraint: Save an extra ₹${requiredMonthlySavings.toLocaleString("en-IN")} monthly to meet the deadline.`);
  }

  if (recs.length === 0) {
    recs.push(`On track: Current savings rate is sufficient to complete ${goalName}.`);
  }

  return recs;
}
