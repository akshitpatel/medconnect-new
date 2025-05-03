module Api
  module V1
    class ProfilePhotosController < BaseController
      before_action :authenticate_user!
      before_action :authorize_patient!

      # POST /api/v1/patients/profile/photo
      def create
        if params[:profile_photo].blank?
          render json: { success: false, errors: ["Profile photo is required"] }, status: :bad_request
          return
        end

        # Check if this is a valid image
        unless params[:profile_photo].content_type.in?(['image/jpeg', 'image/png', 'image/gif'])
          render json: { success: false, errors: ["Invalid image format. Supported formats: JPEG, PNG, GIF"] }, status: :bad_request
          return
        end
        
        # Get the current user
        user = current_user
        
        # Store the original filename and generate a secure random filename
        original_filename = params[:profile_photo].original_filename
        file_extension = File.extname(original_filename).downcase
        secure_filename = "#{SecureRandom.uuid}#{file_extension}"
        
        # Determine the storage directory (create if it doesn't exist)
        storage_dir = Rails.root.join('public', 'uploads', 'profile_photos')
        FileUtils.mkdir_p(storage_dir) unless Dir.exist?(storage_dir)
        
        # Full path for the file
        file_path = File.join(storage_dir, secure_filename)
        
        # Write the file to disk
        File.open(file_path, 'wb') do |file|
          file.write(params[:profile_photo].read)
        end
        
        # Generate the URL for the uploaded photo
        photo_url = "/uploads/profile_photos/#{secure_filename}"
        
        # Update the user's profile picture URL in the database
        begin
          user.update!(profile_picture: photo_url)
          
          # Return success response with the photo URL
          render json: {
            success: true,
            data: {
              photo_url: photo_url
            },
            message: "Profile photo uploaded successfully"
          }, status: :ok
        rescue => e
          # If database update fails, delete the uploaded file to avoid orphaned files
          File.delete(file_path) if File.exist?(file_path)
          
          render json: {
            success: false,
            errors: ["Failed to update profile: #{e.message}"]
          }, status: :unprocessable_entity
        end
      end

      private
      
      def authorize_patient!
        unless current_user.role == 'patient'
          render json: { error: 'Unauthorized access' }, status: :forbidden
        end
      end
    end
  end
end
