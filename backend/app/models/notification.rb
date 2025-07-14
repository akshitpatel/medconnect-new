class Notification < ApplicationRecord
  belongs_to :user, optional: true

  # Enums
  enum :notification_type, { general: 0, appointment: 1, message: 2, alert: 3, reminder: 4, system: 5 }
  enum :priority, { low: 0, medium: 1, high: 2, urgent: 3 }

  # Validations
  validates :title, presence: true, length: { maximum: 255 }
  validates :content, presence: true, length: { maximum: 1000 }
  validates :notification_type, presence: true
  validates :priority, presence: true

  # Scopes
  scope :unread, -> { where(read_at: nil) }
  scope :read, -> { where.not(read_at: nil) }
  scope :for_user, ->(user_id) { where(user_id: user_id) }
  scope :by_type, ->(type) { where(notification_type: type) }
  scope :by_priority, ->(priority) { where(priority: priority) }
  scope :recent, -> { order(created_at: :desc) }
  scope :urgent, -> { where(priority: :urgent) }

  # Instance methods
  def mark_as_read!
    update(read_at: Time.current)
  end

  def is_read?
    read_at.present?
  end

  def is_urgent?
    priority == 'urgent'
  end

  def self.create_for_user(user_id, title, content, notification_type: :general, priority: :medium, data: {})
    create(
      user_id: user_id,
      title: title,
      content: content,
      notification_type: notification_type,
      priority: priority,
      data: data
    )
  end

  def self.broadcast_to_all(title, content, notification_type: :system, priority: :medium, data: {})
    User.find_each do |user|
      create(
        user: user,
        title: title,
        content: content,
        notification_type: notification_type,
        priority: priority,
        data: data
      )
    end
  end
end
