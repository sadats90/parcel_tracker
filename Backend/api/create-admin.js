const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const connectDB = require('../config/database');

const router = express.Router();

// POST /create-admin - Create admin user (for development only)
router.post('/', async (req, res) => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@parceltracker.com' });
    
    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          role: existingAdmin.role,
          name: existingAdmin.name
        }
      });
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
    
    res.status(201).json({
      success: true,
      message: 'Admin user created successfully!',
      admin: {
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name
      }
    });
    
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating admin user',
      error: error.message
    });
  }
});

module.exports = router;
