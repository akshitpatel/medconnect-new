# spec/factories/provider_profiles.rb
FactoryBot.define do
  factory :provider_profile do
    association :user, factory: :provider
    specialty { Faker::Job.field }
    license_number { Faker::Number.number(digits: 8).to_s }
    years_of_experience { Faker::Number.between(from: 1, to: 30) }
    bio { Faker::Lorem.paragraph(sentence_count: 3) }
    education { { institution: Faker::University.name, degree: 'MD', graduation_year: Faker::Date.backward(days: 3650).year } }
    availability { { monday: ['9:00-12:00', '13:00-17:00'], tuesday: ['9:00-12:00', '13:00-17:00'] } }
    services_offered { ['General consultation', 'Preventive care', 'Annual check-ups'] }
    languages { ['English', 'Spanish'] }
    accepting_new_patients { true }
  end
end
