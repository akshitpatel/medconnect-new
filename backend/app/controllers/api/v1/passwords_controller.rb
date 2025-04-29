module Api
  module V1
    class PasswordsController < Devise::PasswordsController
      protect_from_forgery with: :null_session
      respond_to :json
      
      # POST /api/v1/auth/forgot-password
      def create
        self.resource = resource_class.send_reset_password_instructions(resource_params)
        
        if successfully_sent?(resource)
          render json: { 
            success: true, 
            message: 'Reset password instructions sent to your email'
          }, status: :ok
        else
          render json: { 
            success: false, 
            error: 'Failed to send reset instructions',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # POST /api/v1/auth/reset-password
      def update
        self.resource = resource_class.reset_password_by_token(resource_params)
        
        if resource.errors.empty?
          sign_in(resource_name, resource)
          
          render json: { 
            success: true, 
            message: 'Password updated successfully',
            data: { user: UserSerializer.new(resource).serializable_hash[:data][:attributes] }
          }, status: :ok
        else
          render json: { 
            success: false, 
            error: 'Failed to reset password',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      private
      
      def resource_params
        params.permit(:email, :password, :password_confirmation, :reset_password_token)
      end
    end
  end
end 