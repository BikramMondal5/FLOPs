import type { NotificationDTO } from "../dto/notification.dto";
import type { CategoryBreakdownItem } from "@/features/analytics/dto/dashboard.dto";

export function generateAINotifications(
  currentCategories: CategoryBreakdownItem[],
  savingsRate: number,
  previousSavingsRate?: number
): NotificationDTO[] {
  const notifications: NotificationDTO[] = [];
  const now = new Date();

  // Check for unusual category spending (top category spending > 40%)
  currentCategories.forEach((cat) => {
    if (cat.percentage > 40) {
      notifications.push({
        id: `ai-high-spending-${cat.category}`,
        type: "ai",
        severity: "warning",
        title: "AI Insight: High Spending Detected",
        message: `${cat.category} expenses are unusually high (${cat.percentage.toFixed(0)}% of total spending).`,
        actionLabel: "View AI Insights",
        actionUrl: "/ai-insights",
        createdAt: now,
        read: false,
      });
    }
  });

  // Check for savings rate drop
  if (previousSavingsRate !== undefined && savingsRate < previousSavingsRate - 10) {
    notifications.push({
      id: `ai-savings-drop-${Date.now()}`,
      type: "ai",
      severity: "warning",
      title: "AI Insight: Savings Rate Decreased",
      message: `Your savings rate decreased from ${previousSavingsRate.toFixed(0)}% to ${savingsRate.toFixed(0)}% this month.`,
      actionLabel: "View AI Insights",
      actionUrl: "/ai-insights",
      createdAt: now,
      read: false,
    });
  }

  // Positive AI insight - high savings rate
  if (savingsRate > 70) {
    notifications.push({
      id: `ai-excellent-savings-${Date.now()}`,
      type: "ai",
      severity: "success",
      title: "AI Insight: Excellent Savings",
      message: `Your savings rate of ${savingsRate.toFixed(0)}% is exceptional! Keep it up.`,
      actionLabel: "View AI Insights",
      actionUrl: "/ai-insights",
      createdAt: now,
      read: false,
    });
  }

  return notifications;
}
