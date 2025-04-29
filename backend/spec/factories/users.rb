# spec/factories/users.rb
FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { 'password123' }
    password_confirmation { 'password123' }
    full_name { Faker::Name.name }
    phone { Faker::PhoneNumber.phone_number }
    date_of_birth { Faker::Date.birthday(min_age: 18, max_age: 65) }
    gender { ['male', 'female', 'other', 'prefer_not_to_say'].sample }
    address { Faker::Address.full_address }
    
    trait :patient do
      role { 'patient' }
    end

    trait :provider do
      role { 'provider' }
    end

    trait :admin do
      role { 'admin' }
    end
    
    factory :patient, traits: [:patient]
    factory :provider, traits: [:provider]
    factory :admin, traits: [:admin]
  end
end
