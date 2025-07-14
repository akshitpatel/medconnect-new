class AddFieldsToMessages < ActiveRecord::Migration[8.0]
  def change
    add_column :messages, :message_type, :integer, default: 0, null: false
    add_column :messages, :status, :integer, default: 0, null: false
    
    add_index :messages, :message_type
    add_index :messages, :status
    add_index :messages, :read_at
  end
end