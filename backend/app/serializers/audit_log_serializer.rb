class AuditLogSerializer
  include JSONAPI::Serializer
  
  attributes :id, :action, :resource_type, :resource_id, :changes, :ip_address, :user_agent, :created_at
  
  belongs_to :user, serializer: UserSerializer, optional: true
  
  attribute :user_name do |log|
    log.user&.full_name
  end
  
  attribute :user_role do |log|
    log.user&.role
  end
end
