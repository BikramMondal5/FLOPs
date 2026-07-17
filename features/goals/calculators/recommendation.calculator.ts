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

  if (health === "Started" && successProbability < 40) {
    recs.push(`Just Started: Increase monthly contributions to ₹${requiredMonthlySavings.toLocaleString("en-IN")} to stay on track.`);
  }

  if (successProbability < 50) {
    recs.push(`Timeline constraint: Save an extra ₹${requiredMonthlySavings.toLocaleString("en-IN")} monthly to meet the deadline.`);
  }

  if (health === "Almost There") {
    recs.push(`Almost there! Just ₹${remainingAmount.toLocaleString("en-IN")} more to reach your ${goalName} goal.`);
  }

  if (recs.length === 0 && health === "On Track") {
    recs.push(`On track: Current savings rate is sufficient to complete ${goalName}.`);
  }

  return recs;
}
