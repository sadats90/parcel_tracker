const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@parceltracker.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Email: admin@parceltracker.com');
      console.log('Password: admin123');
      console.log('Role: admin');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@parceltracker.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@parceltracker.com');
    console.log('Password: admin123');
    console.log('Role: admin');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 