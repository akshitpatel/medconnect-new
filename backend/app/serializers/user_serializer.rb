class UserSerializer
  include JSONAPI::Serializer
  
  attributes :id, :email, :full_name, :phone, :date_of_birth, :gender, 
             :address, :passport_number, :role, :created_at, :updated_at
  
  attribute :token do |user, params|
    params[:token] if params&.key?(:token)
  end
end 