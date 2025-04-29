# spec/requests/api/v1/providers_spec.rb
require 'rails_helper'

RSpec.describe 'Providers API', type: :request do
  let(:provider) { create(:provider) }
  let!(:provider_profile) { create(:provider_profile, user: provider) }
  
  describe 'GET /api/v1/provider/profile' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'returns the provider profile' do
        get '/api/v1/provider/profile'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['profile']).to be_present
        expect(json_response['data']['profile']['specialty']).to eq(provider_profile.specialty)
      end
    end
    
    context 'when authenticated as patient' do
      let(:patient) { create(:patient) }
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/provider/profile'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'PUT /api/v1/provider/profile' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'updates basic profile information' do
        put '/api/v1/provider/profile', params: {
          profile: {
            specialty: 'Cardiology',
            bio: 'Specialized in heart conditions'
          }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(provider_profile.reload.specialty).to eq('Cardiology')
        expect(provider_profile.reload.bio).to eq('Specialized in heart conditions')
      end
      
      it 'updates education section' do
        education_data = {
          institution: 'Harvard Medical School',
          degree: 'MD',
          graduation_year: 2010
        }
        
        put '/api/v1/provider/profile/education', params: {
          education: education_data
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(provider_profile.reload.education['institution']).to eq('Harvard Medical School')
      end
      
      it 'updates availability schedule' do
        availability_data = {
          monday: ['9:00-12:00', '14:00-17:00'],
          wednesday: ['9:00-12:00']
        }
        
        put '/api/v1/provider/profile/availability', params: {
          availability: availability_data
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(provider_profile.reload.availability['monday']).to eq(['9:00-12:00', '14:00-17:00'])
      end
      
      it 'updates services offered' do
        services = ['General consultation', 'Chronic disease management', 'Preventive care']
        
        put '/api/v1/provider/profile/services', params: {
          services: services
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(provider_profile.reload.services_offered).to include('Chronic disease management')
      end
    end
  end
  
  describe 'GET /api/v1/provider/dashboard' do
    context 'when authenticated as provider' do
      before do 
        sign_in provider
        # Create some test data for dashboard
        3.times do
          create(:appointment, provider: provider, datetime: 1.day.from_now)
        end
      end
      
      it 'returns dashboard data with upcoming appointments' do
        get '/api/v1/provider/dashboard'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['upcoming_appointments'].size).to eq(3)
        expect(json_response['data']['stats']).to be_present
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
