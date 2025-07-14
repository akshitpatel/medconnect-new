# spec/requests/api/v1/auth_spec.rb
require 'rails_helper'

RSpec.describe 'API::V1::Auth', type: :request do
  let(:valid_user_params) do
    {
      user: {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        phone: '+1234567890',
        date_of_birth: '1990-01-01',
        gender: 'male'
      }
    }
  end

  let(:invalid_user_params) do
    {
      user: {
        full_name: '',
        email: 'invalid-email',
        password: 'short',
        password_confirmation: 'different'
      }
    }
  end

  describe 'POST /api/v1/auth/register' do
    context 'with valid parameters' do
      it 'creates a new user and returns success response' do
        expect {
          post '/api/v1/auth/register', params: valid_user_params
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('User registered successfully')
        expect(json_response['data']['token']).to be_present
        expect(json_response['data']['user']['email']).to eq('john@example.com')
        expect(json_response['data']['user']['full_name']).to eq('John Doe')
      end

      it 'sets default role as patient' do
        post '/api/v1/auth/register', params: valid_user_params
        
        user = User.find_by(email: 'john@example.com')
        expect(user.role).to eq('patient')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        post '/api/v1/auth/register', params: invalid_user_params

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end

      it 'does not create a user with duplicate email' do
        User.create!(valid_user_params[:user])
        
        expect {
          post '/api/v1/auth/register', params: valid_user_params
        }.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST /api/v1/auth/login' do
    let!(:user) { User.create!(valid_user_params[:user]) }

    context 'with valid credentials' do
      it 'returns authentication token and user data' do
        post '/api/v1/auth/login', params: {
          user: {
            email: 'john@example.com',
            password: 'password123'
          }
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Logged in successfully')
        expect(json_response['data']['token']).to be_present
        expect(json_response['data']['user']['email']).to eq('john@example.com')
      end

      it 'handles remember me functionality' do
        post '/api/v1/auth/login', params: {
          user: {
            email: 'john@example.com',
            password: 'password123',
            remember_me: true
          }
        }

        expect(response).to have_http_status(:ok)
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized error' do
        post '/api/v1/auth/login', params: {
          user: {
            email: 'john@example.com',
            password: 'wrongpassword'
          }
        }

        expect(response).to have_http_status(:unauthorized)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['message']).to eq('Invalid email or password')
      end

      it 'returns unauthorized for non-existent user' do
        post '/api/v1/auth/login', params: {
          user: {
            email: 'nonexistent@example.com',
            password: 'password123'
          }
        }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'DELETE /api/v1/auth/logout' do
    let!(:user) { User.create!(valid_user_params[:user]) }
    let(:token) { user.generate_jwt }

    context 'with valid authentication' do
      it 'successfully logs out user' do
        delete '/api/v1/auth/logout', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Logged out successfully')
      end
    end

    context 'without authentication' do
      it 'returns unauthorized error' do
        delete '/api/v1/auth/logout'

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    let!(:user) { User.create!(valid_user_params[:user]) }
    let(:token) { user.generate_jwt }

    context 'with valid authentication' do
      it 'returns current user data' do
        get '/api/v1/auth/me', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']['email']).to eq('john@example.com')
        expect(json_response['data']['full_name']).to eq('John Doe')
      end
    end

    context 'without authentication' do
      it 'returns unauthorized error' do
        get '/api/v1/auth/me'

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with invalid token' do
      it 'returns unauthorized error' do
        get '/api/v1/auth/me', headers: {
          'Authorization' => 'Bearer invalid_token'
        }

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/auth/forgot-password' do
    let!(:user) { User.create!(valid_user_params[:user]) }

    context 'with valid email' do
      it 'returns success response' do
        post '/api/v1/auth/forgot-password', params: {
          user: { email: 'john@example.com' }
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Password reset instructions have been sent to your email.')
      end
    end

    context 'with invalid email' do
      it 'returns not found error' do
        post '/api/v1/auth/forgot-password', params: {
          user: { email: 'nonexistent@example.com' }
        }

        expect(response).to have_http_status(:not_found)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['error']).to eq('Email address not found.')
      end
    end
  end

  describe 'POST /api/v1/auth/reset-password' do
    let!(:user) { User.create!(valid_user_params[:user]) }
    let(:reset_token) { user.send_reset_password_instructions }

    context 'with valid reset token' do
      it 'successfully resets password' do
        post '/api/v1/auth/reset-password', params: {
          user: {
            reset_password_token: reset_token,
            password: 'newpassword123',
            password_confirmation: 'newpassword123'
          }
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Password has been reset successfully.')
      end
    end

    context 'with invalid reset token' do
      it 'returns validation errors' do
        post '/api/v1/auth/reset-password', params: {
          user: {
            reset_password_token: 'invalid_token',
            password: 'newpassword123',
            password_confirmation: 'newpassword123'
          }
        }

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['error']).to eq('Password reset failed.')
      end
    end
  end
end
