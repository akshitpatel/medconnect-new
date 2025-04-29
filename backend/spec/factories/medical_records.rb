# spec/factories/medical_records.rb
FactoryBot.define do
  factory :medical_record do
    association :patient, factory: :patient
    association :provider, factory: :provider
    title { Faker::Lorem.sentence(word_count: 3) }
    description { Faker::Lorem.paragraph }
    record_type { ['lab_result', 'prescription', 'imaging', 'procedure', 'note'].sample }
    record_date { Faker::Date.backward(days: 90) }
    status { 'active' }

    trait :with_file do
      after(:build) do |record|
        record.file.attach(
          io: StringIO.new("test file content"),
          filename: "test_file.pdf",
          content_type: "application/pdf"
        )
      end
    end
  end
end
