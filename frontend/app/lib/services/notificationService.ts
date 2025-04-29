import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../mongodb';
import { Notification, NotificationType, NotificationPreferences, DEFAULT_NOTIFICATION_PREFERENCES } from '../models/notification';

/**
 * NotificationService
 * Service for managing user notifications
 */
export class NotificationService {
  /**
   * Get MongoDB collection
   * @param collectionName - The name of the collection
   * @returns The MongoDB collection
   */
  private static async getCollection(collectionName: string) {
    const { db } = await connectToDatabase();
    return db.collection(collectionName);
  }

  /**
   * Create a new notification
   * @param userId - The user ID to create the notification for
   * @param title - The notification title
   * @param message - The notification message
   * @param type - The notification type
   * @param actionUrl - Optional URL to navigate to when clicking the notification
   * @param metadata - Optional additional data for the notification
   * @returns The created notification
   */
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    actionUrl?: string,
    metadata?: Record<string, any>
  ): Promise<Notification> {
    const notificationsCollection = await this.getCollection('notifications');
    
    const now = new Date();
    const notification: Notification = {
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
      action_url: actionUrl,
      metadata,
      created_at: now,
      updated_at: now
    };
    
    const result = await notificationsCollection.insertOne(notification);
    return { ...notification, _id: result.insertedId };
  }

  /**
   * Get notifications for a user
   * @param userId - The user ID to get notifications for
   * @param limit - The maximum number of notifications to return
   * @param skip - The number of notifications to skip
   * @param readFilter - Filter by read status (undefined for all)
   * @returns The notifications and count information
   */
  static async getNotifications(
    userId: string,
    limit: number = 10,
    skip: number = 0,
    readFilter?: boolean
  ): Promise<{ notifications: Notification[]; total: number; unread: number; pages: number }> {
    const notificationsCollection = await this.getCollection('notifications');
    
    // Build query
    const query: any = { user_id: userId };
    if (readFilter !== undefined) {
      query.is_read = readFilter;
    }
    
    // Get total and unread counts
    const total = await notificationsCollection.countDocuments({ user_id: userId });
    const unread = await notificationsCollection.countDocuments({ user_id: userId, is_read: false });
    
    // Get notifications
    const notifications = await notificationsCollection
      .find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray() as Notification[];
    
    const pages = Math.ceil(total / limit);
    
    return { notifications, total, unread, pages };
  }

  /**
   * Mark a notification as read
   * @param notificationId - The notification ID to mark as read
   * @param userId - The user ID who owns the notification
   * @returns True if successful, false otherwise
   */
  static async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    const notificationsCollection = await this.getCollection('notifications');
    
    const result = await notificationsCollection.updateOne(
      { _id: new ObjectId(notificationId), user_id: userId },
      { $set: { is_read: true, updated_at: new Date() } }
    );
    
    return result.modifiedCount > 0;
  }

  /**
   * Mark all notifications as read for a user
   * @param userId - The user ID to mark all notifications as read for
   * @returns The number of notifications marked as read
   */
  static async markAllAsRead(userId: string): Promise<number> {
    const notificationsCollection = await this.getCollection('notifications');
    
    const result = await notificationsCollection.updateMany(
      { user_id: userId, is_read: false },
      { $set: { is_read: true, updated_at: new Date() } }
    );
    
    return result.modifiedCount;
  }

  /**
   * Delete a notification
   * @param notificationId - The notification ID to delete
   * @param userId - The user ID who owns the notification
   * @returns True if successful, false otherwise
   */
  static async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const notificationsCollection = await this.getCollection('notifications');
    
    const result = await notificationsCollection.deleteOne({
      _id: new ObjectId(notificationId),
      user_id: userId
    });
    
    return result.deletedCount > 0;
  }

  /**
   * Get notification preferences for a user
   * @param userId - The user ID to get preferences for
   * @returns The user's notification preferences
   */
  static async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const preferencesCollection = await this.getCollection('notification_preferences');
    
    const preferences = await preferencesCollection.findOne({ user_id: userId }) as NotificationPreferences | null;
    
    if (!preferences) {
      // Return default preferences if none exist
      const defaultPreferences: NotificationPreferences = {
        user_id: userId,
        appointments: DEFAULT_NOTIFICATION_PREFERENCES.appointments,
        results: DEFAULT_NOTIFICATION_PREFERENCES.results,
        reminders: DEFAULT_NOTIFICATION_PREFERENCES.reminders,
        system: DEFAULT_NOTIFICATION_PREFERENCES.system,
        created_at: new Date(),
        updated_at: new Date()
      };
      return defaultPreferences;
    }
    
    return preferences;
  }

  /**
   * Update notification preferences for a user
   * @param userId - The user ID to update preferences for
   * @param preferences - The new preferences
   * @returns The updated preferences
   */
  static async updateNotificationPreferences(
    userId: string,
    preferences: Partial<Omit<NotificationPreferences, '_id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<NotificationPreferences> {
    const preferencesCollection = await this.getCollection('notification_preferences');
    
    const existingPreferences = await this.getNotificationPreferences(userId);
    const now = new Date();
    
    const updatedPreferences = {
      ...existingPreferences,
      ...preferences,
      updated_at: now
    };
    
    if (existingPreferences._id) {
      // Update existing preferences
      await preferencesCollection.updateOne(
        { _id: existingPreferences._id },
        { $set: { ...preferences, updated_at: now } }
      );
    } else {
      // Create new preferences
      const result = await preferencesCollection.insertOne({
        user_id: userId,
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...preferences,
        created_at: now,
        updated_at: now
      });
      
      updatedPreferences._id = result.insertedId;
    }
    
    return updatedPreferences;
  }
} 