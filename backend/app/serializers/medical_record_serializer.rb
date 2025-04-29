class MedicalRecordSerializer
  include JSONAPI::Serializer
  
  attributes :id, :record_type, :record_date, :title, :description,
             :file_url, :status, :created_at, :updated_at
  
  belongs_to :patient, serializer: UserSerializer
  belongs_to :provider, serializer: UserSerializer, optional: true
  
  attribute :provider_name do |record|
    record.provider&.full_name
  end
  
  attribute :patient_name do |record|
    record.patient&.full_name
  end
end
