import { BudgetDTO, BudgetStatus } from "../types/budget.types";

export interface BudgetSummaryDTO {
  totalBudgetLimit: number;
  totalSpent: number;
  totalRemaining: number;
  overallHealthProgress: number; // overall percentage
  activeBudgetsCount: number;
  exceededBudgetsCount: number;
  onTrackBudgetsCount: number;
  nearLimitBudgetsCount: number;
}

export interface SmartBudgetDetailsDTO {
  budget: BudgetDTO;
  spent: number;
  remaining: number;
  progressPercentage: number;
  status: BudgetStatus;
  daysRemaining: number;
  projectedSpend: number;
  projectedRemaining: number;
  projectedStatus: BudgetStatus;
  alertTriggered: boolean;
  alertMessage?: string;
}

export interface BudgetForecastDTO {
  projectedEndSpend: number;
  expectedOverspending: number;
  expectedSavings: number;
}

export interface BudgetDashboardDTO {
  summary: BudgetSummaryDTO;
  budgets: SmartBudgetDetailsDTO[];
  alerts: string[];
  forecast: BudgetForecastDTO;
  insights: string[];
}
