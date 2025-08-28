import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UpdateParcel.css';

const UpdateParcel = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [parcel, setParcel] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    location: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchParcel = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`/api/parcels/${trackingNumber}`);
      setParcel(response.data.data);
    } catch (err) {
      setError('Failed to fetch parcel information');
    } finally {
      setFetchLoading(false);
    }
  }, [trackingNumber]);

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (user && user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    if (user?.role === 'admin') {
      fetchParcel();
    }
  }, [fetchParcel, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`/api/parcels/${parcel._id}/status`, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/track/${parcel.trackingNumber}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update parcel status');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking user role
  if (!user || user.role !== 'admin') {
    return (
      <div className="update-parcel-page">
        <div className="loading">Checking permissions...</div>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="update-parcel-page">
        <div className="loading">Loading parcel information...</div>
      </div>
    );
  }

  if (error && !parcel) {
    return (
      <div className="update-parcel-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="update-parcel-page">
        <div className="success">
          <h2>Status Updated Successfully!</h2>
          <p>Redirecting to tracking page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-parcel-page">
      <div className="form-container">
        <h1>Update Parcel Status</h1>
        <p className="form-subtitle">
          Add a new status update for tracking number: {parcel?.trackingNumber}
        </p>

        {parcel && (
          <div className="parcel-summary">
            <h3>Parcel Details</h3>
            <p><strong>Tracking Number:</strong> {parcel.trackingNumber}</p>
            <p><strong>Current Status:</strong> {parcel.status}</p>
          </div>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">Select a status</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="exception">Exception</option>
              <option value="returned">Returned</option>
            </select>
          </div>

           <div className="form-group">
             <label htmlFor="location">Location *</label>
             <input
               type="text"
               id="location"
               name="location"
               value={formData.location}
               onChange={handleChange}
               required
               placeholder="Enter location"
             />
           </div>

           <div className="form-row">
             <div className="form-group">
                <label htmlFor="latitude">Latitude</label>
                <input
                  type="number"
                  step="any"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  placeholder="Enter latitude"
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  placeholder="Enter longitude"
                />
              </div>
            </div>

                     <div className="form-actions">
             <Link to="/manage-parcels" className="btn btn-secondary">
               Back to Manage
             </Link>
             <button 
               type="submit" 
               className="btn btn-primary"
               disabled={loading}
             >
               {loading ? 'Updating...' : 'Update Status'}
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateParcel; 