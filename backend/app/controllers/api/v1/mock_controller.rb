module Api
  module V1
    class MockController < BaseController
      # Skip authentication for mock endpoints
      skip_before_action :authenticate_user!, only: [:patient_dashboard]
      
      # GET /api/v1/mock/patient_dashboard
      def patient_dashboard
        render json: {
          success: true,
          data: {
            profile: mock_profile,
            appointments: mock_appointments,
            medications: mock_medications,
            messages: mock_messages
          },
          message: "Mock patient dashboard data retrieved successfully."
        }, status: :ok
      end
      
      private
      
      def mock_profile
        {
          id: "p123456",
          fullName: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "+1 (555) 123-4567",
          dateOfBirth: "1985-06-15",
          bloodType: "O+",
          insuranceInfo: {
            provider: "HealthPlus Insurance",
            policyNumber: "HP98765432",
            validUntil: "2026-12-31"
          },
          emergencyContact: {
            name: "John Johnson",
            phone: "+1 (555) 987-6543",
            relationship: "Spouse"
          },
          allergies: ["Penicillin", "Peanuts"],
          conditions: ["Hypertension", "Asthma"]
        }
      end
      
      def mock_appointments
        [
          {
            id: "a123",
            appointment_datetime: (Time.now + 7.days).strftime("%Y-%m-%d %H:%M:%S"),
            duration_minutes: 30,
            status: "scheduled",
            appointment_type: "Annual Check-up",
            reason: "Yearly physical examination",
            notes: "Please bring your insurance card",
            provider: {
              id: "d456",
              fullName: "Dr. James Wilson",
              specialty: "Family Medicine"
            }
          },
          {
            id: "a124",
            appointment_datetime: (Time.now + 14.days).strftime("%Y-%m-%d %H:%M:%S"),
            duration_minutes: 45,
            status: "scheduled",
            appointment_type: "Follow-up",
            reason: "Review blood work results",
            notes: "Fasting required before appointment",
            provider: {
              id: "d789",
              fullName: "Dr. Emily Chen",
              specialty: "Cardiology"
            }
          }
        ]
      end
      
      def mock_medications
        [
          {
            id: "m123",
            name: "Lisinopril",
            dosage: "10mg",
            frequency: "Once daily with breakfast",
            start_date: (Time.now - 60.days).strftime("%Y-%m-%d"),
            end_date: nil,
            instructions: "Take with food",
            prescriber: {
              id: "d456",
              fullName: "Dr. James Wilson"
            }
          },
          {
            id: "m124",
            name: "Ventolin HFA",
            dosage: "90mcg",
            frequency: "2 puffs every 4-6 hours as needed",
            start_date: (Time.now - 90.days).strftime("%Y-%m-%d"),
            end_date: nil,
            instructions: "Use for asthma symptoms",
            prescriber: {
              id: "d789",
              fullName: "Dr. Emily Chen"
            }
          }
        ]
      end
      
      def mock_messages
        [
          {
            id: "msg123",
            content: "Your lab results are ready. Everything looks normal, but I'd like to discuss your cholesterol levels during our next appointment.",
            created_at: (Time.now - 2.days).strftime("%Y-%m-%d %H:%M:%S"),
            read: false,
            sender: {
              id: "d456",
              fullName: "Dr. James Wilson",
              role: "doctor"
            },
            conversation: {
              id: "c123",
              title: "Lab Results Discussion"
            }
          },
          {
            id: "msg124",
            content: "Just a reminder about your upcoming appointment on Tuesday. Please remember to bring your current medication list.",
            created_at: (Time.now - 5.days).strftime("%Y-%m-%d %H:%M:%S"),
            read: true,
            sender: {
              id: "d789",
              fullName: "Dr. Emily Chen",
              role: "doctor"
            },
            conversation: {
              id: "c124",
              title: "Appointment Reminders"
            }
          }
        ]
      end
    end
  end
end
