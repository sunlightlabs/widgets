class EmbedController < ApplicationController

  def embed
    render :template => 'embed/embed.js.erb', :content_type => 'text/javascript'
  end

end