class MainController < ApplicationController
  def index
    @widget = widgets[settings[:featured][:widget]]
  end
  
  def gallery
    @hide_sidebar = true
  end
end