class LegislatorsController < ApplicationController

  caches_action :all, :cache_path => Proc.new { |controller| controller.params }, :expires_in => 1.day

  def all
    index
  end

  def show
    bioguide_id = params[:bioguide_id].present? ? params[:bioguide_id].upcase : nil
    unless bioguide_id and @legislator = Drumbone::Legislator.find(:bioguide_id => bioguide_id)
      head :not_found and return false
    end
  end

  def index
    @query = params[:q] || ""

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

    elsif @query == ''
      @query_type = "All Members of Congress"
      @legislators = Sunlight::Legislator.all_where(:in_office => true)

    elsif @query =~ /^[A-Za-z\s0-9\., ]+ \([^\)]+?\)$/
      @query_type = "Name and Party"
      @name, @party = @query.split(' (')
      @party = @party.sub(')', '')
      @legislators = Sunlight::Legislator.search_by_name(@name, 0.90) || []
      @legislators = @legislators.map{ |legislator| legislator.party.downcase == @party.downcase ? legislator : nil}.compact

    else
      @query_type = "Name"
      @legislators = Sunlight::Legislator.search_by_name(@query, 0.90)
    end

    if @legislators
      @legislators.compact!
    else
      @legislators = []
      @query_type = "Phrase"
    end

    respond_to do |format|
      format.html do
        if @legislators.length == 1
          redirect_to legislator_path(@legislators.first.bioguide_id)
          return
        end
      end
      format.json {render :json => @legislators}
    end
  end

  private

  def is_a_state?(str)
    states = ["Alabama","Alaska","American Samoa","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Guam","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Northern Mariana Islands","Ohio","Oklahoma","Oregon","Pennsylvania","Puerto Rico","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virgin Islands","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]
    abbrevs = ["AL","AK","AS","AZ","AR","CA","CO","CT","DE","DC","FL","GA","GU","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","MP","OH","OK","OR","PA","PR","RI","SC","SD","TN","TX","UT","VT","VI","VA","WA","WV","WI","WY"]
    determine_abbrev = Hash[*(abbrevs.size.times.map { |i| [states[i], abbrevs[i]]}.flatten)]

    if abbrevs.include? str.upcase
      str.upcase
    elsif states.include? str.titlecase
      determine_abbrev[str.titlecase]
    else
      false
    end
  end

end