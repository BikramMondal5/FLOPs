export type ReportPeriod = "Daily" | "Weekly" | "Monthly";

export interface ReportSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  averageDailySpending: number;
  savingsRate: number; // percentage (0-100)
}

export interface BudgetReportItem {
  _id: string;
  name: string;
  category: string;
  budgetAmount: number;
  actualSpent: number;
  progressPercent: number;
  status: "Healthy" | "Warning" | "Critical";
}

export interface GoalReportItem {
  _id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  progressPercent: number;
  status: "On Track" | "Lagging" | "At Risk";
  targetDate: string;
}

export interface HealthScores {
  financialHealth: number;
  budgetAdherence: number;
  goalVelocity: number;
  cashFlowRatio: number;
}

export interface CategoryComparison {
  category: string;
  currentAmount: number;
  previousAmount: number;
  diffAmount: number;
  changePercent: number; // percentage (positive, negative or zero)
}

export interface ReportDashboardDTO {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  summary: ReportSummary;
  budgetPerformance: BudgetReportItem[];
  goalsProgress: GoalReportItem[];
  healthScores: HealthScores;
  tabularComparisons: CategoryComparison[];
}
