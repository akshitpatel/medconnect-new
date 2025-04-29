class CreateMedicalRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :medical_records do |t|
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.references :provider, null: true, foreign_key: { to_table: :users }
      t.integer :record_type
      t.date :record_date
      t.string :title
      t.text :description
      t.string :file_url
      t.integer :status

      t.timestamps
    end
  end
end
