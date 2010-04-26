class MainController < ApplicationController
  
  def index
    @widget = widgets[settings[:featured][:widget]]
  end
  
  def contact
    if request.post?
      if params[:name].blank? or params[:email].blank? or params[:message].blank?
        @notice = 'Please fill out all fields.'
      else
        ContactForm.contact_form(params[:name], params[:email], params[:message]).deliver
        redirect_to contact_path(:sent => 1)
      end
    else
      @notice = "Your message has been sent." if params[:sent] == "1"
    end
  end
  
end