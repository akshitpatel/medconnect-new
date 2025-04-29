# Health Passport API Endpoints

This document provides an overview of all the API endpoints related to the Health Passport feature in the MedConnect platform.

## Authentication

All endpoints require authentication. Include a valid JWT token in the Authorization header.

## Endpoints

### Health Passport Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/health-passport/create` | Create a new health passport for the authenticated user |
| GET | `/api/health-passport/[user_id]` | Get a health passport by user ID |
| GET | `/api/health-passport/[passport_id]` | Get a health passport by passport ID |
| PUT | `/api/health-passport/[passport_id]` | Update a health passport |
| DELETE | `/api/health-passport/[passport_id]` | Delete a health passport (soft delete) |

### Medical Records

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health-passport/[passport_id]/records` | Get all medical records for a health passport |
| POST | `/api/health-passport/[passport_id]/records` | Add a new medical record to a health passport |
| GET | `/api/health-passport/[passport_id]/records/[record_id]` | Get a specific medical record |
| PUT | `/api/health-passport/[passport_id]/records/[record_id]` | Update a medical record |
| DELETE | `/api/health-passport/[passport_id]/records/[record_id]` | Delete a medical record |

### QR Code and Access

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health-passport/[passport_id]/qr-code` | Generate a QR code for a health passport |
| POST | `/api/health-passport/access` | Access a health passport using an access code |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health-passport/search` | Search for health passports (providers and admins only) |

## Request and Response Examples

### Create a Health Passport

**Request:**
```http
POST /api/health-passport/create
Content-Type: application/json

{
  "name": "John Doe",
  "dob": "1990-01-01",
  "gender": "male",
  "blood_type": "O+",
  "height": 180,
  "weight": 75,
  "allergies": [
    {
      "name": "Peanuts",
      "severity": "high",
      "reaction": "Anaphylaxis"
    }
  ],
  "emergency_contacts": [
    {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+1234567890"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Health passport created successfully",
  "passport": {
    "_id": "60d21b4667d0d8992e610c85",
    "user_id": "60d21b4667d0d8992e610c84",
    "passport_number": "HP-12345678",
    "name": "John Doe",
    "dob": "1990-01-01T00:00:00.000Z",
    "gender": "male",
    "blood_type": "O+",
    "height": 180,
    "weight": 75,
    "allergies": [
      {
        "name": "Peanuts",
        "severity": "high",
        "reaction": "Anaphylaxis"
      }
    ],
    "emergency_contacts": [
      {
        "name": "Jane Doe",
        "relationship": "Spouse",
        "phone": "+1234567890"
      }
    ],
    "medical_records": [],
    "vaccinations": [],
    "vital_signs": [],
    "access_logs": [],
    "created_at": "2023-06-19T12:00:00.000Z",
    "updated_at": "2023-06-19T12:00:00.000Z",
    "active": true,
    "emergency_access": false
  }
}
```

### Add a Medical Record

**Request:**
```http
POST /api/health-passport/60d21b4667d0d8992e610c85/records
Content-Type: application/json

{
  "title": "Annual Checkup",
  "type": "examination",
  "provider": "Dr. Smith",
  "facility": "General Hospital",
  "date": "2023-06-15",
  "notes": "Patient is in good health. Blood pressure normal.",
  "attachments": [
    {
      "name": "Blood Test Results",
      "type": "pdf",
      "url": "https://example.com/results.pdf"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Medical record added successfully",
  "record": {
    "record_id": "60d21b4667d0d8992e610c86",
    "title": "Annual Checkup",
    "type": "examination",
    "provider": "Dr. Smith",
    "facility": "General Hospital",
    "date": "2023-06-15T00:00:00.000Z",
    "notes": "Patient is in good health. Blood pressure normal.",
    "attachments": [
      {
        "name": "Blood Test Results",
        "type": "pdf",
        "url": "https://example.com/results.pdf"
      }
    ]
  }
}
```

### Generate QR Code

**Request:**
```http
GET /api/health-passport/60d21b4667d0d8992e610c85/qr-code?expiration=48
```

**Response:**
```json
{
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "access_code": "a1b2c3d4e5f6g7h8",
  "expires_in": "48 hours"
}
```

### Search Health Passports

**Request:**
```http
GET /api/health-passport/search?name=John&page=1&limit=10
```

**Response:**
```json
{
  "passports": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "user_id": "60d21b4667d0d8992e610c84",
      "passport_number": "HP-12345678",
      "name": "John Doe",
      "dob": "1990-01-01T00:00:00.000Z",
      "gender": "male",
      "blood_type": "O+",
      "created_at": "2023-06-19T12:00:00.000Z",
      "updated_at": "2023-06-19T12:00:00.000Z",
      "active": true
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error response body format:

```json
{
  "error": "Error message describing the issue"
}
``` 