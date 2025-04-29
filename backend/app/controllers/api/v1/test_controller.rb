module Api
  module V1
    class TestController < ApplicationController
      protect_from_forgery with: :null_session
      skip_before_action :authenticate_user!
      
      def index
        render json: { message: 'API is working!' }
      end
    end
  end
end 