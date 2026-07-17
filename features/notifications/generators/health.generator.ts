import type { NotificationDTO } from "../dto/notification.dto";
import type { HealthScoreDTO } from "@/features/analytics/dto/dashboard.dto";

export function generateHealthNotifications(health: HealthScoreDTO): NotificationDTO[] {
  const notifications: NotificationDTO[] = [];
  const now = new Date();

  if (health.score === null) {
    return notifications;
  }

  if (health.score >= 80) {
    notifications.push({
      id: `health-excellent-${Date.now()}`,
      type: "health",
      severity: "success",
      title: "Excellent Financial Health",
      message: `Your financial health score is ${health.score}. Keep up the great work!`,
      actionLabel: "View Overview",
      actionUrl: "/overview",
      createdAt: now,
      read: false,
    });
  } else if (health.score < 50) {
    notifications.push({
      id: `health-attention-${Date.now()}`,
      type: "health",
      severity: "critical",
      title: "Financial Health Needs Attention",
      message: `Your financial health score is ${health.score}. Review your spending and savings.`,
      actionLabel: "View Overview",
      actionUrl: "/overview",
      createdAt: now,
      read: false,
    });
  } else if (health.score < 70) {
    notifications.push({
      id: `health-improvement-${Date.now()}`,
      type: "health",
      severity: "warning",
      title: "Financial Health",
      message: `Your financial health score is ${health.score}. There's room for improvement.`,
      actionLabel: "View Overview",
      actionUrl: "/overview",
      createdAt: now,
      read: false,
    });
  }

  return notifications;
}
