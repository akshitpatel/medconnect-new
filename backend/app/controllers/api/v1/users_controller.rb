module Api
  module V1
    class UsersController < BaseController
      before_action :authenticate_user!
      
      # GET /api/v1/auth/me
      def me
        render json: {
          success: true,
          data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] },
          message: 'Current user information retrieved successfully'
        }, status: :ok
      end
    end
  end
end 