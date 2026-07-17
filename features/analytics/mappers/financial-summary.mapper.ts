import type { RawSummaryAggregation, RawCategoryAggregation, RawMonthlyAggregation } from "../repositories/analytics.repository";
import type { CategoryBreakdownItem, MonthlyTrendItem, AccountAssetDistributionItem, FinancialDashboardDTO } from "../dto/dashboard.dto";
import type { AccountDTO } from "@/features/accounts/types/account.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import type { TrendsData } from "../calculators/trends.calculator";
import { calculateSummary } from "../calculators/summary.calculator";
import { calculateCategories } from "../calculators/category.calculator";
import { calculateHealthScore } from "../calculators/health.calculator";
import { generateRuleInsights } from "../calculators/insight.calculator";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function mapRawDashboardToDTO(
  accounts: AccountDTO[],
  recentTransactions: TransactionDTO[],
  summaryRaw: RawSummaryAggregation,
  categoriesRaw: RawCategoryAggregation[],
  monthlyRaw: RawMonthlyAggregation[],
  sparklinePoints: number[],
  daysCount: number,
  trends?: TrendsData
): FinancialDashboardDTO {
  // 1. Calculate assets & distribution
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const accountDistribution: AccountAssetDistributionItem[] = accounts.map((a) => {
    const percentageOfAssets = totalBalance > 0 ? (a.balance / totalBalance) * 100 : 0;
    return {
      accountId: a._id,
      accountName: a.name,
      balance: a.balance,
      percentageOfAssets,
      color: a.color,
    };
  });

  // 2. Format Categories
  const categories = calculateCategories(categoriesRaw, summaryRaw.totalExpense);

  // 3. Format Monthly trends
  const monthlyTrends: MonthlyTrendItem[] = monthlyRaw.map((m) => {
    const idx = m._id.month - 1;
    const name = idx >= 0 && idx < 12 ? monthNames[idx] : `Month ${m._id.month}`;
    return {
      month: `${name} ${m._id.year}`,
      income: m.income,
      expense: m.expense,
      net: m.income - m.expense,
      transactionCount: m.count,
    };
  });

  // Default current month if empty
  if (monthlyTrends.length === 0) {
    const now = new Date();
    monthlyTrends.push({
      month: `${monthNames[now.getMonth()]} ${now.getFullYear()}`,
      income: summaryRaw.totalIncome,
      expense: summaryRaw.totalExpense,
      net: summaryRaw.totalIncome - summaryRaw.totalExpense,
      transactionCount: summaryRaw.count,
    });
  }

  // 4. Summary computations
  const summaryMath = calculateSummary(summaryRaw, daysCount);

  // 5. Health ratings
  const health = calculateHealthScore(
    summaryRaw.totalIncome,
    summaryRaw.totalExpense,
    summaryMath.savingsRate,
    accounts.length,
    summaryRaw.count
  );

  // 6. Insights
  const insights = generateRuleInsights(
    summaryRaw.totalIncome,
    summaryRaw.totalExpense,
    summaryMath.savingsRate,
    categories,
    summaryRaw.largestExpense
  );

  return {
    summary: {
      totalBalance,
      totalIncome: summaryRaw.totalIncome,
      totalExpenses: summaryRaw.totalExpense,
      netSavings: summaryMath.netSavings,
      savingsRate: summaryMath.savingsRate,
      accountCount: accounts.length,
      transactionCount: summaryRaw.count,
      avgDailySpending: summaryMath.avgDailySpending,
      largestIncome: summaryRaw.largestIncome,
      largestExpense: summaryRaw.largestExpense,
    },
    monthlyTrends,
    categories,
    cashFlow: {
      sparkline: sparklinePoints,
      periods: [
        {
          period: "Selected Period",
          income: summaryRaw.totalIncome,
          expense: summaryRaw.totalExpense,
          net: summaryRaw.totalIncome - summaryRaw.totalExpense,
        },
      ],
    },
    accountDistribution,
    recentTransactions,
    health,
    insights,
    trends: trends ?? { weekly: [], monthly: [], yearly: [] },
  };
}
