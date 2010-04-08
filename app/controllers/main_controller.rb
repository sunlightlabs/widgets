class MainController < ApplicationController
  
  before_filter :hide_sidebar, :except => :index
  
  def index
    @widget = widgets[settings[:featured][:widget]]
  end
  
  protected
  
  def hide_sidebar
    @hide_sidebar = true
  end
  
end