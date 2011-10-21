class AddLastSeenAtAndIntervalToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :last_seen_at, :decimal, :precision => 20, :scale => 6
    add_column :users, :interval, :decimal, :precision => 20, :scale => 6
  end

  def self.down
    remove_column :users, :interval
    remove_column :users, :last_seen_at
  end
end
