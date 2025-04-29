class Api::UsersController < ApplicationController
  before_action :authenticate_user!, only: [:show]

  def create
    @user = User.new(user_params)
    if @user.save
      secret = ENV['HEALCARD_JWT_SECRET_KEY']
      if secret.nil? || secret.strip.empty?
        Rails.logger.error('[AUTH ERROR] ENV["HEALCARD_JWT_SECRET_KEY"] is not set! JWT generation will fail.')
        render json: { error: 'JWT secret not configured on server' }, status: :internal_server_error and return
      end
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET (first 8): #{secret[0..7]}")
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET char codes: #{secret.each_byte.to_a.inspect}")
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET length: #{secret.length}")
      render json: { user: @user, jwt: JWT.encode({ id: @user.id }, secret) }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def sign_in
    @user = User.find_by(email: params[:email])
    if @user&.valid_password?(params[:password])
      secret = ENV['HEALCARD_JWT_SECRET_KEY']
      if secret.nil? || secret.strip.empty?
        Rails.logger.error('[AUTH ERROR] ENV["HEALCARD_JWT_SECRET_KEY"] is not set! JWT generation will fail.')
        render json: { error: 'JWT secret not configured on server' }, status: :internal_server_error and return
      end
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET (first 8): #{secret[0..7]}")
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET char codes: #{secret.each_byte.to_a.inspect}")
      Rails.logger.debug("[AUTH DEBUG] JWT_SECRET length: #{secret.length}")
      render json: { user: @user, jwt: JWT.encode({ id: @user.id }, secret) }, status: :ok
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end

  def show
    render json: { user: current_user }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation)
  end
end
