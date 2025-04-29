class ConversationSerializer
  include JSONAPI::Serializer
  
  attributes :id, :created_at, :updated_at
  
  belongs_to :participant_a, serializer: UserSerializer
  belongs_to :participant_b, serializer: UserSerializer
  has_many :messages, serializer: MessageSerializer
  
  attribute :unread_count do |conversation, params|
    if params && params[:current_user]
      conversation.messages
                 .where.not(sender_id: params[:current_user].id)
                 .where(read_at: nil)
                 .count
    else
      0
    end
  end
  
  attribute :last_message do |conversation|
    last_msg = conversation.messages.order(created_at: :desc).first
    if last_msg
      {
        body: last_msg.body.truncate(50),
        sent_at: last_msg.created_at,
        sender_id: last_msg.sender_id,
        is_read: last_msg.read_at.present?
      }
    else
      nil
    end
  end
  
  attribute :other_participant do |conversation, params|
    if params && params[:current_user]
      other = if conversation.participant_a_id == params[:current_user].id
                conversation.participant_b
              else
                conversation.participant_a
              end
      
      {
        id: other.id,
        name: other.full_name,
        role: other.role
      }
    else
      nil
    end
  end
end
