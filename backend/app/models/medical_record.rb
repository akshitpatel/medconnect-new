class MedicalRecord < ApplicationRecord
  belongs_to :patient, class_name: 'User'
  belongs_to :provider, class_name: 'User', optional: true

  # Add Active Storage for file attachments
  has_one_attached :file

  enum :record_type, { lab_result: 0, imaging: 1, consultation_note: 2, other: 99 }
  enum :status, { draft: 0, finalized: 1, archived: 2 }
  
  # Validations
  validates :title, presence: true
  validates :record_date, presence: true
  validates :record_type, presence: true
  
  # Get the file URL if attached
  def file_url
    file.attached? ? Rails.application.routes.url_helpers.rails_blob_url(file, only_path: true) : nil
  end
end
