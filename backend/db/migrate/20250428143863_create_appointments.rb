class CreateAppointments < ActiveRecord::Migration[8.0]
  def change
    create_table :appointments do |t|
      t.references :patient, null: false, foreign_key: { to_table: :users }
      t.references :provider, null: false, foreign_key: { to_table: :users }
      t.datetime :appointment_datetime
      t.integer :duration_minutes
      t.integer :status
      t.string :appointment_type
      t.string :reason
      t.text :notes

      t.timestamps
    end
  end
end
