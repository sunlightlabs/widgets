Widgets::Application.routes.draw do |map|
  root :to => 'main#index'
  
  match 'about' => 'main#about', :as => 'about'
  match 'contact' => 'main#contact', :as => 'contact'
  
  match 'search' => 'legislators#index', :as => 'search'

  match 'embed' => 'embed#embed', :as => 'embed'
  resources :widgets do
    member do
      get :embed
    end
  end

end