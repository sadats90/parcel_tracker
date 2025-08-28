import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AuthTest = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setTestResult('Testing login...');
    
    try {
      const result = await login('sarah.johnson@example.com', 'password123');
      if (result.success) {
        setTestResult('✅ Login successful! User authenticated.');
      } else {
        setTestResult(`❌ Login failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Login error: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testApiCall = async () => {
    setLoading(true);
    setTestResult('Testing API call...');
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      
      const response = await axios.get('/api/parcels/TRK001234567');
      setTestResult(`✅ API call successful! Parcel data: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setTestResult(`❌ API call failed: ${error.response?.data?.message || error.message}`);
    }
    
    setLoading(false);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setTestResult('Token cleared');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Authentication Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</p>
        <p><strong>User:</strong> {user ? user.name : 'None'}</p>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
          Test Login
        </button>
        <button onClick={testApiCall} disabled={loading} style={{ marginRight: '10px' }}>
          Test API Call
        </button>
        <button onClick={clearToken} disabled={loading}>
          Clear Token
        </button>
      </div>

      {testResult && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#f5f5f5', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default AuthTest; 