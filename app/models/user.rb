class User < ActiveRecord::Base
  has_one :authorization
  acts_as_mappable  :default_units        => :miles,
                    :default_formula      => :sphere,
                    :lat_column_name      => :latitude,
                    :lng_column_name      => :longitude             
  

  def self.create_from_hash!(hash)
    create( :name => hash['user_info']['name'], :image_url => hash['user_info']['image'] )
  end
  
  def self.find_active_users
    find_all_by_is_active(true)
  end
    
end
