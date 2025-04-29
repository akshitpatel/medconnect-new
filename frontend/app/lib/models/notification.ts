import { Document, ObjectId } from 'mongodb';

/**
 * Notification types
 * Represents different types of notifications in the system
 */
export type NotificationType = 
  | 'appointment_confirmation'
  | 'appointment_reminder'
  | 'appointment_cancelled'
  | 'appointment_cancellation'
  | 'appointment_rescheduled'
  | 'result_available'
  | 'result_viewed'
  | 'prescription_renewed'
  | 'message_received'
  | 'system_alert'
  | 'payment_processed'
  | 'payment_failed'
  | 'passport_access';

/**
 * Notification interface
 * Represents a notification in the system
 */
export interface Notification extends Document {
  _id?: ObjectId;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

/**
 * NotificationPreferences interface
 * Represents user preferences for notifications
 */
export interface NotificationPreferences extends Document {
  _id?: ObjectId;
  user_id: string;
  appointments: {
    email: boolean;
    inApp: boolean;
  };
  results: {
    email: boolean;
    inApp: boolean;
  };
  reminders: {
    email: boolean;
    inApp: boolean;
  };
  system: {
    email: boolean;
    inApp: boolean;
  };
  created_at: Date;
  updated_at: Date;
}

/**
 * Default notification preferences
 * Used when a user hasn't set their preferences
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: Omit<NotificationPreferences, '_id' | 'user_id' | 'created_at' | 'updated_at'> = {
  appointments: {
    email: true,
    inApp: true
  },
  results: {
    email: true,
    inApp: true
  },
  reminders: {
    email: true,
    inApp: true
  },
  system: {
    email: false,
    inApp: true
  }
};

/**
 * Priority levels for notifications
 */
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Interface for notification data
 */
export interface NotificationData {
  _id?: ObjectId;
  user_id: ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  is_read: boolean;
  action_url?: string;
  related_entity_type?: string; // e.g., 'appointment', 'result', 'passport'
  related_entity_id?: ObjectId; // ID of the related entity
  created_at: Date;
  expires_at?: Date; // Date when notification should expire
  icon?: string; // Icon to display with the notification
  display_on: string[]; // Where to display: 'web', 'email', 'push', 'sms'
  delivery_status: {
    web: boolean; // Delivered to web app
    email?: boolean; // Delivered via email
    push?: boolean; // Delivered via push notification
    sms?: boolean; // Delivered via SMS
  };
  metadata?: Record<string, any>; // Additional data specific to the notification type
}

/**
 * Interface for real-time notification events
 */
export interface NotificationEvent {
  event: 'notification_created' | 'notification_updated' | 'notification_read' | 'notification_deleted';
  notification: NotificationData;
}

/**
 * Interface for notification batch for offline sync
 */
export interface NotificationBatch {
  user_id: ObjectId;
  notifications: NotificationData[];
  last_synced: Date;
} 