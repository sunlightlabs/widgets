# Mild wrapper class for the Drumbone API, used for getting and storing snapshots of widget data server-side

require 'curb'

class Drumbone
  DEFAULT_ENDPOINT = 'http://drumbone.services.sunlightlabs.com/v1/api/'
  DEFAULT_CALLBACK = 'callback'
  
  attr_accessor :apikey, :endpoint, :callback
  
  def initialize(apikey)
    self.apikey = apikey
    self.endpoint = DEFAULT_ENDPOINT
    self.callback = DEFAULT_CALLBACK
  end
  
  def jsonp_for(method, sections, options)
    url = url_for method, sections, options.merge(:callback => self.callback)
    Curl::Easy.perform(url).body_str
  end
  
  def url_for(method, sections, options)
    params = options.merge(:apikey => apikey, :sections => sections.join(","))
    uri = URI.join endpoint, "#{method}.json", "?#{query_string_for params}"
    uri.to_s
  end
  
  private
  
  def e(string)
    CGI::escape string
  end
  
  def query_string_for(options = {})
    string = ""
    keys = options.keys.sort_by(&:to_s)
    keys.each do |key|
      string << "&" unless key == keys.first
      string << "#{key}=#{e options[key]}"
    end
    string
  end
end