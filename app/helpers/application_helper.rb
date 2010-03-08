module ApplicationHelper

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
  
  def district_for(legislator)
    "#{legislator.state}-#{district_for legislator}"
  end
  
  def district_for(legislator)
    legislator.title == 'Sen' ? legislator.district.gsub(' Seat', '') : legislator.district
  end
  
  def search_name_for(legislator)
    name = legislator.lastname
    name << " #{legislator.name_suffix}" if legislator.name_suffix.present?
    name << ", #{legislator.nickname.present? ? legislator.nickname : legislator.firstname}"
  end
end