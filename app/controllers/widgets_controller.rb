class WidgetsController < ApplicationController

  def show
    @slug = params[:id]
    case @slug 
    when 'bio'
      @full_name = "Simple Bio"
    end 
  end

  def embed
    render :layout => false
  end

end
