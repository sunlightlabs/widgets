class MainController < ApplicationController
  
  def index
    @widget = widgets[settings[:featured][:widget]]
  end
  
end