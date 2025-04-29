# MedConnect Health Platform - Development Guide

## Table of Contents

1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Frontend Components](#frontend-components)
6. [Backend Services](#backend-services)
7. [Data Flow](#data-flow)
8. [Authentication](#authentication)
9. [API Integration](#api-integration)
10. [State Management](#state-management)
11. [UI/UX Guidelines](#uiux-guidelines)
12. [Testing Strategy](#testing-strategy)
13. [Deployment Process](#deployment-process)
14. [Performance Optimization](#performance-optimization)
15. [Security Considerations](#security-considerations)
16. [Future Development Roadmap](#future-development-roadmap)
17. [Known Issues and Workarounds](#known-issues-and-workarounds)
18. [Contributing Guidelines](#contributing-guidelines)

## Introduction

The MedConnect Health Platform is a comprehensive healthcare management system that connects patients with healthcare providers, manages health records, and provides tools for health monitoring and management. The platform is built with a focus on user experience, data security, and scalability.

This document serves as a guide for developers who will be working on this project, providing detailed information about the system architecture, codebase, and future development plans.

## System Architecture

MedConnect implements a hybrid architecture with several key components:

### Client-Side Rendering
- Next.js for server-side rendering and client-side navigation
- React for UI component management
- TypeScript for type safety and code quality

### Server-Side Components
- Next.js API routes for serverless functions
- Ruby on Rails backend for complex business logic and database interactions

### Data Storage
- PostgreSQL for relational data (patient records, appointments, etc.)
- Redis for caching frequently accessed data

### Authentication
- JSON Web Tokens (JWT) for maintaining session state
- Role-based access control (RBAC) for different user types (patients, doctors, admin)

### External Integrations
- Payment gateway integration
- Notification services (email, SMS)
- Medical databases for drug information and interactions

## Technology Stack

### Frontend
- **Framework**: Next.js 14.x
- **UI Library**: React 18.x
- **Language**: TypeScript 5.x
- **Styling**: TailwindCSS, CSS Modules
- **State Management**: React Context API, SWR for data fetching
- **Animation**: Framer Motion
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **API Framework**: Next.js API Routes, Ruby on Rails
- **Authentication**: JWT, bcrypt for password hashing
- **Database ORM**: Prisma (Next.js), ActiveRecord (Rails)

### Testing
- **Unit Testing**: Jest, React Testing Library
- **E2E Testing**: Cypress, Playwright

### DevOps
- **CI/CD**: GitHub Actions
- **Deployment**: Netlify, Vercel
- **Monitoring**: Sentry, Application Insights

## Project Structure

```
/frontend
  /app                # Next.js 14 App Router structure
    /api              # API Routes / Backend serverless functions
    /auth             # Authentication pages (login, register, etc.)
    /components       # Reusable UI components
    /contexts         # React Contexts for state management
    /lib              # Utility functions and helpers
      /models         # TypeScript interfaces for data models
      /utils          # Utility functions
    /patient          # Patient-facing pages and components
      /dashboard      # Patient dashboard
      /appointments   # Appointments management
      /health-records # Health records viewing/management
    /doctor           # Doctor-facing pages and components
    /admin            # Admin-facing pages and components
    /services         # API service layer for backend communication
/backend              # Ruby on Rails backend
  /app                # MVC components
  /db                 # Database migrations and schema
  /spec               # Tests
  /config             # Configuration files
```

## Frontend Components

### Core UI Components

MedConnect uses a component-based architecture with several key reusable components:

### Layout Components
- `DefaultLayout`: Main layout wrapper with navigation and footer
- `FooterWrapper`: Consistent footer across pages
- `EnhancedNavbar`: Navigation component with user-specific options

### UI Components
- `FlippableHealthCard`: Interactive health card showing patient information
  - Located at: `/frontend/app/components/ui/FlippableHealthCard.tsx`
  - Props:
    - `patientName`: Patient's full name
    - `patientId`: Unique identifier for the patient
    - `dateOfBirth`: Patient's date of birth
    - `bloodType`: Patient's blood type
    - `emergencyContact`: Emergency contact information
    - `allergies`: Array of patient allergies
    - `conditions`: Array of medical conditions
    - `insuranceProvider`: Name of insurance provider
    - `policyNumber`: Insurance policy number
    - `groupNumber`: Insurance group number
    - `primaryPhysician`: Patient's primary doctor
    - `lastCheckup`: Date of last checkup
    - `healthScore`: Numeric value representing overall health

- `Card`: Base card component with standardized styling
- `Button`: Stylized button component with multiple variants
- `Skeleton`: Loading state placeholder component
- `AnimatedContainer`: Container with animation capabilities

### Specialized Components
- `HealthcareSearch`: Search functionality for healthcare providers
- `NotificationList`, `NotificationItem`, etc.: Notification system components
- `CursorEffect`: Interactive cursor effects for enhanced UX

### Dashboard Components
- Health overview statistics cards
- AI-powered health insights
- Upcoming appointments display
- Medication reminders

## Patient Dashboard

The patient dashboard (`/frontend/app/patient/dashboard/page.tsx`) is the central hub for patient interaction with the platform. It contains several key sections:

### Health Overview
- Display of key health metrics and statistics
- Quick access to important health information
- Visual representation of health trends

### Your Health Card
- The `FlippableHealthCard` component displaying all essential patient information
- Interactive card that can be flipped to show additional details
- QR code for quick access to health information in emergency situations

### Health Insights
- AI-powered insights based on patient data
- Recommendations for health improvements
- Notifications about upcoming appointments or medication refills

### Recent Activity
- Latest interactions with healthcare providers
- Recent test results or health records
- Medication adherence tracking

### Quick Actions
- Buttons for common tasks like scheduling appointments
- Message provider functionality
- Medication refill requests

## Backend Services

### API Structure

MedConnect uses a hybrid backend approach with Next.js API routes for frontend-facing endpoints and Rails for complex business logic.

#### Next.js API Routes

API routes are organized by domain and functionality:

- `/api/auth/*`: Authentication endpoints
  - `/signin`: User login
  - `/signup`: User registration
  - `/reset-password`: Password reset functionality

- `/api/patient/*`: Patient-specific endpoints
  - `/profile`: Patient profile management
  - `/appointments`: Appointments management
  - `/health-records`: Health records access

- `/api/doctors/*`: Doctor-specific endpoints
  - `/[id]`: Individual doctor information
  - `/search`: Doctor search functionality

- `/api/admin/*`: Admin functionality
  - `/user-journeys`: User journey analytics
  - `/config`: System configuration
  - `/content`: Content management

#### Ruby Backend

The Ruby backend provides RESTful API endpoints for data persistence and complex business logic:

- `/api/v1/patients`: Patient data management
- `/api/v1/appointments`: Appointment scheduling and management
- `/api/v1/prescriptions`: Prescription management
- `/api/v1/medical_records`: Medical records storage and retrieval

## Data Flow

### Patient Dashboard Data Flow

1. User authenticates and receives JWT token
2. Dashboard component initializes and checks authentication state
3. If authenticated, parallel API calls are made to fetch:
   - Patient profile data
   - Appointments
   - Medications
   - Messages
4. Data is stored in component state
5. UI renders with loaded data
6. Periodic refresh or SWR revalidation keeps data current

### API Integration Pattern

The application uses a service layer for API communication:

```typescript
// Example from patientAPI service

export const patientAPI = {
  getProfile: async () => {
    try {
      const response = await axiosInstance.get('/api/patient/profile');
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  
  getAppointments: async () => {
    try {
      const response = await axiosInstance.get('/api/patient/appointments');
      return response;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },
  // Additional methods...
};
```

## Authentication

MedConnect uses JWT-based authentication:

1. User logs in with credentials
2. Server validates credentials and issues JWT token
3. Token is stored in HTTP-only cookie or local storage
4. Requests include token in Authorization header
5. Server validates token for each protected endpoint
6. Token expiration triggers re-authentication

### Auth Context

The AuthContext (`/frontend/app/contexts/AuthContext.tsx`) manages authentication state throughout the application:

```typescript
interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'patient' | 'doctor' | 'admin';
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  error: string | null;
}
```

## State Management

The application uses a combination of state management approaches:

### React Context
- `AuthContext`: Authentication state
- `ThemeContext`: UI theme preferences

### Component State
- Local state for component-specific data
- useState and useReducer for complex state logic

### SWR for Data Fetching
- Cache management for API responses
- Automatic revalidation of data

## UI/UX Guidelines

### Design System

MedConnect follows a consistent design system:

- **Colors**:
  - Primary: medical-teal-500 to medical-teal-700
  - Secondary: medical-blue-500 to medical-blue-700
  - Accent: medical-mint-500, medical-lavender-500
  - Semantic: emerald (success), red (error), amber (warning)

- **Typography**:
  - Headings: 2xl to 4xl, font-bold
  - Body: sm to base, font-normal
  - Accents: font-medium for emphasis

- **Spacing**:
  - Consistent spacing scale (4, 8, 16, 24, 32, 48, 64)
  - Responsive spacing for different viewport sizes

- **Shadows**:
  - shadow-card-soft for subtle elevation
  - shadow-card-hover for interactive elements

- **Animations**:
  - Subtle transitions for state changes
  - More pronounced animations for key interactions

### Accessibility Guidelines

- All interactive elements must be keyboard accessible
- Proper ARIA attributes for complex widgets
- Color contrast ratios must meet WCAG AA standards
- Responsive design for all viewport sizes

## Testing Strategy

### Unit Testing

- Test individual components in isolation
- Mock external dependencies and API calls
- Focus on behavioral testing over implementation details

### Integration Testing

- Test component interactions and data flow
- Test form submissions and validation
- Test authentication flows

### End-to-End Testing

- Test complete user journeys
- Test responsive behavior
- Test error handling and edge cases

## Deployment Process

### Development Workflow

1. Local development with `npm run dev`
2. Branch-based development with PR reviews
3. CI/CD pipeline runs tests on PR creation
4. Preview deployments for feature branches
5. Merge to main triggers staging deployment
6. Manual promotion to production

### Environment Configuration

- Development: Local environment variables
- Staging: Netlify/Vercel environment variables
- Production: Secured environment variables with secrets management

## Performance Optimization

### Client-Side Optimizations

- Code splitting via Next.js dynamic imports
- Image optimization with Next.js Image component
- Memoization of expensive calculations
- Virtualization for long lists

### Server-Side Optimizations

- API response caching
- Database query optimization
- Serverless function cold start management

## Security Considerations

### Data Protection

- PHI/PII data must be encrypted at rest and in transit
- Strict content security policy implementation
- Regular security audits and penetration testing

### Input Validation

- All user inputs must be validated and sanitized
- Parameterized queries for database operations
- Protection against XSS and CSRF attacks

## Future Development Roadmap

### Short-term (1-3 months)

1. **Data Visualization Enhancements**
   - Add interactive charts for health metrics
   - Implement trend analysis for vital signs
   - Improve health score calculation algorithm

2. **Mobile Responsiveness**
   - Optimize all components for mobile devices
   - Implement touch-friendly interactions
   - Add offline capabilities for critical features

3. **Notification System**
   - Real-time notifications via WebSockets
   - Push notification integration
   - Customizable notification preferences

### Medium-term (3-6 months)

1. **Telehealth Integration**
   - Video consultation capabilities
   - Secure messaging with file attachments
   - Pre-appointment questionnaires

2. **AI-Powered Features**
   - Symptom analysis and triage
   - Medication interaction checking
   - Personalized health recommendations

3. **Health Device Integration**
   - Connect with fitness trackers and wearables
   - Import data from home health devices
   - Automated vital sign monitoring

### Long-term (6+ months)

1. **Ecosystem Expansion**
   - Provider portal for healthcare professionals
   - Insurance integration for claims processing
   - Health marketplace for products and services

2. **Advanced Analytics**
   - Population health insights
   - Predictive health modeling
   - Research data anonymization and sharing

3. **Mobile Applications**
   - Native iOS and Android applications
   - Cross-platform code sharing with React Native
   - Offline-first approach for rural healthcare

## Known Issues and Workarounds

### Authentication

**Issue**: JWT decode in current_user is causing NoMethodError on nil:NilClass

**Workaround**: Handle null cases explicitly and implement proper error logging to identify root cause. Currently, we've implemented a fallback mechanism that redirects to login when JWT validation fails.

### API Integration

**Issue**: MongoDB dependencies causing build failure during deployment

**Workaround**: Removed MongoDB dependencies and implemented mock data providers for development and demonstration. For production, connect to the actual Ruby backend instead of using MongoDB directly.

### Component Inconsistencies

**Issue**: React components using hooks not marked as client components

**Workaround**: Explicitly add 'use client' directive to all components that use React hooks. This is required for Next.js to properly handle client-side rendering.

## Contributing Guidelines

### Code Standards

- Follow existing project structure and naming conventions
- Use TypeScript for all new code
- Implement comprehensive error handling
- Document complex logic with comments

### PR Process

- Create feature branches from main
- Include tests for all new features
- Ensure all existing tests pass
- Request review from at least one team member
- Address all review comments before merging

### Documentation

- Update this guide for significant architectural changes
- Document new components with props and usage examples
- Include API documentation for new endpoints

---

## Component Implementation Examples

### Patient Dashboard Example

The patient dashboard combines multiple components and data sources to create a comprehensive health overview:

```tsx
export default function PatientDashboard() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  // Set the actual patient name for the current demo
  const patientName = 'Akshit Patel';
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Fetch data from API endpoints
  useEffect(() => {
    // Implementation details...
  }, [user, router]);
  
  return (
    <DefaultLayout>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-medical-teal-600 via-medical-teal-500 to-medical-blue-500 p-6 mb-8 shadow-md">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome back, {patientName}</h1>
          <p className="text-teal-50">Your health dashboard is {loading ? 'updating' : 'up to date'}.</p>
        </div>
      </div>
      
      {/* Main content with health stats, etc. */}
      
      {/* Health Card */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Health Card</h2>
        <div className="w-full aspect-[1.586/1] max-w-sm mx-auto">
          {loading ? (
            <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">Loading health card...</p>
            </div>
          ) : (
            <FlippableHealthCard 
              patientName={patientName}
              patientId={'4'}
              dateOfBirth={'1992-05-30'}
              healthScore={92}
              bloodType={'O+'}
              emergencyContact={'Rihal (Bro)'}
              insuranceProvider={'ICICI Insurance'}
              policyNumber={'3231231231'}
              groupNumber={''}
              allergies={['non', 'heat']}
              conditions={[]}
              primaryPhysician={'Dr. Sarah Johnson'}
              lastCheckup={'March 15, 2025'}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
```

## API Response Format

The MedConnect API follows a consistent response format:

```json
{
    "success": true,
    "data": {
        "profile": {
            "personal_info": {
                "id": 4,
                "name": "Akshit Patel",
                "email": "jodow@ymail.com",
                "phone": "9825499319",
                "date_of_birth": "1992-05-30",
                "gender": "Male",
                "address": "plot-A120 Greencity",
                "passport_number": "9825499319"
            },
            "emergency_contact": {
                "name": "Rihal",
                "phone": "9898989898",
                "relationship": "Bro"
            },
            "insurance": {
                "primary": true,
                "provider": "icici",
                "group_number": null,
                "policy_number": "3231231231"
            },
            "health_metrics": {
                "height": "165",
                "weight": "66",
                "allergies": [
                    "non",
                    "heat"
                ],
                "blood_type": "O+"
            },
            "health_history": []
        }
    },
    "message": "Patient profile retrieved successfully."
}
```

This standardized format ensures consistent error handling and data processing throughout the application.

---

**Last Updated**: April 29, 2025
**Author**: MedConnect Development Team
