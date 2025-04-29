module Api
  module V1
    class MedicationsController < BaseController
      before_action :authenticate_user!
      before_action :set_medication, only: [:show, :update, :destroy, :refill]
      
      # GET /api/v1/patients/medications
      def index
        @medications = current_user.medications
        
        render json: {
          success: true,
          data: {
            medications: @medications.map { |medication| medication_response(medication) }
          },
          message: "Medications retrieved successfully."
        }, status: :ok
      end
      
      # GET /api/v1/patients/medications/:id
      def show
        render json: {
          success: true,
          data: {
            medication: medication_response(@medication)
          },
          message: "Medication retrieved successfully."
        }, status: :ok
      end
      
      # PATCH/PUT /api/v1/patients/medications/:id
      def update
        if @medication.update(medication_params)
          render json: {
            success: true,
            data: {
              medication: medication_response(@medication)
            },
            message: "Medication updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @medication.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # DELETE /api/v1/patients/medications/:id
      def destroy
        if @medication.destroy
          render json: {
            success: true,
            message: "Medication successfully deleted."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @medication.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      # POST /api/v1/patients/medications/:id/refill
      def refill
        # Create a refill request
        refill_request = current_user.refill_requests.new(
          medication_id: @medication.id,
          status: 'pending',
          requested_at: Time.current
        )
        
        if refill_request.save
          # Notify the prescriber
          prescriber = @medication.prescriber
          notification = prescriber.notifications.create(
            title: "Prescription Refill Request",
            content: "#{current_user.full_name} has requested a refill for #{@medication.name} #{@medication.dosage}.",
            notification_type: 'prescription_refill',
            related_id: refill_request.id,
            read: false
          )
          
          # Broadcast notification to prescriber via ActionCable if they're online
          ActionCable.server.broadcast("notifications_#{prescriber.id}", {
            notification: notification
          })
          
          render json: {
            success: true,
            data: {
              refill_request: refill_request
            },
            message: "Refill request submitted successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: refill_request.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
      
      private
      
      def set_medication
        @medication = current_user.medications.find_by(id: params[:id])
        
        unless @medication
          render json: {
            success: false,
            error: "Medication not found"
          }, status: :not_found
        end
      end
      
      def medication_response(medication)
        {
          id: medication.id,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.start_date,
          end_date: medication.end_date,
          instructions: medication.instructions,
          prescriber: {
            id: medication.prescriber.id,
            fullName: medication.prescriber.full_name,
            specialty: medication.prescriber.provider_profile&.specialty
          },
          refill_status: medication.refill_status,
          refills_remaining: medication.refills_remaining,
          last_filled_date: medication.last_filled_date
        }
      end
      
      def medication_params
        params.require(:medication).permit(
          :name, :dosage, :frequency, :instructions, :start_date, 
          :end_date, :refills_remaining, :refill_status
        )
      end
    end
  end
end
