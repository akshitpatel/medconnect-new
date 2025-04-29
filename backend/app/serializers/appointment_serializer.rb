class AppointmentSerializer
  include JSONAPI::Serializer
  attributes :id, :appointment_datetime, :duration_minutes, :status, 
             :appointment_type, :reason, :notes, :created_at, :updated_at

  # belongs_to :patient, serializer: UserSerializer # Don't usually need patient details when patient is fetching
  belongs_to :provider, serializer: UserSerializer # Include basic provider info

  # Optional: Add provider's profile details if needed
  # attribute :provider_details do |appointment|
  #   ProviderProfileSerializer.new(appointment.provider.provider_profile).serializable_hash[:data][:attributes] if appointment.provider&.provider_profile
  # end
end
