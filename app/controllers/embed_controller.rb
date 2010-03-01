class EmbedController < ApplicationController

  def embed
    @params = params
    @size = params[:s] || 'med'
    case @size
      when 'sm'
        @width = 160
        @height = 300
      when 'med'
        @width = 300
        @height = 250
      when 'lg'
        @width = 400
        @height = 300
      else
        @width = 300
        @height = 250
    end
         
    render :template => 'embed/embed.js.erb', :content_type => 'text/javascript'
  end


end
