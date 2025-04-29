module Api
  module V1
    class PatientsController < BaseController
      before_action :authenticate_user!
      before_action :authorize_patient!
      before_action :ensure_patient_profile

      # GET /api/v1/patients/profile
      def profile
        # Return the current user's profile with all relevant details
        render json: {
          success: true,
          data: {
            profile: {
              personal_info: {
                id: current_user.id,
                name: current_user.full_name,
                email: current_user.email,
                phone: current_user.phone,
                date_of_birth: current_user.date_of_birth,
                gender: current_user.gender,
                address: current_user.address,
                passport_number: current_user.passport_number
              },
              emergency_contact: emergency_contact_data,
              insurance: insurance_data,
              health_metrics: health_metrics_data,
              health_history: health_history_data
            }
          },
          message: "Patient profile retrieved successfully."
        }, status: :ok
      end

      # PUT /api/v1/patients/profile
      def update_profile
        # We'll handle different sections of the profile separately
        profile_section = params[:section] || 'personal_info'

        case profile_section
        when 'personal_info'
          result = update_personal_info
        when 'emergency_contact'
          result = update_emergency_contact
        when 'insurance'
          result = update_insurance
        when 'health_metrics'
          result = update_health_metrics
        when 'health_history'
          result = update_health_history
        else
          result = { success: false, error: "Unknown profile section: #{profile_section}" }
        end

        if result[:success]
          render json: {
            success: true,
            data: result[:data],
            message: "#{profile_section.humanize} updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: result[:errors] || [result[:error]]
          }, status: :unprocessable_entity
        end
      end

      private

      def authorize_patient!
        unless current_user.patient?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end

      def ensure_patient_profile
        # Create patient profile if it doesn't exist yet
        current_user.create_patient_profile if current_user.patient_profile.nil?
      end

      # Helper methods to fetch related profile data
      def emergency_contact_data
        current_user.patient_profile.emergency_contact || {}
      end

      def insurance_data
        current_user.patient_profile.insurance_details || {}
      end

      def health_metrics_data
        current_user.patient_profile.health_metrics || {}
      end

      def health_history_data
        current_user.patient_profile.health_history || []
      end

      # Update methods for each profile section
      def update_personal_info
        if current_user.update(personal_info_params)
          {
            success: true,
            data: {
              personal_info: {
                id: current_user.id,
                name: current_user.full_name,
                email: current_user.email,
                phone: current_user.phone,
                date_of_birth: current_user.date_of_birth,
                gender: current_user.gender,
                address: current_user.address,
                passport_number: current_user.passport_number
              }
            }
          }
        else
          { success: false, errors: current_user.errors.full_messages }
        end
      end

      def update_emergency_contact
        profile = current_user.patient_profile
        profile.emergency_contact = emergency_contact_params.to_h
        
        if profile.save
          { success: true, data: { emergency_contact: emergency_contact_data } }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end

      def update_insurance
        profile = current_user.patient_profile
        profile.insurance_details = insurance_params.to_h
        
        if profile.save
          { success: true, data: { insurance: insurance_data } }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end

      def update_health_metrics
        profile = current_user.patient_profile
        profile.health_metrics = health_metrics_params.to_h
        
        if profile.save
          { success: true, data: { health_metrics: health_metrics_data } }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end

      def update_health_history
        profile = current_user.patient_profile
        # Health history is an array of health events/conditions
        profile.health_history = params[:health_history] || []
        
        if profile.save
          { success: true, data: { health_history: health_history_data } }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end

      # Strong params for each section
      def personal_info_params
        params.require(:personal_info).permit(
          :full_name,
          :email,
          :phone,
          :date_of_birth,
          :gender,
          :address,
          :passport_number
        )
      end

      def emergency_contact_params
        params.require(:emergency_contact).permit(
          :name,
          :relationship,
          :phone
        )
      end

      def insurance_params
        params.require(:insurance).permit(
          :provider,
          :policy_number,
          :group_number,
          :primary
        )
      end

      def health_metrics_params
        params.require(:health_metrics).permit(
          :height,
          :weight,
          :blood_pressure,
          :blood_type,
          :allergies => []
        )
      end
    end
  end
end
