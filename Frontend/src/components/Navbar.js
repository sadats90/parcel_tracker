import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📦 Parcel Tracker
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/my-parcels" className="navbar-link">
                My Parcels
              </Link>
              {user?.role === 'admin' && (
                <>
                  <Link to="/add" className="navbar-link">
                    Add Parcel
                  </Link>
                  <Link to="/manage-parcels" className="navbar-link">
                    Update Status
                  </Link>
                </>
              )}
              <div className="navbar-user">
                <span className="user-name">Welcome, {user?.name}</span>
                {user?.role === 'admin' && (
                  <span className="user-role">(Admin)</span>
                )}
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 