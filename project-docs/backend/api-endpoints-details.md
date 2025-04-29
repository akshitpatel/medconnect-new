# MedConnect API Endpoints Documentation - Phase 1

This document provides detailed specifications for the API endpoints implemented in Phase 1 of the MedConnect backend.

## Authentication Endpoints

### Register a New User

**Endpoint**: `POST /api/auth/register`

**Description**: Creates a new user account.

**Authentication**: None

**Request Body**:
```json
{
  "email": "patient@example.com",
  "password": "SecureP@ssw0rd",
  "firstName": "John",
  "lastName": "Doe",
  "role": "patient",
  "phone": "+15555555555",
  "gender": "male",
  "dob": "1990-01-01"
}
```

**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "patient@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient",
    "isVerified": false,
    "createdAt": "2023-05-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `409 Conflict`: Email already exists

**Security Considerations**:
- Password must meet complexity requirements (min 8 chars, mix of letters, numbers, symbols)
- Email verification required before account is fully activated
- Rate limiting applied to prevent abuse

---

### Login

**Endpoint**: `POST /api/auth/login`

**Description**: Authenticates a user and returns access and refresh tokens.

**Authentication**: None

**Request Body**:
```json
{
  "email": "patient@example.com",
  "password": "SecureP@ssw0rd"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account not verified or is deactivated

**Security Considerations**:
- Implement account lockout after multiple failed attempts
- Log all login attempts for security auditing
- Set secure and HttpOnly flags for cookies
- Implement proper CORS configuration

---

### Refresh Token

**Endpoint**: `POST /api/auth/refresh`

**Description**: Generates a new access token using a valid refresh token.

**Authentication**: None (Token-based)

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid or expired refresh token

**Security Considerations**:
- Refresh tokens should have longer expiration but be securely stored
- Implement refresh token rotation for additional security
- Invalidate refresh tokens on logout or security breach

---

### Logout

**Endpoint**: `POST /api/auth/logout`

**Description**: Invalidates the user's refresh token to log them out.

**Authentication**: Required

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Invalid authentication

**Security Considerations**:
- Invalidate both access and refresh tokens
- Clear authentication cookies if using cookie-based auth
- Log all logout events for security auditing

---

### Get Current User

**Endpoint**: `GET /api/auth/me`

**Description**: Retrieves the currently authenticated user's profile.

**Authentication**: Required

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient",
      "phone": "+15555555555",
      "gender": "male",
      "dob": "1990-01-01",
      "address": {
        "line1": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "postalCode": "12345",
        "country": "USA"
      },
      "isVerified": true,
      "createdAt": "2023-05-15T10:30:00Z",
      "lastLogin": "2023-05-16T08:45:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid or expired authentication

**Security Considerations**:
- Ensure sensitive data is properly encrypted in transmission
- Apply proper authorization to prevent user data leakage
- Record access in audit logs for HIPAA compliance

---

## User Management Endpoints

### Get User Profile

**Endpoint**: `GET /api/users/:id`

**Description**: Retrieves a user's profile by their ID.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "patient",
      "phone": "+15555555555",
      "gender": "male",
      "dob": "1990-01-01",
      "address": {
        "line1": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "postalCode": "12345",
        "country": "USA"
      },
      "profileImageUrl": "https://medconnect.com/images/profiles/user-123.jpg",
      "isVerified": true,
      "createdAt": "2023-05-15T10:30:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to view this profile
- `404 Not Found`: User not found

**Security Considerations**:
- Implement access control to limit who can view profiles
- Exclude sensitive data based on the requester's permissions
- Log all access to user profiles for HIPAA compliance

---

### Update User Profile

**Endpoint**: `PUT /api/users/:id`

**Description**: Updates a user's profile information.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+15555555556",
  "address": {
    "line1": "456 Oak Ave",
    "line2": "Apt 7B",
    "city": "Newtown",
    "state": "CA",
    "postalCode": "54321",
    "country": "USA"
  },
  "profileImageUrl": "https://medconnect.com/images/profiles/user-123-updated.jpg"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "email": "patient@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "phone": "+15555555556",
      "address": {
        "line1": "456 Oak Ave",
        "line2": "Apt 7B",
        "city": "Newtown",
        "state": "CA",
        "postalCode": "54321",
        "country": "USA"
      },
      "profileImageUrl": "https://medconnect.com/images/profiles/user-123-updated.jpg",
      "updatedAt": "2023-05-16T14:20:00Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to update this profile
- `404 Not Found`: User not found

**Security Considerations**:
- Validate all input data thoroughly
- Record changes in audit logs for compliance
- Implement verification for critical field changes (e.g., email, phone)
- Sanitize inputs to prevent XSS and injection attacks

---

### Change Password

**Endpoint**: `PUT /api/users/:id/password`

**Description**: Updates a user's password.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "currentPassword": "SecureP@ssw0rd",
  "newPassword": "NewSecureP@ssw0rd"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Password updated successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data or password requirements not met
- `401 Unauthorized`: Current password is incorrect
- `403 Forbidden`: Not authorized to change this password
- `404 Not Found`: User not found

**Security Considerations**:
- Enforce strong password requirements
- Rate limit password change attempts
- Notify user via email about password changes
- Log password change events (without storing actual passwords)

---

### Request Password Reset

**Endpoint**: `POST /api/auth/password-reset/request`

**Description**: Sends a password reset link to the user's email.

**Authentication**: None

**Request Body**:
```json
{
  "email": "patient@example.com"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "If an account with that email exists, a password reset link has been sent"
}
```

**Security Considerations**:
- Don't reveal whether an email exists in the system
- Generate time-limited, single-use reset tokens
- Rate limit requests to prevent abuse
- Send clear instructions in the email

---

### Reset Password

**Endpoint**: `POST /api/auth/password-reset/confirm`

**Description**: Resets a user's password using a valid reset token.

**Authentication**: None

**Request Body**:
```json
{
  "token": "5f8d7e6c5b4a3c2d1e0f",
  "newPassword": "NewSecureP@ssw0rd"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Password has been reset successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data or password requirements not met
- `401 Unauthorized`: Invalid or expired token

**Security Considerations**:
- Invalidate token after use
- Enforce strong password requirements
- Notify user via email about successful password reset
- Log password reset events

---

### Deactivate Account

**Endpoint**: `DELETE /api/users/:id`

**Description**: Deactivates a user account.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "password": "SecureP@ssw0rd"
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Account deactivated successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Password is incorrect
- `403 Forbidden`: Not authorized to deactivate this account
- `404 Not Found`: User not found

**Security Considerations**:
- Require password confirmation for security
- Implement soft delete instead of hard delete for data retention
- Invalidate all active sessions and tokens
- Create audit log entry for account deactivation

---

## Health Passport Endpoints

### Get Health Passport

**Endpoint**: `GET /api/users/:id/health-passport`

**Description**: Retrieves a user's health passport information.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Response (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "healthPassport": {
      "id": "987e6543-e21b-12d3-b456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "bloodType": "A+",
      "height": 175,
      "weight": 70,
      "allergies": ["Penicillin", "Peanuts"],
      "chronicConditions": ["Asthma"],
      "currentMedications": [
        {
          "name": "Albuterol",
          "dosage": "90mcg",
          "frequency": "As needed"
        }
      ],
      "pastSurgeries": [
        {
          "procedure": "Appendectomy",
          "date": "2015-03-15",
          "notes": "No complications"
        }
      ],
      "familyMedicalHistory": "Father: Hypertension, Mother: Diabetes",
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "+15555555557",
        "relationship": "Spouse"
      },
      "updatedAt": "2023-05-15T14:30:00Z"
    }
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to view this health passport
- `404 Not Found`: Health passport not found

