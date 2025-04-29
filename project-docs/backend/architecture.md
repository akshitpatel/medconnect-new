# MedConnect Backend Architecture

This document outlines the comprehensive backend architecture for the MedConnect healthcare platform, designed to seamlessly integrate with our Next.js frontend while meeting healthcare industry requirements for security, scalability, and compliance.

## Technology Stack

### Core Stack
- **Backend Framework**: Node.js with Express.js
  - *Rationale*: Provides seamless integration with our Next.js frontend through shared JavaScript/TypeScript codebase and ecosystem
  - *Benefits*: Asynchronous architecture ideal for handling concurrent connections, extensive npm package ecosystem

- **Database**: PostgreSQL with encryption extensions
  - *Rationale*: Robust relational database with strong ACID compliance and healthcare data modeling support
  - *Benefits*: Column-level encryption, powerful query capabilities, excellent TypeScript support with Prisma ORM

- **ORM**: Prisma
  - *Rationale*: Type-safe database client with excellent TypeScript integration
  - *Benefits*: Schema migrations, query building, and relation handling

### Additional Components
- **Authentication**: NextAuth.js with JWT
  - *Rationale*: Seamless integration with Next.js, supports multiple authentication providers
  - *Benefits*: Built-in security features, session management

- **Caching**: Redis
  - *Rationale*: In-memory data structure store for fast data retrieval
  - *Benefits*: Reduces database load, improves response times

- **Search Engine**: Elasticsearch
  - *Rationale*: Powerful search capabilities for doctor, medication, and service discovery
  - *Benefits*: Full-text search, fuzzy matching, geospatial queries

- **File Storage**: Amazon S3 (with server-side encryption)
  - *Rationale*: Secure, scalable object storage for medical documents and images
  - *Benefits*: HIPAA-eligible when properly configured, versioning support

- **API Documentation**: Swagger/OpenAPI
  - *Rationale*: Industry standard for API documentation
  - *Benefits*: Interactive documentation, client code generation

## Database Schema

### Core Entities

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL, -- patient, doctor, admin, etc.
  first_name VARCHAR(255) ENCRYPTED,
  last_name VARCHAR(255) ENCRYPTED,
  phone VARCHAR(20) ENCRYPTED,
  dob DATE ENCRYPTED,
  gender VARCHAR(20),
  address_line1 VARCHAR(255) ENCRYPTED,
  address_line2 VARCHAR(255) ENCRYPTED,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  profile_image_url VARCHAR(255),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### Doctors
