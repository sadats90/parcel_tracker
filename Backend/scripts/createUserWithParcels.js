const mongoose = require('mongoose');
const User = require('../models/user');
const Parcel = require('../models/parcel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// New user data
const newUser = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  password: 'password123',
  phone: '+8801712345679'
};

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

// Create user and assign parcels
const createUserWithParcels = async () => {
  try {
    console.log('👤 Creating new user with parcels...');

    // Check if user already exists
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      console.log('⚠️  User already exists:', existingUser.email);
      console.log('📦 Assigning parcels to existing user...');
      
      // Update all parcels to belong to this user
      await Parcel.updateMany({}, { user: existingUser._id });
      console.log('✅ All parcels assigned to existing user');
      
      // Get updated parcels
      const parcels = await Parcel.find({ user: existingUser._id });
      console.log(`📦 Found ${parcels.length} parcels assigned to user`);
      
      console.log('\n🔑 User Credentials:');
      console.log(`Email: ${existingUser.email}`);
      console.log(`Password: ${newUser.password}`);
      
      console.log('\n📍 Tracking Numbers:');
      parcels.forEach((parcel, index) => {
        console.log(`${index + 1}. ${parcel.trackingNumber} - ${parcel.status}`);
      });
      
      process.exit(0);
    }

    // Create new user
    const user = new User(newUser);
    const savedUser = await user.save();
    console.log('✅ Created new user:', savedUser.email);

    // Update all parcels to belong to this user
    await Parcel.updateMany({}, { user: savedUser._id });
    console.log('✅ All parcels assigned to new user');

    // Get updated parcels
    const parcels = await Parcel.find({ user: savedUser._id });
    console.log(`📦 Found ${parcels.length} parcels assigned to user`);

    console.log('\n🎉 User creation completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- User: ${savedUser.name} (${savedUser.email})`);
    console.log(`- Parcels assigned: ${parcels.length}`);

    console.log('\n🔑 User Credentials:');
    console.log(`Email: ${newUser.email}`);
    console.log(`Password: ${newUser.password}`);

    console.log('\n📍 Tracking Numbers:');
    parcels.forEach((parcel, index) => {
      console.log(`${index + 1}. ${parcel.trackingNumber} - ${parcel.status}`);
    });

    console.log('\n💡 You can now:');
    console.log('1. Login with these credentials in the frontend');
    console.log('2. Track any of the parcels listed above');
    console.log('3. View the map with all parcel journeys');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating user with parcels:', error);
    process.exit(1);
  }
};

// Run the script
if (require.main === module) {
  connectDB().then(() => {
    createUserWithParcels();
  });
}

module.exports = { connectDB, createUserWithParcels }; 