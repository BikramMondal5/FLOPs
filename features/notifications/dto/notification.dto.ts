export type NotificationType = "budget" | "goal" | "report" | "health" | "ai" | "system";

export type NotificationSeverity = "info" | "success" | "warning" | "critical";

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: Date;
  read: boolean;
}

export interface NotificationSummaryDTO {
  totalUnread: number;
  notifications: NotificationDTO[];
}
