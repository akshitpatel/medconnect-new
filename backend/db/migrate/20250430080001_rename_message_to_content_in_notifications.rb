class RenameMessageToContentInNotifications < ActiveRecord::Migration[8.0]
  def change
    rename_column :notifications, :message, :content
  end
end