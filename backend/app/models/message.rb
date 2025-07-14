class Message < ApplicationRecord
  belongs_to :conversation
  belongs_to :sender, class_name: 'User'

  # Validations
  validates :body, presence: true, length: { maximum: 1000 }
  validates :message_type, presence: true

  # Enums
  enum :message_type, { text: 0, image: 1, file: 2, system: 3 }
  enum :status, { sent: 0, delivered: 1, read: 2, failed: 3 }

  # Scopes
  scope :unread, -> { where(read_at: nil) }
  scope :for_conversation, ->(conversation_id) { where(conversation_id: conversation_id) }
  scope :by_sender, ->(sender_id) { where(sender_id: sender_id) }
  scope :recent, -> { order(created_at: :desc) }

  # Callbacks
  after_create :update_conversation_timestamp
  after_create :send_notification, if: :should_send_notification?

  # Instance methods
  def mark_as_read!
    update(read_at: Time.current, status: :read)
  end

  def is_read?
    read_at.present?
  end

  def recipient
    conversation.participants.where.not(id: sender_id).first
  end

  private

  def update_conversation_timestamp
    conversation.update(last_message_at: created_at)
  end

  def should_send_notification?
    message_type == 'text' && sender_id != conversation.participant_a_id
  end

  def send_notification
    recipient = self.recipient
    return unless recipient

    Notification.create(
      user: recipient,
      title: "New message from #{sender.full_name}",
      content: body.truncate(100),
      notification_type: :message,
      data: { conversation_id: conversation_id, message_id: id }
    )
  end
end
