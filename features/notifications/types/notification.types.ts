export interface INotificationReadStatus {
  _id: string;
  userId: string;
  notificationId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationReadStatusDTO extends INotificationReadStatus {}
