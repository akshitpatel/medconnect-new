# spec/factories/conversations.rb
FactoryBot.define do
  factory :conversation do
    association :participant_a, factory: :patient
    association :participant_b, factory: :provider
  end
end
