require File.expand_path('../boot', __FILE__)

require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "rails/test_unit/railtie"

# Auto-require default libraries and those for the current Rails environment.
Bundler.require :default, Rails.env

module Widgets
  class Application < Rails::Application
    # Add additional load paths for your own custom dirs
    # config.load_paths += %W( #{config.root}/extras )

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'
    
    # Configure sensitive parameters which will be filtered from the log file.
    # config.filter_parameters << :secret_key
  end
end