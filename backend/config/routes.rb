Rails.application.routes.draw do
  # Devise routes for token authentication
  devise_for :users,
    path: '',
    path_names: {
      sign_in: 'api/v1/auth/login',
      sign_out: 'api/v1/auth/logout',
      registration: 'api/v1/auth/register'
    },
    defaults: { format: :json },
    skip: [:sessions, :registrations, :passwords]

  # API routes
  namespace :api do
    namespace :v1 do
      # Test endpoint
      get 'test', to: 'test#index'
      
      # Mock data endpoints
      namespace :mock do
        get 'patient_dashboard', to: 'mock#patient_dashboard'
      end

      # Auth endpoints
      post 'auth/register', to: 'auth#create'
      post 'auth/login', to: 'auth#login'
      delete 'auth/logout', to: 'auth#logout'
      get 'auth/me', to: 'users#me'

      # Patient panel endpoints
      resources :patients, only: [] do
        collection do
          get :profile
          put :profile, to: 'patients#update_profile'
          
          # Patient appointments
          resources :appointments
          
          # Patient medical records
          resources :records
          
          # Patient medications
          resources :medications, only: [:index, :show] do
            member do
              post :refill
            end
          end
          
          # Patient conversations
          resources :conversations, only: [:index, :show, :create] do
            resources :messages, only: [:create]
          end
          
          # Legacy: Patient messages (backward compatibility)
          resources :messages, only: [:index, :show, :create]
          post 'messages/new_conversation', to: 'messages#new_conversation'
          
          # All unread messages
          get 'messages', to: 'messages#all'
        end
      end

      # Provider panel endpoints
      resources :providers, only: [] do
        collection do
          # Provider dashboard
          get :dashboard
          
          # Provider profile
          get :profile
          put :profile, to: 'providers#update_profile'
          
          # Provider appointments
          resources :appointments, controller: 'provider_appointments'
          
          # Provider messages
          resources :messages, controller: 'provider_messages', only: [:index, :show, :create]
          post 'messages/new_conversation', to: 'provider_messages#new_conversation'
        end
      end

      # Admin panel endpoints
      namespace :admin do
        # User management
        resources :users
        
        # Provider management
        resources :providers do
          member do
            post :verify
          end
        end
        
        # Health records management
        resources :health_records
        
        # Notifications management
        resources :notifications do
          collection do
            post :broadcast
          end
        end
        
        # Metrics and audit logs
        get :metrics
        resources :audit_logs, only: [:index]
      end

      # Search & Directory
      get 'doctors/search'
      get 'providers/search'
      get 'pharmacy/search'

      # Other features
      post 'symptom-checker', to: 'symptom_checker#check'
      resources :notifications, only: [:index]
    end
  end

  # Health check endpoint
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
