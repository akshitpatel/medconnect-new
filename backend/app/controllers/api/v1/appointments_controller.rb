module Api
  module V1
    class AppointmentsController < BaseController # Inherit from BaseController for auth
      before_action :authenticate_user!
      before_action :find_appointment, only: [:show, :update, :cancel]

      # GET /api/v1/patients/appointments
      def index
        # Base query for the patient's appointments with provider data included
        appointments = current_user.appointments_as_patient.includes(:provider)

        # Apply filtering if parameters are provided
        filtered = apply_filters(appointments)

        # Apply pagination if needed
        paginated = paginate(filtered)

        render json: {
          success: true,
          data: {
            appointments: paginated.map { |appt| appointment_with_provider(appt) },
            pagination: pagination_data(filtered)
          },
          message: "Appointments retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/patients/appointments/:id
      def show
        render json: {
          success: true,
          data: {
            appointment: appointment_with_provider(@appointment)
          },
          message: "Appointment details retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/patients/appointments
      def create
        # Check if selected time slot is still available
        if !slot_available?
          return render json: {
            success: false,
            errors: ['The selected time slot is no longer available']
          }, status: :unprocessable_entity
        end

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
          # Send confirmation email/notification
          send_appointment_confirmation(@appointment)

          render json: {
            success: true,
            data: {
              appointment: appointment_with_provider(@appointment)
            },
            message: 'Appointment booked successfully. A confirmation has been sent to your email.'
          }, status: :created
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/patients/appointments/:id
      def update
        if @appointment.status != 'scheduled'
          return render json: {
            success: false,
            errors: ['Cannot update a non-scheduled appointment']
          }, status: :unprocessable_entity
        end

        # Check if selected time slot is still available (if changing date/time)
        if appointment_time_changed? && !slot_available?
          return render json: {
            success: false,
            errors: ['The selected time slot is no longer available']
          }, status: :unprocessable_entity
        end

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
          # Send update notification
          send_appointment_update(@appointment)
          
          render json: {
            success: true,
            data: { appointment: appointment_with_provider(@appointment) },
            message: 'Appointment updated successfully. A confirmation has been sent to your email.'
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

      # GET /api/v1/patients/appointments/upcoming
      def upcoming
        today = Date.today.beginning_of_day
        upcoming = current_user.appointments_as_patient
                            .where('appointment_datetime >= ? AND status = ?', today, Appointment.statuses[:scheduled])
                            .order(appointment_datetime: :asc)
                            .limit(5)
                            
        render json: {
          success: true,
          data: {
            appointments: upcoming.map { |appointment| appointment_with_provider(appointment) }
          }
        }, status: :ok
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

      # Check if the requested appointment time slot is available
      def slot_available?
        provider_id = params[:appointment][:provider_id]
        requested_datetime = params[:appointment][:appointment_datetime]
        duration = params[:appointment][:duration_minutes].to_i || 30 # Default to 30 minutes if not specified
        
        return true unless provider_id.present? && requested_datetime.present?
        
        begin
          # Parse the requested datetime
          appointment_time = DateTime.parse(requested_datetime)
          
          # Get the day of week (0-6, Sunday-Saturday)
          day_of_week = appointment_time.wday
          
          # Check if provider has availability for this day and time
          provider_availability = ProviderAvailability.where(
            provider_id: provider_id,
            day_of_week: day_of_week
          ).where(
            'TIME(?) >= start_time AND TIME(?) <= end_time',
            appointment_time,
            appointment_time + duration.minutes
          )
          
          return false if provider_availability.empty?
          
          # Check for conflicting appointments
          conflicting_appointments = Appointment.where(
            provider_id: provider_id,
            status: [:scheduled, :confirmed], # Only check active appointments
          ).where(
            '(appointment_datetime <= ? AND appointment_datetime + INTERVAL duration_minutes MINUTE > ?) OR ' +
            '(appointment_datetime < ? AND appointment_datetime + INTERVAL duration_minutes MINUTE >= ?)',
            appointment_time,
            appointment_time,
            appointment_time + duration.minutes,
            appointment_time + duration.minutes
          )
          
          # Include the current appointment in the exclusion if we're updating
          if @appointment&.id.present?
            conflicting_appointments = conflicting_appointments.where.not(id: @appointment.id)
          end
          
          # Return true if no conflicts
          conflicting_appointments.empty?
        rescue => e
          # Log the error and default to false if there's an issue
          Rails.logger.error("Error checking slot availability: #{e.message}")
          false
        end
      end
      
      # Check if appointment datetime is being changed in an update
      def appointment_time_changed?
        return false unless params[:appointment][:appointment_datetime].present?
        
        requested_time = DateTime.parse(params[:appointment][:appointment_datetime])
        original_time = @appointment.appointment_datetime
        
        # Compare with some tolerance for minor differences in seconds
        (requested_time - original_time).abs > 1.minute
      rescue
        false # If parsing fails, assume no change
      end
      
      # Format appointment with provider details
      def appointment_with_provider(appointment)
        provider = appointment.provider
        
        # Get the serialized appointment
        appt_data = {}
        
        if defined?(AppointmentSerializer)
          # Use serializer if available
          appt_data = AppointmentSerializer.new(appointment).serializable_hash[:data][:attributes]
        else
          # Manual serialization if serializer not available
          appt_data = {
            id: appointment.id,
            appointment_datetime: appointment.appointment_datetime,
            duration_minutes: appointment.duration_minutes,
            status: appointment.status,
            appointment_type: appointment.appointment_type,
            reason: appointment.reason,
            notes: appointment.notes,
            created_at: appointment.created_at,
            updated_at: appointment.updated_at
          }
        end
        
        # Add provider details
        appt_data[:provider] = {
          id: provider.id,
          full_name: provider.full_name,
          email: provider.email,
          # Add more provider details as needed
        }
        
        appt_data
      end
      
      # Send appointment confirmation notifications
      def send_appointment_confirmation(appointment)
        # TODO: Implement actual email sending logic
        # For now, just log that we would send an email
        Rails.logger.info("Would send appointment confirmation email to #{current_user.email} for appointment ##{appointment.id}")
        
        # In a real implementation, you'd have something like:
        # AppointmentMailer.confirmation_email(current_user, appointment).deliver_later
        # AppointmentNotificationService.send_sms(current_user, appointment, :confirmation) if current_user.sms_notifications_enabled?
      end
      
      # Send appointment update notifications
      def send_appointment_update(appointment)
        # TODO: Implement actual email sending logic
        Rails.logger.info("Would send appointment update email to #{current_user.email} for appointment ##{appointment.id}")
        
        # Notify provider as well
        Rails.logger.info("Would send appointment update notification to provider #{appointment.provider.email}")
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
