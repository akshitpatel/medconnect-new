module Api
  module V1
    class AuthController < Api::V1::BaseController
      skip_before_action :authenticate_user!, only: [:create, :login]

      def create
        user = User.new(user_params)
        
        if user.save
          sign_in(user)
          render json: {
            success: true,
            data: {
              token: request.env['warden-jwt_auth.token'],
              user: UserSerializer.new(user).serializable_hash[:data][:attributes]
            },
            message: 'User registered successfully'
          }, status: :created
        else
          render json: { 
            success: false,
            errors: user.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])
        
        if user&.valid_password?(params[:password])
          sign_in(user)
          render json: {
            success: true,
            data: {
              token: request.env['warden-jwt_auth.token'],
              user: UserSerializer.new(user).serializable_hash[:data][:attributes]
            },
            message: 'Logged in successfully'
          }
        else
          render json: { 
            success: false,
            message: 'Invalid email or password'
          }, status: :unauthorized
        end
      end

      def logout
        sign_out(current_user)
        render json: { 
          success: true,
          message: 'Logged out successfully'
        }
      end

      private

      def user_params
        params.require(:user).permit(:full_name, :email, :password, :password_confirmation, :phone, :date_of_birth)
      end
    end
  end
end 