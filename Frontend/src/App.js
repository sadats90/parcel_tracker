import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TrackParcel from './pages/TrackParcel';
import AddParcel from './pages/AddParcel';
import UpdateParcel from './pages/UpdateParcel';
import Login from './pages/Login';
import Register from './pages/Register';
import MyParcels from './pages/MyParcels';
import ManageParcels from './pages/ManageParcels';
import AuthTest from './components/AuthTest';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

/**
 * Route Protection:
 * - PrivateRoute: Requires authentication (any logged-in user)
 * - AdminRoute: Requires authentication + admin role
 * 
 * Security Model:
 * - Regular users: Can only view and track their own parcels
 * - Admin users: Can create, read, update, and manage all parcels
 */

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/track/:trackingNumber" element={<TrackParcel />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/auth-test" element={<AuthTest />} />
              <Route 
                path="/my-parcels" 
                element={
                  <PrivateRoute>
                    <MyParcels />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/add" 
                element={
                  <AdminRoute>
                    <AddParcel />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/update/:trackingNumber" 
                element={
                  <AdminRoute>
                    <UpdateParcel />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/manage-parcels" 
                element={
                  <AdminRoute>
                    <ManageParcels />
                  </AdminRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 