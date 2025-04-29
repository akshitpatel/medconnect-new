# spec/requests/api/v1/patients_spec.rb
require 'rails_helper'

RSpec.describe 'Patients API', type: :request do
  let(:patient) { create(:patient) }
  let!(:patient_profile) { create(:patient_profile, user: patient) }
  
  describe 'GET /api/v1/patient/profile' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns the patient profile' do
        get '/api/v1/patient/profile'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['profile']).to be_present
        expect(json_response['data']['profile']['emergency_contact']).to be_present
        expect(json_response['data']['profile']['insurance_details']).to be_present
      end
    end
    
    context 'when authenticated as provider' do
      let(:provider) { create(:provider) }
      before { sign_in provider }
      
      it 'returns forbidden' do
        get '/api/v1/patient/profile'
        
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
  
  describe 'PUT /api/v1/patient/profile' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates basic profile information' do
        put '/api/v1/patient/profile', params: {
          profile: {
            email: 'updated@example.com',
            phone: '555-123-4567'
          }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient.reload.email).to eq('updated@example.com')
      end
    end
  end
  
  describe 'PUT /api/v1/patient/profile/emergency_contact' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates emergency contact information' do
        emergency_contact = {
          name: 'Emergency Contact',
          relationship: 'Spouse',
          phone: '555-911-1234',
          email: 'emergency@example.com'
        }
        
        put '/api/v1/patient/profile/emergency_contact', params: {
          emergency_contact: emergency_contact
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient_profile.reload.emergency_contact['name']).to eq('Emergency Contact')
      end
    end
  end
  
  describe 'PUT /api/v1/patient/profile/insurance' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates insurance information' do
        insurance = {
          provider: 'New Health Insurance',
          policy_number: '123456789',
          group_number: '987654',
          coverage_dates: '2025-01-01 to 2025-12-31'
        }
        
        put '/api/v1/patient/profile/insurance', params: {
          insurance: insurance
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient_profile.reload.insurance_details['provider']).to eq('New Health Insurance')
      end
    end
  end
  
  describe 'PUT /api/v1/patient/profile/health_metrics' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates health metrics' do
        health_metrics = {
          height: '180 cm',
          weight: '75 kg',
          blood_type: 'O+',
          allergies: ['Peanuts', 'Penicillin'],
          last_physical: Date.today.to_s
        }
        
        put '/api/v1/patient/profile/health_metrics', params: {
          health_metrics: health_metrics
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient_profile.reload.health_metrics['height']).to eq('180 cm')
        expect(patient_profile.reload.health_metrics['allergies']).to eq(['Peanuts', 'Penicillin'])
      end
    end
  end
  
  describe 'PUT /api/v1/patient/profile/health_history' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates health history' do
        health_history = {
          conditions: ['Hypertension', 'Asthma'],
          surgeries: ['Appendectomy 2020'],
          medications: ['Lisinopril', 'Albuterol'],
          family_history: 'Diabetes in maternal side, heart disease in paternal side'
        }
        
        put '/api/v1/patient/profile/health_history', params: {
          health_history: health_history
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(patient_profile.reload.health_history['conditions']).to eq(['Hypertension', 'Asthma'])
        expect(patient_profile.reload.health_history['family_history']).to include('Diabetes')
      end
    end
  end
  
  describe 'GET /api/v1/patient/dashboard' do
    context 'when authenticated as patient' do
      before do 
        sign_in patient
        # Create some appointments for the dashboard
        provider = create(:provider)
        create(:appointment, patient: patient, provider: provider, datetime: 1.day.from_now)
        create(:appointment, patient: patient, provider: provider, datetime: 7.days.from_now)
        # Create some notifications
        create(:notification, user: patient, read_at: nil)
      end
      
      it 'returns dashboard data' do
        get '/api/v1/patient/dashboard'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['upcoming_appointments'].size).to eq(2)
        expect(json_response['data']['unread_notifications']).to be_present
        expect(json_response['data']['recent_prescriptions']).to be_an(Array)
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
