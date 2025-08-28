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

    // Sample addresses with diverse Dhaka locations and realistic coordinates
    const addresses = [
      // Dhaka, Bangladesh addresses - spread across different areas
      { 
        street: 'House 123, Road 12, Banani', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1213', 
        country: 'Bangladesh',
        latitude: 23.7937,
        longitude: 90.4066
      },
      { 
        street: 'House 456, Road 8, Gulshan', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1212', 
        country: 'Bangladesh',
        latitude: 23.8103,
        longitude: 90.4125
      },
      { 
        street: 'House 789, Road 27, Dhanmondi', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1209', 
        country: 'Bangladesh',
        latitude: 23.7458,
        longitude: 90.3654
      },
      { 
        street: 'House 321, Road 15, Uttara', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1230', 
        country: 'Bangladesh',
        latitude: 23.8700,
        longitude: 90.3800
      },
      { 
        street: 'House 654, Road 3, Mirpur', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1216', 
        country: 'Bangladesh',
        latitude: 23.8000,
        longitude: 90.3500
      },
      { 
        street: 'House 987, Road 18, Mohammadpur', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1207', 
        country: 'Bangladesh',
        latitude: 23.7600,
        longitude: 90.3600
      },
      { 
        street: 'House 147, Road 22, Lalmatia', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1207', 
        country: 'Bangladesh',
        latitude: 23.7500,
        longitude: 90.3700
      },
      { 
        street: 'House 258, Road 7, Tejgaon', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1208', 
        country: 'Bangladesh',
        latitude: 23.7800,
        longitude: 90.4000
      },
      { 
        street: 'House 369, Road 5, Farmgate', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1215', 
        country: 'Bangladesh',
        latitude: 23.7700,
        longitude: 90.3900
      },
      { 
        street: 'House 741, Road 11, Bashundhara', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1229', 
        country: 'Bangladesh',
        latitude: 23.8200,
        longitude: 90.4200
      },
      { 
        street: 'House 852, Road 14, Niketan', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1212', 
        country: 'Bangladesh',
        latitude: 23.7900,
        longitude: 90.4100
      },
      { 
        street: 'House 963, Road 9, Baridhara', 
        city: 'Dhaka', 
        state: 'Dhaka', 
        zipCode: '1212', 
        country: 'Bangladesh',
        latitude: 23.8000,
        longitude: 90.4200
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
         // Add multiple transit points for variety
         const transitPoints = [
           { location: 'Dhaka Central Hub, Bangladesh', lat: 23.7937, lng: 90.4066 },
           { location: 'Dhaka Airport Hub, Bangladesh', lat: 23.8433, lng: 90.3978 },
           { location: 'Dhaka Port Hub, Bangladesh', lat: 23.7000, lng: 90.4000 },
           { location: 'Dhaka Railway Hub, Bangladesh', lat: 23.7300, lng: 90.4100 },
           { location: 'Dhaka Bus Terminal Hub, Bangladesh', lat: 23.7600, lng: 90.3800 }
         ];
         
         // Randomly select transit points
         const randomTransit = transitPoints[Math.floor(Math.random() * transitPoints.length)];
         history.push({
           location: randomTransit.location,
           latitude: randomTransit.lat,
           longitude: randomTransit.lng,
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
         // Add multiple transit points for variety
         const transitPoints = [
           { location: 'Dhaka Central Hub, Bangladesh', lat: 23.7937, lng: 90.4066 },
           { location: 'Dhaka Airport Hub, Bangladesh', lat: 23.8433, lng: 90.3978 },
           { location: 'Dhaka Port Hub, Bangladesh', lat: 23.7000, lng: 90.4000 },
           { location: 'Dhaka Railway Hub, Bangladesh', lat: 23.7300, lng: 90.4100 },
           { location: 'Dhaka Bus Terminal Hub, Bangladesh', lat: 23.7600, lng: 90.3800 }
         ];
         
         // Randomly select transit points
         const randomTransit = transitPoints[Math.floor(Math.random() * transitPoints.length)];
         adminHistory.push({
           location: randomTransit.location,
           latitude: randomTransit.lat,
           longitude: randomTransit.lng,
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
