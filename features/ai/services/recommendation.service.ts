import type { FinancialDashboardDTO } from "@/features/analytics/dto/dashboard.dto";
import type { BudgetDashboardDTO } from "@/features/budget/dto/budget-dashboard.dto";
import type { GoalDashboardDTO } from "@/features/goals/dto/goal-dashboard.dto";
import type { AIRecDTO } from "../types/ai.types";

export function generateDeterministicRecommendations(
  analytics: FinancialDashboardDTO,
  budget: BudgetDashboardDTO,
  goals: GoalDashboardDTO
): AIRecDTO[] {
  const list: AIRecDTO[] = [];

  // Rule 1: High Spending category alert
  const sorted = [...analytics.categories].sort((a, b) => b.spent - a.spent);
  if (sorted.length > 0) {
    const top = sorted[0];
    if (top.percentage > 35) {
      list.push({
        category: top.category,
        type: "warning",
        message: `${top.category} util represents ${top.percentage.toFixed(0)}% of total category spending. Target reducing by 10% next month.`,
      });
    }
  }

  // Rule 2: Budget overruns
  budget.budgets.forEach((b) => {
    if (b.status === "Exceeded") {
      list.push({
        category: b.budget.category,
        type: "warning",
        message: `Budget Exceeded: Tracker ${b.budget.name} has overruns of ₹${(b.spent - b.budget.budgetAmount).toLocaleString("en-IN")}.`,
      });
    }
  });

  // Rule 3: Goal progress tracking
  goals.goals.forEach((g) => {
    if (g.health === "Started" && g.progressPercentage < 20) {
      list.push({
        category: g.goal.category,
        type: "neutral",
        message: `Goal "${g.goal.name}" needs attention. Required savings rate is ₹${g.requiredMonthlySavings.toLocaleString("en-IN")}/month.`,
      });
    }
  });

  // Fallback defaults
  if (list.length === 0) {
    list.push({
      category: "Savings",
      type: "positive",
      message: "Monthly utilization is healthy. Consider setting up savings goals.",
    });
  }

  return list;
}
