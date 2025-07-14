class Prescription < ApplicationRecord
  belongs_to :patient, class_name: 'User'
  belongs_to :provider, class_name: 'User'

  enum :status, { active: 0, inactive: 1, completed: 2, cancelled: 3 }

  # Validations
  validates :medication_name, presence: true
  validates :dosage, presence: true
  validates :frequency, presence: true
  validates :start_date, presence: true
  validates :refills_allowed, numericality: { greater_than_or_equal_to: 0 }
  validates :refills_remaining, numericality: { greater_than_or_equal_to: 0 }
  validate :end_date_after_start_date, if: -> { end_date.present? && start_date.present? }

  # Scopes
  scope :active, -> { where(status: :active) }
  scope :for_patient, ->(patient_id) { where(patient_id: patient_id) }
  scope :by_provider, ->(provider_id) { where(provider_id: provider_id) }
  scope :expiring_soon, -> { where('end_date <= ?', 30.days.from_now) }

  # Instance methods
  def can_refill?
    active? && refills_remaining > 0
  end

  def request_refill!
    return false unless can_refill?
    
    update(refills_remaining: refills_remaining - 1)
  end

  def is_expired?
    end_date.present? && end_date < Date.current
  end

  private

  def end_date_after_start_date
    if end_date <= start_date
      errors.add(:end_date, 'must be after start date')
    end
  end
end
