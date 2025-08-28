import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ParcelMap from '../components/ParcelMap';
import { useAuth } from '../context/AuthContext';
import './TrackParcel.css';

const TrackParcel = () => {
  const { trackingNumber } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchParcel = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/parcels/${trackingNumber}`);
      setParcel(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch parcel information');
    } finally {
      setLoading(false);
    }
  }, [trackingNumber]);

  useEffect(() => {
    fetchParcel();
  }, [fetchParcel]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#28a745';
      case 'in transit':
        return '#ffc107';
      case 'out for delivery':
        return '#17a2b8';
      case 'pending':
        return '#6c757d';
      default:
        return '#007bff';
    }
  };

  if (loading) {
    return (
      <div className="tracking-page">
        <div className="loading">Loading parcel information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tracking-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="tracking-page">
        <div className="error">
          <h2>Parcel Not Found</h2>
          <p>No parcel found with tracking number: {trackingNumber}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <div className="tracking-header">
        <h1>Tracking: {parcel.trackingNumber}</h1>
        <div className="parcel-info">
          <p><strong>Tracking Number:</strong> {parcel.trackingNumber}</p>
          <p><strong>Current Status:</strong> 
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(parcel.status) }}
            >
              {parcel.status}
            </span>
          </p>
        </div>
      </div>

      <div className="tracking-content">
        <div className="map-section">
          <h2>Package Journey</h2>
          {console.log('Parcel history:', parcel.history)}
          <ParcelMap 
            statusHistory={parcel.history} 
            center={[23.7937, 90.4066]}
            zoom={10}
          />
        </div>

        <div className="status-section">
          <h2>Status History</h2>
          <div className="status-history">
            {parcel.history && parcel.history.length > 0 ? (
              parcel.history.map((status, index) => (
                <div 
                  key={index} 
                  className={`status-item ${status.status.toLowerCase().replace('_', '-')}`}
                >
                  <div className="status-content">
                    <h4>{status.status.replace('_', ' ').toUpperCase()}</h4>
                    <p className="location">
                      📍 {status.location}
                    </p>
                    <div className="status-date">
                      {new Date(status.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No status updates available</p>
            )}
          </div>
        </div>
      </div>

      <div className="tracking-actions">
        {console.log('User object:', user)}
        {console.log('User role:', user?.role)}
        {console.log('Is admin check:', user?.role === 'admin')}
        {user?.role === 'admin' && (
          <Link to={`/update/${parcel.trackingNumber}`} className="btn btn-primary">
            Update Status
          </Link>
        )}
        <Link to="/" className="btn btn-secondary">
          Track Another Package
        </Link>
      </div>
    </div>
  );
};

export default TrackParcel; 