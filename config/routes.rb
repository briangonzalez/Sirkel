SirkelApp::Application.routes.draw do
  
  get "pusher/auth"

  # Facebook oauth
  match '/auth/:provider/callback', :to => 'sessions#create'
  match '/auth/failure', :to => 'sessions#failure'
  
  # Other
  match '/map',                 :to => 'map#map'
  match '/map/sweep',           :to => 'map#set_all_users_inactive'
  match '/map/heartbeat.json',  :to => 'map#heartbeat'
  match '/map/quicky.json',     :to => 'map#quicky'
  
  match '/sessions',            :to => 'sessions#index'
  match '/sessions/log_out',    :to => 'sessions#log_out'
  match '/home',                :to => 'home#home'
  match '/pusher/auth',         :to => 'pusher#auth'
  
  match '/env',                 :to => 'env#env'
  
  # Geolocate routes
  match '/geolocate/locate_update_get.json',  
        :to => 'geolocate#get_active_users_within_radius_and_set_current_user_active'
        
  
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => "home#home"

  # See how all your routes lay out with "rake routes"
  
  
  
  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
