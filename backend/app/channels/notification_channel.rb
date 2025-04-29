class NotificationChannel < ApplicationCable::Channel
  def subscribed
    # Verify the user is authenticated
    if current_user
      # Subscribe to a user-specific notification channel
      stream_from "notification_channel_#{current_user.id}"
    else
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  # Handle marking notifications as read
  def mark_read(data)
    # Ensure user is authenticated
    return unless current_user
    
    notification_id = data['notification_id']
    return if notification_id.blank?
    
    # Find the notification and ensure user has access
    notification = current_user.notifications.find_by(id: notification_id)
    return unless notification
    
    # Mark as read if not already read
    if notification.read_at.nil?
      notification.update(read_at: Time.current)
      
      # Broadcast updated read status
      ActionCable.server.broadcast(
        "notification_channel_#{current_user.id}",
        type: 'notification_read',
        notification_id: notification.id
      )
    end
  end
  
  # Handle marking all notifications as read
  def mark_all_read
    # Ensure user is authenticated
    return unless current_user
    
    # Mark all unread notifications as read
    read_time = Time.current
    unread_count = current_user.notifications.where(read_at: nil).count
    current_user.notifications.where(read_at: nil).update_all(read_at: read_time)
    
    # Broadcast updated status
    ActionCable.server.broadcast(
      "notification_channel_#{current_user.id}",
      type: 'all_notifications_read',
      count: unread_count,
      read_at: read_time
    )
  end
end
