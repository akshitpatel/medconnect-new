class ProviderAvailability < ApplicationRecord
  belongs_to :provider, class_name: 'User'
  
  # Days of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  enum :day_of_week, { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 }
  
  # Validations
  validates :day_of_week, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validate :end_time_after_start_time
  validate :no_overlapping_slots
  
  # Scope to find available slots for a provider
  scope :for_provider, ->(provider_id) { where(provider_id: provider_id) }
  scope :for_day, ->(day) { where(day_of_week: day) }
  
  private
  
  def end_time_after_start_time
    return if end_time.blank? || start_time.blank?
    
    if end_time <= start_time
      errors.add(:end_time, 'must be after start time')
    end
  end
  
  def no_overlapping_slots
    return if day_of_week.blank? || start_time.blank? || end_time.blank?
    
    overlaps = ProviderAvailability.where(provider_id: provider_id, day_of_week: day_of_week)
                                .where.not(id: id) # Exclude self when updating
                                .where('(start_time < ? AND end_time > ?) OR (start_time < ? AND end_time > ?) OR (start_time >= ? AND end_time <= ?)', 
                                       end_time, start_time, end_time, start_time, start_time, end_time)
    
    if overlaps.exists?
      errors.add(:base, 'Availability slot overlaps with an existing slot')
    end
  end
end
