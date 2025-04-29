module Api
  module V1
    class MessagesController < BaseController
      before_action :authenticate_user!
      before_action :set_conversation, only: [:show, :create]

      # GET /api/v1/patients/messages
      # Returns a list of conversations for the current user
      def index
        # Get all conversations where the current user is a participant
        @conversations = current_user.conversations
                                   .includes(:participant_a, :participant_b, messages: [:sender])
        
        # Apply pagination
        @conversations = paginate(@conversations)
        
        render json: {
          success: true,
          data: {
            conversations: @conversations.map { |conversation| conversation_to_json(conversation) },
            pagination: pagination_data(@conversations)
          },
          message: "Conversations retrieved successfully."
        }, status: :ok
      end
      
      # GET /api/v1/patients/messages
      # Returns all messages for the current user, focusing on unread ones
      def all
        # Get conversations for the current user
        user_conversations = current_user.conversations
        
        # Get all messages from these conversations where the current user is not the sender
        @messages = Message.where(conversation_id: user_conversations.pluck(:id))
                         .where.not(sender_id: current_user.id)
                         .includes(:sender, :conversation)
                         .order(created_at: :desc)
        
        # Prioritize unread messages
        unread_messages = @messages.where(read_at: nil)
        read_messages = @messages.where.not(read_at: nil).limit(10)
        
        # Apply pagination if needed
        if params[:unread_only] == 'true'
          @messages = paginate(unread_messages)
        else
          @messages = paginate(unread_messages + read_messages)
        end
        
        render json: {
          success: true,
          data: {
            messages: @messages.map { |message| message_to_json(message, include_conversation: true) },
            unread_count: unread_messages.count,
            pagination: pagination_data(@messages)
          },
          message: "Messages retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/patients/messages/:id
      # Returns messages for a specific conversation
      def show
        # Get all messages for the conversation
        @messages = @conversation.messages.includes(:sender).order(created_at: :asc)
        
        # Mark unread messages as read if the current user is the recipient
        mark_messages_as_read
        
        render json: {
          success: true,
          data: {
            conversation: conversation_to_json(@conversation, include_messages: true),
            messages: @messages.map { |message| message_to_json(message) }
          },
          message: "Messages retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/patients/messages
      # Creates a new message in a conversation
      def create
        @message = @conversation.messages.build(message_params)
        @message.sender = current_user
        
        if @message.save
          # Send real-time notification via WebSockets
          send_message_notification(@conversation, @message)
          
          render json: {
            success: true,
            data: { message: message_to_json(@message) },
            message: "Message sent successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @message.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/patients/messages/new_conversation
      # Creates a new conversation with the first message
      def new_conversation
        # Find or create a conversation between current user and recipient
        recipient_id = params[:recipient_id]
        unless User.exists?(recipient_id)
          return render json: {
            success: false,
            error: "Recipient not found."
          }, status: :not_found
        end
        
        # Look for existing conversation
        @conversation = find_or_create_conversation(recipient_id)
        
        # Create the first message
        @message = @conversation.messages.build(message_params)
        @message.sender = current_user
        
        if @message.save
          # Send real-time notification via WebSockets
          send_message_notification(@conversation, @message)
          
          render json: {
            success: true,
            data: { 
              conversation: conversation_to_json(@conversation),
              message: message_to_json(@message)
            },
            message: "Conversation started successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @message.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private
      
      def send_message_notification(conversation, message)
        # Determine the recipient of the message (the other participant)
        recipient_id = if conversation.participant_a_id == current_user.id
                        conversation.participant_b_id
                      else
                        conversation.participant_a_id
                      end
        
        # Broadcast to the message channel for both sender and recipient
        ActionCable.server.broadcast(
          "message_channel_#{current_user.id}",
          {
            type: 'new_message',
            message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
            conversation_id: conversation.id
          }
        )
        
        ActionCable.server.broadcast(
          "message_channel_#{recipient_id}",
          {
            type: 'new_message',
            message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
            conversation_id: conversation.id
          }
        )
        
        # Create a notification in the database for the recipient
        notification = Notification.create!(
          user_id: recipient_id,
          title: "New message from #{current_user.full_name}",
          message: message.body.truncate(50),
          notification_type: 'message',
          priority: 'normal'
        )
        
        # Broadcast to the notification channel for the recipient
        ActionCable.server.broadcast(
          "notification_channel_#{recipient_id}",
          {
            type: 'new_notification',
            notification: NotificationSerializer.new(notification).serializable_hash[:data][:attributes]
          }
        )
      end

      def set_conversation
        @conversation = current_user.conversations.find_by(id: params[:id])
        
        unless @conversation
          render json: {
            success: false,
            error: "Conversation not found or access denied."
          }, status: :not_found
        end
      end

      def find_or_create_conversation(recipient_id)
        # Check for existing conversation (in either direction)
        conversation = Conversation.where(
          "(participant_a_id = ? AND participant_b_id = ?) OR (participant_a_id = ? AND participant_b_id = ?)",
          current_user.id, recipient_id, recipient_id, current_user.id
        ).first
        
        # Create new conversation if none exists
        conversation ||= Conversation.create(
          participant_a_id: current_user.id,
          participant_b_id: recipient_id
        )
        
        conversation
      end

      def mark_messages_as_read
        # Mark messages as read if current user is not the sender
        read_time = Time.current
        unread_messages = @conversation.messages
                          .where.not(sender_id: current_user.id)
                          .where(read_at: nil)
        
        # Get unique sender IDs for notifications
        sender_ids = unread_messages.pluck(:sender_id).uniq
        
        # Update the read status
        unread_messages.update_all(read_at: read_time)
        
        # Notify senders that their messages have been read via WebSockets
        sender_ids.each do |sender_id|
          ActionCable.server.broadcast(
            "message_channel_#{sender_id}",
            {
              type: 'messages_read',
              conversation_id: @conversation.id,
              read_at: read_time,
              reader_id: current_user.id
            }
          )
        end
      end

      def message_params
        params.require(:message).permit(:body)
      end

      def paginate(conversations)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        conversations.order('updated_at DESC').offset((page - 1) * per_page).limit(per_page)
      end

      def pagination_data(conversations)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: current_user.conversations.count,
          total_pages: (current_user.conversations.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def conversation_to_json(conversation, include_messages: false)
        # Determine the other participant (not the current user)
        other_participant = if conversation.participant_a_id == current_user.id
                            conversation.participant_b
                          else
                            conversation.participant_a
                          end
        
        # Get the last message in the conversation
        last_message = conversation.messages.order(created_at: :desc).first
        
        # Calculate unread messages count
        unread_count = conversation.messages
                                   .where.not(sender_id: current_user.id)
                                   .where(read_at: nil)
                                   .count
        
        json = {
          id: conversation.id,
          participant: {
            id: other_participant.id,
            name: other_participant.full_name,
            role: other_participant.role,
            avatar: nil # Placeholder for future implementation
          },
          last_message: last_message ? {
            body: last_message.body.truncate(50),
            sender_id: last_message.sender_id,
            sent_at: last_message.created_at,
            is_read: last_message.read_at.present?
          } : nil,
          unread_count: unread_count,
          updated_at: conversation.updated_at
        }
        
        # Include messages if requested
        if include_messages
          json[:messages] = conversation.messages.order(created_at: :asc).map { |message| message_to_json(message) }
end

# Look for existing conversation
@conversation = find_or_create_conversation(recipient_id)

# Create the first message
@message = @conversation.messages.build(message_params)
@message.sender = current_user

if @message.save
  # Send real-time notification via WebSockets
  send_message_notification(@conversation, @message)
  
  render json: {
    success: true,
    data: { 
      conversation: conversation_to_json(@conversation),
      message: message_to_json(@message)
    },
    message: "Conversation started successfully."
  }, status: :created
else
  render json: {
    success: false,
    errors: @message.errors.full_messages
  }, status: :unprocessable_entity
end
end

def all
  # Get all unread messages for the current user
  unread_messages = current_user.messages.where(read_at: nil)
  
  # Render the unread messages
  render json: {
    success: true,
    data: unread_messages.map { |message| message_to_json(message) }
  }
end

private

def send_message_notification(conversation, message)
# Determine the recipient of the message (the other participant)
recipient_id = if conversation.participant_a_id == current_user.id
                conversation.participant_b_id
              else
                conversation.participant_a_id
              end

# Broadcast to the message channel for both sender and recipient
ActionCable.server.broadcast(
  "message_channel_#{current_user.id}",
  {
    type: 'new_message',
    message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
    conversation_id: conversation.id
  }
)

ActionCable.server.broadcast(
  "message_channel_#{recipient_id}",
  {
    type: 'new_message',
    message: MessageSerializer.new(message).serializable_hash[:data][:attributes],
    conversation_id: conversation.id
  }
)

# Create a notification in the database for the recipient
notification = Notification.create!(
  user_id: recipient_id,
  title: "New message from #{current_user.full_name}",
  message: message.body.truncate(50),
  notification_type: 'message',
  priority: 'normal'
)

# Broadcast to the notification channel for the recipient
ActionCable.server.broadcast(
  "notification_channel_#{recipient_id}",
  {
    type: 'new_notification',
    notification: NotificationSerializer.new(notification).serializable_hash[:data][:attributes]
  }
)
end

def set_conversation
@conversation = current_user.conversations.find_by(id: params[:id])

unless @conversation
  render json: {
    success: false,
    error: "Conversation not found or access denied."
  }, status: :not_found
end
end

def find_or_create_conversation(recipient_id)
# Check for existing conversation (in either direction)
conversation = Conversation.where(
  "(participant_a_id = ? AND participant_b_id = ?) OR (participant_a_id = ? AND participant_b_id = ?)",
  current_user.id, recipient_id, recipient_id, current_user.id
).first

# Create new conversation if none exists
conversation ||= Conversation.create(
  participant_a_id: current_user.id,
  participant_b_id: recipient_id
)

conversation
end

def mark_messages_as_read
# Mark messages as read if current user is not the sender
read_time = Time.current
unread_messages = @conversation.messages
                  .where.not(sender_id: current_user.id)
                  .where(read_at: nil)

# Get unique sender IDs for notifications
sender_ids = unread_messages.pluck(:sender_id).uniq

# Update the read status
unread_messages.update_all(read_at: read_time)

# Notify senders that their messages have been read via WebSockets
sender_ids.each do |sender_id|
  ActionCable.server.broadcast(
    "message_channel_#{sender_id}",
    {
      type: 'messages_read',
      conversation_id: @conversation.id,
      read_at: read_time,
      reader_id: current_user.id
    }
  )
end
end

def message_params
params.require(:message).permit(:body)
end

def paginate(conversations)
page = (params[:page] || 1).to_i
per_page = (params[:per_page] || 10).to_i
conversations.order('updated_at DESC').offset((page - 1) * per_page).limit(per_page)
end

def pagination_data(conversations)
{
  current_page: (params[:page] || 1).to_i,
  per_page: (params[:per_page] || 10).to_i,
  total_items: current_user.conversations.count,
  total_pages: (current_user.conversations.count.to_f / (params[:per_page] || 10).to_i).ceil
}
end

def conversation_to_json(conversation, include_messages: false)
# Determine the other participant (not the current user)
other_participant = if conversation.participant_a_id == current_user.id
                    conversation.participant_b
                  else
                    conversation.participant_a
                  end

# Get the last message in the conversation
last_message = conversation.messages.order(created_at: :desc).first

# Calculate unread messages count
unread_count = conversation.messages
                               .where.not(sender_id: current_user.id)
                               .where(read_at: nil)
                               .count

json = {
  id: conversation.id,
  participant: {
    id: other_participant.id,
    name: other_participant.full_name,
    role: other_participant.role,
    avatar: nil # Placeholder for future implementation
  },
  last_message: last_message ? {
    body: last_message.body.truncate(50),
    sender_id: last_message.sender_id,
    sent_at: last_message.created_at,
    is_read: last_message.read_at.present?
  } : nil,
  unread_count: unread_count,
  updated_at: conversation.updated_at
}

# Include messages if requested
if include_messages
  json[:messages] = conversation.messages.order(created_at: :asc).map { |message| message_to_json(message) }
end

json
end

      def message_to_json(message, include_conversation: false)
        json = {
          id: message.id,
          content: message.body,  
          created_at: message.created_at,
          updated_at: message.updated_at,
          read: message.read_at.present?,  
          sender: {
            id: message.sender.id,
            fullName: message.sender.full_name,
            role: message.sender.role,
            avatar: message.sender.avatar_url
          }
        }
        
        if include_conversation
          json[:conversation] = {
            id: message.conversation.id,
            title: message.conversation.title || "Conversation with #{message.sender.full_name}"
          }
        end
        
        json
      end
    end
  end
end
