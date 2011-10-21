# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
SirkelApp::Application.initialize!

Haml::Template.options[:format] = :html5
