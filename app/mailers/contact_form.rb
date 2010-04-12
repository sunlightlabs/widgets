class ContactForm < ActionMailer::Base
  
  def contact_form(name, email, message)
    mail(:to => CONTACT_RECIPIENTS, :from => email, :subject => "Contact form submission from Politiwidgets") do |format|
      format.text {render :text => message}
    end
  end
  
end