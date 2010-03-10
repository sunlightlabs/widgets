class MainController < ApplicationController
  def index
    @featured = featured
  end
end