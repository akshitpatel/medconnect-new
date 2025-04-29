class CreateMedications < ActiveRecord::Migration[8.0]
  def change
    create_table :medications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name, null: false
      t.string :dosage, null: false
      t.string :frequency, null: false
      t.string :prescriber
      t.date :refill_date
      t.integer :status, default: 0
      t.text :notes

      t.timestamps
    end
    
    add_index :medications, [:user_id, :name]
  end
end
