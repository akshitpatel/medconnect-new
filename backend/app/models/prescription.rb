class Prescription < ApplicationRecord
  belongs_to :patient, class_name: 'User'
  belongs_to :provider, class_name: 'User'

  enum :status, { active: 0, inactive: 1, completed: 2, cancelled: 3 }
end
