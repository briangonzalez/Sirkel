require File.expand_path('../boot', __FILE__)

require 'rails/all'

# If you have a Gemfile, require the gems listed there, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(:default, Rails.env) if defined?(Bundler)

module SirkelApp
  class Application < Rails::Application
    
    #Geokit
    config.gem "geokit"
    
    # Lets use Jquery instead of prototype.
    config.action_view.javascript_expansions[:defaults] = %w(jquery rails)
    
    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]
  end
end
