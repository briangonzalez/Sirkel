class ApplicationController < ActionController::Base
  protected
  helper_method( :current_user, :signed_in?, :get_active_users, :have_location, :set_user_inactive, :chat_id_hash, :poll_interval )
  
  # HELPERS
  def current_user
    @current_user ||= User.find_by_id(session[:user_id])
  end

  def signed_in?
    !!current_user
  end
  
  def get_active_users(id)
    user = User.find( id )
    lat = user.latitude
    lng = user.longitude
    return User.geo_scope(:origin => [lat, lng])
    #return User.where(:is_active => true)
  end
  
  def have_location?(id)
    user = User.find(id)
    return user.latitude || user.longitude
  end
  
  # Caller when logout and when user navigates away.
  def set_user_inactive(user)
    user.update_attributes(:last_seen_at => 0.0 )
    user.save
  end
  
  
  
  def chat_id_hash( user_id, p_user_hash )
    chat_ids = []
    
    if p_user_hash  
      p_user_hash.each do |p_user|
        
        if (p_user['id'] > user_id )
          chat_id = "sirkel-" + user_id.to_s() + "-" + p_user['id'].to_s()
        else
          chat_id = "sirkel-" + p_user['id'].to_s() + "-" + user_id.to_s()
        end
        chat_ids << chat_id
      end
    end
    
    return chat_ids
    
  end

  
  def poll_interval
    # Is the user still alive after ___ sec.?
    return 8
  end









  # NON HELPERS
  def current_user=(user)
    @current_user = user
    session[:user_id] = user.id
  end
  
end
