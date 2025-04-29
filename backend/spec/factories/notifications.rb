# spec/factories/notifications.rb
FactoryBot.define do
  factory :notification do
    association :user
    title { Faker::Lorem.sentence(word_count: 3) }
    message { Faker::Lorem.paragraph(sentence_count: 1) }
    notification_type { ['system', 'message', 'appointment', 'prescription'].sample }
    priority { ['low', 'normal', 'high'].sample }
    read_at { nil }
  end
end
