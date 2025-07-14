module Api
  module V1
    class PasswordsController < Api::V1::BaseController
      skip_before_action :authenticate_user!, only: [:forgot_password, :reset_password]

      # POST /api/v1/auth/forgot-password
      def forgot_password
        user = User.find_by(email: params[:user][:email])
        
        if user
          # Generate reset token
          token = user.send_reset_password_instructions
          
          # In a real application, you would send an email here
          # For now, we'll just return the token for testing
          render json: {
            success: true,
            message: 'Password reset instructions have been sent to your email.',
            data: {
              reset_token: token # Remove this in production
            }
          }
        else
          render json: {
            success: false,
            error: 'Email address not found.'
          }, status: :not_found
        end
      end

      # POST /api/v1/auth/reset-password
      def reset_password
        user = User.reset_password_by_token(
          reset_password_token: params[:user][:reset_password_token],
          password: params[:user][:password],
          password_confirmation: params[:user][:password_confirmation]
        )

        if user.errors.empty?
          render json: {
            success: true,
            message: 'Password has been reset successfully.'
          }
        else
          render json: {
            success: false,
            error: 'Password reset failed.',
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/auth/change-password (requires authentication)
      def change_password
        user = current_user
        
        if user.valid_password?(params[:user][:current_password])
          if user.update(
            password: params[:user][:password],
            password_confirmation: params[:user][:password_confirmation]
          )
            render json: {
              success: true,
              message: 'Password changed successfully.'
            }
          else
            render json: {
              success: false,
              error: 'Password change failed.',
              errors: user.errors.full_messages
            }, status: :unprocessable_entity
          end
        else
          render json: {
            success: false,
            error: 'Current password is incorrect.'
          }, status: :unauthorized
        end
      end
    end
  end
end 