class WidgetsController < ApplicationController

  def show
    @legislator = Sunlight::Legislator.all_where(:bioguide_id => params[:bioguide_id]).first

    case params[:id] 
    when 'bio'
      @full_name = "Simple Bio"
    when 'bill'
      @full_name = "Bill Voting Report"
    end 
  end

  def embed
    render :layout => false
  end

end