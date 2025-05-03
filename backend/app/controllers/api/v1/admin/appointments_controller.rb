module Api
  module V1
    module Admin
      class AppointmentsController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_appointment, only: [:show, :update, :destroy]

        # GET /api/v1/admin/appointments
        def index
          @appointments = Appointment.all.includes(:patient, :provider)
          
          # Apply filtering
          @appointments = apply_filters(@appointments)
          
          # Apply sorting
          @appointments = apply_sorting(@appointments)
          
          # Apply pagination
          @appointments = paginate(@appointments)
          
          render json: {
            success: true,
            data: {
              appointments: @appointments.map { |appointment| appointment_to_json(appointment) },
              pagination: pagination_data(@appointments),
              stats: appointment_stats
            },
            message: "Appointments retrieved successfully."
          }, status: :ok
        end

        # GET /api/v1/admin/appointments/:id
        def show
          render json: {
            success: true,
            data: { appointment: appointment_to_json(@appointment, include_details: true) },
            message: "Appointment retrieved successfully."
          }, status: :ok
        end

        # POST /api/v1/admin/appointments
        def create
          @appointment = Appointment.new(appointment_params)
          
          # Check if the slot is available
          unless slot_available?(@appointment)
            return render json: {
              success: false,
              errors: ["The selected time slot is not available."]
            }, status: :unprocessable_entity
          end
          
          if @appointment.save
            # Send notifications to patient and provider (background job)
            NotificationsJob.perform_later(
              user_id: @appointment.patient_id,
              notification_type: 'appointment_created_by_admin',
              data: { appointment_id: @appointment.id }
            )

            NotificationsJob.perform_later(
              user_id: @appointment.provider_id,
              notification_type: 'appointment_created_by_admin',
              data: { appointment_id: @appointment.id }
            )
            
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

        # PUT /api/v1/admin/appointments/:id
        def update
          # Store the old appointment for comparison
          old_appointment = @appointment.dup
          
          # Update with new parameters
          @appointment.assign_attributes(appointment_params)
          
          # Check if the time has changed and if the new slot is available
          if appointment_time_changed?(@appointment, old_appointment) && !slot_available?(@appointment)
            return render json: {
              success: false,
              errors: ["The selected time slot is not available."]
            }, status: :unprocessable_entity
          end
          
          if @appointment.save
            # Send notifications about the update if needed
            if appointment_time_changed?(@appointment, old_appointment)
              NotificationsJob.perform_later(
                user_id: @appointment.patient_id,
                notification_type: 'appointment_rescheduled_by_admin',
                data: { appointment_id: @appointment.id }
              )

              NotificationsJob.perform_later(
                user_id: @appointment.provider_id,
                notification_type: 'appointment_rescheduled_by_admin',
                data: { appointment_id: @appointment.id }
              )
            end
            
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

        # DELETE /api/v1/admin/appointments/:id
        def destroy
          if @appointment.destroy
            # Send notifications about the cancellation
            NotificationsJob.perform_later(
              user_id: @appointment.patient_id,
              notification_type: 'appointment_cancelled_by_admin',
              data: { appointment_id: @appointment.id }
            )

            NotificationsJob.perform_later(
              user_id: @appointment.provider_id,
              notification_type: 'appointment_cancelled_by_admin',
              data: { appointment_id: @appointment.id }
            )
            
            render json: {
              success: true,
              message: "Appointment deleted successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @appointment.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/admin/appointments/stats
        def stats
          render json: {
            success: true,
            data: { stats: appointment_stats },
            message: "Appointment statistics retrieved successfully."
          }, status: :ok
        end

        private

        def set_appointment
          @appointment = Appointment.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: {
            success: false,
            errors: ["Appointment not found"]
          }, status: :not_found
        end

        def appointment_params
          params.require(:appointment).permit(
            :patient_id, 
            :provider_id, 
            :appointment_datetime, 
            :duration_minutes, 
            :appointment_type, 
            :status, 
            :reason,
            :notes
          )
        end

        def appointment_to_json(appointment, include_details: false)
          json = {
            id: appointment.id,
            patient: {
              id: appointment.patient.id,
              full_name: appointment.patient.full_name,
              email: appointment.patient.email
            },
            provider: {
              id: appointment.provider.id,
              full_name: appointment.provider.full_name,
              email: appointment.provider.email
            },
            appointment_datetime: appointment.appointment_datetime,
            duration_minutes: appointment.duration_minutes,
            appointment_type: appointment.appointment_type,
            status: appointment.status,
            created_at: appointment.created_at,
            updated_at: appointment.updated_at
          }
          
          if include_details
            json.merge!({
              reason: appointment.reason,
              notes: appointment.notes,
              # Add any other detailed fields here
            })
          end
          
          json
        end

        def apply_filters(appointments)
          filtered = appointments
          
          # Filter by status
          if params[:status].present?
            filtered = filtered.where(status: params[:status])
          end
          
          # Filter by provider
          if params[:provider_id].present?
            filtered = filtered.where(provider_id: params[:provider_id])
          end
          
          # Filter by patient
          if params[:patient_id].present?
            filtered = filtered.where(patient_id: params[:patient_id])
          end
          
          # Filter by date range
          if params[:start_date].present? && params[:end_date].present?
            begin
              start_date = Date.parse(params[:start_date]).beginning_of_day
              end_date = Date.parse(params[:end_date]).end_of_day
              filtered = filtered.where(appointment_datetime: start_date..end_date)
            rescue ArgumentError
              # Invalid date format, ignore this filter
            end
          end
          
          # Filter by appointment type
          if params[:appointment_type].present?
            filtered = filtered.where(appointment_type: params[:appointment_type])
          end
          
          filtered
        end

        def apply_sorting(appointments)
          sort_by = params[:sort_by] || 'appointment_datetime'
          sort_direction = params[:sort_direction] || 'asc'
          
          # Make sure the sort parameters are valid to prevent SQL injection
          valid_sort_columns = ['appointment_datetime', 'created_at', 'updated_at', 'status']
          valid_sort_directions = ['asc', 'desc']
          
          sort_by = 'appointment_datetime' unless valid_sort_columns.include?(sort_by)
          sort_direction = 'asc' unless valid_sort_directions.include?(sort_direction)
          
          appointments.order("#{sort_by} #{sort_direction}")
        end

        def paginate(appointments)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 10).to_i
          per_page = 100 if per_page > 100 # Limit to 100 per page maximum
          
          appointments.page(page).per(per_page)
        end

        def pagination_data(appointments)
          {
            current_page: appointments.current_page,
            total_pages: appointments.total_pages,
            total_count: appointments.total_count,
            per_page: appointments.limit_value
          }
        end

        def appointment_stats
          # Basic stats
          total = Appointment.count
          scheduled = Appointment.where(status: 'scheduled').count
          completed = Appointment.where(status: 'completed').count
          cancelled = Appointment.where(status: ['cancelled_by_patient', 'cancelled_by_provider']).count
          no_show = Appointment.where(status: 'no_show').count
          
          # Appointments today
          today = Date.today.beginning_of_day..Date.today.end_of_day
          today_appointments = Appointment.where(appointment_datetime: today).count
          
          # Appointments this week
          this_week = Date.today.beginning_of_week.beginning_of_day..Date.today.end_of_week.end_of_day
          this_week_appointments = Appointment.where(appointment_datetime: this_week).count
          
          # Appointments this month
          this_month = Date.today.beginning_of_month.beginning_of_day..Date.today.end_of_month.end_of_day
          this_month_appointments = Appointment.where(appointment_datetime: this_month).count
          
          # Appointment types distribution
          types = Appointment.group(:appointment_type).count
          
          {
            total: total,
            scheduled: scheduled,
            completed: completed,
            cancelled: cancelled,
            no_show: no_show,
            today: today_appointments,
            this_week: this_week_appointments,
            this_month: this_month_appointments,
            types: types
          }
        end

        # Check if the appointment time has changed during an update
        def appointment_time_changed?(new_appointment, old_appointment)
          new_appointment.appointment_datetime != old_appointment.appointment_datetime ||
            new_appointment.duration_minutes != old_appointment.duration_minutes
        end

        # Check if the slot is available for this appointment
        def slot_available?(appointment)
          # Skip availability check if the appointment status is not 'scheduled'
          return true unless appointment.status == 'scheduled'
          
          start_time = appointment.appointment_datetime
          end_time = start_time + appointment.duration_minutes.minutes
          
          # Check for overlaps with other appointments for the same provider
          overlapping_appointments = Appointment.where(provider_id: appointment.provider_id)
            .where.not(id: appointment.id) # Exclude the current appointment if it's an update
            .where(status: 'scheduled')
          
          # Check if any other appointment overlaps with the proposed time slot
          overlapping_appointments.each do |other_appointment|
            other_start = other_appointment.appointment_datetime
            other_end = other_start + other_appointment.duration_minutes.minutes
            
            # Check for overlap
            if (start_time < other_end && end_time > other_start)
              return false
            end
          end
          
          # Check if the provider has defined availability and if this slot fits within it
          provider_availabilities = ProviderAvailability.where(user_id: appointment.provider_id)
          
          # If no availabilities are defined, allow the appointment
          return true if provider_availabilities.empty?
          
          # Check if the appointment falls within any of the provider's available slots
          day_of_week = start_time.wday
          time_of_day_start = start_time.strftime("%H:%M")
          time_of_day_end = end_time.strftime("%H:%M")
          
          provider_availabilities.any? do |availability|
            availability.day_of_week == day_of_week &&
              availability.start_time <= time_of_day_start &&
              availability.end_time >= time_of_day_end
          end
        end
      end
    end
  end
end
