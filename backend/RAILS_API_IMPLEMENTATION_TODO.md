# Ruby on Rails API Implementation To-Do List

This document outlines the tasks needed to implement the backend API using Ruby on Rails, based on the frontend implementation and the existing API plan.

## [P0] Setup and Configuration

1. ✅ Basic Rails app setup (already exists)
2. [ ] Configure JWT authentication properly
   - ⏳ Update User model for roles and additional fields (in progress)
   - [ ] Create JWT token service (partially handled by devise-jwt)
   - ⏳ Set up proper authentication middleware (in progress via BaseController)
3. [ ] Create database migrations for all required models
4. ✅ Set up API versioning and namespacing (`/api/v1/`)
5. ✅ Configure CORS for frontend access (Likely done, verify if needed)
6. [ ] Set up error handling middleware
7. [ ] Create serializers for consistent API responses (UserSerializer started)

## [P1] Authentication APIs

### a. User Registration
- ✅ Implement `POST /api/auth/register`
  - ✅ Accept fields: fullName, email, password, phone, dateOfBirth (gender pending)
  - ✅ Validate required fields and formats
  - ✅ Check for existing users
  - ✅ Create user with 'patient' role by default
  - ✅ Return appropriate success/error response

### b. User Login
- ✅ Implement `POST /api/auth/login`
  - ✅ Accept email and password
  - ✅ Validate credentials
  - ✅ Return user data and JWT token
  - [ ] Support remember-me functionality with longer token expiry

### c. User Profile
- ✅ Implement `GET /api/auth/me`
  - ✅ Return current authenticated user details
  - [ ] Include role-specific information

### d. Logout
- ⏳ Implement `POST /api/auth/logout` (Route uses DELETE, action exists)
  - ⏳ Invalidate current token (token blacklisting - pending)

### e. Password Management
- [ ] Implement `POST /api/auth/forgot-password`
  - Generate reset token and send email
- [ ] Implement `POST /api/auth/reset-password`
  - Validate token and update password

## [P3] Patient Panel APIs

### a. Appointments
- [ ] Implement `GET /api/patient/appointments`
  - Return appointments with filtering capabilities
  - Include doctor information, date, time, status, type, etc.
  - Support pagination and sorting
- [ ] Implement `POST /api/patient/appointments`
  - Book new appointments
  - Validate availability
  - Return confirmation details
- [ ] Implement `PUT /api/patient/appointments/:id`
  - Update appointment details or status
- [ ] Implement `DELETE /api/patient/appointments/:id`
  - Cancel appointments
  - Validate cancellation policies

### b. Profile
- [ ] Implement `GET /api/patient/profile`
  - Return comprehensive patient profile data:
    - Personal information
    - Emergency contacts
    - Insurance details
    - Health metrics
- [ ] Implement `PUT /api/patient/profile`
  - Update profile information
  - Support updating sub-sections (contacts, insurance, etc.)

### c. Medical Records
- [ ] Implement `GET /api/patient/records`
  - Return medical records with filtering capabilities
  - Support pagination and sorting
  - Include record types, dates, providers, etc.
- [ ] Implement `GET /api/patient/records/:id`
  - Detailed view of a single medical record

### d. Prescriptions
- [ ] Implement `GET /api/patient/prescriptions`
  - Return prescriptions with filtering capabilities
  - Include medication details, dosage, frequency, etc.
  - Support pagination and sorting
- [ ] Implement `GET /api/patient/prescriptions/:id`
  - Detailed view of a single prescription

### e. Messages
- [ ] Implement `GET /api/patient/messages`
  - Return conversations list or messages depending on query params
  - Consider implementing separate endpoint for conversations
  - Support pagination and filtering
- [ ] Implement `POST /api/patient/messages`
  - Create new messages
  - Support attachments
  - Handle notifications

## [P4] Provider Panel APIs

### a. Dashboard
- [ ] Implement `GET /api/provider/dashboard`
  - Return dashboard statistics and summaries:
    - Patient counts
    - Appointment statistics
    - Recent activity
    - Pending tasks

### b. Appointments
- [ ] Implement `GET /api/provider/appointments`
  - Return provider's appointments with filtering
  - Include comprehensive patient data
  - Support date-based filtering and status filtering
- [ ] Implement `POST /api/provider/appointments`
  - Create appointments for patients
- [ ] Implement `PUT /api/provider/appointments/:id`
  - Update appointment details, status, notes
- [ ] Implement `DELETE /api/provider/appointments/:id`
  - Cancel appointments
  - Support notification options

### c. Profile
- [ ] Implement `GET /api/provider/profile`
  - Return provider profile with detailed information:
    - Personal and professional details
    - Education and credentials
    - Services offered
    - Availability schedule
- [ ] Implement `PUT /api/provider/profile`
  - Update provider profile information
  - Support updating specialized sections (education, services, etc.)

### d. Messages
- [ ] Implement `GET /api/provider/messages`
  - Return provider's conversations or messages
  - Consider separate conversations endpoint
  - Support filtering by patient, date, etc.
- [ ] Implement `POST /api/provider/messages`
  - Send messages to patients
  - Support attachments
  - Handle notifications

## [P6] Admin Panel APIs

### a. User Management
- [ ] Implement `GET /api/admin/users`
  - Return users with filtering and pagination
  - Include role, status, and activity information
- [ ] Implement `PUT /api/admin/users/:id`
  - Update user roles, status, and permissions
