module Api
  module V1
    module Admin
      class UsersController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_user, only: [:show, :update, :destroy]

        # GET /api/v1/admin/users
        def index
          @users = User.all
          
          # Apply filtering
          @users = apply_filters(@users)
          
          # Apply pagination
          @users = paginate(@users)
          
          render json: {
            success: true,
            data: {
              users: @users.map { |user| user_to_json(user) },
              pagination: pagination_data(@users),
              stats: user_stats
            },
            message: "Users retrieved successfully."
          }, status: :ok
        end

        # GET /api/v1/admin/users/:id
        def show
          render json: {
            success: true,
            data: { user: user_to_json(@user, include_details: true) },
            message: "User retrieved successfully."
          }, status: :ok
        end

        # PUT /api/v1/admin/users/:id
        def update
          if @user.update(user_params)
            render json: {
              success: true,
              data: { user: user_to_json(@user) },
              message: "User updated successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @user.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/admin/users/:id
        def destroy
          # Check if the user being deleted is the current admin
          if @user.id == current_user.id
            return render json: {
              success: false,
              error: "Cannot delete your own account."
            }, status: :unprocessable_entity
          end
          
          if @user.destroy
            render json: {
              success: true,
              message: "User deleted successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @user.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end

        def set_user
          @user = User.find_by(id: params[:id])
          
          unless @user
            render json: {
              success: false,
              error: "User not found."
            }, status: :not_found
          end
        end

        def apply_filters(users)
          filtered = users
          
          # Filter by role
          if params[:role].present?
            filtered = filtered.where(role: params[:role])
          end
          
          # Filter by status (assuming there's a status field)
          if params[:status].present? && User.column_names.include?('status')
            filtered = filtered.where(status: params[:status])
          end
          
          # Filter by search term (name or email)
          if params[:search].present?
            search_term = "%#{params[:search]}%"
            filtered = filtered.where("full_name ILIKE ? OR email ILIKE ?", search_term, search_term)
          end
          
          # Filter by join date range
          if params[:start_date].present? && params[:end_date].present?
            begin
              start_date = Date.parse(params[:start_date])
              end_date = Date.parse(params[:end_date])
              filtered = filtered.where(created_at: start_date.beginning_of_day..end_date.end_of_day)
            rescue ArgumentError
              # Invalid date format, ignore filter
            end
          end
          
          filtered
        end

        def paginate(users)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 10).to_i
          users.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
        end

        def pagination_data(users)
          {
            current_page: (params[:page] || 1).to_i,
            per_page: (params[:per_page] || 10).to_i,
            total_items: User.count,
            total_pages: (User.count.to_f / (params[:per_page] || 10).to_i).ceil
          }
        end

        def user_stats
          {
            total_users: User.count,
            patients: User.where(role: 'patient').count,
            providers: User.where(role: 'provider').count,
            admins: User.where(role: 'admin').count,
            new_today: User.where('created_at >= ?', Date.current.beginning_of_day).count,
            new_this_week: User.where('created_at >= ?', 1.week.ago).count,
            new_this_month: User.where('created_at >= ?', 1.month.ago).count
          }
        end

        def user_to_json(user, include_details: false)
          json = {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role,
            status: user.respond_to?(:status) ? user.status : 'active',
            join_date: user.created_at,
            last_active: user.updated_at
          }
          
          if include_details
            # Add more details for the detailed view
            json.merge!({
              phone: user.phone,
              date_of_birth: user.date_of_birth,
              gender: user.gender,
              address: user.address,
              appointments_count: user.appointments_as_patient.count + user.appointments_as_provider.count,
              records_count: user.role == 'patient' ? user.medical_records_as_patient.count : 
                            (user.role == 'provider' ? user.medical_records_as_provider.count : 0),
              account_details: {
                email_verified: true, # Placeholder for future implementation
                two_factor_enabled: false # Placeholder for future implementation
              }
            })
            
            # Add role specific information
            case user.role
            when 'patient'
              if user.patient_profile
                json[:patient_info] = {
                  emergency_contact: user.patient_profile.emergency_contact,
                  insurance: user.patient_profile.insurance_details
                }
              end
            when 'provider'
              if user.provider_profile
                json[:provider_info] = {
                  specialization: user.provider_profile.specialization,
                  license_number: user.provider_profile.license_number,
                  services_offered: user.provider_profile.services&.size || 0
                }
              end
            end
          end
          
          json
        end

        def user_params
          # Parameters that admin can update for any user
          permitted = [:full_name, :email, :phone, :role, :status]
          
          # Conditionally allow password update if it's provided
          if params[:user][:password].present?
            permitted += [:password, :password_confirmation]
          end
          
          params.require(:user).permit(permitted)
        end
      end
    end
  end
end
