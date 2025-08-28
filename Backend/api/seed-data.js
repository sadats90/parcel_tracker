const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user');
const Parcel = require('../models/parcel');
const connectDB = require('../config/database');

const router = express.Router();

// POST /seed-data - Seed the database with sample data
router.post('/', async (req, res) => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Parcel.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin User
    const adminUser = new User({
      name: 'Admin Manager',
      email: 'admin@parceltracker.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      phone: '+15550100'
    });
    await adminUser.save();
    console.log('👑 Admin user created:', adminUser.email);

    // Create Regular Users
    const users = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: 'password123',
        phone: '+15550101'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        password: 'password123',
        phone: '+15550102'
      },
      {
        name: 'Mike Chen',
        email: 'mike.chen@email.com',
        password: 'password123',
        phone: '+15550103'
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@email.com',
        password: 'password123',
        phone: '+15550104'
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@email.com',
        password: 'password123',
        phone: '+15550105'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log('👤 User created:', user.email);
    }

    // Parcel statuses and types (matching the model requirements)
    const statuses = ['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'];
    const types = ['package', 'document', 'electronics', 'clothing', 'food', 'fragile'];
    const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics'];

    // Sample addresses with Dhaka locations and realistic coordinates
    const addresses = [
      // Dhaka, Bangladesh addresses
      { 
        street: 'House 123, Road 12', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1212', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 456, Road 8', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1207', 
        country: 'Bangladesh',
        latitude: 23.8103,
        longitude: 90.4125
      },
      { 
        street: 'House 789, Road 27', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1213', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 321, Road 15', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1209', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 654, Road 3', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1205', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 987, Road 18', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1211', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 147, Road 22', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1214', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 258, Road 7', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1206', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      }
    ];

    // Create 30 parcels
    const parcels = [];
    for (let i = 1; i <= 30; i++) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
      const randomFromAddress = addresses[Math.floor(Math.random() * addresses.length)];
      const randomToAddress = addresses[Math.floor(Math.random() * addresses.length)];
      
      // Generate random tracking number
      const trackingNumber = `${randomCarrier.substring(0, 3).toUpperCase()}${Date.now()}${i}`;
      
      // Generate random dates
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const estimatedDelivery = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      // Create history entries for the parcel
      const history = [
        {
          location: `${randomFromAddress.city}, ${randomFromAddress.country}`,
          latitude: randomFromAddress.latitude,
          longitude: randomFromAddress.longitude,
          status: 'picked_up',
          timestamp: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
        }
      ];
      
      // Add transit history if not delivered
      if (randomStatus !== 'delivered') {
        history.push({
          location: 'Dhaka Central Hub, Bangladesh',
          latitude: 23.7937,
          longitude: 90.4066,
          status: 'in_transit',
          timestamp: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)
        });
        
        if (randomStatus === 'out_for_delivery') {
          history.push({
            location: `${randomToAddress.city}, ${randomToAddress.country}`,
            latitude: randomToAddress.latitude,
            longitude: randomToAddress.longitude,
            status: 'out_for_delivery',
            timestamp: new Date(estimatedDelivery.getTime() - Math.random() * 24 * 60 * 60 * 1000)
          });
        }
      } else {
        // Add delivery history
        history.push({
          location: `${randomToAddress.city}, ${randomToAddress.country}`,
          latitude: randomToAddress.latitude,
          longitude: randomToAddress.longitude,
          status: 'delivered',
          timestamp: estimatedDelivery
        });
      }
      
      const parcel = new Parcel({
        trackingNumber: trackingNumber,
        user: randomUser._id,
        type: randomType,
        status: randomStatus,
        history: history,
        weight: (Math.random() * 20 + 0.1).toFixed(2),
        dimensions: {
          length: Math.floor(Math.random() * 50) + 10,
          width: Math.floor(Math.random() * 40) + 8,
          height: Math.floor(Math.random() * 30) + 5
        },
        fromAddress: randomFromAddress,
        toAddress: randomToAddress,
        carrier: randomCarrier,
        estimatedDelivery: estimatedDelivery,
        actualDelivery: randomStatus === 'delivered' ? estimatedDelivery : null,
        notes: `Parcel ${i}: ${randomType} package via ${randomCarrier}`,
        isActive: true
      });
      
      await parcel.save();
      parcels.push(parcel);
    }

    // Create some parcels for admin user too
    for (let i = 1; i <= 5; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomCarrier = carriers[Math.floor(Math.random() * carriers.length)];
      const randomFromAddress = addresses[Math.floor(Math.random() * addresses.length)];
      const randomToAddress = addresses[Math.floor(Math.random() * addresses.length)];
      
      const trackingNumber = `ADM${Date.now()}${i}`;
      const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const estimatedDelivery = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      // Create history entries for admin parcel
      const adminHistory = [
        {
          location: `${randomFromAddress.city}, ${randomFromAddress.country}`,
          latitude: randomFromAddress.latitude,
          longitude: randomFromAddress.longitude,
          status: 'picked_up',
          timestamp: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000)
        }
      ];
      
      // Add transit history if not delivered
      if (randomStatus !== 'delivered') {
        adminHistory.push({
          location: 'Dhaka Central Hub, Bangladesh',
          latitude: 23.7937,
          longitude: 90.4066,
          status: 'in_transit',
          timestamp: new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000 + 24 * 60 * 60 * 1000)
        });
        
        if (randomStatus === 'out_for_delivery') {
          adminHistory.push({
            location: `${randomToAddress.city}, ${randomToAddress.country}`,
            latitude: randomToAddress.latitude,
            longitude: randomToAddress.longitude,
            status: 'out_for_delivery',
            timestamp: new Date(estimatedDelivery.getTime() - Math.random() * 24 * 60 * 60 * 1000)
          });
        }
      } else {
        // Add delivery history
        adminHistory.push({
          location: `${randomToAddress.city}, ${randomToAddress.country}`,
          latitude: randomToAddress.latitude,
          longitude: randomToAddress.longitude,
          status: 'delivered',
          timestamp: estimatedDelivery
        });
      }
      
      const adminParcel = new Parcel({
        trackingNumber: trackingNumber,
        user: adminUser._id,
        type: randomType,
        status: randomStatus,
        history: adminHistory,
        weight: (Math.random() * 20 + 0.1).toFixed(2),
        dimensions: {
          length: Math.floor(Math.random() * 50) + 10,
          width: Math.floor(Math.random() * 40) + 8,
          height: Math.floor(Math.random() * 30) + 5
        },
        fromAddress: randomFromAddress,
        toAddress: randomToAddress,
        carrier: randomCarrier,
        estimatedDelivery: estimatedDelivery,
        actualDelivery: randomStatus === 'delivered' ? estimatedDelivery : null,
        notes: `Admin parcel ${i}: ${randomType} package via ${randomCarrier}`,
        isActive: true
      });
      
      await adminParcel.save();
      parcels.push(adminParcel);
    }

    res.status(201).json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        adminUsers: 1,
        regularUsers: createdUsers.length,
        totalParcels: parcels.length,
        adminParcels: 5,
        userParcels: 30
      },
      credentials: {
        admin: 'admin@parceltracker.com / admin123',
        users: 'any email above / password123'
      }
    });
    
  } catch (error) {
    console.error('Error seeding data:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding data',
      error: error.message
    });
  }
});

module.exports = router;
