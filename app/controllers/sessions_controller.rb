class SessionsController < ApplicationController
  
  def create
    reset_session  #  see http://guides.rubyonrails.org/security.html#session-fixation
    auth = request.env['omniauth.auth']
    
    unless @auth = Authorization.find_from_hash(auth)
      # Create a new user or add an auth to existing user, depending on
      # whether there is already a user signed in.
      @auth = Authorization.create_from_hash(auth, current_user)
    end
    
    # @have_location = have_location?(@auth.user_id)
    # if( @have_location )
    #   @active_users = get_active_users(@auth.user_id)
    # end
    
    @page_title = 'Logged In'
    
    user = User.find( @auth.user_id )
    @user_img_url = user.image_url
    @user_name = user.name
    @user_lat = user.latitude
    @user_lng = user.longitude
    
    # We'll use this to display a message to new users.
    if (user.last_seen_at)
      @new_user_alert = true
    end

    # Log the authorizing user in.
    self.current_user = @auth
    
    # Give the user some tips after they login.
    tips = [ 'Alt + Drag = Zoom.', 'Click \'n Drag markers.'  ]
    @tip = tips[rand(tips.size)]
    
    redirect_to :template => 'home/home', :please_sign_in => true unless session[:user_id]
    render :template => "map/map"   
  end
  
  
  def index
    render :text => "Logged in as.."
  end
  
  def log_out  
    flash[:notice] = "Logged out." 
    
    user = User.find( session[:user_id] )
    set_user_inactive(user)
    
    reset_session
    @just_logged_out = true
    redirect_to :controller => 'home', :action => 'home', :just_logged_out => 'true'  
  end
  
  def failure
    redirect_to root_url, :alert => 'Sorry, there was something wrong with your login attempt. Please try again.'
  end
  
  
end
