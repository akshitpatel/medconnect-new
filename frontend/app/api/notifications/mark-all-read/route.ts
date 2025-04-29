import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { NotificationService } from '@/app/lib/services/notificationService';

/**
 * POST /api/notifications/mark-all-read
 * Mark all notifications as read for the current user
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

    // Mark all notifications as read
    const count = await NotificationService.markAllAsRead(user.userId);

    return NextResponse.json({
      message: `${count} notifications marked as read`,
      count
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark all notifications as read' },
      { status: 500 }
    );
  }
} 