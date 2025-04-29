class DropJwtBlacklist < ActiveRecord::Migration[8.0]
  def up
    drop_table :jwt_blacklist, if_exists: true
  end

  def down
    create_table :jwt_blacklist do |t|
      t.string :jti, null: false
      t.datetime :exp, null: false
      t.timestamps
    end
    add_index :jwt_blacklist, :jti
  end
end
