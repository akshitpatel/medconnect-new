module Api
  module V1
    class AppointmentsController < BaseController # Inherit from BaseController for auth
      before_action :authenticate_user!

      # GET /api/v1/patients/appointments
      def index
        # Base query for the patient's appointments with provider data included
        @appointments = current_user.appointments_as_patient.includes(:provider)

        # Apply filtering if parameters are provided
        @appointments = apply_filters(@appointments)

        # Apply pagination if needed
        @appointments = paginate(@appointments)

        render json: {
          success: true,
          data: { 
            appointments: @appointments.map { |appt| AppointmentSerializer.new(appt).serializable_hash[:data][:attributes] },
            pagination: pagination_data(@appointments)
          },
          message: "Appointments retrieved successfully."
        }, status: :ok
      end

      def show
        @appointment = find_appointment
        
        render json: {
          success: true,
          data: { appointment: AppointmentSerializer.new(@appointment).serializable_hash[:data][:attributes] },
          message: "Appointment details retrieved successfully."
        }, status: :ok
      end

      def create
        @appointment = current_user.appointments_as_patient.build(appointment_params)
        
        # Validate provider existence and availability (future implementation)
        unless User.where(id: params[:appointment][:provider_id], role: 'provider').exists?
          return render json: { 
            success: false, 
            error: 'Provider not found or is not a valid healthcare provider' 
          }, status: :unprocessable_entity
        end
        
        # TODO: Add availability check logic here
        
        if @appointment.save
          # Notify provider about new appointment (future implementation)
          render json: {
            success: true,
            data: { appointment: AppointmentSerializer.new(@appointment).serializable_hash[:data][:attributes] },
            message: 'Appointment booked successfully.'
          }, status: :created
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        @appointment = find_appointment
        
        # Only allow updates if appointment is not completed or cancelled
        if ['completed', 'cancelled_by_patient', 'cancelled_by_provider'].include?(@appointment.status)
          return render json: {
            success: false,
            error: 'Cannot modify a completed or cancelled appointment'
          }, status: :unprocessable_entity
        end
        
        # Handle cancellation specifically
        if params[:appointment][:status] == 'cancelled_by_patient'
          return cancel_appointment
        end
        
        # Regular update (date, time, reason, etc.)
        if @appointment.update(appointment_update_params)
          render json: {
            success: true,
            data: { appointment: AppointmentSerializer.new(@appointment).serializable_hash[:data][:attributes] },
            message: 'Appointment updated successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        # Implement as cancellation rather than deletion to maintain records
        cancel_appointment
      end

      private
      
      def find_appointment
        # Find appointment and ensure it belongs to current user
        appointment = current_user.appointments_as_patient.find_by(id: params[:id])
        
        unless appointment
          raise ActiveRecord::RecordNotFound, 'Appointment not found or access denied'
        end
        
        appointment
      end
      
      def cancel_appointment
        @appointment = find_appointment
        
        # Only allow cancellation of scheduled appointments
        unless @appointment.status == 'scheduled'
          return render json: {
            success: false,
            error: 'Only scheduled appointments can be cancelled'
          }, status: :unprocessable_entity
        end
        
        # Update status to cancelled by patient
        if @appointment.update(status: :cancelled_by_patient)
          # TODO: Implement notification to provider
          
          render json: {
            success: true,
            message: 'Appointment cancelled successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def apply_filters(appointments)
        filtered = appointments
        
        # Filter by status if provided
        if params[:status].present?
          filtered = filtered.where(status: params[:status])
        end
        
        # Filter by date range if provided
        if params[:start_date].present? && params[:end_date].present?
          begin
            start_date = Date.parse(params[:start_date]).beginning_of_day
            end_date = Date.parse(params[:end_date]).end_of_day
            filtered = filtered.where(appointment_datetime: start_date..end_date)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end
        
        # Filter by provider if provided
        if params[:provider_id].present?
          filtered = filtered.where(provider_id: params[:provider_id])
        end
        
        # Filter by appointment type if provided
        if params[:appointment_type].present?
          filtered = filtered.where(appointment_type: params[:appointment_type])
        end
        
        filtered
      end
      
      def paginate(appointments)
        # Simple pagination implementation
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        appointments.offset((page - 1) * per_page).limit(per_page)
      end
      
      def pagination_data(appointments)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: current_user.appointments_as_patient.count,
          total_pages: (current_user.appointments_as_patient.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def appointment_params
        params.require(:appointment).permit(
          :provider_id,
          :appointment_datetime,
          :duration_minutes,
          :appointment_type,
          :reason,
          :notes
        )
      end
      
      def appointment_update_params
        # For updates, don't allow changing provider_id to maintain integrity
        params.require(:appointment).permit(
          :appointment_datetime,
          :duration_minutes,
          :appointment_type,
          :reason,
          :notes
        )
      end
    end
  end
end
