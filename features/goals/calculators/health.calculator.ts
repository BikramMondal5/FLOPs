import { GoalHealth } from "../types/goal.types";

export function calculateGoalHealth(
  expectedDelayDays: number,
  status: string
): GoalHealth {
  if (status === "Completed") return "Completed";
  if (status === "Paused" || status === "Cancelled") return "Behind Schedule";

  if (expectedDelayDays > 90) {
    return "At Risk";
  }
  if (expectedDelayDays > 15) {
    return "Behind Schedule";
  }
  return "On Track";
}
