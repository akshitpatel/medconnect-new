# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_04_28_180000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "appointments", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "provider_id", null: false
    t.datetime "appointment_datetime"
    t.integer "duration_minutes"
    t.integer "status"
    t.string "appointment_type"
    t.string "reason"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_appointments_on_patient_id"
    t.index ["provider_id"], name: "index_appointments_on_provider_id"
  end

  create_table "audit_logs", force: :cascade do |t|
    t.bigint "user_id"
    t.string "action"
    t.string "resource_type"
    t.integer "resource_id"
    t.jsonb "details"
    t.string "ip_address"
    t.integer "severity"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["resource_type", "resource_id"], name: "index_audit_logs_on_resource_type_and_resource_id"
    t.index ["user_id"], name: "index_audit_logs_on_user_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.bigint "participant_a_id", null: false
    t.bigint "participant_b_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["participant_a_id", "participant_b_id"], name: "index_conversations_on_participant_a_id_and_participant_b_id", unique: true
    t.index ["participant_a_id"], name: "index_conversations_on_participant_a_id"
    t.index ["participant_b_id"], name: "index_conversations_on_participant_b_id"
  end

  create_table "jwt_denylists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_denylists_on_jti"
  end

  create_table "medical_records", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "provider_id"
    t.integer "record_type"
    t.date "record_date"
    t.string "title"
    t.text "description"
    t.string "file_url"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_medical_records_on_patient_id"
    t.index ["provider_id"], name: "index_medical_records_on_provider_id"
  end

  create_table "medications", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "dosage", null: false
    t.string "frequency", null: false
    t.string "prescriber"
    t.date "refill_date"
    t.integer "status", default: 0
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "name"], name: "index_medications_on_user_id_and_name"
    t.index ["user_id"], name: "index_medications_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.bigint "conversation_id", null: false
    t.bigint "sender_id", null: false
    t.text "body"
    t.datetime "read_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["sender_id"], name: "index_messages_on_sender_id"
  end

  create_table "notifications", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.text "message"
    t.datetime "read_at"
    t.integer "notification_type"
    t.integer "priority"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notifications_on_user_id"
  end

  create_table "patient_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.jsonb "emergency_contact"
    t.jsonb "insurance_details"
    t.jsonb "health_metrics"
    t.jsonb "health_history"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_patient_profiles_on_user_id"
  end

  create_table "prescriptions", force: :cascade do |t|
    t.bigint "patient_id", null: false
    t.bigint "provider_id", null: false
    t.string "medication_name"
    t.string "dosage"
    t.string "frequency"
    t.date "start_date"
    t.date "end_date"
    t.integer "refills_allowed", default: 0
    t.integer "refills_remaining", default: 0
    t.text "instructions"
    t.integer "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["patient_id"], name: "index_prescriptions_on_patient_id"
    t.index ["provider_id"], name: "index_prescriptions_on_provider_id"
  end

  create_table "provider_profiles", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "specialization"
    t.text "bio"
    t.string "languages", default: [], array: true
    t.string "profile_image_url"
    t.string "license_number"
    t.jsonb "education"
    t.jsonb "experience"
    t.jsonb "services"
    t.decimal "consultation_fee"
    t.jsonb "availability"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_provider_profiles_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "full_name"
    t.string "phone"
    t.date "date_of_birth"
    t.string "gender"
    t.integer "role", default: 0, null: false
    t.text "address"
    t.string "passport_number"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["phone"], name: "index_users_on_phone", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "appointments", "users", column: "patient_id"
  add_foreign_key "appointments", "users", column: "provider_id"
  add_foreign_key "audit_logs", "users"
  add_foreign_key "conversations", "users", column: "participant_a_id"
  add_foreign_key "conversations", "users", column: "participant_b_id"
  add_foreign_key "medical_records", "users", column: "patient_id"
  add_foreign_key "medical_records", "users", column: "provider_id"
  add_foreign_key "medications", "users"
  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users", column: "sender_id"
  add_foreign_key "notifications", "users"
  add_foreign_key "patient_profiles", "users"
  add_foreign_key "prescriptions", "users", column: "patient_id"
  add_foreign_key "prescriptions", "users", column: "provider_id"
  add_foreign_key "provider_profiles", "users"
end
