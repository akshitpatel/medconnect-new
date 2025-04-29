class MessageSerializer
  include JSONAPI::Serializer
  
  attributes :id, :body, :created_at, :read_at
  
  belongs_to :sender, serializer: UserSerializer
  belongs_to :conversation
  
  attribute :is_read do |message|
    message.read_at.present?
  end
  
  attribute :sender_name do |message|
    message.sender&.full_name
  end
  
  attribute :sender_role do |message|
    message.sender&.role
  end
end
