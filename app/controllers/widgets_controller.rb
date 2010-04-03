class WidgetsController < ApplicationController
  before_filter :load_widget, :except => :snapshot
  before_filter :load_legislator, :except => :snapshot
  
  def snapshot
    return unless params[:method] and params[:sections]
    
    drumbone = Drumbone.new settings[:sunlight_api_key]
    drumbone.endpoint = settings[:data_endpoint]
    drumbone.callback = "politiwidgetsCallback"
    
    json = drumbone.jsonp_for params[:method], params[:sections].split(","), params[:options]
    
    # timestamped, down to below the millisecond
    id = (Time.now.to_f * 100000).to_i.to_s
    
    if settings[:s3][:access_key]
      s3 = S3::Service.new(
        :access_key_id => settings[:s3][:access_key], 
        :secret_access_key => settings[:s3][:secret_key]
      )
      bucket = s3.buckets.find settings[:s3][:bucket]
      
      object = bucket.objects.build "#{settings[:s3][:path]}#{id}.json"
      object.acl = :public_read
      object.content_type = 'application/json'
      object.content = json
      
      if object.save
        render :text => id
      else
        head 500
      end
    else
      head 500
    end
    
  end
  
  def embed
    render :layout => false
  end

  private
  
  def load_widget
    unless params[:id].present? and @widget = widgets[params[:id].to_sym]
      head :not_found and return false 
    end
  end
  
  def load_legislator
    if results = Sunlight::Legislator.all_where(:bioguide_id => params[:bioguide_id]) and results.any?
      @legislator = results.first
    else
      head :not_found and return false
    end
  end
end