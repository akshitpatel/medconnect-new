module Api
  module V1
    module Admin
      class ProvidersController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_provider, only: [:show, :update, :destroy, :verify]

        # GET /api/v1/admin/providers
        def index
          @providers = User.where(role: 'provider').includes(:provider_profile)
          
          # Apply filtering
          @providers = apply_filters(@providers)
          
          # Apply pagination
          @providers = paginate(@providers)
          
          render json: {
            success: true,
            data: {
              providers: @providers.map { |provider| provider_to_json(provider) },
              pagination: pagination_data(@providers),
              stats: provider_stats
            },
            message: "Providers retrieved successfully."
          }, status: :ok
        end

        # GET /api/v1/admin/providers/:id
        def show
          render json: {
            success: true,
            data: { provider: provider_to_json(@provider, include_details: true) },
            message: "Provider retrieved successfully."
          }, status: :ok
        end

        # PUT /api/v1/admin/providers/:id
        def update
          # Update both user and provider profile
          ActiveRecord::Base.transaction do
            @provider.update!(provider_user_params)
            
            if @provider.provider_profile.nil?
              @provider.create_provider_profile(provider_profile_params)
            else
              @provider.provider_profile.update!(provider_profile_params)
            end
          end
          
          render json: {
            success: true,
            data: { provider: provider_to_json(@provider) },
            message: "Provider updated successfully."
          }, status: :ok
        rescue ActiveRecord::RecordInvalid => e
          render json: {
            success: false,
            errors: e.record.errors.full_messages
          }, status: :unprocessable_entity
        end

        # DELETE /api/v1/admin/providers/:id
        def destroy
          if @provider.destroy
            render json: {
              success: true,
              message: "Provider deleted successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: @provider.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/admin/providers/:id/verify
        def verify
          profile = @provider.provider_profile || @provider.create_provider_profile
          profile.verified = true
          profile.verification_date = Time.current
          
          if profile.save
            # TODO: Notify provider about verification
            render json: {
              success: true,
              data: { provider: provider_to_json(@provider) },
              message: "Provider verified successfully."
            }, status: :ok
          else
            render json: {
              success: false,
              errors: profile.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        private

        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end

        def set_provider
          @provider = User.where(role: 'provider').find_by(id: params[:id])
          
          unless @provider
            render json: {
              success: false,
              error: "Provider not found."
            }, status: :not_found
          end
        end

        def apply_filters(providers)
          filtered = providers
          
          # Filter by specialization
          if params[:specialization].present?
            filtered = filtered.joins(:provider_profile)
                              .where("provider_profiles.specialization ILIKE ?", "%#{params[:specialization]}%")
          end
          
          # Filter by verification status
          if params[:verified].present?
            verified = params[:verified] == 'true' || params[:verified] == '1'
            filtered = filtered.joins(:provider_profile)
                              .where(provider_profiles: { verified: verified })
          end
          
          # Filter by location (assuming address field in User model)
          if params[:location].present?
            filtered = filtered.where("address ILIKE ?", "%#{params[:location]}%")
          end
          
          # Filter by search term (name or email)
          if params[:search].present?
            search_term = "%#{params[:search]}%"
            filtered = filtered.where("full_name ILIKE ? OR email ILIKE ?", search_term, search_term)
          end
          
          filtered
        end

        def paginate(providers)
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 10).to_i
          providers.order(created_at: :desc).offset((page - 1) * per_page).limit(per_page)
        end

        def pagination_data(providers)
          {
            current_page: (params[:page] || 1).to_i,
            per_page: (params[:per_page] || 10).to_i,
            total_items: User.where(role: 'provider').count,
            total_pages: (User.where(role: 'provider').count.to_f / (params[:per_page] || 10).to_i).ceil
          }
        end

        def provider_stats
          {
            total_providers: User.where(role: 'provider').count,
            verified_providers: User.joins(:provider_profile).where(provider_profiles: { verified: true }).count,
            pending_verification: User.joins(:provider_profile).where(provider_profiles: { verified: false }).count,
            no_profile: User.where(role: 'provider').left_outer_joins(:provider_profile).where(provider_profiles: { id: nil }).count,
            new_this_month: User.where(role: 'provider').where('created_at >= ?', 1.month.ago).count
          }
        end

        def provider_to_json(provider, include_details: false)
          profile = provider.provider_profile
          
          json = {
            id: provider.id,
            name: provider.full_name,
            type: 'doctor', # Default to doctor, could be expanded in the future
            specialty: profile&.specialization,
            location: provider.address,
            rating: calculate_rating(provider),
            contact_email: provider.email,
            contact_phone: provider.phone,
            status: profile&.verified ? 'verified' : 'pending',
            verified: profile&.verified || false,
            created_at: provider.created_at,
            photo: profile&.profile_image_url
          }
          
          if include_details
            # Add more details for the detailed view
            json.merge!({
              bio: profile&.bio,
              languages: profile&.languages || [],
              license_number: profile&.license_number,
              education: profile&.education || [],
              experience: profile&.experience || [],
              services: profile&.services || [],
              consultation_fee: profile&.consultation_fee,
              availability: profile&.availability || {},
              appointments_count: provider.appointments_as_provider.count,
              patients_count: provider.appointments_as_provider.select(:patient_id).distinct.count,
              verification_date: profile&.verification_date
            })
          end
          
          json
        end

        def calculate_rating(provider)
          # Placeholder for rating calculation
          # In a real implementation, this would calculate based on reviews
          (3.5 + rand * 1.5).round(1) # Random rating between 3.5 and 5.0
        end

        def provider_user_params
          params.require(:provider).permit(:full_name, :email, :phone, :address, :status)
        end

        def provider_profile_params
          params.require(:provider).permit(
            :specialization,
            :bio,
            :license_number,
            :profile_image_url,
            :consultation_fee,
            :verified,
            languages: [],
            education: [:id, :degree, :institution, :year],
            experience: [:id, :position, :hospital, :start_year, :end_year],
            services: [:id, :name, :price],
            availability: {}
          )
        end
      end
    end
  end
end
