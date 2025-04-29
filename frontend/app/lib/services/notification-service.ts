import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { 
  Notification, 
  NotificationPreferences, 
  NotificationType,
  NotificationPriority
} from '../models/notification';
import { getCurrentUser } from '../auth-utils';

/**
 * Service class for managing notifications
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(notificationData: Omit<Notification, '_id' | 'created_at'>): Promise<Notification> {
    const { db } = await connectToDatabase();
    
    const notification: Notification = {
      ...notificationData,
      is_read: false,
      created_at: new Date(),
    };
    
    const result = await db.collection('notifications').insertOne(notification);
    
    return {
      ...notification,
      _id: result.insertedId,
    };
  }
  
  /**
   * Get a notification by ID
   */
  static async getNotificationById(notificationId: string | ObjectId): Promise<Notification | null> {
    const { db } = await connectToDatabase();
    
    const id = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    
    const notification = await db.collection('notifications').findOne({ _id: id });
    
    return notification as Notification | null;
  }
  
  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(
    userId: string | ObjectId,
    options: {
      limit?: number;
      skip?: number;
      read?: boolean;
      types?: NotificationType[];
    } = {}
  ): Promise<{ notifications: Notification[]; total: number }> {
    const { db } = await connectToDatabase();
    
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const query: any = { user_id: id };
    
    // Filter by read status if specified
    if (options.read !== undefined) {
      query.is_read = options.read;
    }
    
    // Filter by notification types if specified
    if (options.types && options.types.length > 0) {
      query.type = { $in: options.types };
    }
    
    const total = await db.collection('notifications').countDocuments(query);
    
    const notifications = await db
      .collection('notifications')
      .find(query)
      .sort({ created_at: -1 }) // Most recent first
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .toArray();
    
    return {
      notifications: notifications as Notification[],
      total,
    };
  }
  
  /**
   * Mark a notification as read
   */
  static async markNotificationAsRead(notificationId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const id = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    
    const result = await db
      .collection('notifications')
      .updateOne({ _id: id }, { $set: { is_read: true } });
    
    return result.modifiedCount > 0;
  }
  
  /**
   * Mark all notifications as read for a user
   */
  static async markAllNotificationsAsRead(userId: string | ObjectId): Promise<number> {
    const { db } = await connectToDatabase();
    
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const result = await db
      .collection('notifications')
      .updateMany({ user_id: id, is_read: false }, { $set: { is_read: true } });
    
    return result.modifiedCount;
  }
  
  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: string | ObjectId): Promise<boolean> {
    const { db } = await connectToDatabase();
    
    const id = typeof notificationId === 'string' ? new ObjectId(notificationId) : notificationId;
    
    const result = await db.collection('notifications').deleteOne({ _id: id });
    
    return result.deletedCount > 0;
  }
  
  /**
   * Delete all notifications for a user
   */
  static async deleteAllNotifications(userId: string | ObjectId): Promise<number> {
    const { db } = await connectToDatabase();
    
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const result = await db.collection('notifications').deleteMany({ user_id: id });
    
    return result.deletedCount;
  }
  
  /**
   * Get user notification preferences
   */
  static async getUserNotificationPreferences(userId: string | ObjectId): Promise<NotificationPreferences | null> {
    const { db } = await connectToDatabase();
    
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const preferences = await db.collection('notification_preferences').findOne({ user_id: id });
    
    return preferences as NotificationPreferences | null;
  }
  
  /**
   * Create or update user notification preferences
   */
  static async updateUserNotificationPreferences(
    userId: string | ObjectId,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const { db } = await connectToDatabase();
    
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    // Get existing preferences or create default ones
    const existingPreferences = await this.getUserNotificationPreferences(id);
    
    const updatedPreferences: NotificationPreferences = {
      user_id: id,
      created_at: existingPreferences?.created_at || new Date(),
      updated_at: new Date(),
      enabled_channels: {
        web: true,
        email: true,
        push: true,
        sms: false,
        ...existingPreferences?.enabled_channels,
        ...preferences.enabled_channels,
      },
      enabled_types: {
        ...existingPreferences?.enabled_types,
        ...preferences.enabled_types,
      },
      ...(existingPreferences || {}),
      ...preferences,
    };
    
    // Update or insert preferences
    await db.collection('notification_preferences').updateOne(
      { user_id: id },
      { $set: updatedPreferences },
      { upsert: true }
    );
    
    return updatedPreferences;
  }
  
  /**
   * Create default notification preferences for a new user
   */
  static async createDefaultNotificationPreferences(userId: string | ObjectId): Promise<NotificationPreferences> {
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    
    const defaultPreferences: NotificationPreferences = {
      user_id: id,
      enabled_channels: {
        web: true,
        email: true,
        push: true,
        sms: false,
      },
      enabled_types: {
        appointment_reminder: { enabled: true },
        appointment_confirmation: { enabled: true },
        appointment_cancellation: { enabled: true },
        result_available: { enabled: true },
        result_viewed: { enabled: true },
        passport_access: { enabled: true },
        system_alert: { enabled: true },
        recommendation: { enabled: true },
        message: { enabled: true },
      },
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    return this.updateUserNotificationPreferences(id, defaultPreferences);
  }
  
  /**
   * Helper method to create a common notification
   */
  static async sendSystemNotification(
    userId: string | ObjectId,
    title: string,
    message: string,
    options: {
      priority?: NotificationPriority;
      actionUrl?: string;
      relatedEntityType?: string;
      relatedEntityId?: string | ObjectId;
      displayOn?: string[];
      icon?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<Notification> {
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const relatedEntityId = options.relatedEntityId 
      ? (typeof options.relatedEntityId === 'string' ? new ObjectId(options.relatedEntityId) : options.relatedEntityId)
      : undefined;
    
    return this.createNotification({
      user_id: id,
      type: 'system_alert',
      title,
      message,
      is_read: false,
      priority: options.priority || 'medium',
      action_url: options.actionUrl,
      related_entity_type: options.relatedEntityType,
      related_entity_id: relatedEntityId,
      display_on: options.displayOn || ['web', 'email'],
      icon: options.icon,
      expires_at: options.expiresAt,
      delivery_status: {
        web: true,
        email: options.displayOn?.includes('email') || false,
        push: options.displayOn?.includes('push') || false,
        sms: options.displayOn?.includes('sms') || false,
      },
    });
  }
  
  /**
   * Send a notification for a new appointment
   */
  static async sendAppointmentConfirmation(
    userId: string | ObjectId,
    appointmentId: string | ObjectId,
    appointmentInfo: {
      providerName: string;
      appointmentDate: Date;
      imagingType: string;
    }
  ): Promise<Notification> {
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const apptId = typeof appointmentId === 'string' ? new ObjectId(appointmentId) : appointmentId;
    
    const { providerName, appointmentDate, imagingType } = appointmentInfo;
    const formattedDate = appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    
    return this.createNotification({
      user_id: id,
      type: 'appointment_confirmation',
      title: 'Appointment Confirmed',
      message: `Your ${imagingType} appointment with ${providerName} on ${formattedDate} has been confirmed.`,
      is_read: false,
      priority: 'medium',
      action_url: `/appointments/${apptId}`,
      related_entity_type: 'appointment',
      related_entity_id: apptId,
      display_on: ['web', 'email', 'push'],
      icon: 'calendar-check',
      delivery_status: {
        web: true,
        email: true,
        push: true,
      },
    });
  }
  
  /**
   * Send a notification for available imaging results
   */
  static async sendResultAvailableNotification(
    userId: string | ObjectId,
    resultId: string | ObjectId,
    resultInfo: {
      imagingType: string;
      providerName: string;
    }
  ): Promise<Notification> {
    const id = typeof userId === 'string' ? new ObjectId(userId) : userId;
    const rId = typeof resultId === 'string' ? new ObjectId(resultId) : resultId;
    
    const { imagingType, providerName } = resultInfo;
    
    return this.createNotification({
      user_id: id,
      type: 'result_available',
      title: 'Imaging Results Available',
      message: `Your ${imagingType} results from ${providerName} are now available for viewing.`,
      is_read: false,
      priority: 'high',
      action_url: `/results/${rId}`,
      related_entity_type: 'result',
      related_entity_id: rId,
      display_on: ['web', 'email', 'push', 'sms'],
      icon: 'file-medical',
      delivery_status: {
        web: true,
        email: true,
        push: true,
        sms: true,
      },
    });
  }
} 