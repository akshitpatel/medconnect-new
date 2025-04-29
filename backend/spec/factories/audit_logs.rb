# spec/factories/audit_logs.rb
FactoryBot.define do
  factory :audit_log do
    association :user
    action { ['create', 'update', 'delete', 'login', 'logout'].sample }
    resource_type { ['User', 'Appointment', 'MedicalRecord', 'Prescription'].sample }
    resource_id { Faker::Number.number(digits: 5) }
    details { { description: Faker::Lorem.sentence } }
    ip_address { Faker::Internet.ip_v4_address }
    user_agent { Faker::Internet.user_agent }
    timestamp { Time.current }
  end
end
