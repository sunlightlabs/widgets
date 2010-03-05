class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :load_settings
  
  private
  
  def load_settings
    Sunlight::Base.api_key = settings[:sunlight_api_key]
  end
  
  def settings
    @settings ||= YAML.load_file "#{Rails.root}/config/settings.yml"
  end
  helper_method :settings
end