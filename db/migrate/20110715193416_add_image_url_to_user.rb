class AddImageUrlToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :image_url, :string
  end

  def self.down
    remove_column :users, :image_url
  end
end
