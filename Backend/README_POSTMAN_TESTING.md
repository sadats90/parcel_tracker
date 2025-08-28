# Parcel Tracker API - Postman Testing Guide

This guide will help you test the Parcel Tracker API using Postman. The API includes authentication, parcel management, and tracking functionality.

## 🚀 Quick Start

### 1. Setup Database with Dummy Data

First, populate your database with test data:

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies (if not already done)
npm install

# Run the seeding script
npm run seed
```

This will create:
- **5 Test Parcels** with different stages in Dhaka city

### 2. Start the Backend Server

```bash
# Start the development server
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Import Postman Collection

1. Open Postman
2. Click "Import" button
3. Import the file: `Backend/Parcel_Tracker_API.postman_collection.json`
4. The collection will be available with all pre-configured requests

## 📋 Test Data Overview

### Test User
- **Email**: `john.doe@example.com`
- **Password**: `password123`
- **Phone**: `+8801712345678`

### Test Parcels

| Tracking Number | Status | Description |
|----------------|--------|-------------|
| `TRK001234567` | `delivered` | Complete journey from Gulshan to Uttara |
| `TRK002345678` | `out_for_delivery` | Currently being delivered to Shahbagh |
| `TRK003456789` | `in_transit` | Moving through transit hubs |
| `TRK004567890` | `exception` | Has an exception at Motijheel |
| `TRK005678901` | `picked_up` | Just picked up from Lalbagh |

## 🔐 Authentication Testing

### Step 1: Register User (Optional)
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/register`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone": "+8801712345678"
}
```

### Step 2: Login User
- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/auth/login`
- **Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Important**: The login request has a test script that automatically sets the token variable. After successful login, all subsequent requests will use this token.

### Step 3: Verify Authentication
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/auth/me`

## 📦 Parcel Testing

### 1. Get Parcel by Tracking Number

Test each parcel to see different stages:

#### Delivered Parcel
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels/TRK001234567`

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "trackingNumber": "TRK001234567",
    "status": "delivered",
    "history": [
      {
        "location": "Gulshan-1 Sorting Center",
        "latitude": 23.7937,
        "longitude": 90.4066,
        "status": "picked_up",
        "timestamp": "2024-01-01T00:00:00.000Z"
      },
      // ... more history entries
    ]
  }
}
```

#### Out for Delivery Parcel
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels/TRK002345678`

#### In Transit Parcel
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels/TRK003456789`

#### Exception Parcel
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels/TRK004567890`

#### Picked Up Parcel
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels/TRK005678901`

### 2. Create New Parcel

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/parcels`
- **Body**:
```json
{
  "trackingNumber": "TRK006789012",
  "status": "picked_up",
  "initialHistory": {
    "location": "Gulshan-1 Collection Center",
    "latitude": 23.7937,
    "longitude": 90.4066
  }
}
```

### 3. Update Parcel Status

To update a parcel's status, you'll need the parcel ID. You can get this from the response of any "Get Parcel" request.

#### Add Transit Status
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/parcels/{{parcelId}}/status`
- **Body**:
```json
{
  "status": "in_transit",
  "location": "Banani Transit Hub",
  "latitude": 23.7937,
  "longitude": 90.4066
}
```

#### Out for Delivery
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/parcels/{{parcelId}}/status`
- **Body**:
```json
{
  "status": "out_for_delivery",
  "location": "Dhanmondi Local Office",
  "latitude": 23.7465,
  "longitude": 90.3706
}
```

#### Delivered
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/parcels/{{parcelId}}/status`
- **Body**:
```json
{
  "status": "delivered",
  "location": "Uttara Delivery Point",
  "latitude": 23.8709,
  "longitude": 90.3753
}
```

#### Exception
- **Method**: `PUT`
- **URL**: `{{baseUrl}}/api/parcels/{{parcelId}}/status`
- **Body**:
```json
{
  "status": "exception",
  "location": "Motijheel Processing Center",
  "latitude": 23.7289,
  "longitude": 90.4154
}
```

### 4. Get All Parcels

#### Basic List
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels`

#### With Pagination
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels?page=1&limit=5`

#### Filter by Status
- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/parcels?status=in_transit`

## 🗺️ Map Testing

The parcels include real Dhaka city coordinates. When you test the frontend, you'll see:

1. **Markers** for each location in the parcel's history
2. **Polylines** connecting the locations in chronological order
3. **Different stages** represented by different colored markers

### Dhaka Locations Used:
- **Gulshan-1**: 23.7937, 90.4066
- **Banani**: 23.7937, 90.4066
- **Dhanmondi**: 23.7465, 90.3706
- **Mirpur**: 23.8067, 90.3683
- **Uttara**: 23.8709, 90.3753
- **Motijheel**: 23.7289, 90.4154
- **Lalbagh**: 23.7183, 90.3956
- **Old Dhaka**: 23.7104, 90.4074
- **Shahbagh**: 23.7371, 90.3714
- **Farmgate**: 23.7539, 90.3811

## 🔍 Testing Workflow

### 1. Health Check
Start by testing the health endpoint to ensure the server is running:
- **Method**: `GET`
- **URL**: `{{baseUrl}}/health`

### 2. Authentication Flow
1. Login with the test user
2. Verify the token is automatically set
3. Test the "Get Current User" endpoint

### 3. Parcel Testing Flow
1. Get all parcels to see the overview
2. Test individual parcels by tracking number
3. Create a new parcel
4. Update the status of an existing parcel
5. Verify the changes are reflected

### 4. Frontend Integration
1. Start the frontend: `cd Frontend && npm start`
2. Login with the test credentials
3. Test tracking with the provided tracking numbers
4. View the map to see the parcel journeys

## 🚨 Common Issues & Solutions

### 1. Authentication Errors
- **Issue**: 401 Unauthorized
- **Solution**: Make sure you've logged in and the token is set

### 2. Parcel Not Found
- **Issue**: 404 Not Found
- **Solution**: Verify the tracking number exists and belongs to the logged-in user

### 3. Validation Errors
- **Issue**: 400 Bad Request
- **Solution**: Check the request body format and required fields

### 4. Database Connection
- **Issue**: Connection refused
- **Solution**: Ensure MongoDB is running and the connection string is correct

## 📊 Expected Response Examples

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+8801712345678"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Parcel Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "trackingNumber": "TRK001234567",
    "status": "delivered",
    "history": [
      {
        "location": "Gulshan-1 Sorting Center",
        "latitude": 23.7937,
        "longitude": 90.4066,
        "status": "picked_up",
        "timestamp": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 Testing Checklist

- [ ] Health check endpoint works
- [ ] User registration works
- [ ] User login works and sets token
- [ ] Get current user works
- [ ] Get all parcels works
- [ ] Get individual parcels by tracking number works
- [ ] Create new parcel works
- [ ] Update parcel status works
- [ ] Pagination works
- [ ] Status filtering works
- [ ] Frontend can track parcels
- [ ] Map displays correctly with markers and routes

## 🔗 Next Steps

After testing with Postman:

1. **Test the Frontend**: Start the React app and test the full user experience
2. **Test Real Scenarios**: Create parcels with different routes and statuses
3. **Performance Testing**: Test with larger datasets
4. **Error Handling**: Test edge cases and error scenarios

Happy Testing! 🚀 