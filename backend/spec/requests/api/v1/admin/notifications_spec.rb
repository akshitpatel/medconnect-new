# spec/requests/api/v1/admin/notifications_spec.rb
require 'rails_helper'

RSpec.describe 'Admin Notifications API', type: :request do
  let(:admin) { create(:admin) }
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:notification) { create(:notification, user: patient, priority: 'normal') }
  
  describe 'GET /api/v1/admin/notifications' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'returns all notifications' do
        # Create more notifications
        create(:notification, user: provider, priority: 'high')
        create(:notification, user: admin, priority: 'low')
        
        get '/api/v1/admin/notifications'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['notifications'].size).to eq(3)
      end
      
      it 'filters notifications by user_id' do
        create(:notification, user: provider)
        
        get '/api/v1/admin/notifications', params: { user_id: patient.id }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['notifications'].size).to eq(1)
        expect(json_response['data']['notifications'][0]['user_id']).to eq(patient.id)
      end
      
      it 'filters notifications by priority' do
        create(:notification, user: patient, priority: 'high')
        
        get '/api/v1/admin/notifications', params: { priority: 'high' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['notifications'].size).to eq(1)
        expect(json_response['data']['notifications'][0]['priority']).to eq('high')
      end
    end
    
    context 'when authenticated as non-admin' do
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/admin/notifications'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'POST /api/v1/admin/notifications' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      let(:valid_attributes) do
        {
          notification: {
            user_id: patient.id,
            title: 'System Maintenance',
            message: 'The system will be down for maintenance tomorrow',
            notification_type: 'system',
            priority: 'high'
          }
        }
      end
      
      it 'creates a new notification for a user' do
        expect {
          post '/api/v1/admin/notifications', params: valid_attributes
        }.to change(Notification, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['notification']['title']).to eq('System Maintenance')
      end
      
      it 'broadcasts the notification through ActionCable', skip: 'WebSocket tests require special setup' do
        # This would require a more complex setup to test ActionCable broadcasting
      end
    end
  end
  
  describe 'POST /api/v1/admin/notifications/broadcast' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      let(:broadcast_attributes) do
        {
          notification: {
            title: 'Platform Update',
            message: 'New features are now available',
            notification_type: 'system',
            priority: 'normal',
            recipient_role: 'all' # Can be 'all', 'patients', 'providers'
          }
        }
      end
      
      it 'creates notifications for all users' do
        expect {
          post '/api/v1/admin/notifications/broadcast', params: broadcast_attributes
        }.to change(Notification, :count).by(3) # admin, patient, provider
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['count']).to eq(3)
      end
      
      it 'creates notifications only for patients when specified' do
        broadcast_attributes[:notification][:recipient_role] = 'patients'
        
        expect {
          post '/api/v1/admin/notifications/broadcast', params: broadcast_attributes
        }.to change(Notification, :count).by(1)
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['count']).to eq(1)
      end
    end
  end
  
  describe 'PUT /api/v1/admin/notifications/:id/mark_read' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'marks a notification as read' do
        expect(notification.read_at).to be_nil
        
        put "/api/v1/admin/notifications/#{notification.id}/mark_read"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(notification.reload.read_at).not_to be_nil
      end
    end
  end
  
  describe 'DELETE /api/v1/admin/notifications/:id' do
    context 'when authenticated as admin' do
      before { sign_in admin }
      
      it 'deletes a notification' do
        expect {
          delete "/api/v1/admin/notifications/#{notification.id}"
        }.to change(Notification, :count).by(-1)
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
