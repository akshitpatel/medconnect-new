# spec/factories/appointments.rb
FactoryBot.define do
  factory :appointment do
    association :patient, factory: :patient
    association :provider, factory: :provider
    appointment_datetime { Faker::Time.forward(days: 30) }
    duration_minutes { 30 }
    status { 'scheduled' }
    appointment_type { ['regular', 'follow_up', 'emergency', 'annual'].sample }
    reason { Faker::Lorem.sentence(word_count: 3) }
    notes { Faker::Lorem.paragraph }
  end
end
