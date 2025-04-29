class NotificationSerializer
  include JSONAPI::Serializer
  
  attributes :id, :title, :message, :notification_type, :priority, :created_at, :read_at
  
  belongs_to :user, serializer: UserSerializer, optional: true
  
  attribute :is_read do |notification|
    notification.read_at.present?
  end
  
  attribute :user_name do |notification|
    notification.user&.full_name
  end
end
