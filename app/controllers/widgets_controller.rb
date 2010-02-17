class WidgetsController < ApplicationController

  def show
    @slug = params[:id]
    @legislator = Sunlight::Legislator.all_where(:bioguide_id => params[:bioguide_id]).first

    case @slug 
    when 'bio'
      @full_name = "Simple Bio"
    end 
  end

  def embed
    @legislator = Sunlight::Legislator.all_where(:bioguide_id => params[:bioguide_id]).first
    render :layout => false
  end

end
