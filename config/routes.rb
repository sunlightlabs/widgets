Widgets::Application.routes.draw do |map|
  root :to => 'main#index'

  match 'about' => 'main#about', :as => 'about'
  match 'contact' => 'main#contact', :as => 'contact'

  match 'all' => 'legislators#all', :as => 'all'
  match 'search' => 'legislators#index', :as => 'search'
  match 'legislator/:bioguide_id' => 'legislators#show', :as  => 'legislator'
  match 'challenger/:votesmart_id' => 'legislators#show', :as => 'challenger'

  match 'widget/:id' => 'widgets#show', :as => 'widget'
  match 'embed' => 'embed#embed', :as => 'embed'
  resources :widgets do
    member do
      get :embed
    end
  end

  match 'snapshot' => 'widgets#snapshot', :as => 'snapshot'
end