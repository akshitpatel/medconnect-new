# spec/requests/api/v1/provider_messages_spec.rb
require 'rails_helper'

RSpec.describe 'Provider Messages API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:conversation) { create(:conversation, participant_a: provider, participant_b: patient) }
  let!(:message) { create(:message, conversation: conversation, sender: provider) }
  
  describe 'GET /api/v1/provider/conversations' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'returns all provider conversations' do
        get '/api/v1/provider/conversations'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversations'].size).to eq(1)
      end
      
      it 'includes patient information in conversations' do
        get '/api/v1/provider/conversations'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['conversations'][0]['other_participant']).to be_present
        expect(json_response['data']['conversations'][0]['other_participant']['email']).to eq(patient.email)
      end
    end
    
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/provider/conversations'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'GET /api/v1/provider/conversations/:id' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'returns the conversation with messages' do
        get "/api/v1/provider/conversations/#{conversation.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversation']['id']).to eq(conversation.id)
        expect(json_response['data']['messages'].size).to eq(1)
      end
      
      it 'marks patient messages as read when conversation is viewed' do
        # Create an unread message from patient
        unread_message = create(:message, conversation: conversation, sender: patient, read_at: nil)
        
        get "/api/v1/provider/conversations/#{conversation.id}"
        
        expect(response).to have_http_status(:ok)
        expect(unread_message.reload.read_at).not_to be_nil
      end
    end
  end
  
  describe 'POST /api/v1/provider/conversations' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      let(:new_patient) { create(:patient) }
      let(:valid_attributes) do
        {
          conversation: {
            participant_id: new_patient.id,
            message: {
              body: 'Hello, I need to discuss your recent lab results'
            }
          }
        }
      end
      
      it 'creates a new conversation with initial message' do
        expect {
          post '/api/v1/provider/conversations', params: valid_attributes
        }.to change(Conversation, :count).by(1)
         .and change(Message, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversation']).to be_present
        expect(json_response['data']['message']).to be_present
      end
      
      it 'uses existing conversation if one exists' do
        expect {
          post '/api/v1/provider/conversations', params: {
            conversation: {
              participant_id: patient.id,
              message: {
                body: 'Another message'
              }
            }
          }
        }.to change(Conversation, :count).by(0)
         .and change(Message, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end
    end
  end
  
  describe 'POST /api/v1/provider/conversations/:id/messages' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'adds a message to the conversation' do
        expect {
          post "/api/v1/provider/conversations/#{conversation.id}/messages", params: {
            message: { body: 'We need to schedule a follow-up appointment' }
          }
        }.to change(Message, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['message']['body']).to eq('We need to schedule a follow-up appointment')
      end
      
      it 'creates a notification for the patient' do
        # This will trigger a notification creation in the controller
        post "/api/v1/provider/conversations/#{conversation.id}/messages", params: {
          message: { body: 'Notification test message' }
        }
        
        expect(response).to have_http_status(:created)
        
        # Check if a notification was created for the patient
        notification = Notification.where(user_id: patient.id).last
        expect(notification).to be_present
        expect(notification.notification_type).to eq('message')
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
