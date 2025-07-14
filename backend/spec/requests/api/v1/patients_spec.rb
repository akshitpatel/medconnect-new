# spec/requests/api/v1/patients_spec.rb
require 'rails_helper'

RSpec.describe 'API::V1::Patients', type: :request do
  let(:patient) { User.create!(user_params) }
  let(:provider) { User.create!(provider_params) }
  let(:token) { patient.generate_jwt }

  let(:user_params) do
    {
      full_name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      phone: '+1234567890',
      date_of_birth: '1990-01-01',
      gender: 'male',
      role: 'patient'
    }
  end

  let(:provider_params) do
    {
      full_name: 'Dr. Smith',
      email: 'dr.smith@example.com',
      password: 'password123',
      password_confirmation: 'password123',
      phone: '+1234567891',
      date_of_birth: '1980-01-01',
      gender: 'female',
      role: 'provider'
    }
  end

  before do
    # Create patient profile
    PatientProfile.create!(
      user: patient,
      blood_type: 'O+',
      height: '175',
      weight: '70',
      allergies: ['Penicillin'],
      conditions: ['Hypertension']
    )
  end

  describe 'GET /api/v1/patients/profile' do
    context 'with valid authentication' do
      it 'returns patient profile data' do
        get '/api/v1/patients/profile', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']['personal_info']['email']).to eq('john@example.com')
        expect(json_response['data']['personal_info']['full_name']).to eq('John Doe')
        expect(json_response['data']['health_metrics']['blood_type']).to eq('O+')
      end
    end

    context 'without authentication' do
      it 'returns unauthorized error' do
        get '/api/v1/patients/profile'

        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'with non-patient user' do
      let(:provider_token) { provider.generate_jwt }

      it 'returns forbidden error' do
        get '/api/v1/patients/profile', headers: {
          'Authorization' => "Bearer #{provider_token}"
        }

        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PUT /api/v1/patients/profile' do
    let(:update_params) do
      {
        personal_info: {
          full_name: 'John Updated',
          phone: '+1234567899'
        },
        health_metrics: {
          height: '180',
          weight: '75',
          allergies: ['Penicillin', 'Sulfa']
        }
      }
    end

    context 'with valid authentication and parameters' do
      it 'updates patient profile' do
        put '/api/v1/patients/profile', 
          params: update_params,
          headers: {
            'Authorization' => "Bearer #{token}"
          }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Profile updated successfully')
        
        # Verify the update
        patient.reload
        expect(patient.full_name).to eq('John Updated')
        expect(patient.phone).to eq('+1234567899')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        put '/api/v1/patients/profile', 
          params: { personal_info: { email: 'invalid-email' } },
          headers: {
            'Authorization' => "Bearer #{token}"
          }

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'GET /api/v1/patients/appointments' do
    let!(:appointment) do
      Appointment.create!(
        patient: patient,
        provider: provider,
        appointment_datetime: 1.week.from_now,
        duration_minutes: 30,
        status: 'scheduled',
        appointment_type: 'consultation',
        reason: 'Follow-up visit'
      )
    end

    context 'with valid authentication' do
      it 'returns patient appointments' do
        get '/api/v1/patients/appointments', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']).to be_an(Array)
        expect(json_response['data'].length).to eq(1)
        expect(json_response['data'][0]['reason']).to eq('Follow-up visit')
      end

      it 'filters appointments by status' do
        get '/api/v1/patients/appointments', 
          params: { status: 'scheduled' },
          headers: {
            'Authorization' => "Bearer #{token}"
          }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['data'].length).to eq(1)
      end
    end
  end

  describe 'POST /api/v1/patients/appointments' do
    let(:appointment_params) do
      {
        appointment: {
          provider_id: provider.id,
          appointment_datetime: 1.week.from_now.iso8601,
          duration_minutes: 30,
          appointment_type: 'consultation',
          reason: 'New patient visit'
        }
      }
    end

    context 'with valid parameters' do
      it 'creates a new appointment' do
        expect {
          post '/api/v1/patients/appointments',
            params: appointment_params,
            headers: {
              'Authorization' => "Bearer #{token}"
            }
        }.to change(Appointment, :count).by(1)

        expect(response).to have_http_status(:created)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Appointment created successfully')
      end
    end

    context 'with invalid parameters' do
      it 'returns validation errors' do
        post '/api/v1/patients/appointments',
          params: { appointment: { provider_id: provider.id } },
          headers: {
            'Authorization' => "Bearer #{token}"
          }

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['errors']).to be_present
      end
    end
  end

  describe 'GET /api/v1/patients/medications' do
    let!(:prescription) do
      Prescription.create!(
        patient: patient,
        provider: provider,
        medication_name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        start_date: Date.current,
        refills_allowed: 3,
        refills_remaining: 2,
        instructions: 'Take with food',
        status: 'active'
      )
    end

    context 'with valid authentication' do
      it 'returns patient medications' do
        get '/api/v1/patients/medications', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']).to be_an(Array)
        expect(json_response['data'].length).to eq(1)
        expect(json_response['data'][0]['medication_name']).to eq('Lisinopril')
      end
    end
  end

  describe 'POST /api/v1/patients/medications/:id/refill' do
    let!(:prescription) do
      Prescription.create!(
        patient: patient,
        provider: provider,
        medication_name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        start_date: Date.current,
        refills_allowed: 3,
        refills_remaining: 2,
        instructions: 'Take with food',
        status: 'active'
      )
    end

    context 'with valid prescription' do
      it 'requests medication refill' do
        post "/api/v1/patients/medications/#{prescription.id}/refill", headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['message']).to eq('Refill request submitted successfully')
        
        # Verify refill count decreased
        prescription.reload
        expect(prescription.refills_remaining).to eq(1)
      end
    end

    context 'with no refills remaining' do
      before do
        prescription.update!(refills_remaining: 0)
      end

      it 'returns error' do
        post "/api/v1/patients/medications/#{prescription.id}/refill", headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:unprocessable_entity)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be false
        expect(json_response['error']).to eq('No refills remaining')
      end
    end
  end

  describe 'GET /api/v1/patients/records' do
    let!(:medical_record) do
      MedicalRecord.create!(
        patient: patient,
        provider: provider,
        record_type: 'consultation',
        title: 'Annual Checkup',
        content: 'Patient is in good health',
        date: Date.current
      )
    end

    context 'with valid authentication' do
      it 'returns patient medical records' do
        get '/api/v1/patients/records', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']).to be_an(Array)
        expect(json_response['data'].length).to eq(1)
        expect(json_response['data'][0]['title']).to eq('Annual Checkup')
      end
    end
  end

  describe 'GET /api/v1/patients/messages' do
    let!(:conversation) do
      Conversation.create!(
        participant_a: patient,
        participant_b: provider,
        title: 'Health Consultation'
      )
    end

    let!(:message) do
      Message.create!(
        conversation: conversation,
        sender: provider,
        body: 'How are you feeling today?',
        message_type: 'text'
      )
    end

    context 'with valid authentication' do
      it 'returns patient messages' do
        get '/api/v1/patients/messages', headers: {
          'Authorization' => "Bearer #{token}"
        }

        expect(response).to have_http_status(:ok)
        
        json_response = JSON.parse(response.body)
        expect(json_response['success']).to be true
        expect(json_response['data']).to be_an(Array)
        expect(json_response['data'].length).to eq(1)
        expect(json_response['data'][0]['body']).to eq('How are you feeling today?')
      end
    end
  end
end
