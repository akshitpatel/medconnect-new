class CreatePrescriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :prescriptions do |t|
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.references :provider, null: false, foreign_key: { to_table: :users }
      t.string :medication_name
      t.string :dosage
      t.string :frequency
      t.date :start_date
      t.date :end_date
      t.integer :refills_allowed, default: 0
      t.integer :refills_remaining, default: 0
      t.text :instructions
      t.integer :status

      t.timestamps
    end
  end
end
