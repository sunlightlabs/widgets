class MainController < ApplicationController

  def home

  end

  def contact
    
  end
  
  def about
    
  end
  
  def search
    @q = params[:q]
  end

end