module Api
  module V1
    class BaseController < ApplicationController
      before_action :authenticate_user!
      respond_to :json
      
      # Common error handling for API controllers
      rescue_from ActiveRecord::RecordNotFound, with: :not_found
      rescue_from ActionController::ParameterMissing, with: :bad_request
      rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity

      private

      def not_found(exception)
        render json: { success: false, error: exception.message }, status: :not_found
      end
      
      def bad_request(exception)
        render json: { success: false, error: exception.message }, status: :bad_request
      end
      
      def unprocessable_entity(exception)
        render json: { 
          success: false, 
          error: 'Validation failed', 
          errors: exception.record.errors.full_messages 
        }, status: :unprocessable_entity
      end
      
      def authorize_patient!
        unless current_user.patient?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end
      
      def authorize_provider!
        unless current_user.provider?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end
      
      def authorize_admin!
        unless current_user.admin?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end

      def render_error(status, message)
        render json: { error: message }, status: status
      end
    end
  end
end 