# Imaging Services API Endpoints

This document provides an overview of all the API endpoints related to the Imaging Services feature in the MedConnect platform.

## Authentication

All endpoints require authentication. Include a valid JWT token in the Authorization header.

## Endpoints

### Imaging Providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/imaging/providers` | Get all imaging providers with optional filtering |
| POST | `/api/imaging/providers` | Create a new imaging provider (admin only) |
| GET | `/api/imaging/providers/[provider_id]` | Get a specific imaging provider |
| PUT | `/api/imaging/providers/[provider_id]` | Update a specific imaging provider (admin only) |
| DELETE | `/api/imaging/providers/[provider_id]` | Delete a specific imaging provider (admin only, soft delete) |
| GET | `/api/imaging/providers/[provider_id]/availability` | Check availability for a specific provider |

### Imaging Types

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/imaging/types` | Get all imaging types |
| POST | `/api/imaging/types` | Create a new imaging type (admin only) |
| GET | `/api/imaging/types/[type_id]` | Get a specific imaging type |
| PUT | `/api/imaging/types/[type_id]` | Update a specific imaging type (admin only) |
| DELETE | `/api/imaging/types/[type_id]` | Delete a specific imaging type (admin only, soft delete) |

### Imaging Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/imaging/appointments` | Get appointments for the current user |
| POST | `/api/imaging/appointments` | Create a new appointment |
| GET | `/api/imaging/appointments/[appointment_id]` | Get a specific appointment |
| PUT | `/api/imaging/appointments/[appointment_id]` | Update a specific appointment |
| DELETE | `/api/imaging/appointments/[appointment_id]` | Cancel a specific appointment |
| GET | `/api/imaging/appointments/[appointment_id]/results` | Get imaging results for a specific appointment |

### Imaging Results

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/imaging/results` | Get imaging results for the current user |
| POST | `/api/imaging/results` | Create a new imaging result (provider or admin only) |
| GET | `/api/imaging/results/[result_id]` | Get a specific imaging result |
| PUT | `/api/imaging/results/[result_id]` | Update a specific imaging result (provider or admin only) |
| PATCH | `/api/imaging/results/[result_id]` | Mark a result as viewed (by patient or provider) |

## Request and Response Examples

### Search for Imaging Providers

**Request:**
```http
GET /api/imaging/providers?specialty=MRI&city=New%20York&insurance=BlueCross&page=1&limit=10
```

**Response:**
```json
{
  "providers": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "City Imaging Center",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zip": "10001",
        "country": "USA"
      },
      "contact": {
        "phone": "+1234567890",
        "email": "contact@cityimaging.com",
        "website": "https://cityimaging.com"
      },
      "specialties": ["MRI", "CT Scan", "X-Ray"],
      "insurance_accepted": ["BlueCross", "Aetna", "Medicare"],
      "rating": 4.5,
      "verification_status": "verified",
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

### Check Provider Availability

**Request:**
```http
GET /api/imaging/providers/60d21b4667d0d8992e610c85/availability?date=2023-07-15
```

**Response:**
```json
{
  "provider_id": "60d21b4667d0d8992e610c85",
  "provider_name": "City Imaging Center",
  "date": "Jul 15, 2023",
  "available": true,
  "available_slots": [
    {
      "time": "Jul 15, 2023, 9:00 AM",
      "timestamp": "2023-07-15T09:00:00.000Z"
    },
    {
      "time": "Jul 15, 2023, 9:30 AM",
      "timestamp": "2023-07-15T09:30:00.000Z"
    },
    {
      "time": "Jul 15, 2023, 10:00 AM",
      "timestamp": "2023-07-15T10:00:00.000Z"
    }
  ]
}
```

### Create an Appointment

**Request:**
```http
POST /api/imaging/appointments
Content-Type: application/json

{
  "provider_id": "60d21b4667d0d8992e610c85",
  "imaging_type_id": "60d21b4667d0d8992e610c86",
  "appointment_date": "2023-07-15T09:00:00.000Z",
  "body_part": "Head",
  "reason_for_exam": "Headaches",
  "referral_doctor": {
    "name": "Dr. Smith"
  },
  "duration_minutes": 30,
  "contrast_required": false,
  "preparation_confirmed": true,
  "passport_id": "60d21b4667d0d8992e610c87"
}
```

**Response:**
```json
{
  "message": "Appointment scheduled successfully",
  "appointment": {
    "_id": "60d21b4667d0d8992e610c88",
    "user_id": "60d21b4667d0d8992e610c89",
    "provider_id": "60d21b4667d0d8992e610c85",
    "imaging_type_id": "60d21b4667d0d8992e610c86",
    "passport_id": "60d21b4667d0d8992e610c87",
    "appointment_date": "2023-07-15T09:00:00.000Z",
    "duration_minutes": 30,
    "status": "scheduled",
    "body_part": "Head",
    "reason_for_exam": "Headaches",
    "referral_doctor": {
      "name": "Dr. Smith"
    },
    "contrast_required": false,
    "preparation_confirmed": true,
    "created_at": "2023-06-20T12:00:00.000Z",
    "updated_at": "2023-06-20T12:00:00.000Z",
    "notification_status": {
      "confirmation_sent": false,
      "reminder_sent": false,
      "result_available_sent": false
    }
  }
}
```

### Create Imaging Result

**Request:**
```http
POST /api/imaging/results
Content-Type: application/json

{
  "appointment_id": "60d21b4667d0d8992e610c88",
  "user_id": "60d21b4667d0d8992e610c89",
  "provider_id": "60d21b4667d0d8992e610c85",
  "imaging_type_id": "60d21b4667d0d8992e610c86",
  "passport_id": "60d21b4667d0d8992e610c87",
  "findings": "No abnormalities detected in the brain parenchyma. Ventricles are normal in size and configuration.",
  "impression": "Normal brain MRI.",
  "radiologist": {
    "name": "Dr. Johnson",
    "npi": "1234567890"
  },
  "images": [
    {
      "url": "https://example.com/images/1.jpg",
      "thumbnail_url": "https://example.com/thumbnails/1.jpg",
      "type": "JPG",
      "description": "Sagittal T1"
    }
  ],
  "report_url": "https://example.com/reports/1.pdf",
  "is_critical": false
}
```

**Response:**
```json
{
  "message": "Imaging result created successfully",
  "result": {
    "_id": "60d21b4667d0d8992e610c90",
    "appointment_id": "60d21b4667d0d8992e610c88",
    "user_id": "60d21b4667d0d8992e610c89",
    "provider_id": "60d21b4667d0d8992e610c85",
    "imaging_type_id": "60d21b4667d0d8992e610c86",
    "passport_id": "60d21b4667d0d8992e610c87",
    "upload_date": "2023-06-20T12:00:00.000Z",
    "status": "final",
    "findings": "No abnormalities detected in the brain parenchyma. Ventricles are normal in size and configuration.",
    "impression": "Normal brain MRI.",
    "radiologist": {
      "name": "Dr. Johnson",
      "npi": "1234567890"
    },
    "images": [
      {
        "url": "https://example.com/images/1.jpg",
        "thumbnail_url": "https://example.com/thumbnails/1.jpg",
        "type": "JPG",
        "description": "Sagittal T1"
      }
    ],
    "report_url": "https://example.com/reports/1.pdf",
    "is_critical": false,
    "viewed_by_patient": false,
    "viewed_by_provider": true,
    "created_at": "2023-06-20T12:00:00.000Z",
    "updated_at": "2023-06-20T12:00:00.000Z",
    "notifications_sent": {
      "patient": false,
      "referring_provider": false
    }
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