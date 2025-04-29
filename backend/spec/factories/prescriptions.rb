# spec/factories/prescriptions.rb
FactoryBot.define do
  factory :prescription do
    association :patient, factory: :patient
    association :provider, factory: :provider
    medication_name { Faker::Medicine.drug_name }
    dosage { "#{Faker::Number.between(from: 5, to: 500)} mg" }
    frequency { ['Once daily', 'Twice daily', 'Three times daily', 'Every 4 hours', 'As needed'].sample }
    duration { "#{Faker::Number.between(from: 1, to: 90)} days" }
    refills_allowed { Faker::Number.between(from: 0, to: 5) }
    refills_used { Faker::Number.between(from: 0, to: 2) }
    prescribed_date { Faker::Date.backward(days: 90) }
    expiration_date { Faker::Date.forward(days: 180) }
    status { ['active', 'completed', 'expired', 'cancelled'].sample }
    notes { Faker::Lorem.paragraph }
    pharmacy_notes { Faker::Lorem.sentence }
  end
end
