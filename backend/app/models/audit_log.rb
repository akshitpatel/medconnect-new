class AuditLog < ApplicationRecord
  belongs_to :user, optional: true

  # Enums
  enum :severity, { info: 0, warning: 1, error: 2, critical: 3 }
  enum :action_type, { 
    create: 0, update: 1, delete: 2, login: 3, logout: 4, 
    access: 5, export: 6, import: 7, system: 8 
  }

  # Validations
  validates :action, presence: true
  validates :resource_type, presence: true
  validates :severity, presence: true
  validates :action_type, presence: true

  # Scopes
  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_severity, ->(severity) { where(severity: severity) }
  scope :by_action_type, ->(action_type) { where(action_type: action_type) }
  scope :by_resource_type, ->(resource_type) { where(resource_type: resource_type) }
  scope :recent, -> { order(created_at: :desc) }
  scope :errors, -> { where(severity: [:error, :critical]) }
  scope :today, -> { where(created_at: Time.current.beginning_of_day..Time.current.end_of_day) }

  # Class methods for easy logging
  def self.log_action(user, action, resource_type, resource_id = nil, details = {}, severity: :info, action_type: :access)
    create(
      user: user,
      action: action,
      resource_type: resource_type,
      resource_id: resource_id,
      details: details,
      severity: severity,
      action_type: action_type,
      ip_address: user&.current_sign_in_ip || 'unknown'
    )
  end

  def self.log_security_event(user, action, details = {}, severity: :warning)
    log_action(user, action, 'security', nil, details, severity: severity, action_type: :access)
  end

  def self.log_system_event(action, details = {}, severity: :info)
    log_action(nil, action, 'system', nil, details, severity: severity, action_type: :system)
  end

  # Instance methods
  def is_error?
    severity.in?(['error', 'critical'])
  end

  def is_security_event?
    action_type == 'access' && resource_type == 'security'
  end

  def formatted_details
    details.is_a?(Hash) ? details : { message: details.to_s }
  end
end
