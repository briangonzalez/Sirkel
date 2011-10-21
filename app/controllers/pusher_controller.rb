require 'pusher'
require 'json'

Pusher.app_id = '7047'
Pusher.key = '67b3874b87eccb84c688'
Pusher.secret = '9136f26c7b6b54e0400f'

class PusherController < ApplicationController
  
  protect_from_forgery :except => :auth

  def auth
    Logger.new(STDOUT).info("Current User is: " + current_user.to_s)
    current_user = User.find( session[:user_id] )
    
    if current_user
      response = Pusher[params[:channel_name]].authenticate(params[:socket_id], {
        :user_id => current_user.id
      })
      render :json => response.to_json
    else
      render :text => "Not authorized", :status => '403'
    end
  end

end
