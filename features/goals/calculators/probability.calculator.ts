export function calculateGoalProbability(
  progressPercentage: number,
  health: string,
  daysRemaining: number,
  budgetHealthScore: number
): number {
  if (health === "Completed") return 100;

  let probability = 50; // base score

  // 1. Current progress weight (max 25 points)
  probability += Math.round(progressPercentage * 0.25);

  // 2. Health status mapping (max 25 points)
  if (health === "On Track") probability += 25;
  else if (health === "Behind Schedule") probability += 10;
  else probability -= 15; // At Risk penalty

  // 3. Budget utilization score influence (max 25 points)
  probability += Math.round(budgetHealthScore * 0.25);

  // 4. Timeline influence
  if (daysRemaining > 365) probability += 10; // more runway
  else if (daysRemaining < 30) probability -= 20; // tight timeline constraint

  return Math.max(0, Math.min(100, probability));
}
