module Api
  module V1
    class ProvidersController < BaseController
      before_action :authenticate_user!
      before_action :authorize_provider!
      before_action :ensure_provider_profile, except: [:dashboard]
      
      # GET /api/v1/providers/dashboard
      def dashboard
        # Get upcoming appointments for today
        today = Date.current
        upcoming_appointments = current_user.appointments_as_provider
                                          .where("DATE(appointment_datetime) = ? AND status = ?", today, Appointment.statuses[:scheduled])
                                          .includes(:patient)
                                          .order(appointment_datetime: :asc)
                                          .limit(5)
        
        # Get recent patients with activity
        recent_patients = current_user.appointments_as_provider
                                     .includes(:patient)
                                     .where("appointment_datetime < ?", Time.current)
                                     .order(appointment_datetime: :desc)
                                     .limit(5)
                                     .map(&:patient)
                                     .uniq
        
        # Count total appointments for various statistics
        today_appointments_count = current_user.appointments_as_provider
                                              .where("DATE(appointment_datetime) = ?", today)
                                              .count
        
        pending_reports_count = current_user.medical_records_as_provider
                                          .where(status: :draft)
                                          .count
        
        upcoming_surgeries_count = current_user.appointments_as_provider
                                              .where("appointment_datetime > ? AND appointment_type = 'surgery'", Time.current)
                                              .count
        
        # Prepare dashboard data
        dashboard_data = {
          summary: {
            patients_today: today_appointments_count,
            total_appointments: current_user.appointments_as_provider.count,
            pending_reports: pending_reports_count,
            surgery_schedule: upcoming_surgeries_count
          },
          upcoming_appointments: upcoming_appointments.map { |appointment| appointment_summary(appointment) },
          recent_patient_activity: recent_patients.map { |patient| patient_summary(patient) }
        }
        
        render json: {
          success: true,
          data: { dashboard: dashboard_data },
          message: "Provider dashboard data retrieved successfully."
        }, status: :ok
      end
      
      # GET /api/v1/providers/profile
      def profile
        render json: {
          success: true,
          data: { profile: provider_profile_to_json },
          message: "Provider profile retrieved successfully."
        }, status: :ok
      end
      
      # PUT /api/v1/providers/profile
      def update_profile
        section = params[:section] || 'basic_info'
        
        case section
        when 'basic_info'
          result = update_basic_info
        when 'professional_info'
          result = update_professional_info
        when 'services'
          result = update_services
        when 'availability'
          result = update_availability
        else
          result = { success: false, error: "Unknown profile section: #{section}" }
        end
        
        if result[:success]
          render json: {
            success: true,
            data: result[:data],
            message: "#{section.humanize} updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: result[:errors] || [result[:error]]
          }, status: :unprocessable_entity
        end
      end
      
      private
      
      def authorize_provider!
        unless current_user.provider?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end
      
      def ensure_provider_profile
        # Create provider profile if it doesn't exist yet
        current_user.create_provider_profile if current_user.provider_profile.nil?
      end
      
      # Dashboard helper methods
      def appointment_summary(appointment)
        {
          id: appointment.id,
          patient: {
            id: appointment.patient.id,
            name: appointment.patient.full_name,
            age: calculate_age(appointment.patient.date_of_birth),
            gender: appointment.patient.gender
          },
          appointment_time: appointment.appointment_datetime,
          appointment_type: appointment.appointment_type,
          status: appointment.status
        }
      end
      
      def patient_summary(patient)
        last_appointment = patient.appointments_as_patient
                                 .where(provider_id: current_user.id)
                                 .order(appointment_datetime: :desc)
                                 .first
        
        {
          id: patient.id,
          name: patient.full_name,
          age: calculate_age(patient.date_of_birth),
          gender: patient.gender,
          last_visit: last_appointment&.appointment_datetime,
          condition: last_appointment&.reason
        }
      end
      
      def calculate_age(date_of_birth)
        return nil unless date_of_birth
        now = Time.current.to_date
        now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
      end
      
      # Profile methods
      def provider_profile_to_json
        profile = current_user.provider_profile
        
        {
          id: current_user.id,
          firstName: current_user.full_name.split.first,
          lastName: current_user.full_name.split.last,
          email: current_user.email,
          phone: current_user.phone,
          specialization: profile.specialization,
          bio: profile.bio,
          languages: profile.languages || [],
          profileImage: profile.profile_image_url,
          licenseNumber: profile.license_number,
          education: profile.education || [],
          experience: profile.experience || [],
          services: profile.services || [],
          consultationFee: profile.consultation_fee,
          availability: profile.availability || {}
        }
      end
      
      def update_basic_info
        if current_user.update(basic_info_params) && current_user.provider_profile.update(basic_profile_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          errors = current_user.errors.full_messages + current_user.provider_profile.errors.full_messages
          { success: false, errors: errors }
        end
      end
      
      def update_professional_info
        profile = current_user.provider_profile
        
        # Update professional fields
        if params[:education].present?
          profile.education = params[:education]
        end
        
        if params[:experience].present?
          profile.experience = params[:experience]
        end
        
        if params[:languages].present?
          profile.languages = params[:languages]
        end
        
        if profile.update(professional_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      def update_services
        profile = current_user.provider_profile
        
        if params[:services].present?
          profile.services = params[:services]
        end
        
        if profile.update(services_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      def update_availability
        profile = current_user.provider_profile
        
        if params[:availability].present?
          profile.availability = params[:availability]
        end
        
        if profile.save
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      # Strong params
      def basic_info_params
        params.require(:basic_info).permit(:full_name, :email, :phone)
      end
      
      def basic_profile_params
        params.require(:basic_info).permit(:bio, :profile_image_url, :license_number, :specialization)
      end
      
      def professional_params
        params.permit(:license_number, :specialization, :bio)
      end
      
      def services_params
        params.permit(:consultation_fee)
      end
    end
  end
end
