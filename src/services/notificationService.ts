import { Notification } from '@/types';
import { localStorage } from '@/utils/localStorage';
import { generateId } from '@/utils/helpers';

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return localStorage.getNotifications();
  }

  async createNotification(notificationData: Partial<Notification>): Promise<Notification> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const notifications = localStorage.getNotifications();
    const newNotification: Notification = {
      id: generateId(),
      title: notificationData.title || '',
      message: notificationData.message || '',
      type: notificationData.type || 'info',
      targetRole: notificationData.targetRole,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    
    notifications.unshift(newNotification);
    localStorage.setNotifications(notifications);
    
    return newNotification;
  }

  async markAsRead(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const notifications = localStorage.getNotifications();
    const notification = notifications.find((n: Notification) => n.id === id);
    
    if (notification) {
      notification.isRead = true;
      localStorage.setNotifications(notifications);
    }
  }
}

export const notificationService = new NotificationService();