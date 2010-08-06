class ApplicationController < ActionController::Base
  before_filter :load_settings, :load_size
  helper_method :settings, :widgets, :featured
  
  
  def load_settings
    Sunlight::Base.api_key = settings[:sunlight_api_key]
    Drumbone.api_key = settings[:sunlight_api_key]
    Drumbone.url = settings[:data_endpoint]
  end
  
  def settings
    @@settings ||= YAML.load_file "#{Rails.root}/config/settings.yml"
  end
  
  def widgets
    @@widgets ||= load_widgets
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
  
  def load_size
    @size = params[:s] || params[:size] || 'lg'
    case @size
      when 'sm'
        @width = 160
        @height = 300
      when 'med'
        @width = 300
        @height = 250
      when 'lg'
        @width = 400
        @height = 300
      else
        @width = 400
        @height = 300
    end    
  end
end