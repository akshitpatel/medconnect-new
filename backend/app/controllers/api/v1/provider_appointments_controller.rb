module Api
  module V1
    class ProviderAppointmentsController < BaseController
      before_action :authenticate_user!
      before_action :authorize_provider!
      before_action :set_appointment, only: [:show, :update, :destroy]

      # GET /api/v1/providers/appointments
      def index
        @appointments = current_user.appointments_as_provider.includes(:patient)
        
        # Apply filtering if parameters are provided
        @appointments = apply_filters(@appointments)
        
        # Apply pagination
        @appointments = paginate(@appointments)
        
        render json: {
          success: true,
          data: { 
            appointments: @appointments.map { |appt| provider_appointment_to_json(appt) },
            pagination: pagination_data(@appointments)
          },
          message: "Appointments retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/providers/appointments/:id
      def show
        render json: {
          success: true,
          data: { appointment: provider_appointment_to_json(@appointment, include_details: true) },
          message: "Appointment details retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/providers/appointments
      def create
        @appointment = current_user.appointments_as_provider.build(appointment_params)
        
        # Validate patient existence
        unless User.where(id: params[:appointment][:patient_id], role: 'patient').exists?
          return render json: { 
            success: false, 
            error: 'Patient not found or is not a valid patient' 
          }, status: :unprocessable_entity
        end
        
        if @appointment.save
          # TODO: Notify patient about new appointment
          render json: {
            success: true,
            data: { appointment: provider_appointment_to_json(@appointment) },
            message: 'Appointment created successfully.'
          }, status: :created
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/providers/appointments/:id
      def update
        # Provider can update appointment including changing status
        if @appointment.update(provider_appointment_params)
          # If appointment is being cancelled by provider
          if params[:appointment][:status] == 'cancelled_by_provider'
            # TODO: Notify patient about cancellation
          end
          
          # If appointment is being marked as completed
          if params[:appointment][:status] == 'completed'
            # TODO: Prompt for follow-up notes or additional actions
          end
          
          render json: {
            success: true,
            data: { appointment: provider_appointment_to_json(@appointment) },
            message: 'Appointment updated successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/providers/appointments/:id
      def destroy
        # Providers should use cancel instead of delete, but we'll allow deletion of future appointments
        if @appointment.appointment_datetime <= Time.current
          return render json: {
            success: false,
            error: 'Cannot delete past appointments. Use status update instead.'
          }, status: :unprocessable_entity
        end
        
        if @appointment.destroy
          # TODO: Notify patient about cancellation
          render json: {
            success: true,
            message: 'Appointment deleted successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def authorize_provider!
        unless current_user.provider?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end
      
      def set_appointment
        @appointment = current_user.appointments_as_provider.find_by(id: params[:id])
        
        unless @appointment
          render json: {
            success: false,
            error: 'Appointment not found or access denied.'
          }, status: :not_found
        end
      end

      def apply_filters(appointments)
        filtered = appointments
        
        # Filter by status
        if params[:status].present?
          filtered = filtered.where(status: params[:status])
        end
        
        # Filter by date range
        if params[:start_date].present? && params[:end_date].present?
          begin
            start_date = Date.parse(params[:start_date]).beginning_of_day
            end_date = Date.parse(params[:end_date]).end_of_day
            filtered = filtered.where(appointment_datetime: start_date..end_date)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end
        
        # Filter by single date
        if params[:date].present?
          begin
            date = Date.parse(params[:date])
            filtered = filtered.where("DATE(appointment_datetime) = ?", date)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end
        
        # Filter by patient name/id
        if params[:patient].present?
          patient_query = "%#{params[:patient]}%"
          patient_ids = User.where("full_name ILIKE ? OR id::text = ?", patient_query, params[:patient]).pluck(:id)
          filtered = filtered.where(patient_id: patient_ids) if patient_ids.any?
        end
        
        # Filter by appointment type
        if params[:appointment_type].present?
          filtered = filtered.where(appointment_type: params[:appointment_type])
        end
        
        filtered
      end
      
      def paginate(appointments)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        appointments.order(appointment_datetime: :desc).offset((page - 1) * per_page).limit(per_page)
      end
      
      def pagination_data(appointments)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: current_user.appointments_as_provider.count,
          total_pages: (current_user.appointments_as_provider.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def appointment_params
        params.require(:appointment).permit(
          :patient_id,
          :appointment_datetime,
          :duration_minutes,
          :appointment_type,
          :reason,
          :notes,
          :status
        )
      end
      
      def provider_appointment_params
        # Allow provider to update all fields including status
        params.require(:appointment).permit(
          :appointment_datetime,
          :duration_minutes,
          :appointment_type,
          :reason,
          :notes,
          :status
        )
      end
      
      def provider_appointment_to_json(appointment, include_details: false)
        json = {
          id: appointment.id,
          patient: {
            id: appointment.patient.id,
            name: appointment.patient.full_name,
            age: calculate_age(appointment.patient.date_of_birth),
            gender: appointment.patient.gender
          },
          date: appointment.appointment_datetime&.to_date,
          start_time: appointment.appointment_datetime&.strftime('%H:%M'),
          end_time: (appointment.appointment_datetime + appointment.duration_minutes.minutes)&.strftime('%H:%M'),
          duration_minutes: appointment.duration_minutes,
          status: appointment.status,
          appointment_type: appointment.appointment_type,
          reason: appointment.reason,
          created_at: appointment.created_at
        }
        
        # Add more details if requested
        if include_details
          json[:notes] = appointment.notes
          json[:patient][:contact] = appointment.patient.phone
          json[:patient][:email] = appointment.patient.email
          
          # Add medical history if available
          if appointment.patient.patient_profile&.health_history.present?
            json[:patient][:medical_history] = appointment.patient.patient_profile.health_history
          end
        end
        
        json
      end
      
      def calculate_age(date_of_birth)
        return nil unless date_of_birth
        now = Time.current.to_date
        now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
      end
    end
  end
end
