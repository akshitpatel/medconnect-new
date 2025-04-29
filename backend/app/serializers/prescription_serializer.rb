class PrescriptionSerializer
  include JSONAPI::Serializer
  
  attributes :id, :medication_name, :dosage, :frequency, :start_date, :end_date,
             :refills_allowed, :refills_remaining, :instructions, :status,
             :created_at, :updated_at
  
  belongs_to :patient, serializer: UserSerializer
  belongs_to :provider, serializer: UserSerializer
  
  attribute :provider_name do |prescription|
    prescription.provider&.full_name
  end
  
  attribute :patient_name do |prescription|
    prescription.patient&.full_name
  end
end
