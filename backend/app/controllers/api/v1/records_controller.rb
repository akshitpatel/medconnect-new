module Api
  module V1
    class RecordsController < BaseController
      before_action :authenticate_user!
      before_action :authorize_patient!
      before_action :set_record, only: [:show, :update, :destroy]

      # GET /api/v1/patients/records
      def index
        @records = current_user.medical_records_as_patient
        
        # Apply filtering
        @records = apply_filters(@records)
        
        # Apply pagination
        @records = paginate(@records)
        
        render json: {
          success: true,
          data: {
            records: @records.map { |record| record_to_json(record) },
            pagination: pagination_data(@records)
          },
          message: "Medical records retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/patients/records/:id
      def show
        render json: {
          success: true,
          data: { record: record_to_json(@record) },
          message: "Medical record retrieved successfully."
        }, status: :ok
      end

      # POST /api/v1/patients/records
      def create
        @record = current_user.medical_records_as_patient.build(record_params)
        
        # Handle file upload if provided
        if params[:file].present?
          @record.file.attach(params[:file])
        end
        
        if @record.save
          render json: {
            success: true,
            data: { record: record_to_json(@record) },
            message: "Medical record created successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @record.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/patients/records/:id
      def update
        # Handle file upload if provided
        if params[:file].present?
          @record.file.attach(params[:file])
        end
        
        if @record.update(record_params)
          render json: {
            success: true,
            data: { record: record_to_json(@record) },
            message: "Medical record updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @record.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/patients/records/:id
      def destroy
        if @record.destroy
          render json: {
            success: true,
            message: "Medical record deleted successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @record.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      private

      def set_record
        @record = current_user.medical_records_as_patient.find_by(id: params[:id])
        
        unless @record
          render json: {
            success: false,
            error: "Medical record not found or access denied."
          }, status: :not_found
        end
      end

      def record_params
        params.require(:record).permit(
          :provider_id,
          :record_type,
          :record_date,
          :title,
          :description,
          :status
        )
      end

      def apply_filters(records)
        filtered = records

        # Filter by record type
        if params[:record_type].present?
          filtered = filtered.where(record_type: params[:record_type])
        end

        # Filter by date range
        if params[:start_date].present? && params[:end_date].present?
          begin
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            filtered = filtered.where(record_date: start_date..end_date)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end

        # Filter by provider
        if params[:provider_id].present?
          filtered = filtered.where(provider_id: params[:provider_id])
        end

        # Filter by title or description (search)
        if params[:search].present?
          search_term = "%#{params[:search]}%"
          filtered = filtered.where("title ILIKE ? OR description ILIKE ?", search_term, search_term)
        end

        filtered
      end

      def paginate(records)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        records.order(record_date: :desc).offset((page - 1) * per_page).limit(per_page)
      end

      def pagination_data(records)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: current_user.medical_records_as_patient.count,
          total_pages: (current_user.medical_records_as_patient.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def record_to_json(record)
        {
          id: record.id,
          patient_id: record.patient_id,
          provider_id: record.provider_id,
          provider_name: record.provider&.full_name,
          record_type: record.record_type,
          record_date: record.record_date,
          title: record.title,
          description: record.description,
          file_url: record.file_url,
          status: record.status,
          created_at: record.created_at,
          updated_at: record.updated_at
        }
      end
    end
  end
end
