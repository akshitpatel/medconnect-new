# spec/requests/api/v1/admin/metrics_spec.rb
require 'rails_helper'

RSpec.describe 'Admin Metrics API', type: :request do
  let(:admin) { create(:admin) }
  
  # Set up test data for metrics
  before do
    # Create users
    3.times { create(:patient) }
    2.times { create(:provider) }
    
    # Create appointments with different statuses
    patient = User.where(role: 'patient').first
    provider = User.where(role: 'provider').first
    
    create(:appointment, patient: patient, provider: provider, status: 'scheduled', datetime: 1.day.from_now)
    create(:appointment, patient: patient, provider: provider, status: 'completed', datetime: 1.day.ago)
    create(:appointment, patient: patient, provider: provider, status: 'cancelled', datetime: 2.days.ago)
    
    # Create medical records
    create(:medical_record, patient: patient, provider: provider, record_type: 'lab_result')
    create(:medical_record, patient: patient, provider: provider, record_type: 'imaging')
  end
  
  describe 'GET /api/v1/admin/metrics/users' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns user growth metrics' do
        get '/api/v1/admin/metrics/users'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['total_users']).to eq(6) # 3 patients + 2 providers + 1 admin
        expect(json_response['data']['by_role']).to be_present
        expect(json_response['data']['by_role']['patient']).to eq(3)
        expect(json_response['data']['by_role']['provider']).to eq(2)
        expect(json_response['data']['growth']).to be_present
      end
      
      it 'returns metrics for specified time range' do
        get '/api/v1/admin/metrics/users', params: {
          start_date: 30.days.ago.to_date.to_s,
          end_date: Date.today.to_s
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['period']).to be_present
        expect(json_response['data']['period']['start_date']).to be_present
        expect(json_response['data']['period']['end_date']).to be_present
      end
    end
    
    context 'when authenticated as non-admin' do
      let(:patient) { User.where(role: 'patient').first }
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/admin/metrics/users'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'GET /api/v1/admin/metrics/appointments' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns appointment metrics' do
        get '/api/v1/admin/metrics/appointments'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['total_appointments']).to eq(3)
        expect(json_response['data']['by_status']).to be_present
        expect(json_response['data']['by_status']['scheduled']).to eq(1)
        expect(json_response['data']['by_status']['completed']).to eq(1)
        expect(json_response['data']['by_status']['cancelled']).to eq(1)
      end
    end
  end
  
  describe 'GET /api/v1/admin/metrics/records' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns medical records metrics' do
        get '/api/v1/admin/metrics/records'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['total_records']).to eq(2)
        expect(json_response['data']['by_type']).to be_present
        expect(json_response['data']['by_type']['lab_result']).to eq(1)
        expect(json_response['data']['by_type']['imaging']).to eq(1)
      end
    end
  end
  
  describe 'GET /api/v1/admin/metrics/system' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns system-wide metrics' do
        get '/api/v1/admin/metrics/system'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['metrics']).to be_present
        expect(json_response['data']['metrics']['users']).to be_present
        expect(json_response['data']['metrics']['appointments']).to be_present
        expect(json_response['data']['metrics']['records']).to be_present
        expect(json_response['data']['platform_health']).to be_present
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
