class User < ApplicationRecord
  has_one :patient_profile, dependent: :destroy
  has_one :provider_profile, dependent: :destroy

  has_many :appointments_as_patient, class_name: 'Appointment', foreign_key: 'patient_id', dependent: :destroy
  has_many :appointments_as_provider, class_name: 'Appointment', foreign_key: 'provider_id', dependent: :destroy

  has_many :medical_records_as_patient, class_name: 'MedicalRecord', foreign_key: 'patient_id', dependent: :destroy
  has_many :medical_records_as_provider, class_name: 'MedicalRecord', foreign_key: 'provider_id', dependent: :nullify

  has_many :prescriptions_as_patient, class_name: 'Prescription', foreign_key: 'patient_id', dependent: :destroy
  has_many :prescriptions_as_provider, class_name: 'Prescription', foreign_key: 'provider_id', dependent: :destroy

  has_many :started_conversations, class_name: 'Conversation', foreign_key: 'participant_a_id', dependent: :destroy
  has_many :received_conversations, class_name: 'Conversation', foreign_key: 'participant_b_id', dependent: :destroy
  has_many :sent_messages, class_name: 'Message', foreign_key: 'sender_id', dependent: :destroy
  has_many :medications, dependent: :destroy
  has_many :notifications, dependent: :destroy
  has_many :audit_logs, dependent: :nullify

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  # Rails 8 enum syntax
  enum :role, { patient: 0, provider: 1, admin: 2 }, default: :patient

  # Validations
  validates :full_name, presence: true, allow_blank: true # Temporarily allow blank to avoid validation errors during setup
  validates :phone, uniqueness: true, allow_blank: true
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: 6 }, if: :password_required?
  validates :password_confirmation, presence: true, if: :password_required?

  # Return the JWT payload
  def jwt_payload
    { 
      'id' => id,
      'email' => email,
      'role' => role,
      'exp' => 1.day.from_now.to_i
    }
  end

  # Return all conversations for this user (both started and received)
  def conversations
    Conversation.where(participant_a_id: id).or(Conversation.where(participant_b_id: id))
  end

  def generate_jwt
    # Use the same secret key as ApplicationController for consistency
    secret = Rails.application.credentials.secret_key_base.to_s
    
    if secret.nil? || secret.strip.empty?
      Rails.logger.error('[AUTH ERROR] Rails.application.credentials.secret_key_base is not set! JWT generation will fail.')
      return nil
    end
    
    # Create payload consistent with what ApplicationController expects
    payload = {
      'id' => id,  # Note: Using string keys to match the expected format in ApplicationController
      'exp' => 1.day.from_now.to_i
    }
    
    # Use HS256 algorithm explicitly, same as ApplicationController
    JWT.encode(payload, secret, 'HS256')
  end

  private

  def password_required?
    new_record? || password.present?
  end

  # Private methods below
  # Note: conversations method has been moved to public scope above
end
