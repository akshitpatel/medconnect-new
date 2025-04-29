class CreatePatientProfiles < ActiveRecord::Migration[8.0]
  def change
    create_table :patient_profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.jsonb :emergency_contact
      t.jsonb :insurance_details
      t.jsonb :health_metrics
      t.jsonb :health_history

      t.timestamps
    end
  end
end