**Security Considerations**:
- Apply strict access controls for health data
- Encrypt all sensitive health information
- Log all access to health passport data
- Implement field-level permissions based on user role

---

### Create or Update Health Passport

**Endpoint**: `PUT /api/users/:id/health-passport`

**Description**: Creates or updates a user's health passport.

**Authentication**: Required

**URL Parameters**:
- `id`: User ID

**Request Body**:
```json
{
  "bloodType": "A+",
  "height": 175,
  "weight": 70,
  "allergies": ["Penicillin", "Peanuts"],
  "chronicConditions": ["Asthma"],
  "currentMedications": [
    {
      "name": "Albuterol",
      "dosage": "90mcg",
      "frequency": "As needed"
    }
  ],
  "pastSurgeries": [
    {
      "procedure": "Appendectomy",
      "date": "2015-03-15",
      "notes": "No complications"
    }
  ],
  "familyMedicalHistory": "Father: Hypertension, Mother: Diabetes",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "+15555555557",
    "relationship": "Spouse"
  }
}
```

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Health passport updated successfully",
  "data": {
    "healthPassport": {
      "id": "987e6543-e21b-12d3-b456-426614174000",
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "bloodType": "A+",
      "height": 175,
      "weight": 70,
      "allergies": ["Penicillin", "Peanuts"],
      "chronicConditions": ["Asthma"],
      "currentMedications": [
        {
          "name": "Albuterol",
          "dosage": "90mcg",
          "frequency": "As needed"
        }
      ],
      "pastSurgeries": [
        {
          "procedure": "Appendectomy",
          "date": "2015-03-15",
          "notes": "No complications"
        }
      ],
      "familyMedicalHistory": "Father: Hypertension, Mother: Diabetes",
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "+15555555557",
        "relationship": "Spouse"
      },
      "updatedAt": "2023-05-16T15:45:00Z"
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to update this health passport
- `404 Not Found`: User not found

**Security Considerations**:
- Validate all health-related data thoroughly
- Record changes in audit logs for HIPAA compliance
- Implement versioning or history tracking for health data
- Encrypt sensitive health data in transit and at rest

---

## Implementation Notes

1. **Error Handling**: All endpoints should return consistent error responses with appropriate HTTP status codes.

2. **Rate Limiting**: Implement rate limiting for all endpoints, particularly authentication-related ones.

3. **Request Validation**: Use schema validation (e.g., Zod, Joi) to validate all request bodies.

4. **Response Format**: Maintain a consistent response format across all endpoints.

5. **CORS Configuration**: Configure proper CORS headers based on allowed origins.

6. **Audit Logging**: Log all access to PHI in compliance with HIPAA regulations.

7. **Input Sanitization**: Sanitize all inputs to prevent XSS and injection attacks.

8. **Data Encryption**: Ensure sensitive data is encrypted both in transit and at rest.

9. **Token Management**: Implement secure token generation, validation, and revocation.

10. **Testing**: Create comprehensive test cases for each endpoint.

## Swagger/OpenAPI Documentation

All endpoints should be documented using Swagger/OpenAPI specification for interactive API documentation. This should include:

- Endpoint descriptions
- Request parameters and body schemas
- Response schemas
- Authentication requirements
- Error responses
- Examples of requests and responses 