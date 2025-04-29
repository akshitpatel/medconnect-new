# spec/requests/api/v1/auth_spec.rb
require 'rails_helper'

RSpec.describe 'Authentication API', type: :request do
  describe 'POST /api/v1/auth/register' do
    let(:valid_attributes) do
      {
        user: {
          email: 'test@example.com',
          password: 'password123',
          password_confirmation: 'password123',
          full_name: 'Test User',
          phone: '555-123-4567',
          role: 'patient'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new user and returns JWT token' do
        expect {
          post '/api/v1/auth/register', params: valid_attributes
        }.to change(User, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['user']['email']).to eq('test@example.com')
        expect(json_response['data']['token']).to be_present
      end
    end

    context 'with invalid parameters' do
      it 'does not create a user with duplicate email' do
        create(:user, email: 'test@example.com')
        
        expect {
          post '/api/v1/auth/register', params: valid_attributes
        }.to change(User, :count).by(0)
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['success']).to be false
      end
      
      it 'does not create a user with mismatched passwords' do
        invalid_attributes = valid_attributes.deep_dup
        invalid_attributes[:user][:password_confirmation] = 'wrongpassword'
        
        expect {
          post '/api/v1/auth/register', params: invalid_attributes
        }.to change(User, :count).by(0)
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['success']).to be false
      end
    end
  end

  describe 'POST /api/v1/auth/login' do
    let!(:user) { create(:user, email: 'existing@example.com', password: 'password123') }
    
    context 'with valid credentials' do
      it 'returns a JWT token' do
        post '/api/v1/auth/login', params: { 
          email: 'existing@example.com',
          password: 'password123'
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['token']).to be_present
        expect(json_response['data']['user']['email']).to eq('existing@example.com')
      end
    end
    
    context 'with invalid credentials' do
      it 'returns unauthorized for wrong password' do
        post '/api/v1/auth/login', params: { 
          email: 'existing@example.com',
          password: 'wrongpassword'
        }
        
        expect(response).to have_http_status(:unauthorized)
        expect(json_response['success']).to be false
      end
      
      it 'returns unauthorized for non-existent user' do
        post '/api/v1/auth/login', params: { 
          email: 'nonexistent@example.com',
          password: 'password123'
        }
        
        expect(response).to have_http_status(:unauthorized)
        expect(json_response['success']).to be false
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
