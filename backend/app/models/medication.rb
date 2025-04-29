class Medication < ApplicationRecord
  belongs_to :user
  
  # Fields: name, dosage, frequency, refill_date, prescriber, status
  
  validates :name, presence: true
  validates :dosage, presence: true
  validates :frequency, presence: true
  validates :user_id, presence: true
  
  enum :status, { active: 0, completed: 1, discontinued: 2 }, default: :active
  
  def refill_available?
    status == "active" && (refill_date.nil? || refill_date <= Date.today + 5.days)
  end
end
