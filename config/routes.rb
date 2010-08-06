Widgets::Application.routes.draw do |map|
  root :to => 'main#index'
  
  match 'about' => 'main#about', :as => 'about'
  match 'contact' => 'main#contact', :as => 'contact'
  
  match 'all' => 'legislators#index', :as => 'all'
  match 'search' => 'legislators#index', :as => 'search'
  match 'legislator/:bioguide_id' => 'legislators#show', :as  => 'legislator'

  # embed JS
  match 'embed' => 'embed#embed', :as => 'embed'
  match 'embed/tabs' => 'embed#embed_tabs', :as => 'embed_tabs'
  
  resources :widgets do
    member do
      get :embed
    end
  end
  
  match 'widget/tabs' => 'widgets#show_tabs', :as => 'widget_tabs'
  match 'widget/embed_tabs' => 'widgets#embed_tabs', :as => 'widget_embed_tabs'
  
  
  match 'snapshot' => 'widgets#snapshot', :as => 'snapshot'
end