```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  license_number VARCHAR(100) ENCRYPTED,
  specialization VARCHAR(100)[],
  education TEXT[],
  experience INTEGER,
  bio TEXT,
  consultation_fee_clinic DECIMAL,
  consultation_fee_online DECIMAL,
  is_guru_program BOOLEAN DEFAULT FALSE,
  average_rating DECIMAL,
  total_reviews INTEGER DEFAULT 0,
  languages VARCHAR(50)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### DoctorAvailability
```sql
CREATE TABLE doctor_availability (
  id UUID PRIMARY KEY,
  doctor_id UUID REFERENCES doctors(id),
  day_of_week INTEGER, -- 0-6 (Sunday-Saturday)
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT TRUE,
  clinic_id UUID REFERENCES locations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Appointments
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  appointment_date DATE,
  start_time TIME,
  end_time TIME,
  status VARCHAR(20), -- scheduled, completed, cancelled, no-show
  type VARCHAR(20), -- clinic, online
  booking_fee DECIMAL,
  payment_status VARCHAR(20), -- pending, completed, refunded
  payment_id UUID REFERENCES payments(id),
  location_id UUID REFERENCES locations(id),
  notes TEXT ENCRYPTED,
  symptoms TEXT[] ENCRYPTED,
  diagnosis TEXT ENCRYPTED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### LabTests
```sql
CREATE TABLE lab_tests (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price DECIMAL,
  preparation_instructions TEXT,
  duration INTEGER, -- in minutes
  report_delivery_time INTEGER, -- in hours
  available_locations UUID[] REFERENCES locations(id),
  category VARCHAR(100)[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### LabOrders
```sql
CREATE TABLE lab_orders (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  test_id UUID REFERENCES lab_tests(id),
  order_date TIMESTAMP,
  scheduled_date TIMESTAMP,
  status VARCHAR(20), -- ordered, sample-collected, processing, completed, cancelled
  payment_status VARCHAR(20), -- pending, completed, refunded
  payment_id UUID REFERENCES payments(id),
  location_id UUID REFERENCES locations(id),
  is_home_collection BOOLEAN DEFAULT FALSE,
  home_address TEXT ENCRYPTED,
  result_document_url VARCHAR(255),
  technician_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Medications
```sql
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  generic_name VARCHAR(255),
  manufacturer VARCHAR(255),
  description TEXT,
  dosage_form VARCHAR(50), -- tablet, capsule, liquid, etc.
  strength VARCHAR(50),
  price DECIMAL,
  requires_prescription BOOLEAN DEFAULT FALSE,
  available_locations UUID[] REFERENCES locations(id),
  in_stock BOOLEAN DEFAULT TRUE,
  category VARCHAR(100)[],
  side_effects TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Prescriptions
```sql
CREATE TABLE prescriptions (
  id UUID PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  issue_date TIMESTAMP,
  valid_until TIMESTAMP,
  status VARCHAR(20), -- active, expired, filled, cancelled
  notes TEXT ENCRYPTED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### PrescriptionItems
```sql
CREATE TABLE prescription_items (
  id UUID PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id),
  medication_id UUID REFERENCES medications(id),
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  duration INTEGER, -- in days
  quantity INTEGER,
  instructions TEXT ENCRYPTED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### HealthPassports
```sql
CREATE TABLE health_passports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) UNIQUE,
  blood_type VARCHAR(10) ENCRYPTED,
  height DECIMAL ENCRYPTED,
  weight DECIMAL ENCRYPTED,
  allergies TEXT[] ENCRYPTED,
  chronic_conditions TEXT[] ENCRYPTED,
  current_medications TEXT[] ENCRYPTED,
  past_surgeries TEXT[] ENCRYPTED,
  family_medical_history TEXT ENCRYPTED,
  emergency_contact_name VARCHAR(255) ENCRYPTED,
  emergency_contact_phone VARCHAR(20) ENCRYPTED,
  emergency_contact_relationship VARCHAR(50) ENCRYPTED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Locations
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50), -- hospital, clinic, lab, pharmacy
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  latitude DECIMAL,
  longitude DECIMAL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  operating_hours JSONB,
  amenities VARCHAR(100)[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  doctor_id UUID REFERENCES doctors(id),
  rating INTEGER, -- 1-5
  comment TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  appointment_id UUID REFERENCES appointments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Payments
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount DECIMAL,
  currency VARCHAR(10),
  payment_method VARCHAR(50),
  status VARCHAR(20), -- pending, completed, failed, refunded
  transaction_id VARCHAR(255),
  payment_date TIMESTAMP,
  service_type VARCHAR(50), -- appointment, lab_test, medication, etc.
  service_id UUID,
  refund_amount DECIMAL,
  refund_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### AuditLogs
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100),
  entity_type VARCHAR(50),
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Design

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get tokens
- `POST /api/auth/refresh` - Refresh the access token
- `POST /api/auth/logout` - Logout and invalidate tokens
- `GET /api/auth/me` - Get current user information

### User Endpoints
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user information
- `DELETE /api/users/:id` - Deactivate user account
- `GET /api/users/:id/health-passport` - Get user's health passport

### Doctor Endpoints
- `GET /api/doctors` - Search/filter doctors
- `GET /api/doctors/:id` - Get doctor details
- `GET /api/doctors/:id/availability` - Get doctor's availability
- `GET /api/doctors/:id/reviews` - Get doctor's reviews
- `POST /api/doctors/:id/reviews` - Add a review for a doctor

### Appointment Endpoints
- `GET /api/appointments` - Get user's appointments
- `POST /api/appointments` - Book a new appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment (reschedule)
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/:id/prescription` - Get appointment prescription

### Lab Test Endpoints
- `GET /api/lab-tests` - Get available lab tests
- `GET /api/lab-tests/:id` - Get lab test details
- `GET /api/lab-tests/categories` - Get lab test categories
- `POST /api/lab-orders` - Book a lab test
- `GET /api/lab-orders` - Get user's lab orders
- `GET /api/lab-orders/:id` - Get lab order details
- `GET /api/lab-orders/:id/results` - Get lab test results

### Medication Endpoints
- `GET /api/medications` - Search medications
- `GET /api/medications/:id` - Get medication details
- `GET /api/medications/categories` - Get medication categories
- `POST /api/prescriptions` - Create a new prescription
- `GET /api/prescriptions` - Get user's prescriptions
- `GET /api/prescriptions/:id` - Get prescription details

### Location Endpoints
- `GET /api/locations` - Search locations
- `GET /api/locations/:id` - Get location details
- `GET /api/locations/nearby` - Find nearby healthcare facilities

### Payment Endpoints
- `POST /api/payments` - Process a payment
- `GET /api/payments` - Get user's payment history
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/:id/refund` - Request a refund

## Authentication and Security

### Authentication System
- JWT-based authentication with refresh tokens
- OAuth 2.0 integration for social logins (Google, Apple)
- Role-based access control (RBAC)
- Multi-factor authentication for sensitive operations

### Data Encryption
- TLS/SSL for all API communications
- AES-256 encryption for sensitive data at rest
- Column-level encryption for PHI in database
- Secure key management with AWS KMS or similar service

### Access Controls
- Role-based permissions (patient, doctor, admin, etc.)
- Attribute-based access control for fine-grained permissions
- IP-based access restrictions for admin panel
- Session timeout and automatic logout

### Audit Logging
- Comprehensive audit trail of all data access and modifications
- HIPAA-compliant logging of PHI access
- Immutable logs stored securely
- Regular log review procedures

## Third-Party Integrations

### Payment Processing
- **Primary**: Stripe for healthcare
  - Features: Strong security, HIPAA compliance, recurring payments
- **Alternative**: Braintree
  - Features: Lower fees for startups, similar feature set

### Appointment Scheduling
- **Primary**: Cal.com (formerly Calendly)
  - Features: Open source, customizable, developer-friendly
- **Alternative**: Acuity Scheduling
  - Features: More healthcare-specific features

### Telehealth Video
- **Primary**: Twilio Programmable Video
  - Features: HIPAA-compliant, customizable UI, robust SDK
- **Alternative**: Daily.co
  - Features: Simpler implementation, lower cost

### EHR Integration
- **Primary**: Redox
  - Features: Standardized API for connecting to multiple EHR systems
- **Alternative**: Direct FHIR API integration with major EHR systems

### Medication Database
- **Primary**: RxNorm (National Library of Medicine)
  - Features: Free, comprehensive, standard codes
- **Alternative**: First Databank (FDB)
  - Features: More detailed drug information, interaction checking

### Notification Services
- **Primary**: Twilio for SMS + SendGrid for Email
  - Features: Reliable delivery, templating, scheduling
- **Alternative**: Firebase Cloud Messaging
  - Features: Free tier, push notifications

### Maps and Geolocation
- **Primary**: Google Maps Platform
  - Features: Accurate geocoding, distance matrix, place details
- **Alternative**: Mapbox
  - Features: More customization options, potentially lower cost

## Deployment Architecture

### Development Environment
- Local Docker development with docker-compose
- Database migrations for schema changes
- Seed data for testing
- Pre-commit hooks for code quality

### Testing Strategy
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress
- Security scanning with OWASP ZAP

### CI/CD Pipeline
- GitHub Actions for automated testing and deployment
- Separate pipelines for development, staging, and production
- Automated security scanning and vulnerability checks
- Semantic versioning for releases

### Cloud Infrastructure (AWS)
- **Web Tier**: Amazon ECS with Fargate
  - Auto-scaling based on load
  - Load balancing with AWS ALB
- **Database**: Amazon RDS for PostgreSQL with encryption
  - Multi-AZ deployment for high availability
  - Automated backups and point-in-time recovery
- **Caching**: Amazon ElastiCache for Redis
- **Search**: Amazon Elasticsearch Service
- **Storage**: Amazon S3 with server-side encryption
- **CDN**: Amazon CloudFront for static assets
- **Monitoring**: Amazon CloudWatch + AWS X-Ray

### Security Measures
- AWS WAF for web application firewall
- AWS Shield for DDoS protection
- AWS Config for compliance monitoring
- AWS GuardDuty for threat detection
- VPC with private subnets for database and application tiers

## Monitoring and Observability

### Monitoring Tools
- AWS CloudWatch for infrastructure monitoring
- New Relic for application performance monitoring
- Sentry for error tracking
- Prometheus + Grafana for custom metrics

### Key Metrics
- API response times
- Error rates
- Database query performance
- Cache hit/miss ratio
- Authentication success/failure rates
- Third-party API response times

### Alerting Strategy
- Critical alerts via PagerDuty
- Non-critical alerts via Slack and email
- Automated incident response playbooks
- Escalation paths for different alert types

### Logging
- Centralized logging with AWS CloudWatch Logs
- Structured logging with proper redaction of PHI
- Log retention policies aligned with HIPAA requirements
- Log analysis with AWS CloudWatch Logs Insights

## Scalability Strategy

### Horizontal Scaling
- Stateless application design for easy scaling
- Auto-scaling groups for handling traffic spikes
- Database read replicas for scaling read operations
- Connection pooling for database efficiency

### Performance Optimization
- Redis caching for frequently accessed data
- CDN for static assets and cached API responses
- Optimized database queries and indexing
- Rate limiting to prevent abuse

### Data Management
- Data partitioning strategy for large tables
- Archive strategy for historical data
- Backup and disaster recovery procedures
- Data retention policies aligned with regulations

## Development and Implementation Plan

### Phase 1: Core Infrastructure
- Set up AWS infrastructure with Terraform
- Implement authentication and user management
- Create basic API structure and documentation
- Establish CI/CD pipeline and environments

### Phase 2: Doctor and Appointment Features
- Implement doctor profiles and search
- Build appointment scheduling system
- Integrate payment processing
- Develop review and rating system

### Phase 3: Lab Tests and Medications
- Build lab test catalog and ordering system
- Implement medication database and search
- Develop prescription management
- Integrate with pharmacy services

### Phase 4: Health Passport and Advanced Features
- Create health passport profile
- Implement telehealth capabilities
- Build analytics dashboard
- Enhance security and compliance features

## Compliance Considerations

### HIPAA Compliance
- BAA with all service providers handling PHI
- Regular security risk assessments
- Employee training on HIPAA requirements
- Incident response plan for data breaches

### Data Privacy
- Comprehensive privacy policy
- User consent management
- Data access and deletion mechanisms
- Compliance with GDPR, CCPA as applicable

### Security Certifications
- SOC 2 Type II compliance
- HITRUST certification (long-term goal)
- Regular penetration testing
- Vulnerability management program

## Conclusion

This backend architecture provides a robust foundation for the MedConnect healthcare platform while ensuring security, scalability, and compliance with healthcare regulations. The modular design allows for phased implementation and future extensions as the platform grows.

By leveraging Node.js and Express.js with a PostgreSQL database, we ensure strong integration with our Next.js frontend while providing the security and reliability necessary for healthcare applications. The comprehensive API design supports all required features while third-party integrations extend functionality where needed.

Regular reviews and updates to this architecture document will be necessary as requirements evolve and new technologies emerge. 