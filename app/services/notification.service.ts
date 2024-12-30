import { Observable } from '@nativescript/core';
import { Notification, NotificationType } from '../models/notification.model';

export class NotificationService extends Observable {
  private static instance: NotificationService;
  private notifications: Notification[] = [];
  private _unreadCount: number = 0;

  private constructor() {
    super();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.filter(n => n.userId === userId);
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any
  ): Promise<Notification> {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
      userId
    };

    this.notifications.unshift(notification);
    this._unreadCount++;
    this.notifyPropertyChange('unreadCount', this._unreadCount);

    return notification;
  }

  async markAsRead(notificationId: string): Promise<void> {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this._unreadCount--;
      this.notifyPropertyChange('unreadCount', this._unreadCount);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    const userNotifications = this.notifications.filter(n => n.userId === userId && !n.read);
    userNotifications.forEach(n => n.read = true);
    this._unreadCount = 0;
    this.notifyPropertyChange('unreadCount', this._unreadCount);
  }

  get unreadCount(): number {
    return this._unreadCount;
  }
}