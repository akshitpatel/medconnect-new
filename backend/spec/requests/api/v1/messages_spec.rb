# spec/requests/api/v1/messages_spec.rb
require 'rails_helper'

RSpec.describe 'Messages API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:conversation) { create(:conversation, participant_a: patient, participant_b: provider) }
  let!(:message) { create(:message, conversation: conversation, sender: patient) }
  
  describe 'GET /api/v1/conversations' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns all patient conversations' do
        get '/api/v1/conversations'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversations'].size).to eq(1)
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/conversations'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'GET /api/v1/conversations/:id' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns the conversation with messages' do
        get "/api/v1/conversations/#{conversation.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversation']['id']).to eq(conversation.id)
        expect(json_response['data']['messages'].size).to eq(1)
      end
      
      it 'returns not found for other users conversations' do
        other_patient = create(:patient)
        other_conversation = create(:conversation, participant_a: other_patient, participant_b: provider)
        
        get "/api/v1/conversations/#{other_conversation.id}"
        
        expect(response).to have_http_status(:not_found)
      end
      
      it 'marks messages as read when conversation is viewed' do
        # Create an unread message from provider
        unread_message = create(:message, conversation: conversation, sender: provider, read_at: nil)
        
        get "/api/v1/conversations/#{conversation.id}"
        
        expect(response).to have_http_status(:ok)
        expect(unread_message.reload.read_at).not_to be_nil
      end
    end
  end
  
  describe 'POST /api/v1/conversations' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      let(:new_provider) { create(:provider) }
      let(:valid_attributes) do
        {
          conversation: {
            participant_id: new_provider.id,
            message: {
              body: 'Hello doctor, I have a question'
            }
          }
        }
      end
      
      it 'creates a new conversation with initial message' do
        expect {
          post '/api/v1/conversations', params: valid_attributes
        }.to change(Conversation, :count).by(1)
         .and change(Message, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['conversation']).to be_present
        expect(json_response['data']['message']).to be_present
      end
      
      it 'uses existing conversation if one exists' do
        expect {
          post '/api/v1/conversations', params: {
            conversation: {
              participant_id: provider.id,
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
  
  describe 'POST /api/v1/conversations/:id/messages' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'adds a message to the conversation' do
        expect {
          post "/api/v1/conversations/#{conversation.id}/messages", params: {
            message: { body: 'New message content' }
          }
        }.to change(Message, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['message']['body']).to eq('New message content')
      end
      
      it 'broadcasts the message through ActionCable', skip: 'WebSocket tests require special setup' do
        # This would require a more complex setup to test ActionCable broadcasting
        # Consider using action-cable-testing gem for this
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
