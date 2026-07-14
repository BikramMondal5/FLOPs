export type NotificationType = "Budget" | "Goal" | "CashFlow" | "System";
export type NotificationSeverity = "info" | "warning" | "critical";

export interface NotificationDTO {
  id: string; // unique hash or id
  type: NotificationType;
  severity: NotificationSeverity;
  message: string;
  targetId?: string; // ID of target budget, goal, or account
  isRead: boolean;
  createdAt: string;
}

export interface NotificationReadRecord {
  userId: string;
  notificationId: string;
  readAt: string;
}
