import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import type { BudgetDTO } from "@/features/budget/types/budget.types";
import type { GoalDTO } from "@/features/goals/types/goal.types";
import type {
  ReportDashboardDTO,
  ReportPeriod,
  BudgetReportItem,
  GoalReportItem,
  CategoryComparison,
  HealthScores,
} from "../types/report.types";

export function compileReportDashboard(
  period: ReportPeriod,
  startDate: Date,
  endDate: Date,
  currentTransactions: TransactionDTO[],
  previousTransactions: TransactionDTO[],
  budgets: BudgetDTO[],
  goals: GoalDTO[]
): ReportDashboardDTO {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // 1. Calculate Summary Metrics
  let totalIncome = 0;
  let totalExpense = 0;

  currentTransactions.forEach((t) => {
    if (t.type === "Income") {
      totalIncome += t.amount;
    } else if (t.type === "Expense") {
      totalExpense += t.amount;
    }
  });

  const netSavings = totalIncome - totalExpense;
  const averageDailySpending = Number((totalExpense / daysCount).toFixed(2));
  const savingsRate = totalIncome > 0 ? Number(((netSavings / totalIncome) * 100).toFixed(2)) : 0;

  // 2. Budget Performance Compilation
  const budgetPerformance: BudgetReportItem[] = budgets.map((b) => {
    const categoryTx = currentTransactions.filter(
      (t) => t.type === "Expense" && t.category === b.category
    );
    const actualSpent = categoryTx.reduce((sum, t) => sum + t.amount, 0);
    const progressPercent = b.budgetAmount > 0 ? Number(((actualSpent / b.budgetAmount) * 100).toFixed(2)) : 0;

    let status: "Healthy" | "Warning" | "Critical" = "Healthy";
    const threshold = b.alertThreshold ?? 80;
    if (progressPercent >= 100) {
      status = "Critical";
    } else if (progressPercent >= threshold) {
      status = "Warning";
    }

    return {
      _id: b._id,
      name: b.name,
      category: b.category,
      budgetAmount: b.budgetAmount,
      actualSpent,
      progressPercent,
      status,
    };
  });

  // 3. Goals Progress Compilation
  const now = new Date();
  const goalsProgress: GoalReportItem[] = goals.map((g) => {
    const targetAmount = g.targetAmount;
    const currentSavings = g.currentContribution;
    const progressPercent = targetAmount > 0 ? Number(((currentSavings / targetAmount) * 100).toFixed(2)) : 0;

    let status: "On Track" | "Lagging" | "At Risk" = "On Track";
    const targetDate = new Date(g.targetDate);

    if (progressPercent < 100) {
      if (targetDate.getTime() < now.getTime()) {
        status = "At Risk";
      } else {
        const daysLeft = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const requiredRate = (targetAmount - currentSavings) / (daysLeft || 1);
        if (requiredRate > 500) { // arbitrary threshold for warning
          status = "Lagging";
        }
      }
    }

    return {
      _id: g._id,
      name: g.name,
      targetAmount,
      currentSavings,
      progressPercent,
      status,
      targetDate: g.targetDate,
    };
  });

  // 4. Health Scores
  const totalBudgets = budgetPerformance.length;
  const healthyBudgets = budgetPerformance.filter((b) => b.status === "Healthy").length;
  const budgetAdherence = totalBudgets > 0 ? Math.round((healthyBudgets / totalBudgets) * 100) : 100;

  const totalGoals = goalsProgress.length;
  const onTrackGoals = goalsProgress.filter((g) => g.status === "On Track").length;
  const goalVelocity = totalGoals > 0 ? Math.round((onTrackGoals / totalGoals) * 100) : 100;

  const cashFlowRatio = totalIncome > 0 ? Math.max(0, Math.min(100, Math.round((netSavings / totalIncome) * 100))) : 0;

  const financialHealth = Math.round((budgetAdherence + goalVelocity + cashFlowRatio) / 3);

  const healthScores: HealthScores = {
    financialHealth,
    budgetAdherence,
    goalVelocity,
    cashFlowRatio,
  };

  // 5. Category Tabular Comparisons
  const currentCategoryMap = new Map<string, number>();
  const previousCategoryMap = new Map<string, number>();

  currentTransactions.forEach((t) => {
    if (t.type === "Expense") {
      currentCategoryMap.set(t.category, (currentCategoryMap.get(t.category) ?? 0) + t.amount);
    }
  });

  previousTransactions.forEach((t) => {
    if (t.type === "Expense") {
      previousCategoryMap.set(t.category, (previousCategoryMap.get(t.category) ?? 0) + t.amount);
    }
  });

  const categoriesSet = new Set([...currentCategoryMap.keys(), ...previousCategoryMap.keys()]);
  const tabularComparisons: CategoryComparison[] = Array.from(categoriesSet).map((cat) => {
    const currentAmount = currentCategoryMap.get(cat) ?? 0;
    const previousAmount = previousCategoryMap.get(cat) ?? 0;
    const diffAmount = currentAmount - previousAmount;
    const changePercent = previousAmount > 0 ? Number(((diffAmount / previousAmount) * 100).toFixed(2)) : 0;

    return {
      category: cat,
      currentAmount,
      previousAmount,
      diffAmount,
      changePercent,
    };
  });

  return {
    period,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    summary: {
      totalIncome,
      totalExpense,
      netSavings,
      averageDailySpending,
      savingsRate,
    },
    budgetPerformance,
    goalsProgress,
    healthScores,
    tabularComparisons,
  };
}
