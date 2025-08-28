import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ManageParcels.css';

const ManageParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/parcels');
      setParcels(response.data.data.parcels);
    } catch (err) {
      setError('Failed to fetch parcels');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '#28a745';
      case 'in_transit':
        return '#ffc107';
      case 'out_for_delivery':
        return '#17a2b8';
      case 'exception':
        return '#dc3545';
      case 'returned':
        return '#6f42c1';
      case 'picked_up':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = parcel.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parcel.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || parcel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="manage-parcels-page">
        <div className="loading">Loading parcels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-parcels-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-parcels-page">
      <div className="manage-header">
        <h1>Manage Parcels</h1>
        <p>Search and update status for all parcels</p>
      </div>

      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by tracking number or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="picked_up">Picked Up</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="exception">Exception</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="parcels-summary">
        <p>Showing {filteredParcels.length} of {parcels.length} parcels</p>
      </div>

      <div className="parcels-grid">
        {filteredParcels.length > 0 ? (
          filteredParcels.map((parcel) => (
            <div key={parcel._id} className="parcel-card">
              <div className="parcel-header">
                <h3>{parcel.trackingNumber}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(parcel.status) }}
                >
                  {parcel.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="parcel-details">
                <p><strong>Current Location:</strong> {parcel.currentLocation?.location || 'N/A'}</p>
                <p><strong>Last Updated:</strong> {new Date(parcel.updatedAt).toLocaleDateString()}</p>
                <p><strong>History Entries:</strong> {parcel.history?.length || 0}</p>
              </div>

              <div className="parcel-actions">
                <Link 
                  to={`/track/${parcel.trackingNumber}`} 
                  className="btn btn-secondary btn-sm"
                >
                  View Details
                </Link>
                {console.log('User object in ManageParcels:', user)}
                {console.log('User role in ManageParcels:', user?.role)}
                {console.log('Is admin check in ManageParcels:', user?.role === 'admin')}
                {user?.role === 'admin' && (
                  <Link 
                    to={`/update/${parcel.trackingNumber}`} 
                    className="btn btn-primary btn-sm"
                  >
                    Update Status
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <h3>No parcels found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParcels; 