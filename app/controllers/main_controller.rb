class MainController < ApplicationController

  def home

  end

  def contact
    
  end
  
  def about
    
  end
  
  def search    
    @query = params[:q]
    @legislators = []
    
    if @query =~ /^[0-9]{5}$/
      @query_type = "ZIP Code"
      @legislators = Sunlight::Legislator.all_in_zipcode(@query)
    
    elsif @query =~ /^[A-Za-z]{2}-[0-9]{1,2}$/
      @query_type = "Congressional District"
      @state, @district = *@query.split("-")
      @legislators = Sunlight::Legislator.all_where(:state => @state, :district => @district) +
                     Sunlight::Legislator.all_where(:state => @state, :title => "Sen")
    
    elsif @state = is_a_state?(@query)
      @query_type = "State"
      @query = @state
      @legislators = Sunlight::Legislator.all_where(:state => @state)
    
    elsif @query =~ /^[0-9]+.+/ 
      @district = Sunlight::District.get(:address => @query)
      @query_type = "Address"
      @legislators = Sunlight::Legislator.all_for(:address => @query).values
    
    else
      @query_type = "Name"
      @query = @query.titlecase
      @legislators = Sunlight::Legislator.search_by_name(@query, 0.90)
    end
    
    if @legislators
      @legislators.compact!
    else
      @query_type = "Phrase"
    end
  end
  
  private
  
  def is_a_state?(str)
    states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
    abbrevs = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"]
    determine_abbrev = Hash[*(50.times.map { |i| [states[i], abbrevs[i]]}.flatten)]
    
    if abbrevs.include? str.upcase
      return str.upcase
    elsif states.include? str.titlecase
      return determine_abbrev[str.titlecase]
    else
      return false
    end
  end

end