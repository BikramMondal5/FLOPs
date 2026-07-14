import type { BudgetDTO } from "@/features/budget/types/budget.types";
import type { GoalDTO } from "@/features/goals/types/goal.types";
import type { TransactionDTO } from "@/features/transactions/types/transaction.types";
import type { NotificationDTO } from "../types/notification.types";

export function compileDynamicNotifications(
  userId: string,
  budgets: BudgetDTO[],
  goals: GoalDTO[],
  currentTransactions: TransactionDTO[]
): NotificationDTO[] {
  const alerts: NotificationDTO[] = [];
  const now = new Date();
  const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

  // 1. Calculate Monthly Cash Flow
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

  if (netSavings < 0 && totalIncome > 0) {
    alerts.push({
      id: `cashflow-${userId}-${yearMonth}`,
      type: "CashFlow",
      severity: "warning",
      message: `Negative cash flow: You have spent more than you earned this month by ${Math.abs(netSavings)}.`,
      createdAt: now.toISOString(),
      isRead: false,
    });
  }

  // 2. Budget Threshold Checks
  budgets.forEach((b) => {
    const categoryTx = currentTransactions.filter(
      (t) => t.type === "Expense" && t.category === b.category
    );
    const actualSpent = categoryTx.reduce((sum, t) => sum + t.amount, 0);
    const progressPercent = b.budgetAmount > 0 ? (actualSpent / b.budgetAmount) * 100 : 0;
    const threshold = b.alertThreshold ?? 80;

    if (progressPercent >= 100) {
      alerts.push({
        id: `budget-${b._id}-${yearMonth}`,
        type: "Budget",
        severity: "critical",
        message: `Budget Exceeded: You have spent ${actualSpent} out of your ${b.budgetAmount} budget for ${b.category}.`,
        targetId: b._id,
        createdAt: now.toISOString(),
        isRead: false,
      });
    } else if (progressPercent >= threshold) {
      alerts.push({
        id: `budget-${b._id}-${yearMonth}`,
        type: "Budget",
        severity: "warning",
        message: `Budget Warning: You have used ${Math.round(progressPercent)}% of your ${b.budgetAmount} budget for ${b.category}.`,
        targetId: b._id,
        createdAt: now.toISOString(),
        isRead: false,
      });
    }
  });

  // 3. Goal Deadlines & Health Checks
  goals.forEach((g) => {
    const targetAmount = g.targetAmount;
    const currentSavings = g.currentContribution;
    const progressPercent = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
    const targetDate = new Date(g.targetDate);

    if (progressPercent < 100) {
      if (targetDate.getTime() < now.getTime()) {
        alerts.push({
          id: `goal-${g._id}-${yearMonth}`,
          type: "Goal",
          severity: "critical",
          message: `Goal Deadline Passed: "${g.name}" has passed its target deadline of ${g.targetDate} and is only ${Math.round(progressPercent)}% funded.`,
          targetId: g._id,
          createdAt: now.toISOString(),
          isRead: false,
        });
      } else {
        const daysLeft = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 30) {
          alerts.push({
            id: `goal-${g._id}-${yearMonth}`,
            type: "Goal",
            severity: "warning",
            message: `Goal Deadline Approaching: "${g.name}" deadline is in ${daysLeft} days (${g.targetDate}) and is ${Math.round(progressPercent)}% funded.`,
            targetId: g._id,
            createdAt: now.toISOString(),
            isRead: false,
          });
        }
      }
    }
  });

  return alerts;
}
