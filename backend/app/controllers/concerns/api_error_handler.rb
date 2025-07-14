module ApiErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from StandardError, with: :handle_standard_error
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
    rescue_from ActionController::UnpermittedParameters, with: :handle_unpermitted_parameters
    rescue_from JWT::DecodeError, with: :handle_jwt_error
    rescue_from JWT::ExpiredSignature, with: :handle_jwt_expired
    rescue_from JWT::VerificationError, with: :handle_jwt_verification_error
  end

  private

  def handle_standard_error(exception)
    Rails.logger.error("API Error: #{exception.class.name} - #{exception.message}")
    Rails.logger.error(exception.backtrace.join("\n"))
    
    render json: {
      success: false,
      error: 'An unexpected error occurred',
      code: 'INTERNAL_SERVER_ERROR'
    }, status: :internal_server_error
  end

  def handle_not_found(exception)
    render json: {
      success: false,
      error: 'Resource not found',
      code: 'NOT_FOUND',
      details: exception.message
    }, status: :not_found
  end

  def handle_validation_error(exception)
    render json: {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def handle_parameter_missing(exception)
    render json: {
      success: false,
      error: 'Missing required parameter',
      code: 'PARAMETER_MISSING',
      details: exception.message
    }, status: :bad_request
  end

  def handle_unpermitted_parameters(exception)
    render json: {
      success: false,
      error: 'Unpermitted parameters',
      code: 'UNPERMITTED_PARAMETERS',
      details: exception.message
    }, status: :bad_request
  end

  def handle_jwt_error(exception)
    Rails.logger.warn("JWT Decode Error: #{exception.message}")
    render json: {
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN'
    }, status: :unauthorized
  end

  def handle_jwt_expired(exception)
    Rails.logger.warn("JWT Expired: #{exception.message}")
    render json: {
      success: false,
      error: 'Authentication token has expired',
      code: 'TOKEN_EXPIRED'
    }, status: :unauthorized
  end

  def handle_jwt_verification_error(exception)
    Rails.logger.warn("JWT Verification Error: #{exception.message}")
    render json: {
      success: false,
      error: 'Authentication token verification failed',
      code: 'TOKEN_VERIFICATION_FAILED'
    }, status: :unauthorized
  end
end