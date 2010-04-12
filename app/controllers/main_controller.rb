class MainController < ApplicationController
  
  def index
    @widget = widgets[settings[:featured][:widget]]
  end
  
  def contact
    if request.post?
      if params[:name].blank? or params[:email].blank? or params[:message].blank?
        params[:notice] = 'Please fill out all fields.'
      else
        ContactForm.contact_form(params[:name], params[:email], params[:message]).deliver
        redirect_to contact_path(:notice => 'Your message has been sent.')
      end
    end
  end
  
end