- [ ] Implement `DELETE /api/admin/users/:id`
  - Deactivate or delete users
  - Handle associated data appropriately

### b. Provider Management
- [ ] Implement `GET /api/admin/providers`
  - Return providers with filtering and pagination
  - Include verification status, specialties, etc.
- [ ] Implement `PUT /api/admin/providers/:id`
  - Update provider status, verification, details
- [ ] Implement `DELETE /api/admin/providers/:id`
  - Deactivate or delete provider accounts

### c. Health Records
- [ ] Implement `GET /api/admin/health-records`
  - Return health records with filtering
  - Include patient and provider information
- [ ] Implement `POST /api/admin/health-records`
  - Create new health records
- [ ] Implement `PUT /api/admin/health-records/:id`
  - Update record details, status
- [ ] Implement `DELETE /api/admin/health-records/:id`
  - Delete records when appropriate

### d. Notifications, Metrics, Audit Logs
- [ ] Implement `GET /api/admin/notifications`
  - Return system notifications with filtering
- [ ] Implement `PUT /api/admin/notifications/:id`
  - Mark notifications as read
- [ ] Implement `DELETE /api/admin/notifications/:id`
  - Delete notifications
- [ ] Implement `GET /api/admin/metrics`
  - Return system metrics with time-range filtering
  - Include user, appointment, and system metrics
- [ ] Implement `GET /api/admin/audit-logs`
  - Return audit logs with comprehensive filtering
  - Include user, action, resource, and time information

## [P5] Search & Directory APIs

- [ ] Implement `GET /api/doctors/search`
  - Support filtering by specialty, location, services, etc.
  - Include necessary provider details and pagination.
- [ ] Implement `GET /api/providers/search` (General provider search if needed)
  - Define scope and filters.
- [ ] Implement `GET /api/pharmacy/search`
  - Support filtering by location, services, etc.
  - Include necessary pharmacy details and pagination.

## [P7] Other Feature APIs

### a. Symptom Checker
- [ ] Implement `POST /api/symptom-checker`
  - Accept symptoms and other relevant data.
  - Return possible conditions and recommendations.
  - Integrate with external service or internal logic if needed.

## [P2] Data Models

Implement the following Rails models:

1. ⏳ User (In progress)
   - ✅ Authentication fields (already started with Devise)
   - ✅ Profile fields: name, email, phone, date_of_birth (gender pending)
   - ✅ Role enum: patient, doctor, admin (default handled)
   - [ ] Status tracking

2. ⏳ PatientProfile (In progress - basic model/migration created)
   - [ ] Extended patient information (emergency_contact, insurance_details, health_metrics, health_history fields created as jsonb)
   - [ ] Emergency contacts
   - [ ] Insurance details
   - [ ] Health metrics

3. ⏳ ProviderProfile (In progress - basic model/migration created)
   - [ ] Professional details (specialization, bio, license_number, etc. created)
   - [ ] Specialization
   - [ ] Education and credentials (education, experience created as jsonb)
   - [ ] Availability
   - [ ] Services offered

4. ⏳ Appointment (In progress - basic model/migration created)
   - [ ] Patient and provider references (user_id FKs created)
   - [ ] Date and time fields (datetime/integer created)
   - [ ] Type and status enums (status enum defined)

5. ⏳ MedicalRecord (In progress - basic model/migration created)
   - [ ] Patient reference (user_id FK created)
   - [ ] Provider reference (user_id FK created, optional)
   - [ ] Record type enum (enum defined)
   - [ ] Date and details fields
   - [ ] Status tracking
   - [ ] Notes and reason fields

6. ⏳ Prescription (In progress - basic model/migration created)
   - [ ] Patient and provider references (user_id FKs created)
   - [ ] Medication details (name, dosage, frequency, instructions created)
   - [ ] Dosage and frequency

7. ⏳ Message / Conversation (In progress - basic models/migrations created)
   - [ ] Message content and metadata (body, read_at created)
   - [ ] Sender and recipient references (Associations created)
   - [ ] Read status tracking

8. ⏳ Notification (In progress - basic model/migration created)
   - [ ] Title and content (fields created)
   - [ ] Type and priority enums (enums defined)
   - [ ] User reference (nullable FK created)
   - [ ] Read status tracking (read_at field created)

9. ⏳ AuditLog (In progress - basic model/migration created)
   - [ ] User reference (nullable FK created)
   - [ ] Action and resource details (fields created)
   - [ ] Timestamp and IP address (fields created)

## [P8] Testing Strategy

1. [ ] Set up RSpec for testing
2. [ ] Create request specs for all API endpoints
3. [ ] Create model specs for all models
4. [ ] Set up factories with FactoryBot
5. [ ] Implement integration tests for critical user flows

## [P9] Deployment and DevOps

1. [ ] Configure environment variables
2. [ ] Set up database migrations for production
3. [ ] Configure production-ready web server
4. [ ] Set up monitoring and logging
5. [ ] Create CI/CD pipeline

## Prioritization (Reference - Integrated Above)

Implementation should follow this priority order:

1.  **[P0]** Setup and Configuration
2.  **[P1]** Authentication system
3.  **[P2]** Core data models and migrations
4.  **[P3]** Patient APIs (appointments, profile)
5.  **[P4]** Provider APIs (dashboard, appointments)
6.  **[P5]** Search & Directory APIs
7.  **[P6]** Admin APIs
8.  **[P7]** Other Feature APIs (Symptom Checker)
9.  **[P8]** Testing Strategy
10. **[P9]** Deployment and DevOps
