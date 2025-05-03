module Api
  module V1
    class ProviderAvailabilitiesController < ApplicationController
      before_action :authenticate_user!
      before_action :ensure_provider, only: [:create, :update, :destroy]
      before_action :find_availability, only: [:update, :destroy]

      # GET /api/v1/providers/:provider_id/availabilities
      def index
        provider_id = params[:provider_id]
        @availabilities = ProviderAvailability.for_provider(provider_id).order(:day_of_week, :start_time)

        render json: {
          success: true,
          data: {
            availabilities: @availabilities.map { |availability| serialize_availability(availability) }
          }
        }, status: :ok
      end

      # POST /api/v1/providers/availabilities
      def create
        # Provider can only manage their own availability
        @availability = current_user.availabilities.build(availability_params)

        if @availability.save
          render json: {
            success: true,
            data: {
              availability: serialize_availability(@availability)
            },
            message: 'Availability slot created successfully.'
          }, status: :created
        else
          render json: {
            success: false,
            errors: @availability.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/providers/availabilities/:id
      def update
        if @availability.update(availability_params)
          render json: {
            success: true,
            data: {
              availability: serialize_availability(@availability)
            },
            message: 'Availability slot updated successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @availability.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/providers/availabilities/:id
      def destroy
        if @availability.destroy
          render json: {
            success: true,
            message: 'Availability slot deleted successfully.'
          }, status: :ok
        else
          render json: {
            success: false,
            errors: ['Failed to delete availability slot.']
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/providers/:provider_id/available_slots
      # Params: date (YYYY-MM-DD format)
      def available_slots
        provider_id = params[:provider_id]
        date_param = params[:date]
        
        # Validate date format
        begin
          date = Date.parse(date_param) if date_param.present?
        rescue ArgumentError
          return render json: {
            success: false,
            errors: ['Invalid date format. Please use YYYY-MM-DD format.']
          }, status: :bad_request
        end

        # Find the day of the week (0-6) for the given date
        day_of_week = date.present? ? date.wday : nil
        
        # Find availability templates for the provider
        availabilities = ProviderAvailability.for_provider(provider_id)
        availabilities = availabilities.for_day(day_of_week) if day_of_week.present?
        
        # Find existing appointments for the provider on the specified date
        existing_appointments = []
        if date.present?
          start_of_day = date.beginning_of_day
          end_of_day = date.end_of_day
          existing_appointments = Appointment.where(
            provider_id: provider_id,
            appointment_datetime: start_of_day..end_of_day
          ).pluck(:appointment_datetime, :duration_minutes)
        end
        
        # Generate available time slots based on availability templates and existing appointments
        available_slots = generate_available_slots(availabilities, existing_appointments, date)
        
        render json: {
          success: true,
          data: {
            provider_id: provider_id,
            date: date,
            available_slots: available_slots
          }
        }, status: :ok
      end

      private

      def ensure_provider
        unless current_user.provider?
          render json: {
            success: false,
            errors: ['Only providers can manage availability slots.']
          }, status: :forbidden
          return
        end
      end

      def find_availability
        @availability = current_user.availabilities.find_by(id: params[:id])
        
        unless @availability
          render json: {
            success: false,
            errors: ['Availability slot not found or access denied.']
          }, status: :not_found
          return
        end
      end

      def availability_params
        params.require(:availability).permit(:day_of_week, :start_time, :end_time)
      end

      def serialize_availability(availability)
        {
          id: availability.id,
          provider_id: availability.provider_id,
          day_of_week: availability.day_of_week,
          day_name: availability.day_of_week.to_s.capitalize,
          start_time: availability.start_time.strftime('%H:%M'),
          end_time: availability.end_time.strftime('%H:%M'),
          created_at: availability.created_at,
          updated_at: availability.updated_at
        }
      end

      def generate_available_slots(availabilities, existing_appointments, date)
        return [] unless date.present?
        
        available_slots = []
        slot_duration = 30 # Default slot duration in minutes
        
        availabilities.each do |availability|
          start_time = availability.start_time
          end_time = availability.end_time
          
          # Convert availability template times to actual datetime for the requested date
          current_slot_time = DateTime.new(
            date.year, date.month, date.day, 
            start_time.hour, start_time.min, 0, date.zone
          )
          
          end_datetime = DateTime.new(
            date.year, date.month, date.day, 
            end_time.hour, end_time.min, 0, date.zone
          )
          
          # Generate slots until reaching the end time
          while current_slot_time + slot_duration.minutes <= end_datetime
            slot_end_time = current_slot_time + slot_duration.minutes
            
            # Check if this slot overlaps with any existing appointment
            is_available = true
            existing_appointments.each do |appt_datetime, duration|
              appt_start = appt_datetime
              appt_end = appt_datetime + duration.minutes
              
              # Check for overlap
              if (current_slot_time >= appt_start && current_slot_time < appt_end) ||
                 (slot_end_time > appt_start && slot_end_time <= appt_end) ||
                 (current_slot_time <= appt_start && slot_end_time >= appt_end)
                is_available = false
                break
              end
            end
            
            if is_available
              available_slots << {
                start_time: current_slot_time.strftime('%Y-%m-%d %H:%M:%S'),
                end_time: slot_end_time.strftime('%Y-%m-%d %H:%M:%S'),
                formatted_time: current_slot_time.strftime('%I:%M %p')
              }
            end
            
            # Move to the next slot
            current_slot_time += slot_duration.minutes
          end
        end
        
        available_slots
      end
    end
  end
end
