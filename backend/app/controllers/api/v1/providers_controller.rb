module Api
  module V1
    class ProvidersController < BaseController
      before_action :authenticate_user!
      before_action :authorize_provider!
      before_action :ensure_provider_profile, except: [:dashboard]
      
      # GET /api/v1/providers/dashboard
      def dashboard
        # Get upcoming appointments for today
        today = Date.current
        upcoming_appointments = current_user.appointments_as_provider
                                          .where("DATE(appointment_datetime) = ? AND status = ?", today, Appointment.statuses[:scheduled])
                                          .includes(:patient)
                                          .order(appointment_datetime: :asc)
                                          .limit(5)
        
        # Get recent patients with activity
        recent_patients = current_user.appointments_as_provider
                                     .includes(:patient)
                                     .where("appointment_datetime < ?", Time.current)
                                     .order(appointment_datetime: :desc)
                                     .limit(5)
                                     .map(&:patient)
                                     .uniq
        
        # Count total appointments for various statistics
        today_appointments_count = current_user.appointments_as_provider
                                              .where("DATE(appointment_datetime) = ?", today)
                                              .count
        
        pending_reports_count = current_user.medical_records_as_provider
                                          .where(status: :draft)
                                          .count
        
        upcoming_surgeries_count = current_user.appointments_as_provider
                                              .where("appointment_datetime > ? AND appointment_type = 'surgery'", Time.current)
                                              .count
        
        # Prepare dashboard data
        dashboard_data = {
          summary: {
            patients_today: today_appointments_count,
            total_appointments: current_user.appointments_as_provider.count,
            pending_reports: pending_reports_count,
            surgery_schedule: upcoming_surgeries_count
          },
          upcoming_appointments: upcoming_appointments.map { |appointment| appointment_summary(appointment) },
          recent_patient_activity: recent_patients.map { |patient| patient_summary(patient) }
        }
        
        render json: {
          success: true,
          data: { dashboard: dashboard_data },
          message: "Provider dashboard data retrieved successfully."
        }, status: :ok
      end
      
      # GET /api/v1/providers/profile
      def profile
        render json: {
          success: true,
          data: { profile: provider_profile_to_json },
          message: "Provider profile retrieved successfully."
        }, status: :ok
      end
      
      # PUT /api/v1/providers/profile
      def update_profile
        section = params[:section] || 'basic_info'
        
        case section
        when 'basic_info'
          result = update_basic_info
        when 'professional_info'
          result = update_professional_info
        when 'services'
          result = update_services
        when 'availability'
          result = update_availability
        else
          result = { success: false, error: "Unknown profile section: #{section}" }
        end
        
        if result[:success]
          render json: {
            success: true,
            data: result[:data],
            message: "#{section.humanize} updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: result[:errors] || [result[:error]]
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/providers/appointments
      def appointments
        @appointments = current_user.appointments_as_provider
                                   .includes(:patient)
                                   .order(appointment_datetime: :desc)
        
        # Apply filters
        @appointments = apply_appointment_filters(@appointments)
        
        # Apply pagination
        @appointments = paginate(@appointments)
        
        render json: {
          success: true,
          data: {
            appointments: @appointments.map { |appointment| appointment_to_json(appointment) },
            pagination: pagination_data(@appointments)
          },
          message: "Appointments retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/providers/appointments/:id
      def show_appointment
        @appointment = current_user.appointments_as_provider.find(params[:id])
        
        render json: {
          success: true,
          data: { appointment: appointment_to_json(@appointment, include_details: true) },
          message: "Appointment retrieved successfully."
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Appointment not found."
        }, status: :not_found
      end

      # PUT /api/v1/providers/appointments/:id
      def update_appointment
        @appointment = current_user.appointments_as_provider.find(params[:id])
        
        if @appointment.update(appointment_params)
          render json: {
            success: true,
            data: { appointment: appointment_to_json(@appointment) },
            message: "Appointment updated successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Appointment not found."
        }, status: :not_found
      end

      # DELETE /api/v1/providers/appointments/:id
      def cancel_appointment
        @appointment = current_user.appointments_as_provider.find(params[:id])
        
        if @appointment.update(status: :cancelled)
          render json: {
            success: true,
            message: "Appointment cancelled successfully."
          }, status: :ok
        else
          render json: {
            success: false,
            errors: @appointment.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Appointment not found."
        }, status: :not_found
      end

      # GET /api/v1/providers/patients
      def patients
        @patients = User.joins(:appointments_as_patient)
                       .where(appointments: { provider_id: current_user.id })
                       .distinct
                       .includes(:patient_profile)
        
        # Apply filters
        @patients = apply_patient_filters(@patients)
        
        # Apply pagination
        @patients = paginate(@patients)
        
        render json: {
          success: true,
          data: {
            patients: @patients.map { |patient| patient_to_json(patient) },
            pagination: pagination_data(@patients)
          },
          message: "Patients retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/providers/patients/:id/records
      def patient_records
        @patient = User.find(params[:id])
        @records = @patient.medical_records_as_patient
                          .where(provider_id: current_user.id)
                          .order(created_at: :desc)
        
        render json: {
          success: true,
          data: {
            patient: patient_to_json(@patient),
            records: @records.map { |record| medical_record_to_json(record) }
          },
          message: "Patient records retrieved successfully."
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Patient not found."
        }, status: :not_found
      end

      # POST /api/v1/providers/patients/:id/records
      def add_medical_record
        @patient = User.find(params[:id])
        @record = @patient.medical_records_as_patient.build(record_params.merge(provider_id: current_user.id))
        
        if @record.save
          render json: {
            success: true,
            data: { record: medical_record_to_json(@record) },
            message: "Medical record added successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @record.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Patient not found."
        }, status: :not_found
      end

      # GET /api/v1/providers/messages
      def messages
        @conversations = current_user.conversations_as_provider
                                   .includes(:messages, :participants)
                                   .order(updated_at: :desc)
        
        render json: {
          success: true,
          data: {
            conversations: @conversations.map { |conversation| conversation_to_json(conversation) }
          },
          message: "Messages retrieved successfully."
        }, status: :ok
      end

      # GET /api/v1/providers/messages/:id
      def show_conversation
        @conversation = current_user.conversations_as_provider.find(params[:id])
        
        render json: {
          success: true,
          data: {
            conversation: conversation_to_json(@conversation, include_messages: true)
          },
          message: "Conversation retrieved successfully."
        }, status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Conversation not found."
        }, status: :not_found
      end

      # POST /api/v1/providers/messages/:id
      def send_message
        @conversation = current_user.conversations_as_provider.find(params[:id])
        @message = @conversation.messages.build(message_params.merge(sender: current_user))
        
        if @message.save
          render json: {
            success: true,
            data: { message: message_to_json(@message) },
            message: "Message sent successfully."
          }, status: :created
        else
          render json: {
            success: false,
            errors: @message.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound
        render json: {
          success: false,
          error: "Conversation not found."
        }, status: :not_found
      end
      
      private
      
      def authorize_provider!
        unless current_user.provider?
          render json: { success: false, error: 'Unauthorized access' }, status: :forbidden
        end
      end
      
      def ensure_provider_profile
        # Create provider profile if it doesn't exist yet
        current_user.create_provider_profile if current_user.provider_profile.nil?
      end
      
      # Dashboard helper methods
      def appointment_summary(appointment)
        {
          id: appointment.id,
          patient: {
            id: appointment.patient.id,
            name: appointment.patient.full_name,
            age: calculate_age(appointment.patient.date_of_birth),
            gender: appointment.patient.gender
          },
          appointment_time: appointment.appointment_datetime,
          appointment_type: appointment.appointment_type,
          status: appointment.status
        }
      end
      
      def patient_summary(patient)
        last_appointment = patient.appointments_as_patient
                                 .where(provider_id: current_user.id)
                                 .order(appointment_datetime: :desc)
                                 .first
        
        {
          id: patient.id,
          name: patient.full_name,
          age: calculate_age(patient.date_of_birth),
          gender: patient.gender,
          last_visit: last_appointment&.appointment_datetime,
          condition: last_appointment&.reason
        }
      end
      
      def calculate_age(date_of_birth)
        return nil unless date_of_birth
        now = Time.current.to_date
        now.year - date_of_birth.year - ((now.month > date_of_birth.month || (now.month == date_of_birth.month && now.day >= date_of_birth.day)) ? 0 : 1)
      end
      
      # Profile methods
      def provider_profile_to_json
        profile = current_user.provider_profile
        
        {
          id: current_user.id,
          firstName: current_user.full_name.split.first,
          lastName: current_user.full_name.split.last,
          email: current_user.email,
          phone: current_user.phone,
          specialization: profile.specialization,
          bio: profile.bio,
          languages: profile.languages || [],
          profileImage: profile.profile_image_url,
          licenseNumber: profile.license_number,
          education: profile.education || [],
          experience: profile.experience || [],
          services: profile.services || [],
          consultationFee: profile.consultation_fee,
          availability: profile.availability || {}
        }
      end
      
      def update_basic_info
        if current_user.update(basic_info_params) && current_user.provider_profile.update(basic_profile_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          errors = current_user.errors.full_messages + current_user.provider_profile.errors.full_messages
          { success: false, errors: errors }
        end
      end
      
      def update_professional_info
        profile = current_user.provider_profile
        
        # Update professional fields
        if params[:education].present?
          profile.education = params[:education]
        end
        
        if params[:experience].present?
          profile.experience = params[:experience]
        end
        
        if params[:languages].present?
          profile.languages = params[:languages]
        end
        
        if profile.update(professional_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      def update_services
        profile = current_user.provider_profile
        
        if params[:services].present?
          profile.services = params[:services]
        end
        
        if profile.update(services_params)
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      def update_availability
        profile = current_user.provider_profile
        
        if params[:availability].present?
          profile.availability = params[:availability]
        end
        
        if profile.save
          {
            success: true,
            data: { profile: provider_profile_to_json }
          }
        else
          { success: false, errors: profile.errors.full_messages }
        end
      end
      
      # Strong params
      def basic_info_params
        params.require(:basic_info).permit(:full_name, :email, :phone)
      end
      
      def basic_profile_params
        params.require(:basic_info).permit(:bio, :profile_image_url, :license_number, :specialization)
      end
      
      def professional_params
        params.permit(:license_number, :specialization, :bio)
      end
      
      def services_params
        params.permit(:consultation_fee)
      end

      # Helper methods for new endpoints
      def apply_appointment_filters(appointments)
        filtered = appointments
        
        # Filter by status
        if params[:status].present?
          filtered = filtered.where(status: params[:status])
        end
        
        # Filter by date range
        if params[:start_date].present? && params[:end_date].present?
          begin
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            filtered = filtered.where(appointment_datetime: start_date.beginning_of_day..end_date.end_of_day)
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end
        
        # Filter by patient
        if params[:patient_id].present?
          filtered = filtered.where(patient_id: params[:patient_id])
        end
        
        filtered
      end

      def apply_patient_filters(patients)
        filtered = patients
        
        # Filter by search term
        if params[:search].present?
          search_term = "%#{params[:search]}%"
          filtered = filtered.where("full_name ILIKE ? OR email ILIKE ?", search_term, search_term)
        end
        
        # Filter by last visit date
        if params[:last_visit_after].present?
          begin
            date = Date.parse(params[:last_visit_after])
            filtered = filtered.joins(:appointments_as_patient)
                              .where(appointments: { provider_id: current_user.id, appointment_datetime: date.. })
          rescue ArgumentError
            # Invalid date format, ignore filter
          end
        end
        
        filtered
      end

      def paginate(collection)
        page = (params[:page] || 1).to_i
        per_page = (params[:per_page] || 10).to_i
        collection.offset((page - 1) * per_page).limit(per_page)
      end

      def pagination_data(collection)
        {
          current_page: (params[:page] || 1).to_i,
          per_page: (params[:per_page] || 10).to_i,
          total_items: collection.count,
          total_pages: (collection.count.to_f / (params[:per_page] || 10).to_i).ceil
        }
      end

      def appointment_to_json(appointment, include_details: false)
        json = {
          id: appointment.id,
          appointment_datetime: appointment.appointment_datetime,
          duration_minutes: appointment.duration_minutes,
          status: appointment.status,
          appointment_type: appointment.appointment_type,
          reason: appointment.reason,
          notes: appointment.notes,
          patient: {
            id: appointment.patient.id,
            name: appointment.patient.full_name,
            age: calculate_age(appointment.patient.date_of_birth),
            gender: appointment.patient.gender
          }
        }
        
        if include_details
          json[:patient].merge!({
            email: appointment.patient.email,
            phone: appointment.patient.phone,
            emergency_contact: appointment.patient.patient_profile&.emergency_contact
          })
        end
        
        json
      end

      def patient_to_json(patient)
        last_appointment = patient.appointments_as_patient
                                 .where(provider_id: current_user.id)
                                 .order(appointment_datetime: :desc)
                                 .first
        
        {
          id: patient.id,
          name: patient.full_name,
          email: patient.email,
          phone: patient.phone,
          age: calculate_age(patient.date_of_birth),
          gender: patient.gender,
          last_visit: last_appointment&.appointment_datetime,
          total_appointments: patient.appointments_as_patient.where(provider_id: current_user.id).count,
          emergency_contact: patient.patient_profile&.emergency_contact
        }
      end

      def medical_record_to_json(record)
        {
          id: record.id,
          record_type: record.record_type,
          title: record.title,
          content: record.content,
          diagnosis: record.diagnosis,
          treatment: record.treatment,
          medications: record.medications,
          created_at: record.created_at,
          updated_at: record.updated_at
        }
      end

      def conversation_to_json(conversation, include_messages: false)
        json = {
          id: conversation.id,
          title: conversation.title,
          participants: conversation.participants.map { |p| { id: p.id, name: p.full_name, role: p.role } },
          last_message: conversation.messages.last&.content,
          last_message_at: conversation.messages.last&.created_at,
          unread_count: conversation.messages.where.not(sender: current_user).where(read_at: nil).count
        }
        
        if include_messages
          json[:messages] = conversation.messages.order(created_at: :asc).map { |m| message_to_json(m) }
        end
        
        json
      end

      def message_to_json(message)
        {
          id: message.id,
          content: message.content,
          message_type: message.message_type,
          created_at: message.created_at,
          read_at: message.read_at,
          sender: {
            id: message.sender.id,
            name: message.sender.full_name,
            role: message.sender.role
          }
        }
      end

      # Strong parameters
      def appointment_params
        params.require(:appointment).permit(:appointment_datetime, :duration_minutes, :status, :appointment_type, :reason, :notes)
      end

      def record_params
        params.require(:record).permit(:record_type, :title, :content, :diagnosis, :treatment, :medications)
      end

      def message_params
        params.require(:message).permit(:content, :message_type)
      end
    end
  end
end
