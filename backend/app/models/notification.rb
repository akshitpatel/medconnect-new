class Notification < ApplicationRecord
  belongs_to :user, optional: true

  enum :notification_type, { general: 0, appointment: 1, message: 2, alert: 3 }
  enum :priority, { low: 0, medium: 1, high: 2 }

  validates :title, presence: true
  validates :message, presence: true
end
