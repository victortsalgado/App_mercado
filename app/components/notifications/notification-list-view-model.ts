import { Observable } from '@nativescript/core';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Notification, NotificationType } from '../../models/notification.model';

export class NotificationListViewModel extends Observable {
  private notificationService: NotificationService;
  private authService: AuthService;
  private _notifications: Notification[] = [];

  constructor() {
    super();
    this.notificationService = NotificationService.getInstance();
    this.authService = AuthService.getInstance();
    this.loadNotifications();
  }

  private async loadNotifications() {
    const user = this.authService.currentUser;
    if (!user) return;

    this._notifications = await this.notificationService.getNotifications(user.id);
    this.notifyPropertyChange('notifications', this._notifications);
  }

  get notifications(): Notification[] {
    return this._notifications;
  }

  getTypeIcon(type: NotificationType): string {
    switch (type) {
      case 'DEAL': return '🏷️';
      case 'SAVINGS': return '💰';
      case 'ALERT': return '⚠️';
      case 'SYSTEM': return '🔔';
      default: return '📌';
    }
  }

  async markAllAsRead() {
    const user = this.authService.currentUser;
    if (!user) return;

    await this.notificationService.markAllAsRead(user.id);
    await this.loadNotifications();
  }
}