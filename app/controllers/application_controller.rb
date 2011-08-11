class ApplicationController < ActionController::Base
  before_filter :load_settings, :load_size
  helper_method :settings, :widgets, :featured


  def location_for_ip(ip)
    GeoIp.api_key = settings[:geo_ip_api_key]
    GeoIp.geolocation ip
  rescue Timeout::Error, Errno::EINVAL, Errno::ECONNRESET, EOFError, Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError, Net::ProtocolError, RuntimeError => e
    nil
  end

  def get_location
    location_for_ip request.ip
  end

  def get_person_by_any_id(params={})
    bioguide_id = params[:bioguide_id].present? ? params[:bioguide_id].upcase : nil
    votesmart_id = params[:votesmart_id].present? ? params[:votesmart_id] : nil
    unless (bioguide_id and person = Drumbone::Legislator.find(:bioguide_id => bioguide_id)) or
           (votesmart_id and person = challengers.people(:votesmart_id => votesmart_id))
      return false
    end
    if person.in_office?
      person.person_type = 'legislator'
    else
      person.person_type = 'challenger'
    end
    person
  end

  def load_settings
    Sunlight::Base.api_key = settings[:sunlight_api_key]
    Drumbone.api_key = settings[:sunlight_api_key]
    Drumbone.url = settings[:data_endpoints][:drumbone]
  end

  def challengers
    @@challengers = Tastyrb::Client.new(base_uri=settings[:data_endpoints][:challengers], api_key=settings[:sunlight_api_key])
  end

  def settings
    @@settings ||= YAML.load_file "#{Rails.root}/config/settings.yml"
  end

  def widgets
    @@widgets ||= load_widgets
  end

  def widgets_for(legislator)
    widgets.reject { |slug, widget| widget[:display_for].exclude? legislator.person_type.pluralize.to_sym }
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
        @width = 300
        @height = 250
    end
  end
end