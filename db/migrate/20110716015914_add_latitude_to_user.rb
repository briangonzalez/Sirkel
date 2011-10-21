class AddLatitudeToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :latitude, :float
  end

  def self.down
    remove_column :users, :latitude
  end
end
