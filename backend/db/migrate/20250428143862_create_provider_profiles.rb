class CreateProviderProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :provider_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :specialization
      t.text :bio
      t.string :languages, array: true, default: []
      t.string :profile_image_url
      t.string :license_number
      t.jsonb :education
      t.jsonb :experience
      t.jsonb :services
      t.decimal :consultation_fee
      t.jsonb :availability

      t.timestamps
    end
  end
end
