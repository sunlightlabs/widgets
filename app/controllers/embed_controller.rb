class EmbedController < ApplicationController

  def embed
    render :template => 'embed/embed.js.erb', :content_type => 'text/javascript'
  end
  
  def embed_tabs
    render :template => 'embed/embed_tabs.js.erb', :content_type => 'text/javascript'
  end

end