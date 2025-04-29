# spec/factories/patient_profiles.rb
FactoryBot.define do
  factory :patient_profile do
    association :user, factory: :patient
    
    emergency_contact { {
      name: Faker::Name.name,
      relationship: ['Spouse', 'Parent', 'Child', 'Sibling', 'Friend'].sample,
      phone: Faker::PhoneNumber.phone_number,
      email: Faker::Internet.email
    } }
    
    insurance_details { {
      provider: Faker::Company.name,
      policy_number: Faker::Number.number(digits: 10).to_s,
      group_number: Faker::Number.number(digits: 6).to_s,
      coverage_dates: "#{Faker::Date.backward(days: 365)} to #{Faker::Date.forward(days: 365)}"
    } }
    
    health_metrics { {
      height: "#{Faker::Number.between(from: 150, to: 200)} cm",
      weight: "#{Faker::Number.between(from: 50, to: 120)} kg",
      blood_type: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].sample,
      allergies: Faker::Lorem.words(number: 3),
      last_physical: Faker::Date.backward(days: 300).to_s
    } }
    
    health_history { {
      conditions: Faker::Lorem.words(number: 2),
      surgeries: Faker::Lorem.words(number: 1),
      medications: Faker::Lorem.words(number: 2),
      family_history: Faker::Lorem.sentence
    } }
  end
end
