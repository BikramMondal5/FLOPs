import { GoalDTO, GoalHealth } from "../types/goal.types";

export interface GoalSummaryDTO {
  totalGoalsCount: number;
  completedGoalsCount: number;
  activeGoalsCount: number;
  pausedGoalsCount: number;
  cancelledGoalsCount: number;
  totalTargetAmount: number;
  totalSaved: number;
  totalRemaining: number;
  averageProgressPercentage: number;
  averageMonthlyContribution: number;
}

export interface SmartGoalDetailsDTO {
  goal: GoalDTO;
  saved: number;
  remaining: number;
  progressPercentage: number;
  daysRemaining: number;
  estimatedCompletionDate: string;
  completionPercentage: number;
  requiredMonthlySavings: number;
  projectedCompletionDate: string;
  expectedDelayDays: number;
  health: GoalHealth;
  successProbability: number; // 0-100
  recommendations: string[];
}

export interface GoalDashboardDTO {
  summary: GoalSummaryDTO;
  goals: SmartGoalDetailsDTO[];
  recommendations: string[];
}
