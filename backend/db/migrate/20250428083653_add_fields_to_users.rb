class AddFieldsToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :full_name, :string
    add_column :users, :phone, :string
    add_column :users, :date_of_birth, :date
    add_column :users, :gender, :string
    add_column :users, :role, :integer, default: 0, null: false # 0=patient, 1=provider, 2=admin
    add_column :users, :address, :text
    add_column :users, :passport_number, :string
    
    add_index :users, :role
    add_index :users, :phone, unique: true
  end
end
