const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  phone: '+1234567890'
};

const testParcel = {
  trackingNumber: 'TEST123456789',
  status: 'picked_up',
  initialHistory: {
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060
  }
};

async function testAPI() {
  console.log('🧪 Testing Parcel Tracker API...\n');

  try {
    // Test 1: Register user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ User registered successfully');
    console.log('User ID:', registerResponse.data.data.user.id);
    console.log('Token:', registerResponse.data.data.token.substring(0, 20) + '...\n');

    authToken = registerResponse.data.data.token;

    // Test 2: Login user
    console.log('2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User logged in successfully\n');

    // Test 3: Get user profile
    console.log('3. Testing get user profile...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User profile retrieved successfully');
    console.log('User name:', profileResponse.data.data.user.name);
    console.log('User email:', profileResponse.data.data.user.email, '\n');

    // Test 4: Create parcel
    console.log('4. Testing parcel creation...');
    const createParcelResponse = await axios.post(`${BASE_URL}/parcels`, testParcel, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Parcel created successfully');
    console.log('Parcel ID:', createParcelResponse.data.data._id);
    console.log('Tracking Number:', createParcelResponse.data.data.trackingNumber, '\n');

    const parcelId = createParcelResponse.data.data._id;

    // Test 5: Get parcel by tracking number
    console.log('5. Testing get parcel by tracking number...');
    const getParcelResponse = await axios.get(`${BASE_URL}/parcels/${testParcel.trackingNumber}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Parcel retrieved successfully');
    console.log('Current status:', getParcelResponse.data.data.status, '\n');

    // Test 6: Update parcel status
    console.log('6. Testing parcel status update...');
    const updateStatusResponse = await axios.put(`${BASE_URL}/parcels/${parcelId}/status`, {
      status: 'in_transit',
      location: 'Chicago, IL',
      latitude: 41.8781,
      longitude: -87.6298
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Parcel status updated successfully');
    console.log('New status:', updateStatusResponse.data.data.status, '\n');

    // Test 7: List user's parcels
    console.log('7. Testing list user parcels...');
    const listParcelsResponse = await axios.get(`${BASE_URL}/parcels`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ User parcels listed successfully');
    console.log('Total parcels:', listParcelsResponse.data.data.pagination.totalParcels, '\n');

    // Test 8: Health check
    console.log('8. Testing health check...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check successful');
    console.log('Server status:', healthResponse.data.status, '\n');

    console.log('🎉 All tests passed! The API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/health');
    console.log('✅ Server is running on http://localhost:5000');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the server with: npm run dev');
    return false;
  }
}

// Run tests
async function runTests() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAPI();
  }
}

runTests(); 