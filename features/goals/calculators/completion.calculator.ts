export interface CompletionCalculationResult {
  daysRemaining: number;
  estimatedCompletionDate: string;
  completionPercentage: number;
}

export function calculateGoalCompletion(
  targetDateStr: string,
  progressPercentage: number
): CompletionCalculationResult {
  const now = new Date();
  const targetDate = new Date(targetDateStr);

  const daysRemaining = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return {
    daysRemaining,
    estimatedCompletionDate: targetDate.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    }),
    completionPercentage: progressPercentage,
  };
}
