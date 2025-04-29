# API Implementation Plan & Crosscheck

This document provides a comprehensive, cross-checked list of all features, endpoints, and required data fields needed by the frontend, as well as a step-by-step plan for backend implementation.

---

## 1. Authentication & User Management

### Endpoints
- `POST /api/auth/login` — `{ email, password, rememberMe } → { success, data: { token, user }, message }`
- `POST /api/auth/register` — `{ name, email, password, phone, dateOfBirth, gender, ... } → { success, data: { user }, message }`
- `GET /api/auth/me` — (JWT in header) → `{ success, data: { user }, message }`
- `POST /api/auth/logout` — (JWT in header) → `{ success }`
- `POST /api/auth/provider/signin` — `{ email, password } → { success, data: { token, provider }, message }`

#### User fields required by frontend:
- id, name, email, phone, dateOfBirth, gender, address, passportNumber, roles

---

## 2. Patient Panel

### a. Appointments
- `GET /api/patient/appointments`
- `POST /api/patient/appointments`
- `PUT /api/patient/appointments/:id`
- `DELETE /api/patient/appointments/:id`
- **Fields:** id, providerId, providerName, providerSpecialty, dateTime, duration, status, type, location, notes
- **Status:**
  - Frontend page (`app/patient/appointments/page.tsx`) exists and uses the correct data structure but currently relies on **mock data**.
  - Next.js API route handler (`app/api/patient/appointments/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler and update the frontend page to fetch real data.

### b. Profile
- `GET /api/patient/profile`
- `PUT /api/patient/profile`
- **Fields:**
  - personalInfo: name, dob, gender, email, phone, address, passportNumber
  - emergencyContact: name, relationship, phone
  - insurance: provider, policyNumber, groupNumber, primary
  - healthMetrics: height, weight, bloodPressure, bloodType, allergies
  - healthHistory: type, name, date, details
- **Status:**
  - Frontend page (`app/patient/profile/page.tsx`) exists and uses a consistent data structure but currently relies on **mock data**.
  - Next.js API route handler (`app/api/patient/profile/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler and update the frontend page to fetch and update real data.

### c. Medical Records
- `GET /api/patient/records`
- `POST /api/patient/records` (Upload)
- `GET /api/patient/records/:id`
- `PUT /api/patient/records/:id`
- `DELETE /api/patient/records/:id`
- **Fields:** id, patientId, type, title, date, fileUrl, uploadedBy
- **Status:**
  - Frontend page (`app/patient/records/page.tsx`) exists but uses a **different data structure** (uses `description` for `title`, `provider`/`facility` for `uploadedBy`, `attachments` array instead of `fileUrl`, missing `patientId`) and relies on **mock data**.
  - Next.js API route handler (`app/api/patient/records/route.ts`) is **missing**.
  - **Action Needed:** Reconcile frontend data structure with API plan, create the API route handler, and update the frontend page to fetch/upload real data.

### d. Prescriptions
- `GET /api/patient/prescriptions`
- `GET /api/patient/prescriptions/:id`
- `POST /api/patient/prescriptions/:id/refill` (Request Refill)
- **Fields (List - GET /api/patient/prescriptions):** id, patientId, medicationName, dosage, frequency, prescribedBy, prescriptionDate, refillsLeft, status
- **Fields (Detail - GET /api/patient/prescriptions/:id):** (Includes list fields plus details like genericName, pharmacy, expirationDate, instructions, warnings, interactions, etc. - Needs finalization)
- **Status:**
  - Frontend page (`app/patient/prescriptions/page.tsx`) exists for the list view. It uses **mock data** with most core fields present (some name variations) but is **missing `patientId`** and includes many extra detail fields.
  - Frontend pages/components for detail view (`[id]/`) and refill (`refill/`) likely exist based on directory structure but haven't been checked.
  - Next.js API route handler (`app/api/patient/prescriptions/route.ts`) is **missing**.
  - **Action Needed:** Define fields for detail view API, create API route handler(s), update frontend pages to use real data, ensure `patientId` is handled.

### e. Messages
- `GET /api/patient/messages` (**Clarification needed:** Does this return a list of *conversations* or individual *messages*?)
- `POST /api/patient/messages`
- **Fields (Plan):** id, from, to, message, timestamp, category, attachments
- **Status:**
  - Frontend page (`app/patient/messages/page.tsx`) exists, providing a chat interface. It uses **mock data** for both conversation lists and individual messages.
  - **Data Structure Mismatch:** The mock data structures used in the frontend (for both conversation list and individual messages) **differ significantly** from the API plan fields. Key fields from the plan (`from`, `to`, `attachments`) are missing in the mock data, while the mock data contains fields not in the plan (`name`, `role`, `lastMessage`, `starred`, `status`, etc.).
  - Next.js API route handler (`app/api/patient/messages/route.ts`) is **missing**.
  - **Action Needed:** Clarify the purpose and expected response/fields of `GET /api/patient/messages` (consider a separate `GET /api/patient/conversations` endpoint?). Reconcile frontend and API data structures. Create the API route handler(s) and update the frontend page to use real data.

---

## 3. Provider Panel

### a. Dashboard
- `GET /api/provider/dashboard`
- **Fields:**
  - `summary`: Object/Array containing key stats (e.g., { patientsToday, totalAppointments, pendingReports, surgerySchedule })
  - `upcomingAppointments`: Array of patient objects (e.g., { id, name, age, gender, appointmentTime, appointmentType, status })
  - `recentPatientActivity`: Array of patient objects (e.g., { id, name, age, gender, lastVisit, condition })
- **Status:**
  - Frontend page (`app/provider/dashboard/page.tsx`) exists and uses **mock data** whose structure is **consistent** with the planned sections (summary, upcoming, recent). Provides a good reference for the Rails API response structure.
  - Next.js API route handler (`app/api/provider/dashboard/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler and update the frontend page to fetch real data. Define precise fields for the Rails API based on frontend needs.

### b. Appointments
- `GET /api/provider/appointments`
- `POST /api/provider/appointments`
- `PUT /api/provider/appointments/:id`
- `DELETE /api/provider/appointments/:id`
- **Fields:** id, patientId, patientName, dateTime, duration, status, type, notes
- **Status:**
  - Frontend page (`app/provider/appointments/page.tsx`) exists and uses **mock data**.
  - **Data Structure Mismatch:** Frontend uses separate `date`/`startTime`/`endTime` instead of `dateTime`. It also includes extra fields (`patientAge`, `gender`, `avatar`, `reason`, `isNew`, `photo`, `mode`) not in the plan. Status values differ from the patient view.
  - Next.js API route handler (`app/api/provider/appointments/route.ts`) is **missing**.
  - **Action Needed:** Reconcile date/time representation and decide which fields are necessary for the API. Create the API route handler(s) and update the frontend page to use real data.

### c. Profile
- `GET /api/provider/profile`
- `PUT /api/provider/profile`
- **Fields (Refined based on Frontend):**
  - `id`: string
  - `firstName`: string
  - `lastName`: string
  - `email`: string
  - `phone`: string
  - `specialization`: string  // Renamed from 'specialties'
  - `bio`: string
  - `languages`: string[]      // Added from Frontend
  - `profileImage`: string (URL) // Added from Frontend
  - `licenseNumber`: string    // Added from Frontend (part of qualifications)
  - `education`: Array<{ id, degree, institution, year }> // Added from Frontend (part of qualifications)
  - `experience`: Array<{ id, position, hospital, startYear, endYear }>
  - `services`: Array<{ id, name, price? }> // Added from Frontend
  - `consultationFee`: number  // Added from Frontend
  - `availability`: Object map (day -> { start, end } | null) // Renamed from availableSlots
  - **Missing from Frontend (Consider adding/removing):** `address`, `hospitalAffiliations`
- **Status:**
  - Frontend page (`app/provider/profile/page.tsx`) exists, uses **mock data**, and includes **editing functionality**.
  - **Data Structure Mismatch:** Frontend has a more detailed structure than the original plan (name, education, license, languages, services, fee). Fields `address` and `hospitalAffiliations` from the plan are currently **missing** in the frontend mock data.
  - Next.js API route handler (`app/api/provider/profile/route.ts`) is **missing**.
  - **Action Needed:** Confirm final fields (especially `address`, `hospitalAffiliations`). Create the API route handler(s) supporting both GET and PUT (for profile updates). Update the frontend page to use real data.

### d. Messages
- `GET /api/provider/messages` (**Clarification needed:** Does this return *conversations* or *messages*? Consider separate endpoints/params.)
- `POST /api/provider/messages`
- **Fields (Plan):** id, from, to, message, timestamp, category, attachments
- **Status:**
  - Frontend page (`app/provider/messages/page.tsx`) exists, providing a chat interface. Uses **mock data** for conversation list and individual messages.
  - **Data Structure Mismatch:** Frontend uses different structures (`patient` object in conversations, `sender`/`text` in messages) and includes extra fields (`avatar`, `online`, `unreadCount`, `senderName`, `isRead`) while missing plan fields (`from`, `to`, `category`, `attachments`).
  - Next.js API route handler (`app/api/provider/messages/route.ts`) is **missing**.
  - **Action Needed:** Clarify API design for fetching conversations vs. messages (e.g., `GET /api/provider/conversations`, `GET /api/provider/conversations/:id/messages`?). Reconcile frontend and API data structures. Create API route handler(s) and update frontend to use real data.

---

## 4. Admin Panel

### a. User Management
- `GET /api/admin/users`
- `PUT /api/admin/users/:id` (for role/status updates)
- `DELETE /api/admin/users/:id`
- **Fields (Refined based on Frontend):** id, name, email, role, status, joinDate (was `createdAt`), lastActive (was `lastLogin`)
- **Status:**
  - Frontend page (`app/admin/users/page.tsx`) exists, uses **mock data**, and includes UI elements for editing/deleting users.
  - **Data Structure Match:** Frontend fields align well with the plan, with minor name differences (`joinDate`, `lastActive`).
  - Next.js API route handler (`app/api/admin/users/route.ts` and `app/api/admin/users/[id]/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler(s) supporting GET, PUT, and DELETE. Update the frontend page to use real data and implement the management actions (edit role/status, delete). Consider if stats data should be part of the main GET or a separate endpoint.

### b. Provider Management
- `GET /api/admin/providers` (Returns list of all provider types)
- `PUT /api/admin/providers/:id` (For status updates, verification, etc.)
- `DELETE /api/admin/providers/:id`
- **Fields (Based on Frontend):** id, name, type, specialty?, location, rating, contactEmail, contactPhone, status, verified, createdAt, photo?, services?
- **Status:**
  - Main frontend page (`app/admin/providers/page.tsx`) exists, displays a list of all provider types using **mock data**. Includes UI for filtering and management actions (status change, verify, delete).
  - Frontend structure includes separate pages for Doctors, Labs, Pharmacies (`app/admin/providers/doctors/`, etc.), suggesting potential need for type-specific API endpoints (e.g., for adding/editing detailed type-specific fields) not currently in the plan.
  - Next.js API route handler (`app/api/admin/providers/route.ts` and `app/api/admin/providers/[id]/route.ts`) is **missing**.
  - **Action Needed:** Define precise fields for the API based on frontend needs. Create the API route handler(s) supporting GET, PUT, DELETE. Update the frontend page to use real data. Evaluate if type-specific API endpoints are needed for detailed editing/creation.

### c. Health Records
- `GET /api/admin/health-records`
- `POST /api/admin/health-records`
- `PUT /api/admin/health-records/:id`
- `DELETE /api/admin/health-records/:id`
- **Fields (Based on Frontend):** id, patientName, patientId, recordType, createdAt, updatedAt, status, provider
- **Status:**
  - Frontend page (`app/admin/health-records/page.tsx`) exists, displays a list of records using **mock data**. Includes UI for filtering, creating, viewing, editing, and deleting records.
  - Frontend indicates need for a `POST` endpoint (missing from original plan).
  - Next.js API route handler (`app/api/admin/health-records/route.ts` and `app/api/admin/health-records/[id]/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler(s) supporting GET, POST, PUT, DELETE. Update the frontend page to use real data and implement the management actions.

### d. Notifications, Metrics, Audit Logs
- `GET /api/admin/notifications`
- `PUT /api/admin/notifications/:id` (For marking as read)
- `DELETE /api/admin/notifications/:id`
- **Fields (Notifications - Based on Frontend):** id, title, message, type, priority, timestamp, isRead
- **Status (Notifications):**
  - Frontend page (`app/admin/notifications/page.tsx`) exists, displays a list of notifications using **mock data**. Includes UI for filtering, marking as read, and deleting.
  - Frontend indicates need for `PUT` and `DELETE` endpoints (missing from original plan).
  - Next.js API route handler (`app/api/admin/notifications/route.ts` and `app/api/admin/notifications/[id]/route.ts`) is **missing**.
  - **Action Needed:** Create the API route handler(s) supporting GET, PUT, DELETE. Update the frontend page to use real data.

- `GET /api/admin/metrics` (Should support time range parameter, e.g., `?range=weekly`)
  - **Fields (Metrics - Based on Frontend):** See `Metrics` interface in `app/admin/metrics/page.tsx` (includes activeUsers, appointments, registrations, providerUtilization, responseTime, systemPerformance).
  - **Status (Metrics):**
    - Frontend page (`app/admin/metrics/page.tsx`) exists, displays various platform metrics using **mock data**. Includes UI for time range filtering.
    - API route should support a time range query parameter.
    - Next.js API route handler (`app/api/admin/metrics/route.ts`) is **missing**.
    - **Action Needed:** Create the API route handler supporting GET with a time range parameter. Update the frontend page to use real data.

- `GET /api/admin/audit-logs` (Should support filtering parameters: date range, userId, action, resource, role, severity, status)
  - **Fields (Audit Logs - Based on Frontend):** See `AuditLog` interface in `app/admin/audit-logs/page.tsx` (includes userId, userName, userRole, action, resource, resourceId, details, ipAddress, timestamp, severity, status).
  - **Status (Audit Logs):**
    - Frontend page (`app/admin/audit-logs/page.tsx`) exists, displays audit logs using **mock data**. Includes extensive UI for filtering.
    - API route should support various query parameters for filtering.
    - Next.js API route handler (`app/api/admin/audit-logs/route.ts`) is **missing**.
    - **Action Needed:** Create the API route handler supporting GET with filtering parameters. Update the frontend page to use real data.

---

## 5. Search & Directory

- `GET /api/doctors/search?specialty=&location=&services=&...`
- `GET /api/providers/search?...`
- `GET /api/pharmacy/search?...`
- **Fields:** id, name, specialty, location, rating, services

---

## 6. Other Features

### Symptom Checker
- `POST /api/symptom-checker` — `{ symptoms: [string], ... } → { possibleConditions: [string], recommendations: [string] }`

### Notifications
- `GET /api/notifications` — id, type, message, read, createdAt

---

## 7. General Field Types

- **User:** id, name, email, phone, dateOfBirth, gender, address, passportNumber, roles
- **Appointment:** id, providerId/patientId, dateTime, duration, status, type, location, notes
- **Record:** id, type, provider, facility, date, description, details, attachments, category
- **Prescription:** id, name, dosage, frequency, pharmacy, prescribedBy, dateIssued, refills, etc.
- **Message:** id, from, to, message, timestamp, category, attachments

---

## Crosscheck: All Features & Data Required by Frontend

- All patient, provider, admin, and search flows mapped to endpoints above
- All fields referenced in frontend forms, lists, and details are present in endpoint specs
- Attachments, refill history, health metrics, and insurance are included
- Messaging supports attachments, categories, starred, and timestamp
- Search endpoints cover all directory and filterable data
- Symptom checker and notification flows are included
- Admin panel supports user, provider, appointment, record, notification, and metrics management

---

## Implementation Plan

1. **Scaffold Endpoints:**
   - Create controllers for auth, patient, provider, admin, search, notifications, and symptom checker
   - Use Rails resources for RESTful structure

2. **Define Models & Validations:**
   - User, Appointment, MedicalRecord, Prescription, Message, Notification, etc.
   - Add all required fields as per above
   - Use strong validations (presence, type, format)

3. **Authentication:**
   - Use Devise + JWT for all auth flows
   - Secure all protected endpoints with JWT middleware

4. **Implement Business Logic:**
   - Appointments: booking, update, cancel, status transitions
   - Messaging: send, receive, star, categorize
   - Records: create, update, attach files
   - Search: filtering, sorting, pagination
   - Admin: CRUD for users, providers, records, etc.

5. **Testing:**
   - Write request specs for every endpoint
   - Test with valid and invalid data, check all edge cases

6. **Documentation:**
   - Generate OpenAPI/Swagger docs
   - Document all endpoints, fields, and validation rules

7. **Iterate:**
   - Review with frontend, update as needed
   - Add missing fields/flows if discovered during integration

---

**This plan is fully crosschecked against the frontend. All data and features required by the frontend are covered. If new features are added, update this file and backend accordingly.**
