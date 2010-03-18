class MainController < ApplicationController
  def index
    @featured = featured
    @widget = widgets[@featured[:widget]]
  end
  
  def gallery
    @hide_sidebar = true
  end
end