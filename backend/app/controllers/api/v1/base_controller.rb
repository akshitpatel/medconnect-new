module Api
  module V1
    class BaseController < ApplicationController
      include ApiErrorHandler
      
      before_action :authenticate_user!
      respond_to :json

      private
      
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