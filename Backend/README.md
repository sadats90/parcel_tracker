# Parcel Tracker Backend

A secure REST API for parcel tracking with user authentication and authorization.

## Features

- 🔐 **User Authentication**: Register, login, and manage user profiles
- 📦 **Parcel Management**: Create and track parcels with detailed history
- 🛡️ **Security**: JWT authentication, password hashing, input validation
- 📍 **Location Tracking**: Geographic coordinates for parcel locations
- 📊 **Status Updates**: Real-time parcel status tracking
- 🔍 **Search & Filter**: Find parcels by tracking number or status
- 📄 **Pagination**: Efficient data loading for large datasets

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security middleware

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/parcel-tracker

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRE=30d

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login user |
| `GET` | `/api/auth/me` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update user profile |
| `PUT` | `/api/auth/password` | Change password |

### Parcels

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/parcels` | Create a new parcel |
| `GET` | `/api/parcels` | List user's parcels (with pagination) |
| `GET` | `/api/parcels/:trackingNumber` | Get parcel by tracking number |
| `PUT` | `/api/parcels/:id/status` | Update parcel status |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check endpoint |

## Authentication

All parcel endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Parcel
```bash
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "trackingNumber": "TRK123456789",
    "status": "picked_up",
    "initialHistory": {
      "location": "New York, NY",
      "latitude": 40.7128,
      "longitude": -74.0060
    }
  }'
```

### Get Parcel by Tracking Number
```bash
curl -X GET http://localhost:5000/api/parcels/TRK123456789 \
  -H "Authorization: Bearer <your_jwt_token>"
```

### Update Parcel Status
```bash
curl -X PUT http://localhost:5000/api/parcels/<parcel_id>/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "status": "in_transit",
    "location": "Chicago, IL",
    "latitude": 41.8781,
    "longitude": -87.6298
  }'
```

## Data Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Parcel
```javascript
{
  user: ObjectId (required, ref: 'User'),
  trackingNumber: String (required, unique),
  status: String (required, enum),
  history: [{
    location: String (required),
    latitude: Number (required),
    longitude: Number (required),
    status: String (required),
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Parcel Status Values
- `picked_up` - Parcel has been picked up
- `in_transit` - Parcel is in transit
- `out_for_delivery` - Parcel is out for delivery
- `delivered` - Parcel has been delivered
- `exception` - Delivery exception occurred
- `returned` - Parcel has been returned

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured CORS for frontend integration
- **Helmet Security**: Security headers middleware
- **Error Handling**: Comprehensive error handling and logging

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### File Structure
```
Backend/
├── config/
│   └── database.js      # MongoDB connection
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Global error handling
├── models/
│   ├── user.js          # User model
│   └── parcel.js        # Parcel model
├── routes/
│   ├── auth.js          # Authentication routes
│   └── parcel.js        # Parcel routes
├── utils/
│   └── validation.js    # Custom validation
├── server.js            # Main application
└── package.json         # Dependencies
```

## License

MIT License 