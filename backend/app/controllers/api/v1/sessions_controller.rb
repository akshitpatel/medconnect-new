module Api
  module V1
    class SessionsController < Devise::SessionsController
      protect_from_forgery with: :null_session
      respond_to :json
      
      # POST /api/v1/auth/login
      def create
        user = User.find_by(email: sign_in_params[:email])
        
        if user && user.valid_password?(sign_in_params[:password])
          sign_in(user)
          
          # Set token expiry based on remember_me parameter
          expiry = params[:remember_me] ? 1.month.from_now : 1.day.from_now
          
          render json: {
            success: true,
            data: {
              token: request.env['warden-jwt_auth.token'],
              user: UserSerializer.new(user).serializable_hash[:data][:attributes]
            },
            message: 'Logged in successfully'
          }, status: :ok
        else
          render json: { 
            success: false,
            message: 'Invalid email or password'
          }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/auth/logout
      def destroy
        jwt_payload = request.headers['Authorization'].to_s.split(' ').last
        JwtDenylist.create!(jti: JWT.decode(jwt_payload, nil, false).first['jti'], exp: Time.now)
        
        sign_out(current_user)
        render json: { success: true }, status: :ok
      end
      
      # POST /api/v1/auth/provider/signin
      def provider_signin
        user = User.find_by(email: sign_in_params[:email])
        
        if user && user.valid_password?(sign_in_params[:password]) && user.provider?
          sign_in(user)
          render json: {
            success: true,
            data: {
              token: request.env['warden-jwt_auth.token'],
              provider: UserSerializer.new(user).serializable_hash[:data][:attributes]
            },
            message: 'Provider signed in successfully'
          }, status: :ok
        else
          render json: { 
            success: false,
            message: 'Invalid provider credentials'
          }, status: :unauthorized
        end
      end
      
      private
      
      def sign_in_params
        params.permit(:email, :password)
      end
      
      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end 