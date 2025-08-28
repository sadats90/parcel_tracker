import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MyParcels.css';

const MyParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const fetchParcels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/parcels');
      setParcels(response.data.data.parcels);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch parcels');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchParcels();
    }
  }, [isAuthenticated, fetchParcels]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#28a745';
      case 'in_transit':
        return '#ffc107';
      case 'out_for_delivery':
        return '#17a2b8';
      case 'picked_up':
        return '#6c757d';
      case 'exception':
        return '#dc3545';
      case 'returned':
        return '#fd7e14';
      default:
        return '#007bff';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  const handleParcelClick = (trackingNumber) => {
    navigate(`/track/${trackingNumber}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="my-parcels-page">
        <div className="error">
          <h2>Authentication Required</h2>
          <p>Please login to view your parcels.</p>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="my-parcels-page">
        <div className="loading">Loading your parcels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-parcels-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchParcels} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="my-parcels-page">
      <div className="parcels-header">
        <h1>My Parcels</h1>
        <p>Track all your parcels in one place</p>
      </div>

      {parcels.length === 0 ? (
        <div className="no-parcels">
          <h3>No Parcels Found</h3>
          <p>You don't have any parcels yet.</p>
          {user?.role === 'admin' ? (
            <Link to="/add" className="btn btn-primary">
              Add First Parcel
            </Link>
          ) : (
            <p>Contact an administrator to add parcels for you.</p>
          )}
        </div>
      ) : (
        <div className="parcels-grid">
          {parcels.map((parcel) => (
            <div 
              key={parcel._id} 
              className="parcel-card"
              onClick={() => handleParcelClick(parcel.trackingNumber)}
            >
              <div className="parcel-header">
                <h3>{parcel.trackingNumber}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(parcel.status) }}
                >
                  {getStatusText(parcel.status)}
                </span>
              </div>
              
              <div className="parcel-details">
                <p><strong>Recipient:</strong> {parcel.recipientName}</p>
                <p><strong>Address:</strong> {parcel.deliveryAddress}</p>
                <p><strong>Created:</strong> {new Date(parcel.createdAt).toLocaleDateString()}</p>
                {parcel.history && parcel.history.length > 0 && (
                  <p><strong>Last Update:</strong> {new Date(parcel.history[parcel.history.length - 1].timestamp).toLocaleString()}</p>
                )}
              </div>

              <div className="parcel-actions">
                <button className="btn btn-primary btn-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="parcels-actions">
        {user?.role === 'admin' && (
          <Link to="/add" className="btn btn-primary">
            Add New Parcel
          </Link>
        )}
        <Link to="/" className="btn btn-secondary">
          Track Another Package
        </Link>
      </div>
    </div>
  );
};

export default MyParcels; 