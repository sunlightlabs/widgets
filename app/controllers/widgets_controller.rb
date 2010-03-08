class WidgetsController < ApplicationController
  before_filter :load_widget, :load_legislator
  
  
  def embed
    render :layout => false
  end

  private
  
  def load_widget
    unless params[:id].present? and @widget = widgets[params[:id].to_sym]
      head :not_found and return false 
    end
  end
  
  def load_legislator
    if results = Sunlight::Legislator.all_where(:bioguide_id => params[:bioguide_id]) and results.any?
      @legislator = results.first
    else
      head :not_found and return false
    end
  end
end