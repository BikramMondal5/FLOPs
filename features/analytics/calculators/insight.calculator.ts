import type { RuleInsightDTO } from "../dto/dashboard.dto";
import type { CategoryBreakdownItem } from "../dto/dashboard.dto";

export function generateRuleInsights(
  totalIncome: number,
  totalExpense: number,
  savingsRate: number,
  categories: CategoryBreakdownItem[],
  largestExpense: number
): RuleInsightDTO[] {
  const insights: RuleInsightDTO[] = [];

  // Insight 1: Savings speed
  if (savingsRate >= 20) {
    insights.push({
      type: "positive",
      message: `Great job! You saved ${savingsRate.toFixed(1)}% of your earnings.`,
    });
  } else if (savingsRate > 0) {
    insights.push({
      type: "neutral",
      message: `You saved ₹${(totalIncome - totalExpense).toLocaleString("en-IN")} this month. Try to aim for 20%.`,
    });
  } else if (totalExpense > totalIncome && totalIncome > 0) {
    insights.push({
      type: "warning",
      message: "Warning: Your spending exceeded your monthly income.",
    });
  }

  // Insight 2: Top category alert
  if (categories.length > 0) {
    const topCat = categories[0];
    if (topCat.percentage > 40) {
      insights.push({
        type: "warning",
        message: `High concentration: ${topCat.category} represents ${topCat.percentage.toFixed(0)}% of your expenses.`,
      });
    } else {
      insights.push({
        type: "neutral",
        message: `Your highest spending category this period is ${topCat.category}.`,
      });
    }
  }

  // Insight 3: Large transaction alerts
  if (largestExpense > 20000) {
    insights.push({
      type: "warning",
      message: `Large expense warning: Single largest spending event was ₹${largestExpense.toLocaleString("en-IN")}.`,
    });
  }

  // Default fallback
  if (insights.length === 0) {
    insights.push({
      type: "neutral",
      message: "Ledger syncing is running successfully. Start logging cashflows to see insights.",
    });
  }

  return insights;
}
