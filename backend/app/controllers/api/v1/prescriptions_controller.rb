module Api
  module V1
    class PrescriptionsController < BaseController
      before_action :authenticate_user!
      before_action :authorize_patient!
      before_action :set_prescription, only: [:show, :update, :destroy, :refill]

      # GET /api/v1/patients/prescriptions
      def index
        @prescriptions = current_user.prescriptions_as_patient.includes(:provider)
        
        # Apply filtering
        @prescriptions = apply_filters(@prescriptions)
        
        # Apply pagination
        @prescriptions = paginate(@prescriptions)
        
        render json: {
          success: true,
          data: {
            prescriptions: @prescriptions.map { |prescription| prescription_to_json(prescription, include_details: false) },
            pagination: pagination_data(@prescriptions)
          },
          message: "Prescriptions retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/patients/prescriptions/:id
      def show
        render json: {
          success: true,
          data: { prescription: prescription_to_json(@prescription, include_details: true) },
          message: "Prescription retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/patients/prescriptions/:id/refill
      def refill
        # Check if the prescription is active and has refills available
        unless @prescription.active? && @prescription.refills_remaining > 0
          return render json: {
            success: false,
            error: "Cannot refill this prescription. It may be inactive or have no refills remaining."
          }, status: :unprocessable_entity
        end
        
        # Process refill request
        @prescription.refills_remaining -= 1
        
        # If no refills left, mark as completed
        @prescription.status = :completed if @prescription.refills_remaining <= 0
        
        if @prescription.save
          # TODO: Send notification to provider (future implementation)
          
          render json: {
            success: true,
            data: { prescription: prescription_to_json(@prescription, include_details: true) },
            message: "Refill requested successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @prescription.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def set_prescription
        @prescription = current_user.prescriptions_as_patient.find_by(id: params[:id])
        
        unless @prescription
          render json: {
            success: false,
            error: "Prescription not found or access denied."
          }, status: :not_found
        end
      end

      def apply_filters(prescriptions)
        filtered = prescriptions

        # Filter by status
        if params[:status].present?
          filtered = filtered.where(status: params[:status])
        end

        # Filter by date range
        if params[:start_date].present? && params[:end_date].present?
          begin
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            filtered = filtered.where('start_date >= ? AND end_date <= ?', start_date, end_date)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end

        # Filter by provider
        if params[:provider_id].present?
          filtered = filtered.where(provider_id: params[:provider_id])
        end

        # Filter by medication name
        if params[:medication].present?
          search_term = "%#{params[:medication]}%"
          filtered = filtered.where("medication_name ILIKE ?", search_term)
        end

        filtered
      end

      def paginate(prescriptions)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        prescriptions.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
      end

      def pagination_data(prescriptions)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: current_user.prescriptions_as_patient.count,
          total_pages: (current_user.prescriptions_as_patient.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def prescription_to_json(prescription, include_details: false)
        json = {
          id: prescription.id,
          medication_name: prescription.medication_name,
          dosage: prescription.dosage,
          frequency: prescription.frequency,
          start_date: prescription.start_date,
          end_date: prescription.end_date,
          refills_remaining: prescription.refills_remaining,
          status: prescription.status,
          provider_name: prescription.provider&.full_name,
          created_at: prescription.created_at
        }
        
        # Add detailed information if requested
        if include_details
          json.merge!({
            instructions: prescription.instructions,
            refills_allowed: prescription.refills_allowed,
            provider_details: {
              id: prescription.provider.id,
              name: prescription.provider.full_name,
              specialization: prescription.provider.provider_profile&.specialization || 'Not specified',
              email: prescription.provider.email,
              phone: prescription.provider.phone
            }
          })
        end
        
        json
      end
    end
  end
end
