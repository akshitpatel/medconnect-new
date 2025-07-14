module Api
  module V1
    class AppointmentsController < BaseController
      before_action :authenticate_user!
      before_action :set_appointment, only: [:show, :update, :destroy]
      before_action :authorize_appointment_access!, only: [:show, :update, :destroy]

      # GET /api/v1/appointments
      def index
        @appointments = if current_user.patient?
          current_user.appointments_as_patient
        elsif current_user.provider?
          current_user.appointments_as_provider
        else
          Appointment.none
        end

        @appointments = @appointments.includes(:patient, :provider)
                                   .order(appointment_datetime: :desc)

        # Apply filters
        @appointments = apply_filters(@appointments)
        
        # Apply pagination
        @appointments = paginate(@appointments)

        render json: {
          success: true,
          data: {
            appointments: @appointments.map { |appointment| appointment_to_json(appointment) },
            pagination: pagination_data(@appointments)
          },
          message: "Appointments retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/appointments/:id
      def show
        render json: {
          success: true,
          data: { appointment: appointment_to_json(@appointment, include_details: true) },
          message: "Appointment retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/appointments
      def create
        # Only patients can create appointments
        unless current_user.patient?
          return render json: {
            success: false,
            error: "Only patients can create appointments."
          }, status: :forbidden
        end

        @appointment = current_user.appointments_as_patient.build(appointment_params)

        # Validate appointment time
        unless valid_appointment_time?
          return render json: {
            success: false,
            error: "Invalid appointment time. Please select a future time during provider availability."
          }, status: :unprocessable_entity
        end

        # Check for conflicts
        if appointment_conflict?
          return render json: {
            success: false,
            error: "Appointment time conflicts with existing appointment."
          }, status: :unprocessable_entity
        end

        if @appointment.save
          # Send notifications
          send_appointment_notifications(@appointment)
          
          render json: {
            success: true,
            data: { appointment: appointment_to_json(@appointment) },
            message: "Appointment created successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/appointments/:id
      def update
        # Only allow updates if appointment is not completed or cancelled
        unless @appointment.status.in?(['scheduled', 'confirmed'])
          return render json: {
            success: false,
            error: "Cannot update appointment with status: #{@appointment.status}"
          }, status: :unprocessable_entity
        end

        # Validate appointment time if it's being changed
        if appointment_params[:appointment_datetime].present?
          unless valid_appointment_time?
            return render json: {
              success: false,
              error: "Invalid appointment time. Please select a future time during provider availability."
            }, status: :unprocessable_entity
          end

          if appointment_conflict?
            return render json: {
              success: false,
              error: "Appointment time conflicts with existing appointment."
            }, status: :unprocessable_entity
          end
        end

        if @appointment.update(appointment_params)
          # Send notifications for updates
          send_appointment_update_notifications(@appointment)
          
          render json: {
            success: true,
            data: { appointment: appointment_to_json(@appointment) },
            message: "Appointment updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/appointments/:id
      def destroy
        # Only allow cancellation if appointment is not completed
        unless @appointment.status.in?(['scheduled', 'confirmed'])
          return render json: {
            success: false,
            error: "Cannot cancel appointment with status: #{@appointment.status}"
          }, status: :unprocessable_entity
        end

        if @appointment.update(status: :cancelled)
          # Send cancellation notifications
          send_appointment_cancellation_notifications(@appointment)
          
          render json: {
            success: true,
            message: "Appointment cancelled successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/appointments/available_slots
      def available_slots
        provider_id = params[:provider_id]
        date = params[:date]

        unless provider_id && date
          return render json: {
            success: false,
            error: "Provider ID and date are required."
          }, status: :bad_request
        end

        begin
          target_date = Date.parse(date)
        rescue ArgumentError
          return render json: {
            success: false,
            error: "Invalid date format."
          }, status: :bad_request
        end

        provider = User.find_by(id: provider_id, role: 'provider')
        unless provider
          return render json: {
            success: false,
            error: "Provider not found."
          }, status: :not_found
        end

        slots = calculate_available_slots(provider, target_date)

        render json: {
          success: true,
          data: {
            provider: {
              id: provider.id,
              name: provider.full_name,
              specialization: provider.provider_profile&.specialization
            },
            date: target_date,
            available_slots: slots
          },
          message: "Available slots retrieved successfully."
        }, status: :ok
      end

      private

      def set_appointment
        @appointment = if current_user.patient?
          current_user.appointments_as_patient.find(params[:id])
        elsif current_user.provider?
          current_user.appointments_as_provider.find(params[:id])
        else
          nil
        end
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Appointment not found."
        }, status: :not_found
      end

      def authorize_appointment_access!
        # Patients can access their own appointments
        # Providers can access appointments where they are the provider
        unless @appointment && (
          (current_user.patient? && @appointment.patient_id == current_user.id) ||
          (current_user.provider? && @appointment.provider_id == current_user.id)
        )
          render json: {
            success: false,
            error: "Unauthorized access to appointment."
          }, status: :forbidden
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
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            filtered = filtered.where(appointment_datetime: start_date.beginning_of_day..end_date.end_of_day)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end

        # Filter by provider (for patients)
        if current_user.patient? && params[:provider_id].present?
          filtered = filtered.where(provider_id: params[:provider_id])
        end

        # Filter by patient (for providers)
        if current_user.provider? && params[:patient_id].present?
          filtered = filtered.where(patient_id: params[:patient_id])
        end

        filtered
      end

      def paginate(collection)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        collection.offset((page - 1) * per_page).limit(per_page)
      end

      def pagination_data(collection)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: collection.count,
          total_pages: (collection.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def valid_appointment_time?
        appointment_time = appointment_params[:appointment_datetime]
        return false unless appointment_time

        begin
          datetime = DateTime.parse(appointment_time)
        rescue ArgumentError
          return false
        end

        # Must be in the future
        return false if datetime <= Time.current

        # Must be during provider availability
        provider = User.find(appointment_params[:provider_id])
        return false unless provider&.provider_profile

        # Check if the time falls within provider's availability
        # This is a simplified check - in a real app, you'd check the provider's availability schedule
        hour = datetime.hour
        return hour >= 9 && hour <= 17 # 9 AM to 5 PM
      end

      def appointment_conflict?
        appointment_time = DateTime.parse(appointment_params[:appointment_datetime])
        duration = appointment_params[:duration_minutes] || 30
        end_time = appointment_time + duration.minutes

        # Check for conflicts with existing appointments
        conflicting_appointments = Appointment.where(
          provider_id: appointment_params[:provider_id],
          status: ['scheduled', 'confirmed']
        ).where(
          'appointment_datetime < ? AND appointment_datetime + (duration_minutes || 30) * INTERVAL \'1 minute\' > ?',
          end_time,
          appointment_time
        )

        # Exclude current appointment if updating
        conflicting_appointments = conflicting_appointments.where.not(id: @appointment.id) if @appointment

        conflicting_appointments.exists?
      end

      def calculate_available_slots(provider, date)
        # Get provider's availability for the day
        availability = provider.provider_profile&.availability || {}
        day_schedule = availability[date.strftime('%A').downcase] || {}

        # Default availability if not set
        start_time = day_schedule['start'] || '09:00'
        end_time = day_schedule['end'] || '17:00'
        slot_duration = day_schedule['slot_duration'] || 30

        # Generate time slots
        slots = []
        current_time = Time.parse(start_time)
        end_datetime = Time.parse(end_time)

        while current_time < end_datetime
          slot_start = date.to_time + current_time.seconds_since_midnight.seconds
          slot_end = slot_start + slot_duration.minutes

          # Check if slot is available (no conflicting appointments)
          conflicting = Appointment.where(
            provider_id: provider.id,
            status: ['scheduled', 'confirmed']
          ).where(
            'appointment_datetime < ? AND appointment_datetime + (duration_minutes || 30) * INTERVAL \'1 minute\' > ?',
            slot_end,
            slot_start
          ).exists?

          unless conflicting
            slots << {
              start_time: slot_start.strftime('%H:%M'),
              end_time: slot_end.strftime('%H:%M'),
              available: true
            }
          end

          current_time += slot_duration.minutes
        end

        slots
      end

      def appointment_to_json(appointment, include_details: false)
        json = {
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

        # Add patient info
        if appointment.patient
          json[:patient] = {
            id: appointment.patient.id,
            name: appointment.patient.full_name,
            age: calculate_age(appointment.patient.date_of_birth),
            gender: appointment.patient.gender
          }

          if include_details
            json[:patient].merge!({
              email: appointment.patient.email,
              phone: appointment.patient.phone,
              emergency_contact: appointment.patient.patient_profile&.emergency_contact
            })
          end
        end

        # Add provider info
        if appointment.provider
          json[:provider] = {
            id: appointment.provider.id,
            name: appointment.provider.full_name,
            specialization: appointment.provider.provider_profile&.specialization
          }

          if include_details
            json[:provider].merge!({
              email: appointment.provider.email,
              phone: appointment.provider.phone,
              license_number: appointment.provider.provider_profile&.license_number
            })
          end
        end

        json
      end

      def calculate_age(date_of_birth)
        return nil unless date_of_birth
        now = Time.current.to_date
        now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
      end

      def send_appointment_notifications(appointment)
        # Send notification to provider
        Notification.create(
          user: appointment.provider,
          title: "New Appointment Request",
          message: "You have a new appointment request from #{appointment.patient.full_name}",
          notification_type: "appointment_request",
          data: { appointment_id: appointment.id }
        )

        # Send confirmation to patient
        Notification.create(
          user: appointment.patient,
          title: "Appointment Confirmed",
          message: "Your appointment with #{appointment.provider.full_name} has been scheduled",
          notification_type: "appointment_confirmation",
          data: { appointment_id: appointment.id }
        )
      end

      def send_appointment_update_notifications(appointment)
        # Send notification to both parties about the update
        [appointment.patient, appointment.provider].each do |user|
          next unless user
          
          Notification.create(
            user: user,
            title: "Appointment Updated",
            message: "Your appointment has been updated",
            notification_type: "appointment_update",
            data: { appointment_id: appointment.id }
          )
        end
      end

      def send_appointment_cancellation_notifications(appointment)
        # Send notification to both parties about the cancellation
        [appointment.patient, appointment.provider].each do |user|
          next unless user
          
          Notification.create(
            user: user,
            title: "Appointment Cancelled",
            message: "Your appointment has been cancelled",
            notification_type: "appointment_cancellation",
            data: { appointment_id: appointment.id }
          )
        end
      end

      def appointment_params
        params.require(:appointment).permit(
          :provider_id,
          :appointment_datetime,
          :duration_minutes,
          :appointment_type,
          :reason,
          :notes,
          :status
        )
      end
    end
  end
end
