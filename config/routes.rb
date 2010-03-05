Widgets::Application.routes.draw do |map|

  root :to => 'main#index'
  match 'search' => 'main#search', :as => 'search'
  match 'contact' => 'main#contact', :as => 'contact'
  match 'about' => 'main#about', :as => 'about'

  match 'embed' => 'embed#embed', :as => 'embed'

  resources :widgets do
    member do
      get :embed
    end
  end

end