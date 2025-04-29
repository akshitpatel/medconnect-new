# spec/factories/messages.rb
FactoryBot.define do
  factory :message do
    association :conversation
    association :sender, factory: :user
    body { Faker::Lorem.paragraph }
    read_at { nil }
  end
end
