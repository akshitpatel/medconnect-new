module Api
  module V1
    class ConversationsController < BaseController
      before_action :authenticate_user!
      before_action :set_conversation, only: [:show, :update, :destroy]
      
      # GET /api/v1/patients/conversations
      def index
        @conversations = current_user.conversations
        
        render json: {
          success: true,
          data: {
            conversations: @conversations.map { |conversation| conversation_response(conversation) }
          },
          message: "Conversations retrieved successfully."
        }, status: :ok
      end
      
      # GET /api/v1/patients/conversations/:id
      def show
        # Mark all unread messages in this conversation as read
        @conversation.messages.where(recipient: current_user, read: false).update_all(read: true)
        
        render json: {
          success: true,
          data: {
            conversation: conversation_response(@conversation, include_messages: true)
          },
          message: "Conversation retrieved successfully."
        }, status: :ok
      end
      
      # POST /api/v1/patients/conversations
      def create
        # Start a new conversation
        provider_id = params[:provider_id]
        provider = User.providers.find_by(id: provider_id)
        
        unless provider
          render json: {
            success: false,
            error: "Provider not found"
          }, status: :not_found
          return
        end
        
        @conversation = Conversation.new(
          title: "Conversation with #{provider.full_name}",
          initiator: current_user
        )
        
        # Add participants
        @conversation.participants << current_user
        @conversation.participants << provider
        
        if @conversation.save
          # Create the initial message
          @message = @conversation.messages.new(
            content: params[:message][:content],
            sender: current_user,
            recipient: provider,
            read: false
          )
          
          if @message.save
            # Notify the provider via ActionCable
            ActionCable.server.broadcast("conversations_#{provider.id}", {
              conversation: conversation_response(@conversation),
              message: message_response(@message)
            })
            
            render json: {
              success: true,
              data: {
                conversation: conversation_response(@conversation, include_messages: true)
              },
              message: "Conversation started successfully."
            }, status: :created
          else
            render json: {
              success: false,
              errors: @message.errors.full_messages
            }, status: :unprocessable_entity
          end
        else
          render json: {
            success: false,
            errors: @conversation.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      private
      
      def set_conversation
        @conversation = current_user.conversations.find_by(id: params[:id])
        
        unless @conversation
          render json: {
            success: false,
            error: "Conversation not found"
          }, status: :not_found
        end
      end
      
      def conversation_response(conversation, include_messages: false)
        response = {
          id: conversation.id,
          title: conversation.title,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          participants: conversation.participants.map do |participant|
            {
              id: participant.id,
              fullName: participant.full_name,
              role: participant.role,
              profilePicture: participant.profile_picture_url
            }
          end,
          unread_count: conversation.messages.where(recipient: current_user, read: false).count,
          last_message: conversation.messages.order(created_at: :desc).first&.content&.truncate(50)
        }
        
        if include_messages
          response[:messages] = conversation.messages.order(created_at: :asc).map { |message| message_response(message) }
        end
        
        response
      end
      
      def message_response(message)
        {
          id: message.id,
          content: message.content,
          created_at: message.created_at,
          read: message.read,
          sender: {
            id: message.sender.id,
            fullName: message.sender.full_name,
            role: message.sender.role
          }
        }
      end
    end
  end
end
