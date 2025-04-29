# spec/requests/api/v1/appointments_spec.rb
require 'rails_helper'

RSpec.describe 'Appointments API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:appointment) do
    create(:appointment, 
           patient: patient, 
           provider: provider, 
           appointment_datetime: 1.day.from_now, 
           status: 'scheduled')
  end
  
  describe 'GET /api/v1/appointments' do
    context 'when authenticated as patient' do
      # No need for before block as we're using the _with_auth methods directly
      
      it 'returns all patient appointments' do
        # Create another appointment for same patient
        create(:appointment, patient: patient, provider: provider, appointment_datetime: 2.days.from_now)
        
        get_with_auth '/api/v1/patients/appointments', patient
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointments'].size).to eq(2)
      end
      
      it 'filters appointments by status' do
        create(:appointment, patient: patient, provider: provider, appointment_datetime: 2.days.from_now, status: 'cancelled_by_patient')
        
        get_with_auth '/api/v1/patients/appointments', patient, params: { status: 'scheduled' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['appointments'].size).to eq(1)
        expect(json_response['data']['appointments'][0]['status']).to eq('scheduled')
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/patients/appointments'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'GET /api/v1/appointments/:id' do
    context 'when authenticated as patient' do
      # No need for before block as we're using the _with_auth methods directly
      
      it 'returns the appointment' do
        get_with_auth "/api/v1/patients/appointments/#{appointment.id}", patient
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointment']['id']).to eq(appointment.id)
      end
      
      it 'returns not found for other patients appointments' do
        other_patient = create(:patient)
        other_appointment = create(:appointment, patient: other_patient, provider: provider)
        
        get_with_auth "/api/v1/patients/appointments/#{other_appointment.id}", patient
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  describe 'POST /api/v1/appointments' do
    context 'when authenticated as patient' do
      # No need for before block as we're using the _with_auth methods directly
      
      let(:valid_attributes) do
        {
          appointment: {
            provider_id: provider.id,
            appointment_datetime: 3.days.from_now,
            duration_minutes: 30,
            appointment_type: 'regular',
            reason: 'Checkup',
            notes: 'First visit'
          }
        }
      end
      
      it 'creates a new appointment' do
        expect {
          post_with_auth '/api/v1/patients/appointments', patient, params: valid_attributes
        }.to change(Appointment, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['appointment']['reason']).to eq('Checkup')
      end
      
      it 'fails with invalid attributes' do
        invalid_attributes = valid_attributes.deep_dup
        invalid_attributes[:appointment][:appointment_datetime] = nil
        
        expect {
          post_with_auth '/api/v1/patients/appointments', patient, params: invalid_attributes
        }.not_to change(Appointment, :count)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe 'PUT /api/v1/appointments/:id' do
    context 'when authenticated as patient' do
      # No need for before block as we're using the _with_auth methods directly
      
      it 'updates the appointment' do
        put_with_auth "/api/v1/patients/appointments/#{appointment.id}", patient, params: {
          appointment: { notes: 'Updated notes' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(appointment.reload.notes).to eq('Updated notes')
      end
      
      it 'cannot update completed appointments' do
        completed_appointment = create(:appointment, 
                                      patient: patient, 
                                      provider: provider, 
                                      status: 'completed')
        
        put_with_auth "/api/v1/patients/appointments/#{completed_appointment.id}", patient, params: {
          appointment: { notes: 'Updated notes' }
        }
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe 'DELETE /api/v1/appointments/:id' do
    context 'when authenticated as patient' do
      # No need for before block as we're using the _with_auth methods directly
      
      it 'cancels the appointment' do
        delete_with_auth "/api/v1/patients/appointments/#{appointment.id}", patient
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(appointment.reload.status).to eq('cancelled_by_patient')
      end
      
      it 'cannot cancel completed appointments' do
        completed_appointment = create(:appointment, 
                                      patient: patient, 
                                      provider: provider, 
                                      status: 'completed')
        
        delete_with_auth "/api/v1/patients/appointments/#{completed_appointment.id}", patient
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
