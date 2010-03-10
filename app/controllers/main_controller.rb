class MainController < ApplicationController
  def index
    @featured = featured
    @widget = widgets[@featured[:widget]]
  end
end