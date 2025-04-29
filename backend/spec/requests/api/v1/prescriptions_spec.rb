# spec/requests/api/v1/prescriptions_spec.rb
require 'rails_helper'

RSpec.describe 'Prescriptions API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:prescription) do
    create(:prescription, 
           patient: patient, 
           provider: provider, 
           medication_name: 'Lisinopril',
           status: 'active')
  end
  
  describe 'GET /api/v1/prescriptions' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns all patient prescriptions' do
        # Create another prescription for same patient
        create(:prescription, patient: patient, provider: provider, medication_name: 'Metformin')
        
        get '/api/v1/prescriptions'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['prescriptions'].size).to eq(2)
      end
      
      it 'filters prescriptions by status' do
        create(:prescription, patient: patient, provider: provider, status: 'expired')
        
        get '/api/v1/prescriptions', params: { status: 'active' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['prescriptions'].size).to eq(1)
        expect(json_response['data']['prescriptions'][0]['status']).to eq('active')
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/prescriptions'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'GET /api/v1/prescriptions/:id' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns the prescription' do
        get "/api/v1/prescriptions/#{prescription.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['prescription']['id']).to eq(prescription.id)
        expect(json_response['data']['prescription']['medication_name']).to eq('Lisinopril')
      end
      
      it 'returns not found for other patients prescriptions' do
        other_patient = create(:patient)
        other_prescription = create(:prescription, patient: other_patient, provider: provider)
        
        get "/api/v1/prescriptions/#{other_prescription.id}"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  describe 'POST /api/v1/prescriptions/:id/refill' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'creates a refill request for a prescription' do
        post "/api/v1/prescriptions/#{prescription.id}/refill", params: {
          notes: 'Running low on medication'
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['refill_request']).to be_present
      end
      
      it 'cannot refill a prescription with no refills remaining' do
        # Update prescription to have no refills left
        prescription.update(refills_allowed: 1, refills_used: 1)
        
        post "/api/v1/prescriptions/#{prescription.id}/refill"
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['success']).to be false
      end
      
      it 'cannot refill an expired prescription' do
        # Update prescription to expired status
        prescription.update(status: 'expired')
        
        post "/api/v1/prescriptions/#{prescription.id}/refill"
        
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json_response['success']).to be false
      end
    end
  end
  
  # Provider perspective - creating and managing prescriptions
  describe 'POST /api/v1/provider/patients/:patient_id/prescriptions' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      let(:valid_attributes) do
        {
          prescription: {
            medication_name: 'Amoxicillin',
            dosage: '500 mg',
            frequency: 'Three times daily',
            duration: '10 days',
            refills_allowed: 0,
            notes: 'Take with food',
            pharmacy_notes: 'Dispense as written'
          }
        }
      end
      
      it 'creates a new prescription for a patient' do
        expect {
          post "/api/v1/provider/patients/#{patient.id}/prescriptions", params: valid_attributes
        }.to change(Prescription, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['prescription']['medication_name']).to eq('Amoxicillin')
      end
    end
  end
  
  describe 'PUT /api/v1/provider/prescriptions/:id' do
    context 'when authenticated as provider' do
      before { sign_in provider }
      
      it 'updates a prescription' do
        put "/api/v1/provider/prescriptions/#{prescription.id}", params: {
          prescription: { notes: 'Updated instructions', refills_allowed: 3 }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(prescription.reload.notes).to eq('Updated instructions')
        expect(prescription.reload.refills_allowed).to eq(3)
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
