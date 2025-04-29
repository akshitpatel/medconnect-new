# spec/requests/api/v1/admin/audit_logs_spec.rb
require 'rails_helper'

RSpec.describe 'Admin Audit Logs API', type: :request do
  let(:admin) { create(:admin) }
  let(:patient) { create(:patient) }
  let!(:audit_log) { create(:audit_log, user: patient, action: 'login') }
  
  describe 'GET /api/v1/admin/audit_logs' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns all audit logs' do
        # Create more audit logs
        create(:audit_log, user: admin, action: 'update', resource_type: 'User')
        create(:audit_log, user: patient, action: 'view', resource_type: 'MedicalRecord')
        
        get '/api/v1/admin/audit_logs'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['audit_logs'].size).to eq(3)
      end
      
      it 'filters audit logs by user_id' do
        create(:audit_log, user: admin, action: 'create')
        
        get '/api/v1/admin/audit_logs', params: { user_id: patient.id }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['audit_logs'].size).to eq(1)
        expect(json_response['data']['audit_logs'][0]['user_id']).to eq(patient.id)
      end
      
      it 'filters audit logs by action' do
        create(:audit_log, user: patient, action: 'create')
        create(:audit_log, user: admin, action: 'login')
        
        get '/api/v1/admin/audit_logs', params: { action: 'login' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['audit_logs'].size).to eq(2)
        expect(json_response['data']['audit_logs'][0]['action']).to eq('login')
      end
      
      it 'filters audit logs by resource_type' do
        create(:audit_log, user: patient, action: 'view', resource_type: 'MedicalRecord')
        
        get '/api/v1/admin/audit_logs', params: { resource_type: 'MedicalRecord' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['audit_logs'].size).to eq(1)
        expect(json_response['data']['audit_logs'][0]['resource_type']).to eq('MedicalRecord')
      end
      
      it 'includes pagination information' do
        # Create additional audit logs to test pagination
        10.times { create(:audit_log, user: patient) }
        
        get '/api/v1/admin/audit_logs', params: { page: 1, per_page: 5 }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['audit_logs'].size).to eq(5)
        expect(json_response['data']['pagination']).to be_present
        expect(json_response['data']['pagination']['total_pages']).to be > 1
      end
    end
    
    context 'when authenticated as non-admin' do
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/admin/audit_logs'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'GET /api/v1/admin/audit_logs/:id' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns the audit log with details' do
        get "/api/v1/admin/audit_logs/#{audit_log.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['audit_log']['id']).to eq(audit_log.id)
        expect(json_response['data']['audit_log']['action']).to eq('login')
        expect(json_response['data']['audit_log']['details']).to be_present
      end
    end
  end
  
  describe 'GET /api/v1/admin/audit_logs/stats' do
    context 'when authenticated as admin' do
      before do
        sign_in admin
        # Create various types of audit logs for stats
        create(:audit_log, user: patient, action: 'login')
        create(:audit_log, user: admin, action: 'update', resource_type: 'User')
        create(:audit_log, user: patient, action: 'view', resource_type: 'MedicalRecord')
      end
      
      it 'returns audit log statistics' do
        get '/api/v1/admin/audit_logs/stats'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['stats']).to be_present
        expect(json_response['data']['stats']['total_logs']).to eq(4) # Including the one from before block
        expect(json_response['data']['stats']['by_action']).to be_present
        expect(json_response['data']['stats']['by_resource_type']).to be_present
      end
      
      it 'returns stats filtered by date range' do
        # Create an old audit log outside the date range
        old_log = create(:audit_log, user: patient, timestamp: 30.days.ago)
        
        get '/api/v1/admin/audit_logs/stats', params: {
          start_date: 7.days.ago.to_date.to_s,
          end_date: Date.today.to_s
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['stats']['total_logs']).to eq(4) # Not including old_log
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
