module Api
  module V1
    module Admin
      class AuditLogsController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!

        # GET /api/v1/admin/audit-logs
        def index
          @audit_logs = AuditLog.includes(:user)
          
          # Apply filtering
          @audit_logs = apply_filters(@audit_logs)
          
          # Apply pagination
          @audit_logs = paginate(@audit_logs)
          
          render json: {
            success: true,
            data: {
              audit_logs: @audit_logs.map { |log| audit_log_to_json(log) },
              pagination: pagination_data(@audit_logs),
              stats: audit_log_stats
            },
            message: "Audit logs retrieved successfully."
          }, status: :ok
        end

        private

        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end

        def apply_filters(logs)
          filtered = logs
          
          # Filter by action type
          if params[:action_type].present?
            filtered = filtered.where(action: params[:action_type])
          end
          
          # Filter by user
          if params[:user_id].present?
            filtered = filtered.where(user_id: params[:user_id])
          end
          
          # Filter by resource type
          if params[:resource_type].present?
            filtered = filtered.where(resource_type: params[:resource_type])
          end
          
          # Filter by resource id
          if params[:resource_id].present?
            filtered = filtered.where(resource_id: params[:resource_id])
          end
          
          # Filter by date range
          if params[:start_date].present? && params[:end_date].present?
            begin
              start_date = Date.parse(params[:start_date]).beginning_of_day
              end_date = Date.parse(params[:end_date]).end_of_day
              filtered = filtered.where(created_at: start_date..end_date)
            rescue ArgumentError
              # Invalid date format, ignore filter
            end
          end
          
          # Filter by IP address
          if params[:ip_address].present?
            filtered = filtered.where(ip_address: params[:ip_address])
          end
          
          filtered
        end

        def paginate(logs)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 20).to_i
          logs.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
        end

        def pagination_data(logs)
          total = AuditLog.count
          {
            current_page: (params[:page] || 1).to_i,
            per_page: (params[:per_page] || 20).to_i,
            total_items: total,
            total_pages: (total.to_f / (params[:per_page] || 20).to_i).ceil
          }
        end

        def audit_log_stats
          {
            total_logs: AuditLog.count,
            logs_today: AuditLog.where('created_at >= ?', Date.current.beginning_of_day).count,
            logs_this_week: AuditLog.where('created_at >= ?', 1.week.ago).count,
            by_action: {
              create: AuditLog.where(action: 'create').count,
              update: AuditLog.where(action: 'update').count,
              delete: AuditLog.where(action: 'delete').count,
              login: AuditLog.where(action: 'login').count,
              logout: AuditLog.where(action: 'logout').count
            },
            by_resource: {
              user: AuditLog.where(resource_type: 'User').count,
              appointment: AuditLog.where(resource_type: 'Appointment').count,
              medical_record: AuditLog.where(resource_type: 'MedicalRecord').count,
              prescription: AuditLog.where(resource_type: 'Prescription').count
            }
          }
        end

        def audit_log_to_json(log)
          {
            id: log.id,
            action: log.action,
            user: log.user ? {
              id: log.user.id,
              name: log.user.full_name,
              role: log.user.role
            } : nil,
            resource_type: log.resource_type,
            resource_id: log.resource_id,
            ip_address: log.ip_address,
            user_agent: log.user_agent,
            changes: log.changes,
            created_at: log.created_at
          }
        end
      end
    end
  end
end
