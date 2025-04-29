class MessageChannel < ApplicationCable::Channel
  def subscribed
    # Verify the user is authenticated
    if current_user
      # Subscribe to a user-specific channel for receiving messages
      stream_from "message_channel_#{current_user.id}"
    else
      reject
    end
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  # Handle sending messages
  def send_message(data)
    # Ensure user is authenticated
    return unless current_user
    
    # Extract message data
    conversation_id = data['conversation_id']
    body = data['body']
    
    # Basic validation
    return if conversation_id.blank? || body.blank?
    
    # Find the conversation and ensure user has access
    conversation = current_user.conversations.find_by(id: conversation_id)
    return unless conversation
    
    # Create the message
    message = conversation.messages.create!(
      sender: current_user,
      body: body
    )
    
    # Determine the other participant
    recipient_id = if conversation.participant_a_id == current_user.id
                    conversation.participant_b_id
                  else
                    conversation.participant_a_id
                  end
    
    # Broadcast to both sender and recipient
    ActionCable.server.broadcast(
      "message_channel_#{current_user.id}",
      message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
      conversation_id: conversation.id
    )
    
    ActionCable.server.broadcast(
      "message_channel_#{recipient_id}",
      message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
      conversation_id: conversation.id
    )
    
    # Create a notification for the recipient
    Notification.create!(
      user_id: recipient_id,
      title: "New message from #{current_user.full_name}",
      message: body.truncate(50),
      notification_type: 'message',
      priority: 'normal'
    )
    
    # Broadcast to the notification channel for the recipient
    ActionCable.server.broadcast(
      "notification_channel_#{recipient_id}",
      type: 'new_message',
      message: "New message from #{current_user.full_name}"
    )
  end
  
  # Handle marking messages as read
  def mark_read(data)
    # Ensure user is authenticated
    return unless current_user
    
    conversation_id = data['conversation_id']
    return if conversation_id.blank?
    
    # Find the conversation and ensure user has access
    conversation = current_user.conversations.find_by(id: conversation_id)
    return unless conversation
    
    # Mark all unread messages from other participants as read
    read_time = Time.current
    unread_messages = conversation.messages
                                 .where.not(sender_id: current_user.id)
                                 .where(read_at: nil)
    
    # Update read status
    unread_messages.update_all(read_at: read_time)
    
    # Notify the sender that their messages have been read
    sender_ids = unread_messages.select(:sender_id).distinct.pluck(:sender_id)
    
    sender_ids.each do |sender_id|
      ActionCable.server.broadcast(
        "message_channel_#{sender_id}",
        type: 'messages_read',
        conversation_id: conversation.id,
        read_at: read_time,
        reader_id: current_user.id
      )
    end
  end
end
