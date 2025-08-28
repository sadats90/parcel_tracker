const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('../config/database');
const authRoutes = require('../routes/auth');
const parcelRoutes = require('../routes/parcel');
const errorHandler = require('../middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - Allow all Vercel domains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin === 'http://localhost:3000' || origin === 'http://127.0.0.1:3000') {
      return callback(null, true);
    }
    
    // Allow all Vercel domains
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Allow your specific domains
    const allowedDomains = [
      'https://parcel-tracker-z868.vercel.app',
      'https://parcel-tracker-z868-r8mg0c29t-sadats-projects-70fa07bb.vercel.app'
    ];
    
    if (allowedDomains.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/create-admin', require('./create-admin'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test database connection and show collections
app.get('/test-db', async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection;
    
    if (db.readyState === 1) {
      // Get all collections
      const collections = await db.db.listCollections().toArray();
      const collectionNames = collections.map(col => col.name);
      
      res.status(200).json({
        status: 'Database Connected',
        database: db.name,
        collections: collectionNames,
        readyState: db.readyState
      });
    } else {
      res.status(500).json({
        status: 'Database Not Connected',
        readyState: db.readyState
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// View all users (for testing - remove in production)
app.get('/view-users', async (req, res) => {
  try {
    const User = require('../models/user');
    const users = await User.find({}).select('-password'); // Don't show passwords
    
    res.status(200).json({
      status: 'Success',
      count: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// View all parcels (for testing - remove in production)
app.get('/view-parcels', async (req, res) => {
  try {
    const Parcel = require('../models/parcel');
    const parcels = await Parcel.find({}).populate('user', 'name email');
    
    res.status(200).json({
      status: 'Success',
      count: parcels.length,
      parcels: parcels
    });
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Parcel Tracker API is running',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Export for Vercel
module.exports = app;
