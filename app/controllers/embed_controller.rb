class EmbedController < ApplicationController

  def embed
    @params = params
    render :template => 'embed/embed.js.erb', :content_type => 'text/javascript'
  end


end
