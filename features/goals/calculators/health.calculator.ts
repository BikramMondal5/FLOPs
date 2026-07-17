import { GoalHealth } from "../types/goal.types";

export function calculateGoalHealth(
  progressPercentage: number,
  status: string
): GoalHealth {
  if (status === "Completed" || progressPercentage >= 100) return "Completed";
  if (progressPercentage >= 70) return "Almost There";
  if (progressPercentage >= 40) return "On Track";
  return "Started";
}
