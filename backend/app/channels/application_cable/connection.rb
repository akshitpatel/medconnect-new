module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private
    
    def find_verified_user
      # Extract token from request headers
      auth_header = request.headers['Authorization']
      return reject_unauthorized_connection unless auth_header
      
      token = auth_header.split(' ').last
      return reject_unauthorized_connection unless token
      
      begin
        # Use the same secret key as the rest of the application
        # Consistent with our fix for JWT verification in ApplicationController
        secret_key = Rails.application.credentials.secret_key_base
        
        # Decode the token
        decoded = JWT.decode(token, secret_key, true, { algorithm: 'HS256' })[0]
        user_id = decoded['id'] || decoded['user_id'] || decoded['sub']
        
        # Find the user
        user = User.find_by(id: user_id)
        return user if user
        
        reject_unauthorized_connection
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        reject_unauthorized_connection
      end
    end
  end
end
