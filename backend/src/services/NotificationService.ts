import { Notification } from '../models/Notification';
import { AppError } from '../utils/appError';

export class NotificationService {
  create(payload: {
    user: string;
    channel: 'email' | 'sms' | 'whatsapp' | 'in_app';
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, unknown>;
  }) {
    return Notification.create(payload);
  }

  async markRead(userId: string, id: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId, isDeleted: false },
      { readAt: new Date() },
      { new: true }
    );
    if (!notification) throw new AppError('Notification not found', 404);
    return notification;
  }
}

export const notificationService = new NotificationService();
