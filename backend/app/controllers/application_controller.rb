class ApplicationController < ActionController::API
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email, :password, :password_confirmation])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :email, :password, :password_confirmation])
  end

  # JWT-based authentication for API
  def authenticate_user!
    unless user_signed_in?
      Rails.logger.warn("[AUTH] User not signed in. Headers: #{request.headers['Authorization']}")
      render json: { 
        success: false,
        error: 'Authentication required. Please log in to continue.',
        code: 'AUTHENTICATION_REQUIRED'
      }, status: :unauthorized
    end
  end

  # JWT-based authentication for API
  def current_user
    # Return existing user if already set to avoid redundant processing
    return @current_user if defined?(@current_user) && !@current_user.nil?
    
    # Initialize to nil as default return value
    @current_user = nil
    
    begin
      # Extract token from Authorization header
      auth_header = request.headers['Authorization'].to_s
      
      # Always log the current path to help debug route issues
      Rails.logger.info("[ROUTE] Processing request for path: #{request.path}, method: #{request.method}")
      
      if auth_header.empty?
        Rails.logger.info("[AUTH] No valid Authorization header present")
        return nil
      end
      
      # Extract token, handling both with and without 'Bearer ' prefix
      token = auth_header.start_with?('Bearer ') ? auth_header.split(' ').last.to_s : auth_header
      
      if token.empty?
        Rails.logger.info("[AUTH] JWT token is blank or malformed")
        return nil
      end
      
      # Use Rails secret key from credentials
      secret_key = Rails.application.credentials.secret_key_base.to_s
      
      if secret_key.empty?
        Rails.logger.error("[AUTH] Secret key is blank! JWT verification will fail.")
        return nil
      end
      
      # Log truncated token for debugging (don't log full token for security)
      token_start = token[0..4] rescue 'error'
      token_end = token[-5..-1] rescue 'error'
      Rails.logger.info("[AUTH] Processing token: #{token_start}...#{token_end}")
      
      # Decode JWT token with proper error handling
      decoded = nil
      begin
        # Always decode using the same algorithm as encoding
        decoded = JWT.decode(token, secret_key, true, { algorithm: 'HS256' })
      rescue JWT::ExpiredSignature
        Rails.logger.error("[AUTH] JWT token has expired")
        return nil
      rescue JWT::VerificationError
        Rails.logger.error("[AUTH] JWT verification failed")
        return nil
      rescue JWT::DecodeError => e
        Rails.logger.error("[AUTH] JWT decode error: #{e.message}")
        return nil
      rescue => e
        Rails.logger.error("[AUTH] Unexpected JWT error: #{e.class.name} - #{e.message}")
        return nil
      end
      
      # Validate decoded structure
      unless decoded.is_a?(Array) && decoded.length > 0 && decoded[0].is_a?(Hash)
        Rails.logger.error("[AUTH] Invalid JWT structure: #{decoded.inspect}")
        return nil
      end
      
      # Extract payload safely
      payload = decoded[0]
      
      # Extract user ID with comprehensive key checking
      user_id = nil
      ['id', :id, 'user_id', :user_id, 'sub', :sub].each do |key|
        if payload.key?(key) && !payload[key].to_s.strip.empty?
          user_id = payload[key]
          Rails.logger.info("[AUTH] Found user_id '#{user_id}' using key '#{key}'")
          break
        end
      end
      
      # Handle missing user ID
      if user_id.nil?
        Rails.logger.warn("[AUTH] No user ID found in JWT payload. Keys: #{payload.keys.join(', ')}")
        return nil
      end
      
      # Find user safely
      begin
        @current_user = User.find_by(id: user_id)
        
        if @current_user.nil?
          Rails.logger.error("[AUTH] User not found for id: #{user_id}")
          return nil
        end
        
        Rails.logger.info("[AUTH] Successfully authenticated user: #{@current_user.email}")
        return @current_user
      rescue => e
        Rails.logger.error("[AUTH] Error finding user: #{e.class.name} - #{e.message}")
        return nil
      end
    rescue => e
      # Final fallback for any unexpected errors
      Rails.logger.error("[AUTH] Critical error in current_user method: #{e.class.name} - #{e.message}")
      Rails.logger.error("[AUTH] #{e.backtrace[0..2].join("\n")}")
      return nil
    end
  end

  def user_signed_in?
    current_user.present?
  end
end
