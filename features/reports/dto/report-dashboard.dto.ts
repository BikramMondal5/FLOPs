export interface ReportSummaryDTO {
  totalReportsGenerated: number;
  latestReportDate: string | null;
  currentFinancialScore: number | null;
  currentNetWorth: number;
}

export interface ReportAccountsSummaryDTO {
  totalAccounts: number;
  totalBalance: number;
  accountsList: Array<{
    name: string;
    type: string;
    balance: number;
  }>;
  largestAccount: string;
  inactiveAccountsCount: number;
}

export interface ReportAnalyticsSummaryDTO {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  avgDailySpending: number;
  topCategories: Array<{
    category: string;
    spent: number;
    percentage: number;
  }>;
  highestTransaction: number;
}

export interface ReportBudgetsSummaryDTO {
  totalBudgetLimit: number;
  totalSpent: number;
  totalRemaining: number;
  overallUtilization: number;
  exceededCount: number;
  healthyCount: number;
  budgets: Array<{
    name: string;
    category: string;
    limit: number;
    spent: number;
    remaining: number;
    utilization: number;
    status: string;
  }>;
}

export interface ReportGoalsSummaryDTO {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  totalTargetAmount: number;
  totalSaved: number;
  totalRemaining: number;
  averageProgress: number;
  nearestGoal: string | null;
  goals: Array<{
    name: string;
    target: number;
    saved: number;
    remaining: number;
    progress: number;
    etaMonths: number;
    status: string;
  }>;
}

export interface ReportHealthDTO {
  score: number | null;
  rating: string;
  positiveFactors: string[];
  riskFactors: string[];
}

export interface FullReportDTO {
  reportType: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  summary: {
    netWorth: number;
    totalIncome: number;
    totalExpenses: number;
    savingsRate: number;
    dailyAverageSpending: number;
    financialHealthScore: number | null;
    budgetUtilization: number;
    goalProgress: number;
  };
  accounts: ReportAccountsSummaryDTO;
  analytics: ReportAnalyticsSummaryDTO;
  budgets: ReportBudgetsSummaryDTO;
  goals: ReportGoalsSummaryDTO;
  health: ReportHealthDTO;
  aiSummary: string;
}
