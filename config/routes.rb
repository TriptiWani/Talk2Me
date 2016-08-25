Rails.application.routes.draw do
  root :to => 'pages#home'
  resources :users
  resources :groups
  resources :messages
  get '/contacts' => 'contacts#create'
  get '/login' => 'session#new'
  post '/login' => 'session#create'
  delete '/login' => 'session#destroy'
  post '/group/:group_id/contacts/:user_id' => 'groups#add_users_to_group' , as: "adduserstogroup"
  get 'messages/create'
  # this is ajax endpoint for user name search
  get '/incremental_user_search' => 'users#incremental_search'
  get '/incremental_user_add' => 'groups#add_users_to_group'
  post '/add_image_as_message' => 'messages#create'
  post '/group/:group_id/user/:user_id' => 'group#remove_user_from_group' , as: "removeusersfromgroup"
end
