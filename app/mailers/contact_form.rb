class ContactForm < ActionMailer::Base
  
  def contact_form(name, email, message)
    mail(:to => CONTACT_RECIPIENTS, :from => email, :subject => "[Politiwidgets] Contact form submission from #{name}") do |format|
      format.text {render :text => message}
    end
  end
  
end