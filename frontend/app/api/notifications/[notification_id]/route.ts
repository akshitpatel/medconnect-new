import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { NotificationService } from '@/app/lib/services/notification-service';

interface Params {
  params: {
    notification_id: string;
  };
}

/**
 * GET /api/notifications/[notification_id]
 * Get a single notification by ID
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notificationId = params.notification_id;
    if (!ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }

    // Get the notification
    const notification = await NotificationService.getNotificationById(notificationId);

    // Check if notification exists
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Check if notification belongs to the user
    if (notification.user_id.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications/[notification_id]
 * Mark a notification as read
 * Body parameters:
 * - action: 'mark_read' (required)
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notificationId = params.notification_id;
    if (!ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }
    
    // Parse request body
    const body = await request.json();
    const { action } = body;

    // Validate action
    if (action !== 'mark_read') {
      return NextResponse.json(
        { error: 'Invalid action. Supported actions: mark_read' },
        { status: 400 }
      );
    }

    // Get the notification to check ownership
    const notification = await NotificationService.getNotificationById(notificationId);

    // Check if notification exists
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Check if notification belongs to the user
    if (notification.user_id.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mark notification as read
    const success = await NotificationService.markNotificationAsRead(notificationId);

    return NextResponse.json({
      message: success ? 'Notification marked as read' : 'Failed to mark notification as read',
      success: success,
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[notification_id]
 * Delete a notification
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notificationId = params.notification_id;
    if (!ObjectId.isValid(notificationId)) {
      return NextResponse.json({ error: 'Invalid notification ID' }, { status: 400 });
    }

    // Get the notification to check ownership
    const notification = await NotificationService.getNotificationById(notificationId);

    // Check if notification exists
    if (!notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Check if notification belongs to the user
    if (notification.user_id.toString() !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete notification
    const success = await NotificationService.deleteNotification(notificationId);

    return NextResponse.json({
      message: success ? 'Notification deleted successfully' : 'Failed to delete notification',
      success: success,
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
} 