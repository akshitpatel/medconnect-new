import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { NotificationService } from '@/app/lib/services/notificationService';
import { NotificationType } from '@/app/lib/models/notification';

/**
 * GET /api/notifications
 * Get notifications for the current user
 * Query parameters:
 * - limit: number of notifications to return (default: 10)
 * - skip: number of notifications to skip (default: 0)
 * - read: filter by read status (true, false, or undefined for all)
 */
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = parseInt(searchParams.get('skip') || '0');
    
    // Parse read filter
    let readFilter: boolean | undefined = undefined;
    if (searchParams.has('read')) {
      const readParam = searchParams.get('read');
      if (readParam === 'true') readFilter = true;
      if (readParam === 'false') readFilter = false;
    }

    // Get notifications
    const result = await NotificationService.getNotifications(
      user.userId,
      limit,
      skip,
      readFilter
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification
 * Body parameters:
 * - userId: ID of the user to create the notification for (admin only)
 * - title: notification title
 * - message: notification message
 * - type: notification type
 * - actionUrl: optional URL to navigate to when clicking the notification
 * - metadata: optional additional data for the notification
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admins can create notifications for other users
    const isAdmin = user.role === 'admin';

    // Parse request body
    const body = await request.json();
    const {
      userId,
      title,
      message,
      type,
      actionUrl,
      metadata
    } = body;

    // Validate required fields
    if (!title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message, type' },
        { status: 400 }
      );
    }

    // Validate notification type
    const validTypes = ['appointment_confirmation', 'appointment_reminder', 'appointment_cancelled', 
                        'appointment_rescheduled', 'result_available', 'prescription_renewed', 
                        'message_received', 'system_alert', 'payment_processed', 'payment_failed'];
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
    }

    // Determine target user ID
    const targetUserId = userId && isAdmin ? userId : user.userId;

    // Create notification
    const notification = await NotificationService.createNotification(
      targetUserId,
      title,
      message,
      type as NotificationType,
      actionUrl,
      metadata
    );

    return NextResponse.json(
      { message: 'Notification created successfully', notification },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Delete all notifications for the current user
 */
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all notifications
    const deletedCount = await NotificationService.deleteAllNotifications(user.userId);

    return NextResponse.json({
      message: `${deletedCount} notifications deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: 'Failed to delete notifications' },
      { status: 500 }
    );
  }
} 