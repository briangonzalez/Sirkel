class HomeController < ApplicationController
  #layout 'application', :except => :index # Rule to ignore application layout (application.html.)
   
  def home
    reset_session
    @login_url = "auth/facebook"
    @page_title = 'Login'
    @active_users = User.find_active_users
    
    @tag_line = "Only your closest friends."     
    
    @just_logged_out = params[:just_logged_out]
  end
end
