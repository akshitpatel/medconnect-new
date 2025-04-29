class Appointment < ApplicationRecord
  belongs_to :patient, class_name: 'User'
  belongs_to :provider, class_name: 'User'

  enum :status, { scheduled: 0, completed: 1, cancelled_by_patient: 2, cancelled_by_provider: 3, no_show: 4 }
  
  # Validations
  validates :appointment_datetime, presence: true
  validates :duration_minutes, presence: true, numericality: { greater_than: 0 }
  validates :appointment_type, presence: true
  validates :reason, presence: true
end
