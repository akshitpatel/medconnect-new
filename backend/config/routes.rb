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
      get 'mock/patient_dashboard', to: 'mock#patient_dashboard'

      # Auth endpoints
      post 'auth/register', to: 'auth#create'
      post 'auth/login', to: 'auth#login'
      delete 'auth/logout', to: 'auth#logout'
      get 'auth/me', to: 'users#me'
      
      # Password management
      post 'auth/forgot-password', to: 'passwords#forgot_password'
      post 'auth/reset-password', to: 'passwords#reset_password'
      post 'auth/change-password', to: 'passwords#change_password'

      # Patient panel endpoints
      resources :patients, only: [] do
        collection do
          get :profile
          put :profile, to: 'patients#update_profile'
          post 'profile/photo', to: 'profile_photos#create'
          
          # Patient appointments
          resources :appointments
          get 'upcoming_appointments', to: 'appointments#upcoming'
          
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
          
          # Provider availability management
          resources :availabilities, controller: 'provider_availabilities', except: [:show]
          
          # Provider appointments
          resources :appointments, controller: 'provider_appointments'
          
          # Provider messages
          resources :messages, controller: 'provider_messages', only: [:index, :show, :create]
          post 'messages/new_conversation', to: 'provider_messages#new_conversation'
        end
      end

      # Routes for accessing provider data without being a provider
      get 'providers/:provider_id/availabilities', to: 'provider_availabilities#index'
      get 'providers/:provider_id/available_slots', to: 'provider_availabilities#available_slots'

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
        
        # Unified search endpoint
        get 'unified_search', to: 'unified_search#index'
        
        # Appointment management
        resources :appointments do
          collection do
            get :stats
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
        
        # Dashboard data
        get 'dashboard/user-stats', to: 'dashboard#user_stats'
        get 'dashboard/system-health', to: 'dashboard#system_health'
        get 'dashboard/activity', to: 'dashboard#activity'
        get 'dashboard/analytics', to: 'dashboard#analytics'
        get 'dashboard/predictive-analytics', to: 'dashboard#predictive_analytics'
        get 'dashboard/user-engagement', to: 'dashboard#user_engagement'
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
