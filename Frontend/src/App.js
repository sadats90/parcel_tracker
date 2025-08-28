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

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
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
                  <PrivateRoute>
                    <AddParcel />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/update/:trackingNumber" 
                element={
                  <PrivateRoute>
                    <UpdateParcel />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/manage-parcels" 
                element={
                  <PrivateRoute>
                    <ManageParcels />
                  </PrivateRoute>
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