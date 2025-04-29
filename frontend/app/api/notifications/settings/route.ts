import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/lib/auth-utils';
import { NotificationService } from '@/app/lib/services/notificationService';

/**
 * GET /api/notifications/settings
 * Get notification preferences for the current user
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

    // Get notification preferences
    const settings = await NotificationService.getNotificationPreferences(user.userId);

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to get notification settings' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/settings
 * Update notification preferences for the current user
 * Body parameters:
 * - settings: notification preferences object
 */
export async function PUT(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { settings } = body;

    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings object' },
        { status: 400 }
      );
    }

    // Update notification preferences
    const updatedSettings = await NotificationService.updateNotificationPreferences(
      user.userId,
      settings
    );

    return NextResponse.json({
      message: 'Notification settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    );
  }
} 