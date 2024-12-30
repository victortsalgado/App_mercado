export type NotificationType = 'DEAL' | 'SAVINGS' | 'ALERT' | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  userId: string;
}

export interface NotificationPreferences {
  deals: boolean;
  savings: boolean;
  alerts: boolean;
  system: boolean;
}