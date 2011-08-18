module ApplicationHelper

  def embed_url_for(widget_id, legislator_id=nil, options = {})
    options[:s] ||= options.delete(:size) || 'lg'
    options[:w] = widget_id
    options[:legislator] = legislator_id

    "http://#{settings[:frontend_hostname]}/embed?#{query_string_for options}"
  end

  def long_title(title)
    {:rep => 'Representative',
     :senator => 'Senator',
     :del => 'Delegate',
    }[title.downcase.to_sym || 'Candidate']
  end

  def id_for(legislator)
    [legislator.bioguide_id,
     legislator.votesmart_id,
     legislator.crp_id,
     legislator.govtrack_id,
     legislator.transparencydata_id].reject {|x| x.blank? }[0]
  end

  def photo_url_for(legislator, size = :small)
    sizes = {:small => "40x50", :medium => "100x125", :large => "200x250"}
    if !legislator.bioguide_id.blank?
      "http://assets.sunlightfoundation.com/moc/#{sizes[size]}/#{legislator.bioguide_id}.jpg"
    elsif !legislator.photo.blank?
      legislator.photo
    else
      "http://assets.sunlightfoundation.com/moc/default.png"
    end
  end

  def title_for(legislator)
    {"Rep" => "Representative",
     "Sen" => "Senator",
     "Del" => "Delegate"}[legislator.title] || "Candidate"
  end

  def party_for(legislator)
    {"D" => "Democratic",
     "R" => "Republican",
     "I" => "Independent"}[legislator.party] || legislator.party.chomp(' Party')
  end

  def full_district_for(legislator)
    "#{legislator.state}-#{district_for legislator}"
  end

  def district_for(legislator)
    return 'AL' if legislator.district == '0'
    legislator.title == 'Sen' ? legislator.district.gsub(' Seat', '') : "%02d" % legislator.district.to_i
  end

  def titled_name_for(legislator)
    name = "#{legislator.nickname.present? ? legislator.nickname : legislator.firstname} "
    name << legislator.lastname
    name << " #{legislator.name_suffix}" if legislator.name_suffix.present?
    name
  end

  def full_name_for(legislator)
    "#{title_for legislator} #{titled_name_for legislator} (#{legislator.party}) #{full_district_for legislator}"
  end

  def param_string
    options = {}
    options[:id] = params.delete :w
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

  def state_codes
    {
      "AL" => "Alabama",
      "AK" => "Alaska",
      "AZ" => "Arizona",
      "AR" => "Arkansas",
      "CA" => "California",
      "CO" => "Colorado",
      "CT" => "Connecticut",
      "DE" => "Delaware",
      "DC" => "District of Columbia",
      "FL" => "Florida",
      "GA" => "Georgia",
      "HI" => "Hawaii",
      "ID" => "Idaho",
      "IL" => "Illinois",
      "IN" => "Indiana",
      "IA" => "Iowa",
      "KS" => "Kansas",
      "KY" => "Kentucky",
      "LA" => "Louisiana",
      "ME" => "Maine",
      "MD" => "Maryland",
      "MA" => "Massachusetts",
      "MI" => "Michigan",
      "MN" => "Minnesota",
      "MS" => "Mississippi",
      "MO" => "Missouri",
      "MT" => "Montana",
      "NE" => "Nebraska",
      "NV" => "Nevada",
      "NH" => "New Hampshire",
      "NJ" => "New Jersey",
      "NM" => "New Mexico",
      "NY" => "New York",
      "NC" => "North Carolina",
      "ND" => "North Dakota",
      "OH" => "Ohio",
      "OK" => "Oklahoma",
      "OR" => "Oregon",
      "PA" => "Pennsylvania",
      "PR" => "Puerto Rico",
      "RI" => "Rhode Island",
      "SC" => "South Carolina",
      "SD" => "South Dakota",
      "TN" => "Tennessee",
      "TX" => "Texas",
      "UT" => "Utah",
      "VT" => "Vermont",
      "VA" => "Virginia",
      "WA" => "Washington",
      "WV" => "West Virginia",
      "WI" => "Wisconsin",
      "WY" => "Wyoming"
    }
  end
end