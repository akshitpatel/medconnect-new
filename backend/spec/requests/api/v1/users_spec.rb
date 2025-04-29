# spec/requests/api/v1/users_spec.rb
require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  let(:user) { create(:user) }
  
  describe 'GET /api/v1/auth/me' do
    context 'when authenticated' do
      it 'returns the current user information' do
        get_with_auth '/api/v1/auth/me', user
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['user']['email']).to eq(user.email)
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/auth/me'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
