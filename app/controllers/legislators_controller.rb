class LegislatorsController < ApplicationController

  caches_action :all, :cache_path => Proc.new { |controller| controller.params }, :expires_in => 1.day

  def all
    index
  end

  def show
    unless @legislator = get_person_by_any_id(params[:id])
      head :not_found and return false
    end
    @widgets = widgets_for @legislator
  end

  def index
    district_addons = [0, 'Junior Seat', 'Senior Seat']
    @query = params[:q] || ""

    if @query =~ /^[0-9]{5}$/
      @query_type = "ZIP Code"
      districts = Sunlight::District.all_from_zipcode(@query)
      state = districts[0].state
      districts = districts.map {|district| district.number} + district_addons
      @legislators = api.personlist(:state__iexact => state, :district__in => districts.join(',')) rescue []

    elsif @query =~ /^[A-Za-z]{2}-[0-9]{1,2}$/
      @query_type = "Congressional District"
      @state, @district = *@query.split("-")
      @legislators = api.personlist(:state__iexact => @state, :district__in => (district_addons << @district).join(',')) rescue []

    elsif @state = is_a_state?(@query)
      @query_type = "State"
      @query = @state
      @legislators = api.personlist(:state__iexact => @state) rescue []

    elsif @query =~ /^[0-9]+.+/
      @district = Sunlight::District.get(:address => @query)
      @query_type = "Address"
      @legislators = api.personlist(:state__iexact => @district.state, :district__in => (district_addons << @district.number).join(',')) rescue []

    elsif @query == ''
      @query_type = "All Members of Congress and Candidates"
      @legislators = api.personlist()

    elsif @query =~ /^[A-Za-z\s0-9\., ]+ \([^\)]+?\)$/
      @query_type = "Name and Party"
      @name, @party = @query.split(' (')
      @party = @party.sub(')', '')

      @legislators = api.personlist(:q => @name) rescue []
      @legislators = @legislators.reject{|legislator| legislator.party.downcase != @party.downcase}

    else
      @query_type = "Name"
      @legislators = api.personlist(:q => @query) rescue []
    end

    if @legislators
      #dedup & then remove nils
      prev_ids = []
      @legislators.delete_if do |legislator|
        if prev_ids.include? legislator.votesmart_id.to_i
          true
        else
          prev_ids.push(legislator.votesmart_id.to_i)
          false
        end
      end
      @legislators.compact!
    else
      @legislators = []
      @query_type = "Phrase"
    end

    respond_to do |format|
      format.html do
        if @legislators.length == 1
          legislator = @legislators.first
          redirect_to legislator_path(:id => id_for(legislator))
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