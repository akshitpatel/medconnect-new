class ProviderProfile < ApplicationRecord
  belongs_to :user

  # Define provider types
  PROVIDER_TYPES = [
    'doctor', 'hospital', 'diagnostic', 'lab', 
    'imaging', 'pharmacy', 'insurance', 'homeservice'
  ]

  # Validations
  validates :provider_type, inclusion: { in: PROVIDER_TYPES }, allow_nil: true

  # Default values
  attribute :provider_type, :string, default: 'doctor'
  attribute :facility_details, :jsonb, default: -> { {} }
  attribute :equipment, :string, array: true, default: -> { [] }
  attribute :insurance_providers, :string, array: true, default: -> { [] }
  attribute :operating_hours, :jsonb, default: -> { {} }

  # Scopes for provider types
  scope :doctors, -> { where(provider_type: 'doctor') }
  scope :hospitals, -> { where(provider_type: 'hospital') }
  scope :diagnostic_centers, -> { where(provider_type: 'diagnostic') }
  scope :labs, -> { where(provider_type: 'lab') }
  scope :imaging_centers, -> { where(provider_type: 'imaging') }
  scope :pharmacies, -> { where(provider_type: 'pharmacy') }
  scope :insurance_providers, -> { where(provider_type: 'insurance') }
  scope :home_services, -> { where(provider_type: 'homeservice') }
  
  # Methods
  def verified?
    verified == true
  end
end
