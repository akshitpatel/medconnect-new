# spec/requests/api/v1/provider_appointments_spec.rb
require 'rails_helper'

RSpec.describe 'Provider Appointments API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:appointment) do
    create(:appointment, 
           patient: patient, 
           provider: provider, 
           datetime: 1.day.from_now, 
           status: 'scheduled')
  end
  
  describe 'GET /api/v1/provider/appointments' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'returns all provider appointments' do
        # Create another appointment for same provider
        create(:appointment, patient: patient, provider: provider, datetime: 2.days.from_now)
        
        get '/api/v1/provider/appointments'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointments'].size).to eq(2)
      end
      
      it 'filters appointments by date range' do
        # Create appointments on different days
        create(:appointment, 
               patient: patient, 
               provider: provider, 
               datetime: 10.days.from_now)
        
        get '/api/v1/provider/appointments', params: { 
          start_date: Date.tomorrow.to_s,
          end_date: 3.days.from_now.to_date.to_s
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['appointments'].size).to eq(2)
      end
    end
    
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns forbidden' do
        get '/api/v1/provider/appointments'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/provider/appointments'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'GET /api/v1/provider/appointments/:id' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'returns the appointment with patient details' do
        get "/api/v1/provider/appointments/#{appointment.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointment']['id']).to eq(appointment.id)
        expect(json_response['data']['patient']).to be_present
      end
      
      it 'returns not found for other providers appointments' do
        other_provider = create(:provider)
        other_appointment = create(:appointment, patient: patient, provider: other_provider)
        
        get "/api/v1/provider/appointments/#{other_appointment.id}"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  describe 'PUT /api/v1/provider/appointments/:id' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'updates the appointment status' do
        put "/api/v1/provider/appointments/#{appointment.id}", params: {
          appointment: { status: 'confirmed' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(appointment.reload.status).to eq('confirmed')
      end
      
      it 'adds provider notes to the appointment' do
        put "/api/v1/provider/appointments/#{appointment.id}", params: {
          appointment: { provider_notes: 'Patient needs follow-up' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(appointment.reload.provider_notes).to eq('Patient needs follow-up')
      end
    end
  end
  
  describe 'POST /api/v1/provider/appointments' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      let(:valid_attributes) do
        {
          appointment: {
            patient_id: patient.id,
            datetime: 3.days.from_now,
            duration: 30,
            appointment_type: 'follow_up',
            reason: 'Follow-up visit',
            notes: 'Scheduled by provider'
          }
        }
      end
      
      it 'creates a new appointment for a patient' do
        expect {
          post '/api/v1/provider/appointments', params: valid_attributes
        }.to change(Appointment, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointment']['reason']).to eq('Follow-up visit')
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
