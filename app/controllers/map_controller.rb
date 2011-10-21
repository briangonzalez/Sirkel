require 'json'

class MapController < ApplicationController
  helper_method :login_info
  
  def map 
    @page_title = 'Map'    
  end
  
  def set_all_users_inactive
    # Are you Brian, if not...
    logger.info( '[Sirkel] Setting all users inactive.' )
    users = User.find(:all)
    
    users.each do |user|
      user.update_attributes(:interval => 80.00)
      user.save
    end
    render :text => '[Sirkel] Set all users inactive.'
  end
  
  
  def heartbeat
    # Update this user's interval. We'll be getting one of these 
    # requests every 8 or so seconds.

    user = User.find(session[:user_id] )
    user.update_attributes( :latitude => params[:lat], :longitude => params[:lng])
    user.save
    
    now = Time.now.to_f
    
    if( user.last_seen_at ) 
      
      #interval = BigDecimal.new(now.to_s) - BigDecimal.new(user.last_seen_at.to_s)
      interval = now - user.last_seen_at
      
      logger.info( "******************************************************************************" )
      logger.info( "[Sirkel] User ##{session[:user_id]} is alive. We saw them #{interval} seconds ago." )
      logger.info( "******************************************************************************" )
    
      user.update_attributes( :last_seen_at => now,
                              :interval     => interval )
      user.save
      
    
    else
      user.update_attributes( :last_seen_at => now,
                              :interval     => 5 )
      user.save
    end
      
    
    # Let's get a list of users who have a small interval.
    #
    users = User.where(:interval => 0..poll_interval) 
    active_users = chat_id_hash( session[:user_id], users )
    
    
    render :json => { is_alive:       "I hear you're alive User ##{params[:id]}", 
                      active_users:   active_users,
                      last_seen_at:   user.last_seen_at 
                      }.to_json

  end
  
  def quicky
    render :json => { }.to_json
  end
  
end
