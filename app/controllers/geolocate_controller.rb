require 'json'

class GeolocateController < ApplicationController
  
  #
  # GETS ACTIVE USERS WITH A CERTAIN RADIUS AND SET SELF ACTIVE.
  #
  def get_active_users_within_radius_and_set_current_user_active()
    
    lat = params[:lat]
    lng = params[:lng]
    loc = { :lat => lat, :lng => lng }
    radius = params[:radius]
    
    # First, update the user since now we know there geolocation.
    user = User.find( session[:user_id] )
    user.update_attributes( :latitude => lat, :longitude => lng)
    user.save 
    
    # Grab proxime users from db.
    # proxime_users = User.geo_scope( :within => radius, :origin => [lat, lng]) 
    # 
    all_users = User.where("id != ?", session[:user_id])
    all_near_users = User.geo_scope( :within => radius, :origin => [lat, lng]).where("id != ?", session[:user_id])
    proxime_users = []
    
    all_near_users.each do |user|
      proxime_users << user unless !( Time.now.to_f - user.last_seen_at < poll_interval ) # We're polling every 5, so if a user has
    end                                                                                     # been gone for this interval, we're ok.
    
    # Grab all users from db.
    # all_active_users = User.where(:is_active => true).where("id != ?", session[:user_id])
    # Pusher['userActive'].trigger('update-users', {:data => all_active_users})
    
    # Get the chat id hash that we'll use on the client side to check which user are within the radius.
    chat_ids = chat_id_hash( session[:user_id], proxime_users )
    all_chat_ids = chat_id_hash( session[:user_id], all_users )
        
    respond_to do |type|
        type.json { render :json => { proxime_users:  proxime_users, 
                                      self_id:        session[:user_id], 
                                      params:         params, 
                                      chat_ids:       chat_ids,
                                      all_chat_ids:   all_chat_ids,
                                      image_url:      user.image_url,
                                      name:           user.name }.to_json }
    end
  
  end  
      
  
end
