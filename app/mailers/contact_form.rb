class ContactForm < ActionMailer::Base
  
  def new_form(name, email, message)
    @name = name
    @email = email
    @message = message
    
    mail :to => CONTACT_RECIPIENTS, :from => @email, :subject => "Contact form submission from Politiwidgets"
  end
  
end