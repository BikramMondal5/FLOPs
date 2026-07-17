import type { NotificationDTO } from "../dto/notification.dto";
import type { SmartBudgetDetailsDTO } from "@/features/budget/dto/budget-dashboard.dto";

export function generateBudgetNotifications(budgets: SmartBudgetDetailsDTO[]): NotificationDTO[] {
  const notifications: NotificationDTO[] = [];
  const now = new Date();

  budgets.forEach((budget) => {
    const { budget: budgetData, status, progressPercentage, remaining } = budget;

    if (status === "Exceeded") {
      const overspent = Math.abs(remaining);
      notifications.push({
        id: `budget-exceeded-${budgetData._id}`,
        type: "budget",
        severity: "critical",
        title: "Budget Exceeded",
        message: `${budgetData.name} budget exceeded by ₹${overspent.toLocaleString("en-IN")}.`,
        actionLabel: "View Budget",
        actionUrl: "/budget",
        createdAt: now,
        read: false,
      });
    } else if (status === "Warning") {
      notifications.push({
        id: `budget-warning-${budgetData._id}`,
        type: "budget",
        severity: "warning",
        title: "Budget Warning",
        message: `${budgetData.name} budget is close to exceeding its limit (${progressPercentage.toFixed(0)}%).`,
        actionLabel: "View Budget",
        actionUrl: "/budget",
        createdAt: now,
        read: false,
      });
    } else if (status === "Watch" && progressPercentage >= 70) {
      notifications.push({
        id: `budget-watch-${budgetData._id}`,
        type: "budget",
        severity: "warning",
        title: "Budget Watch",
        message: `${budgetData.name} budget has reached ${progressPercentage.toFixed(0)}%.`,
        actionLabel: "View Budget",
        actionUrl: "/budget",
        createdAt: now,
        read: false,
      });
    } else if (status === "Healthy" && progressPercentage < 60) {
      notifications.push({
        id: `budget-healthy-${budgetData._id}`,
        type: "budget",
        severity: "success",
        title: "Budget On Track",
        message: `${budgetData.name} budget is on track.`,
        actionLabel: "View Budget",
        actionUrl: "/budget",
        createdAt: now,
        read: false,
      });
    }
  });

  return notifications;
}
