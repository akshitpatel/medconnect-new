class Conversation < ApplicationRecord
  belongs_to :participant_a, class_name: 'User'
  belongs_to :participant_b, class_name: 'User'
  has_many :messages, dependent: :destroy

  # Add validation to ensure participants are different if needed
  # Add scope to find conversation between two users
end
