# spec/requests/api/v1/records_spec.rb
require 'rails_helper'

RSpec.describe 'Medical Records API', type: :request do
  let(:patient) { create(:patient) }
  let(:provider) { create(:provider) }
  let!(:medical_record) do
    create(:medical_record, 
           patient: patient, 
           provider: provider, 
           record_type: 'lab_result',
           title: 'Blood test')
  end
  
  describe 'GET /api/v1/records' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns all patient medical records' do
        # Create another record for same patient
        create(:medical_record, patient: patient, provider: provider, record_type: 'imaging')
        
        get '/api/v1/records'
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['records'].size).to eq(2)
      end
      
      it 'filters records by type' do
        create(:medical_record, patient: patient, provider: provider, record_type: 'imaging')
        
        get '/api/v1/records', params: { record_type: 'lab_result' }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['data']['records'].size).to eq(1)
        expect(json_response['data']['records'][0]['record_type']).to eq('lab_result')
      end
    end
    
    context 'when not authenticated' do
      it 'returns unauthorized' do
        get '/api/v1/records'
        
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
  
  describe 'GET /api/v1/records/:id' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'returns the medical record' do
        get "/api/v1/records/#{medical_record.id}"
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(json_response['data']['record']['id']).to eq(medical_record.id)
      end
      
      it 'returns not found for other patients records' do
        other_patient = create(:patient)
        other_record = create(:medical_record, patient: other_patient, provider: provider)
        
        get "/api/v1/records/#{other_record.id}"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  describe 'POST /api/v1/records' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      let(:valid_attributes) do
        {
          record: {
            provider_id: provider.id,
            title: 'New lab results',
            description: 'Cholesterol test results',
            record_type: 'lab_result',
            record_date: Time.current
          }
        }
      end
      
      it 'creates a new medical record' do
        expect {
          post '/api/v1/records', params: valid_attributes
        }.to change(MedicalRecord, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['record']['title']).to eq('New lab results')
      end
      
      it 'creates a new medical record with file attachment' do
        # Create a test file
        file = Rack::Test::UploadedFile.new(
          StringIO.new('test file content'), 
          'application/pdf', 
          original_filename: 'test.pdf'
        )
        
        expect {
          post '/api/v1/records', 
               params: valid_attributes.deep_merge(record: { file: file })
        }.to change(MedicalRecord, :count).by(1)
        
        expect(response).to have_http_status(:created)
        expect(json_response['success']).to be true
        expect(json_response['data']['record']['file_url']).to be_present
        
        # Verify attachment presence
        record = MedicalRecord.last
        expect(record.file).to be_attached
      end
      
      it 'fails with invalid attributes' do
        invalid_attributes = valid_attributes.deep_dup
        invalid_attributes[:record][:title] = nil
        
        expect {
          post '/api/v1/records', params: invalid_attributes
        }.not_to change(MedicalRecord, :count)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
  
  describe 'PUT /api/v1/records/:id' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'updates the medical record' do
        put "/api/v1/records/#{medical_record.id}", params: {
          record: { description: 'Updated description' }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(medical_record.reload.description).to eq('Updated description')
      end
      
      it 'updates the file attachment' do
        file = Rack::Test::UploadedFile.new(
          StringIO.new('updated file content'), 
          'application/pdf', 
          original_filename: 'updated.pdf'
        )
        
        put "/api/v1/records/#{medical_record.id}", params: {
          record: { file: file }
        }
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
        expect(medical_record.reload.file).to be_attached
      end
    end
  end
  
  describe 'DELETE /api/v1/records/:id' do
    context 'when authenticated as patient' do
      before { sign_in patient }
      
      it 'deletes the medical record' do
        expect {
          delete "/api/v1/records/#{medical_record.id}"
        }.to change(MedicalRecord, :count).by(-1)
        
        expect(response).to have_http_status(:ok)
        expect(json_response['success']).to be true
      end
      
      it 'returns not found for other patients records' do
        other_patient = create(:patient)
        other_record = create(:medical_record, patient: other_patient, provider: provider)
        
        delete "/api/v1/records/#{other_record.id}"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
  
  # Helper method to parse JSON response
  def json_response
    JSON.parse(response.body)
  end
end
