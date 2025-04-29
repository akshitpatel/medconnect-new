module Api
  module V1
    class RegistrationsController < Devise::RegistrationsController
      protect_from_forgery with: :null_session
      respond_to :json
      
      # POST /api/v1/auth/register
      def create
        build_resource(sign_up_params)
        resource.save
        
        if resource.persisted?
          sign_up(resource_name, resource)
          
          render json: {
            success: true,
            data: { user: UserSerializer.new(resource).serializable_hash[:data][:attributes] },
            message: 'Signed up successfully'
          }, status: :created
        else
          clean_up_passwords resource
          set_minimum_password_length
          
          render json: {
            success: false,
            error: 'User registration failed',
            errors: resource.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      private
      
      def sign_up_params
        params.permit(
          :full_name, 
          :email, 
          :password, 
          :phone, 
          :date_of_birth,
          :gender,
          :address,
          :passport_number
        )
      end
    end
  end
end 