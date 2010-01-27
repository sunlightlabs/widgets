Widgets::Application.routes.draw do |map|
  match 'embed' => 'embed#embed'
  
  resources :widgets do
    member do
      get :embed
    end
  end

end