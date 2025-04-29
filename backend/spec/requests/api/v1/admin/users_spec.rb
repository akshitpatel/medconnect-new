# spec/requests/api/v1/admin/users_spec.rb
require 'rails_helper'

RSpec.describe 'Admin Users API', type: :request do
  let(:admin) { create(:admin) }
  let!(:patient) { create(:patient) }
  let!(:provider) { create(:provider) }
  
  describe 'GET /api/v1/admin/users' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns all users' do
        get '/api/v1/admin/users'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['users'].size).to eq(3) # admin, patient, provider
      end
      
      it 'filters users by role' do
        get '/api/v1/admin/users', params: { role: 'patient' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['users'].size).to eq(1)
        expect(json_response['data']['users'][0]['role']).to eq('patient')
      end
      
      it 'includes pagination information' do
        # Create additional users to test pagination
        5.times { create(:patient) }
        
        get '/api/v1/admin/users', params: { page: 1, per_page: 3 }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['users'].size).to eq(3)
        expect(json_response['data']['pagination']).to be_present
        expect(json_response['data']['pagination']['total_pages']).to be > 1
      end
    end
    
    context 'when authenticated as non-admin' do
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/admin/users'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'GET /api/v1/admin/users/:id' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns the user with details' do
        get "/api/v1/admin/users/#{patient.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['user']['id']).to eq(patient.id)
        expect(json_response['data']['user']['role']).to eq('patient')
      end
      
      it 'returns not found for non-existent user' do
        get "/api/v1/admin/users/999999"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  describe 'POST /api/v1/admin/users' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      let(:valid_attributes) do
        {
          user: {
            email: 'new_user@example.com',
            password: 'password123',
            password_confirmation: 'password123',
            first_name: 'New',
            last_name: 'User',
            role: 'patient'
          }
        }
      end
      
      it 'creates a new user' do
        expect {
          post '/api/v1/admin/users', params: valid_attributes
        }.to change(User, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['user']['email']).to eq('new_user@example.com')
      end
      
      it 'fails with invalid attributes' do
        invalid_attributes = valid_attributes.deep_dup
        invalid_attributes[:user][:email] = 'invalid'
        
        expect {
          post '/api/v1/admin/users', params: invalid_attributes
        }.not_to change(User, :count)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe 'PUT /api/v1/admin/users/:id' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'updates a user' do
        put "/api/v1/admin/users/#{patient.id}", params: {
          user: { first_name: 'Updated', last_name: 'Patient' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient.reload.first_name).to eq('Updated')
        expect(patient.reload.last_name).to eq('Patient')
      end
      
      it 'can change user role' do
        put "/api/v1/admin/users/#{patient.id}", params: {
          user: { role: 'provider' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient.reload.role).to eq('provider')
      end
    end
  end
  
  describe 'DELETE /api/v1/admin/users/:id' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'deletes a user' do
        expect {
          delete "/api/v1/admin/users/#{patient.id}"
        }.to change(User, :count).by(-1)
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
      end
      
      it 'cannot delete the current admin user' do
        expect {
          delete "/api/v1/admin/users/#{admin.id}"
        }.not_to change(User, :count)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe 'GET /api/v1/admin/users/stats' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns user statistics' do
        get '/api/v1/admin/users/stats'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['stats']).to be_present
        expect(json_response['data']['stats']['total_users']).to eq(3)
        expect(json_response['data']['stats']['by_role']).to be_present
        expect(json_response['data']['stats']['by_role']['patient']).to eq(1)
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
