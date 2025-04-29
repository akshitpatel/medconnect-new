class CreateAuditLogs < ActiveRecord::Migration[8.0]
  def change
    create_table :audit_logs do |t|
      t.references :user, null: true, foreign_key: true
      t.string :action
      t.string :resource_type
      t.integer :resource_id
      t.jsonb :details
      t.string :ip_address
      t.integer :severity
      t.integer :status

      t.timestamps
    end

    add_index :audit_logs, [:resource_type, :resource_id]
  end
end
