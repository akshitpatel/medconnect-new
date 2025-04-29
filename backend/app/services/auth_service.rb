class AuthService
  def self.authenticate(email, password)
    user = User.find_by(email: email)
    return nil unless user&.valid_password?(password)
    
    # Generate JWT token
    secret = ENV['HEALCARD_JWT_SECRET_KEY']
    if secret.nil? || secret.strip.empty?
      Rails.logger.error('[AUTH ERROR] ENV["HEALCARD_JWT_SECRET_KEY"] is not set! JWT generation will fail.')
      return nil
    end
    Rails.logger.debug("[AUTH DEBUG] JWT_SECRET (first 8): #{secret[0..7]}")
    Rails.logger.debug("[AUTH DEBUG] JWT_SECRET char codes: #{secret.each_byte.to_a.inspect}")
    Rails.logger.debug("[AUTH DEBUG] JWT_SECRET length: #{secret.length}")
    token = JWT.encode(
      {
        id: user.id,
        exp: 24.hours.from_now.to_i
      },
      secret
    )
    
    {
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  end

  def self.logout(token)
    # In a real application, you might want to blacklist the token
    # or store it in a database to invalidate it
    true
  end
end 