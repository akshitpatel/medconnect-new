module Api
  module V1
    module Admin
      class NotificationsController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_notification, only: [:show, :update, :destroy]

        # GET /api/v1/admin/notifications
        def index
          @notifications = Notification.all
          
          # Apply filtering
          @notifications = apply_filters(@notifications)
          
          # Apply pagination
          @notifications = paginate(@notifications)
          
          render json: {
            success: true,
            data: {
              notifications: @notifications.map { |notification| notification_to_json(notification) },
              pagination: pagination_data(@notifications),
              stats: notification_stats
            },
            message: "Notifications retrieved successfully."
          }, status: :ok
        end

        # GET /api/v1/admin/notifications/:id
        def show
          render json: {
            success: true,
            data: { notification: notification_to_json(@notification, include_details: true) },
            message: "Notification retrieved successfully."
          }, status: :ok
        end

        # POST /api/v1/admin/notifications
        def create
          @notification = Notification.new(notification_params)
          
          # Validate user existence if targeting a specific user
          if params[:notification][:user_id].present? && !User.exists?(params[:notification][:user_id])
            return render json: {
              success: false,
              error: "User not found."
            }, status: :unprocessable_entity
          end
          
          if @notification.save
            # TODO: Send push notification or email as needed
            render json: {
              success: true,
              data: { notification: notification_to_json(@notification) },
              message: "Notification created and sent successfully."
            }, status: :created
          else
            render json: {
              success: false,
              errors: @notification.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/admin/notifications/:id
        def update
          # Only allow updating read status and priority
          if @notification.update(notification_update_params)
            render json: {
              success: true,
              data: { notification: notification_to_json(@notification) },
              message: "Notification updated successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @notification.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/notifications/:id
        def destroy
          if @notification.destroy
            render json: {
              success: true,
              message: "Notification deleted successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @notification.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # POST /api/v1/admin/notifications/broadcast
        def broadcast
          # Create a notification for all users or a specific role
          target_role = params[:role]
          
          # Get target users based on role (or all users if no role specified)
          target_users = if target_role.present?
                           User.where(role: target_role)
                         else
                           User.all
                         end
          
          # Track success and failures
          success_count = 0
          failed_ids = []
          
          # Create a notification for each target user
          target_users.find_each do |user|
            notification = Notification.new(
              title: params[:notification][:title],
              message: params[:notification][:message],
              notification_type: params[:notification][:notification_type] || 'general',
              priority: params[:notification][:priority] || 'normal',
              user_id: user.id
            )
            
            if notification.save
              success_count += 1
            else
              failed_ids << user.id
            end
          end
          
          render json: {
            success: true,
            data: {
              success_count: success_count,
              failed_count: failed_ids.size,
              failed_user_ids: failed_ids
            },
            message: "Broadcast notification sent to #{success_count} users."
          }, status: :ok
        end

        private

        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end

        def set_notification
          @notification = Notification.find_by(id: params[:id])
          
          unless @notification
            render json: {
              success: false,
              error: "Notification not found."
            }, status: :not_found
          end
        end

        def apply_filters(notifications)
          filtered = notifications
          
          # Filter by type
          if params[:type].present?
            filtered = filtered.where(notification_type: params[:type])
          end
          
          # Filter by priority
          if params[:priority].present?
            filtered = filtered.where(priority: params[:priority])
          end
          
          # Filter by read status
          if params[:read].present?
            is_read = params[:read] == 'true' || params[:read] == '1'
            if is_read
              filtered = filtered.where.not(read_at: nil)
            else
              filtered = filtered.where(read_at: nil)
            end
          end
          
          # Filter by user
          if params[:user_id].present?
            filtered = filtered.where(user_id: params[:user_id])
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
          
          # Filter by search term (title or message)
          if params[:search].present?
            search_term = "%#{params[:search]}%"
            filtered = filtered.where("title ILIKE ? OR message ILIKE ?", search_term, search_term)
          end
          
          filtered
        end

        def paginate(notifications)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 10).to_i
          notifications.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
        end

        def pagination_data(notifications)
          total = Notification.count
          {
            current_page: (params[:page] || 1).to_i,
            per_page: (params[:per_page] || 10).to_i,
            total_items: total,
            total_pages: (total.to_f / (params[:per_page] || 10).to_i).ceil
          }
        end

        def notification_stats
          {
            total: Notification.count,
            unread: Notification.where(read_at: nil).count,
            read: Notification.where.not(read_at: nil).count,
            by_type: {
              general: Notification.where(notification_type: 'general').count,
              appointment: Notification.where(notification_type: 'appointment').count,
              message: Notification.where(notification_type: 'message').count,
              alert: Notification.where(notification_type: 'alert').count
            },
            by_priority: {
              high: Notification.where(priority: 'high').count,
              normal: Notification.where(priority: 'normal').count,
              low: Notification.where(priority: 'low').count
            }
          }
        end

        def notification_to_json(notification, include_details: false)
          json = {
            id: notification.id,
            title: notification.title,
            message: notification.message,
            type: notification.notification_type,
            priority: notification.priority,
            timestamp: notification.created_at,
            is_read: notification.read_at.present?,
            read_at: notification.read_at,
            user_id: notification.user_id
          }
          
          if include_details && notification.user_id.present?
            user = User.find_by(id: notification.user_id)
            if user
              json[:user] = {
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role
              }
            end
          end
          
          json
        end

        def notification_params
          params.require(:notification).permit(
            :title,
            :message,
            :notification_type,
            :priority,
            :user_id
          )
        end

        def notification_update_params
          # Only allow updating read_at and priority
          updates = {}
          
          # Mark as read/unread
          if params[:is_read].present?
            updates[:read_at] = params[:is_read] == 'true' || params[:is_read] == '1' ? Time.current : nil
          end
          
          # Update priority
          if params[:notification][:priority].present?
            updates[:priority] = params[:notification][:priority]
          end
          
          updates
        end
      end
    end
  end
end
