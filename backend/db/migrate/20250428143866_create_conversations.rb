class CreateConversations < ActiveRecord::Migration[8.0]
  def change
    create_table :conversations do |t|
      t.references :participant_a, null: false, foreign_key: { to_table: :users }
      t.references :participant_b, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end

    add_index :conversations, [:participant_a_id, :participant_b_id], unique: true
  end
end
