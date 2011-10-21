class AddLongitudeToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :longitude, :float
  end

  def self.down
    remove_column :users, :longitude
  end
end
