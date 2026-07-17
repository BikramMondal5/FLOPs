import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import type { TrendDataPoint } from "@/features/analytics/calculators/trends.calculator";

export interface CategoryBreakdownItem {
  category: string;
  spent: number;
  percentage: number;
  count: number;
  averageSpend: number;
}

export interface MonthlyTrendItem {
  month: string; // e.g. "January" or "Jan 26"
  income: number;
  expense: number;
  net: number;
  transactionCount: number;
}

export interface CashFlowPeriodItem {
  period: string; // "Today" | "This Week" etc
  income: number;
  expense: number;
  net: number;
}

export interface AccountAssetDistributionItem {
  accountId: string;
  accountName: string;
  balance: number;
  percentageOfAssets: number;
  color?: string;
}

export interface HealthScoreDTO {
  score: number; // 0 - 100
  rating: "Excellent" | "Good" | "Average" | "Needs Attention";
  savingsRate: number;
  incomeExpenseRatio: number;
  burnRate: number; // Avg monthly burn
  healthInsights: string[];
}

export interface RuleInsightDTO {
  type: "positive" | "warning" | "neutral";
  message: string;
}

export interface FinancialDashboardDTO {
  summary: {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
    accountCount: number;
    transactionCount: number;
    avgDailySpending: number;
    largestIncome: number;
    largestExpense: number;
  };
  monthlyTrends: MonthlyTrendItem[];
  categories: CategoryBreakdownItem[];
  cashFlow: {
    sparkline: number[]; // Last 7 spending totals
    periods: CashFlowPeriodItem[];
  };
  accountDistribution: AccountAssetDistributionItem[];
  recentTransactions: TransactionDTO[];
  health: HealthScoreDTO;
  insights: RuleInsightDTO[];
  trends: {
    weekly: TrendDataPoint[];
    monthly: TrendDataPoint[];
    yearly: TrendDataPoint[];
  };
}
