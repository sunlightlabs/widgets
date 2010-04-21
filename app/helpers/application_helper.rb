module ApplicationHelper

  def embed_url_for(widget_id, bioguide_id, options = {})
    options[:s] ||= options.delete(:size) || 'lg'
    options[:w] = widget_id
    options[:bgd] = bioguide_id
    
    "http://#{settings[:frontend_hostname]}/embed?#{query_string_for options}"
  end
  
  def long_title(title)
    {:rep => 'Representative',
     :senator => 'Senator',
     :del => 'Delegate'
    }[title.downcase.to_sym]
  end

  def photo_url_for(legislator, size = :small)
    sizes = {:small => "40x50", :medium => "100x125", :large => "200x250"}
    "http://assets.sunlightfoundation.com/moc/#{sizes[size]}/#{legislator.bioguide_id}.jpg"
  end
  
  def title_for(legislator)
    {"Rep" => "Representative",
     "Sen" => "Senator",
     "Del" => "Delegate"}[legislator.title] || "Delegate"
  end
  
  def party_for(legislator)
    {"D" => "Democratic",
     "R" => "Republican",
     "I" => "Independent"}[legislator.party]
  end
  
  def full_district_for(legislator)
    "#{legislator.state}-#{district_for legislator}"
  end
  
  def district_for(legislator)
    return 'AL' if legislator.district == '0'
    legislator.title == 'Sen' ? legislator.district.gsub(' Seat', '') : zero_prefix(legislator.district)
  end
  
  def zero_prefix(district)
    district.to_i < 10 ? "0#{district}" : "#{district}"
  end  
  
  def search_name_for(legislator)
    name = "#{legislator.nickname.present? ? legislator.nickname : legislator.firstname} "
    name << legislator.lastname
    name << " #{legislator.name_suffix}" if legislator.name_suffix.present?
    name
  end
  
  def full_name_for(legislator)
    "#{title_for legislator} #{search_name_for legislator} (#{legislator.party}) #{full_district_for legislator}"
  end
  
  def param_string
    options = {}
    options[:bioguide_id] = params.delete :bgd
    options[:size] = params.delete :s
    options = options.merge params
    
    [:action, :controller].each {|key| options.delete key}
    
    query_string_for options
  end
  
  def e(string)
    CGI::escape string
  end
  
  def query_string_for(options = {})
    string = ""
    keys = options.keys.sort_by(&:to_s)
    keys.each do |key|
      string << "&" unless key == keys.first
      string << "#{key}=#{e options[key].to_s}"
    end
    string
  end
end