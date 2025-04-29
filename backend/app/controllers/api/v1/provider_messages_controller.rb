module Api
  module V1
    class ProviderMessagesController < BaseController
      before_action :authenticate_user!
      before_action :authorize_provider!
      before_action :set_conversation, only: [:show, :create]

      # GET /api/v1/providers/messages
      # Returns a list of conversations for the current provider
      def index
        # Get all conversations where the current provider is a participant
        @conversations = current_user.conversations
                                   .includes(:participant_a, :participant_b, messages: [:sender])
        
        # Apply filters if needed
        @conversations = filter_conversations(@conversations) if params[:patient_id].present?
        
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

      # GET /api/v1/providers/messages/:id
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

      # POST /api/v1/providers/messages
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

      # POST /api/v1/providers/messages/new_conversation
      # Creates a new conversation with the first message
      def new_conversation
        # Find or create a conversation between current provider and patient
        patient_id = params[:patient_id]
        
        # Validate patient exists
        unless User.where(id: patient_id, role: 'patient').exists?
          return render json: {
            success: false,
            error: "Patient not found."
          }, status: :not_found
        end
        
        # Look for existing conversation
        @conversation = find_or_create_conversation(patient_id)
        
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
          title: "New message from Dr. #{current_user.full_name}",
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

      def authorize_provider!
        unless current_user.provider?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
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

      def filter_conversations(conversations)
        # Filter conversations by patient ID
        if params[:patient_id].present?
          patient_id = params[:patient_id]
          conversations.where("participant_a_id = ? OR participant_b_id = ?", patient_id, patient_id)
        else
          conversations
        end
      end

      def find_or_create_conversation(patient_id)
        # Check for existing conversation (in either direction)
        conversation = Conversation.where(
          "(participant_a_id = ? AND participant_b_id = ?) OR (participant_a_id = ? AND participant_b_id = ?)",
          current_user.id, patient_id, patient_id, current_user.id
        ).first
        
        # Create new conversation if none exists
        conversation ||= Conversation.create(
          participant_a_id: current_user.id,
          participant_b_id: patient_id
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
        
        # We only show conversations with patients for providers
        if other_participant.provider?
          return nil # Skip this conversation as it's between providers
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
          patient: {
            id: other_participant.id,
            name: other_participant.full_name,
            avatar: nil, # Placeholder for future implementation
            online: false, # Placeholder for online status (future implementation)
            last_appointment: get_last_appointment(other_participant.id)
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

      def message_to_json(message)
        {
          id: message.id,
          conversation_id: message.conversation_id,
          sender_id: message.sender_id,
          sender_name: message.sender.full_name,
          sender_role: message.sender.role,
          body: message.body,
          is_read: message.read_at.present?,
          created_at: message.created_at
        }
      end
      
      def get_last_appointment(patient_id)
        appointment = current_user.appointments_as_provider
                                 .where(patient_id: patient_id)
                                 .order(appointment_datetime: :desc)
                                 .first
        
        appointment ? {
          date: appointment.appointment_datetime.to_date,
          reason: appointment.reason
        } : nil
      end
    end
  end
end
