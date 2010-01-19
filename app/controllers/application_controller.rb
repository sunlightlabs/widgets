class ApplicationController < ActionController::Base
  protect_from_forgery
  filter_parameter_logging :password
  before_filter :load_settings
  
  private
  
  def load_settings
    settings = YAML.load_file(Rails.root.to_s + "/config/settings.yml")    
    @frontend_hostname = settings['frontend_hostname']
    @backend_hostname = settings['backend_hostname']
  end
  
end
