module Api
  module V1
    module Admin
      class UnifiedSearchController < BaseController
        before_action :authenticate_user!
        before_action :authorize_admin!
        
        # GET /api/v1/admin/unified_search
        def index
          search_term = params[:query].present? ? "%#{params[:query]}%" : nil
          @results = []
          
          # Start with empty search results
          results = { providers: [], users: [] }
          
          # Search providers based on query and provider_type
          if params[:include_providers] != 'false'
            providers_query = User.where(role: 'provider')
                               .joins(:provider_profile)
            
            # Filter by provider type if specified
            if params[:provider_type].present?
              providers_query = providers_query.where(provider_profiles: { provider_type: params[:provider_type] })
            end
            
            # Apply search if query is present
            if search_term.present?
              providers_query = providers_query.where(
                "users.full_name ILIKE ? OR users.email ILIKE ? OR provider_profiles.specialization ILIKE ?", 
                search_term, search_term, search_term
              )
            end
            
            # Apply additional filters
            if params[:verified].present?
              verified = params[:verified] == 'true' || params[:verified] == '1'
              providers_query = providers_query.where(provider_profiles: { verified: verified })
            end
            
            results[:providers] = providers_query.limit(20).map { |provider| provider_to_search_result(provider) }
          end
          
          # Search users if requested
          if params[:include_users] != 'false'
            users_query = User.where.not(role: 'provider')
            
            # Filter by role if specified
            if params[:role].present?
              users_query = users_query.where(role: params[:role])
            end
            
            # Apply search if query is present
            if search_term.present?
              users_query = users_query.where(
                "full_name ILIKE ? OR email ILIKE ?", 
                search_term, search_term
              )
            end
            
            results[:users] = users_query.limit(20).map { |user| user_to_search_result(user) }
          end
          
          # Combine and paginate results
          combined_results = results[:providers] + results[:users]
          page = (params[:page] || 1).to_i
          per_page = (params[:per_page] || 20).to_i
          paginated_results = combined_results[(page - 1) * per_page, per_page] || []
          
          render json: {
            success: true,
            data: {
              results: paginated_results,
              pagination: {
                current_page: page,
                per_page: per_page,
                total_items: combined_results.size,
                total_pages: (combined_results.size.to_f / per_page).ceil
              },
              counts: {
                providers: results[:providers].size,
                users: results[:users].size,
                total: combined_results.size
              }
            },
            message: "Search completed successfully."
          }, status: :ok
        end
        
        private
        
        def authorize_admin!
          unless current_user.admin?
            render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
          end
        end
        
        def user_to_search_result(user)
          {
            id: user.id,
            type: 'user',
            subtype: user.role,
            name: user.full_name,
            email: user.email,
            phone: user.phone,
            created_at: user.created_at
          }
        end
        
        def provider_to_search_result(provider)
          profile = provider.provider_profile
          result = {
            id: provider.id,
            type: 'provider',
            subtype: profile&.provider_type || 'doctor',
            name: provider.full_name,
            specialty: profile&.specialization,
            location: provider.address,
            email: provider.email,
            phone: provider.phone,
            verified: profile&.verified || false,
            rating: calculate_rating(provider),
            created_at: provider.created_at
          }
          
          # Add type-specific fields
          if profile.present?
            case profile.provider_type
            when 'hospital', 'clinic'
              result[:departments] = profile.facility_details&.dig('departments') || []
            when 'doctor'
              result[:accepting_patients] = profile.facility_details&.dig('accepting_new_patients') || true
            end
          end
          
          result
        end
        
        def calculate_rating(provider)
          # Placeholder for rating calculation
          (3.5 + rand * 1.5).round(1) # Random rating between 3.5 and 5.0
        end
      end
    end
  end
end
