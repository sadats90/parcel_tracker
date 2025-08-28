const mongoose = require('mongoose');
const User = require('../models/user');
const Parcel = require('../models/parcel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Dhaka city locations with coordinates
const dhakaLocations = [
  {
    name: 'Gulshan-1',
    latitude: 23.7937,
    longitude: 90.4066
  },
  {
    name: 'Banani',
    latitude: 23.7937,
    longitude: 90.4066
  },
  {
    name: 'Dhanmondi',
    latitude: 23.7465,
    longitude: 90.3706
  },
  {
    name: 'Mirpur',
    latitude: 23.8067,
    longitude: 90.3683
  },
  {
    name: 'Uttara',
    latitude: 23.8709,
    longitude: 90.3753
  },
  {
    name: 'Motijheel',
    latitude: 23.7289,
    longitude: 90.4154
  },
  {
    name: 'Lalbagh',
    latitude: 23.7183,
    longitude: 90.3956
  },
  {
    name: 'Old Dhaka',
    latitude: 23.7104,
    longitude: 90.4074
  },
  {
    name: 'Shahbagh',
    latitude: 23.7371,
    longitude: 90.3714
  },
  {
    name: 'Farmgate',
    latitude: 23.7539,
    longitude: 90.3811
  }
];

// Test user data
const testUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'password123',
  phone: '+8801712345678',
  role: 'admin'
};

// Parcel data with different stages
const parcels = [
  {
    trackingNumber: 'TRK001234567',
    status: 'delivered',
    history: [
      {
        location: 'Gulshan-1 Sorting Center',
        latitude: 23.7937,
        longitude: 90.4066,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        location: 'Banani Transit Hub',
        latitude: 23.7937,
        longitude: 90.4066,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
      },
      {
        location: 'Dhanmondi Distribution Center',
        latitude: 23.7465,
        longitude: 90.3706,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        location: 'Mirpur Local Office',
        latitude: 23.8067,
        longitude: 90.3683,
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        location: 'Uttara Delivery Point',
        latitude: 23.8709,
        longitude: 90.3753,
        status: 'delivered',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ]
  },
  {
    trackingNumber: 'TRK002345678',
    status: 'out_for_delivery',
    history: [
      {
        location: 'Motijheel Central Hub',
        latitude: 23.7289,
        longitude: 90.4154,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        location: 'Lalbagh Processing Center',
        latitude: 23.7183,
        longitude: 90.3956,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        location: 'Old Dhaka Transit Point',
        latitude: 23.7104,
        longitude: 90.4074,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        location: 'Shahbagh Local Office',
        latitude: 23.7371,
        longitude: 90.3714,
        status: 'out_for_delivery',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ]
  },
  {
    trackingNumber: 'TRK003456789',
    status: 'in_transit',
    history: [
      {
        location: 'Farmgate Collection Point',
        latitude: 23.7539,
        longitude: 90.3811,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        location: 'Gulshan-1 Sorting Center',
        latitude: 23.7937,
        longitude: 90.4066,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        location: 'Banani Transit Hub',
        latitude: 23.7937,
        longitude: 90.4066,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      }
    ]
  },
  {
    trackingNumber: 'TRK004567890',
    status: 'exception',
    history: [
      {
        location: 'Dhanmondi Collection Center',
        latitude: 23.7465,
        longitude: 90.3706,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
      },
      {
        location: 'Mirpur Processing Hub',
        latitude: 23.8067,
        longitude: 90.3683,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        location: 'Uttara Distribution Center',
        latitude: 23.8709,
        longitude: 90.3753,
        status: 'in_transit',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        location: 'Motijheel Local Office',
        latitude: 23.7289,
        longitude: 90.4154,
        status: 'exception',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ]
  },
  {
    trackingNumber: 'TRK005678901',
    status: 'picked_up',
    history: [
      {
        location: 'Lalbagh Collection Point',
        latitude: 23.7183,
        longitude: 90.3956,
        status: 'picked_up',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      }
    ]
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/parcel-tracker');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Parcel.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create test user
    const user = new User(testUser);
    const savedUser = await user.save();
    console.log('✅ Created test user:', savedUser.email);

    // Create parcels
    const createdParcels = [];
    for (const parcelData of parcels) {
      const parcel = new Parcel({
        user: savedUser._id,
        ...parcelData
      });
      const savedParcel = await parcel.save();
      createdParcels.push(savedParcel);
      console.log(`✅ Created parcel: ${savedParcel.trackingNumber}`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- User: ${savedUser.name} (${savedUser.email})`);
    console.log(`- Parcels created: ${createdParcels.length}`);
    console.log('\n📦 Parcel Details:');
    createdParcels.forEach((parcel, index) => {
      console.log(`${index + 1}. ${parcel.trackingNumber} - ${parcel.status}`);
    });

    console.log('\n🔑 Test Credentials:');
    console.log(`Email: ${testUser.email}`);
    console.log(`Password: ${testUser.password}`);

    console.log('\n📍 Tracking Numbers for Testing:');
    createdParcels.forEach((parcel, index) => {
      console.log(`${index + 1}. ${parcel.trackingNumber}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { connectDB, seedDatabase }; 