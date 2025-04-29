module Api
  module V1
    module Admin
      class HealthRecordsController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_record, only: [:show, :update, :destroy]

        # GET /api/v1/admin/health-records
        def index
          @records = MedicalRecord.includes(:patient, :provider)
          
          # Apply filtering
          @records = apply_filters(@records)
          
          # Apply pagination
          @records = paginate(@records)
          
          render json: {
            success: true,
            data: {
              records: @records.map { |record| record_to_json(record) },
              pagination: pagination_data(@records),
              stats: record_stats
            },
            message: "Health records retrieved successfully."
          }, status: :ok
        end

        # GET /api/v1/admin/health-records/:id
        def show
          render json: {
            success: true,
            data: { record: record_to_json(@record, include_details: true) },
            message: "Health record retrieved successfully."
          }, status: :ok
        end

        # POST /api/v1/admin/health-records
        def create
          @record = MedicalRecord.new(record_params)
          
          # Validate patient and provider existence
          unless User.where(id: params[:record][:patient_id], role: 'patient').exists?
            return render json: {
              success: false,
              error: "Patient not found or invalid."
            }, status: :unprocessable_entity
          end
          
          if params[:record][:provider_id].present? && !User.where(id: params[:record][:provider_id], role: 'provider').exists?
            return render json: {
              success: false,
              error: "Provider not found or invalid."
            }, status: :unprocessable_entity
          end
          
          # Handle file upload if necessary
          if params[:file].present?
            # This is a placeholder for file upload handling
            # In a real implementation, you would use ActiveStorage or a file upload service
            @record.file_url = "https://example.com/files/#{SecureRandom.uuid}"
          end
          
          if @record.save
            render json: {
              success: true,
              data: { record: record_to_json(@record) },
              message: "Health record created successfully."
            }, status: :created
          else
            render json: {
              success: false,
              errors: @record.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/admin/health-records/:id
        def update
          # Handle file upload if necessary
          if params[:file].present?
            # This is a placeholder for file upload handling
            @record.file_url = "https://example.com/files/#{SecureRandom.uuid}"
          end
          
          if @record.update(record_params)
            render json: {
              success: true,
              data: { record: record_to_json(@record) },
              message: "Health record updated successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @record.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/health-records/:id
        def destroy
          if @record.destroy
            render json: {
              success: true,
              message: "Health record deleted successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @record.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end

        def set_record
          @record = MedicalRecord.find_by(id: params[:id])
          
          unless @record
            render json: {
              success: false,
              error: "Health record not found."
            }, status: :not_found
          end
        end

        def apply_filters(records)
          filtered = records
          
          # Filter by record type
          if params[:record_type].present?
            filtered = filtered.where(record_type: params[:record_type])
          end
          
          # Filter by patient
          if params[:patient_id].present?
            filtered = filtered.where(patient_id: params[:patient_id])
          end
          
          # Filter by provider
          if params[:provider_id].present?
            filtered = filtered.where(provider_id: params[:provider_id])
          end
          
          # Filter by status
          if params[:status].present?
            filtered = filtered.where(status: params[:status])
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
          
          # Filter by search term (title or description)
          if params[:search].present?
            search_term = "%#{params[:search]}%"
            filtered = filtered.where("title ILIKE ? OR description ILIKE ?", search_term, search_term)
          end
          
          filtered
        end

        def paginate(records)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 10).to_i
          records.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
        end

        def pagination_data(records)
          total = MedicalRecord.count
          {
            current_page: (params[:page] || 1).to_i,
            per_page: (params[:per_page] || 10).to_i,
            total_items: total,
            total_pages: (total.to_f / (params[:per_page] || 10).to_i).ceil
          }
        end

        def record_stats
          {
            total_records: MedicalRecord.count,
            draft_records: MedicalRecord.where(status: :draft).count,
            finalized_records: MedicalRecord.where(status: :finalized).count,
            archived_records: MedicalRecord.where(status: :archived).count,
            records_by_type: {
              lab_results: MedicalRecord.where(record_type: :lab_result).count,
              imaging: MedicalRecord.where(record_type: :imaging).count,
              consultation_notes: MedicalRecord.where(record_type: :consultation_note).count,
              other: MedicalRecord.where(record_type: :other).count
            }
          }
        end

        def record_to_json(record, include_details: false)
          json = {
            id: record.id,
            patient_name: record.patient&.full_name,
            patient_id: record.patient_id,
            record_type: record.record_type,
            created_at: record.created_at,
            updated_at: record.updated_at,
            status: record.status,
            provider: record.provider&.full_name,
            title: record.title,
            record_date: record.record_date
          }
          
          if include_details
            # Add more details for the detailed view
            json.merge!({
              description: record.description,
              file_url: record.file_url,
              patient_details: {
                name: record.patient&.full_name,
                email: record.patient&.email,
                phone: record.patient&.phone,
                date_of_birth: record.patient&.date_of_birth,
                gender: record.patient&.gender
              },
              provider_details: record.provider ? {
                name: record.provider.full_name,
                email: record.provider.email,
                phone: record.provider.phone,
                specialization: record.provider.provider_profile&.specialization
              } : nil
            })
          end
          
          json
        end

        def record_params
          params.require(:record).permit(
            :patient_id,
            :provider_id,
            :record_type,
            :record_date,
            :title,
            :description,
            :status
          )
        end
      end
    end
  end
end
