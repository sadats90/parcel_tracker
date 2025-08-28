import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddParcel.css';

const AddParcel = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trackingNumber: '',
    status: 'picked_up',
    userId: '',
    initialHistory: {
      location: '',
      latitude: '',
      longitude: ''
    }
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await axios.get('/api/auth/users');
        console.log('Fetched users:', response.data);
        setUsers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('initialHistory.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        initialHistory: {
          ...prev.initialHistory,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Frontend validation
    if (!formData.trackingNumber || formData.trackingNumber.length < 5) {
      setError('Tracking number must be at least 5 characters long');
      setLoading(false);
      return;
    }

    if (!formData.userId) {
      setError('Please select a user to assign the parcel to');
      setLoading(false);
      return;
    }

    if (!formData.initialHistory.location || !formData.initialHistory.latitude || !formData.initialHistory.longitude) {
      setError('Please fill in all location details (location, latitude, longitude)');
      setLoading(false);
      return;
    }

    try {
      // Convert latitude and longitude to numbers
      const parcelData = {
        ...formData,
        userId: formData.userId || undefined, // Only send if selected
        initialHistory: {
          ...formData.initialHistory,
          latitude: parseFloat(formData.initialHistory.latitude),
          longitude: parseFloat(formData.initialHistory.longitude)
        }
      };

      console.log('Sending parcel data:', parcelData);
      console.log('Form data before processing:', formData);
      const response = await axios.post('/api/parcels', parcelData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/track/${response.data.data.trackingNumber}`);
      }, 2000);
    } catch (err) {
      console.error('Error creating parcel:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Handle validation errors specifically
      if (err.response?.data?.errors && err.response.data.errors.length > 0) {
        const validationErrors = err.response.data.errors.map(error => error.msg).join(', ');
        setError(`Validation failed: ${validationErrors}`);
      } else {
        setError(err.response?.data?.message || 'Failed to create parcel');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="add-parcel-page">
        <div className="success">
          <h2>Parcel Created Successfully!</h2>
          <p>Redirecting to tracking page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-parcel-page">
      <div className="form-container">
        <h1>Add New Parcel</h1>
        <p className="form-subtitle">
          Create a new parcel for tracking
        </p>
        <p className="form-help">
          💡 Tip: Use coordinates from Dhaka city area (e.g., 23.7937, 90.4066 for Gulshan)
        </p>
        <p className="form-help">
          📋 Requirements: Tracking number must be 5-20 characters, all fields are required
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="parcel-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="trackingNumber">Tracking Number *</label>
              <input
                type="text"
                id="trackingNumber"
                name="trackingNumber"
                value={formData.trackingNumber}
                onChange={handleChange}
                required
                minLength="5"
                maxLength="20"
                placeholder="Enter tracking number (5-20 characters)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userId">Assign to User *</label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                disabled={loadingUsers}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
              {loadingUsers && <small>Loading users...</small>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Initial Status *</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="picked_up">Picked Up</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="exception">Exception</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="initialHistory.location">Initial Location *</label>
            <input
              type="text"
              id="initialHistory.location"
              name="initialHistory.location"
              value={formData.initialHistory.location}
              onChange={handleChange}
              required
              placeholder="Enter location (e.g., Dhaka Sorting Center)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="initialHistory.latitude">Latitude *</label>
              <input
                type="number"
                step="any"
                id="initialHistory.latitude"
                name="initialHistory.latitude"
                value={formData.initialHistory.latitude}
                onChange={handleChange}
                required
                placeholder="Enter latitude (e.g., 23.7937)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="initialHistory.longitude">Longitude *</label>
              <input
                type="number"
                step="any"
                id="initialHistory.longitude"
                name="initialHistory.longitude"
                value={formData.initialHistory.longitude}
                onChange={handleChange}
                required
                placeholder="Enter longitude (e.g., 90.4066)"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Parcel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddParcel; 