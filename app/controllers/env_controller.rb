class EnvController < ApplicationController
  
  def env
    @env = ENV
    @page_title = 'Environment Variables'
  end
  
end
