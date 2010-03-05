class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :load_settings
  helper_method :settings, :widgets
  
  private
  
  def load_settings
    Sunlight::Base.api_key = settings[:sunlight_api_key]
  end
  
  def settings
    @settings ||= YAML.load_file "#{Rails.root}/config/settings.yml"
  end
  
  def widgets
    @widgets ||= load_widgets
  end
  
  # It would be nicer if you could cleanly load a YAML file into an ordered hash
  def load_widgets
    widgets = ActiveSupport::OrderedHash.new
    widget_hash = YAML.load_file "#{Rails.root}/config/widgets.yml"
    widget_hash.keys.sort_by {|key| widget_hash[key][:order]}.each do |key| 
      widgets[key] = widget_hash[key]
    end
    widgets
  end
end