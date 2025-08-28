# Parcel Tracker Frontend

A React-based frontend application for tracking parcels with real-time updates, interactive maps, and user authentication.

## Features

- 🔍 **Parcel Tracking**: Search and track parcels by tracking number
- 🗺️ **Interactive Maps**: Visualize parcel journey with Leaflet maps
- 👤 **User Authentication**: Login and registration system
- 📦 **Parcel Management**: Add new parcels and update status
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔒 **Secure**: JWT-based authentication

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on http://localhost:5000

## Installation

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   └── ParcelMap.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── TrackParcel.js
│   │   ├── TrackParcel.css
│   │   ├── AddParcel.js
│   │   ├── AddParcel.css
│   │   ├── UpdateParcel.js
│   │   ├── UpdateParcel.css
│   │   ├── Login.js
│   │   ├── Login.css
│   │   ├── Register.js
│   │   └── Register.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Routes

- `/` - Home page with search functionality
- `/track/:trackingNumber` - Parcel tracking page with map and status history
- `/add` - Add new parcel (requires authentication)
- `/update/:id` - Update parcel status (requires authentication)
- `/login` - User login page
- `/register` - User registration page

## API Integration

The frontend connects to the backend API running on `http://localhost:5000` with the following endpoints:

- `GET /api/parcels/track/:trackingNumber` - Get parcel by tracking number
- `POST /api/parcels` - Create new parcel
- `PUT /api/parcels/:id/status` - Update parcel status
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

## Authentication

The app uses JWT tokens for authentication. Users must be logged in to:
- Add new parcels
- Update parcel status

## Map Integration

The app uses Leaflet for interactive maps showing:
- Markers for each location in the parcel history
- Polylines connecting locations in chronological order
- Popup information for each marker

## Styling

The app uses custom CSS with:
- Responsive design
- Modern UI components
- Consistent color scheme
- Mobile-friendly layout

## Dependencies

- React 18.2.0
- React Router DOM 6.11.1
- Axios 1.4.0
- Leaflet 1.9.4
- React Leaflet 4.2.1

## Browser Support

The app supports all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

### Common Issues

1. **Backend Connection Error**: Ensure the backend server is running on port 5000
2. **Map Not Loading**: Check if Leaflet CSS is loading properly
3. **Authentication Issues**: Clear browser storage and try logging in again

### Getting Help

If you encounter any issues:
1. Check the browser console for errors
2. Verify the backend server is running
3. Ensure all dependencies are installed correctly

## License

This project is part of the Parcel Tracker MERN application. 