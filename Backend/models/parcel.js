const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required'],
    min: [-90, 'Latitude must be between -90 and 90'],
    max: [90, 'Latitude must be between -90 and 90']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required'],
    min: [-180, 'Longitude must be between -180 and 180'],
    max: [180, 'Longitude must be between -180 and 180']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'],
      message: 'Status must be one of: picked_up, in_transit, out_for_delivery, delivered, exception, returned'
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true
});

const parcelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  trackingNumber: {
    type: String,
    required: [true, 'Tracking number is required'],
    unique: true,
    trim: true,
    uppercase: true,
    minlength: [5, 'Tracking number must be at least 5 characters'],
    maxlength: [20, 'Tracking number cannot exceed 20 characters']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'],
      message: 'Status must be one of: picked_up, in_transit, out_for_delivery, delivered, exception, returned'
    }
  },
  history: {
    type: [historySchema],
    validate: {
      validator: function(history) {
        return history && history.length > 0;
      },
      message: 'Parcel must have at least one history entry'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted tracking number
parcelSchema.virtual('formattedTrackingNumber').get(function() {
  return this.trackingNumber.replace(/(.{4})/g, '$1-').slice(0, -1);
});

// Virtual for current location
parcelSchema.virtual('currentLocation').get(function() {
  if (this.history && this.history.length > 0) {
    const latest = this.history[this.history.length - 1];
    return {
      location: latest.location,
      latitude: latest.latitude,
      longitude: latest.longitude,
      timestamp: latest.timestamp
    };
  }
  return null;
});

// Pre-save middleware to update status based on latest history
parcelSchema.pre('save', function(next) {
  if (this.history && this.history.length > 0) {
    const latestHistory = this.history[this.history.length - 1];
    this.status = latestHistory.status;
  }
  next();
});

// Index for better query performance
parcelSchema.index({ user: 1 });
parcelSchema.index({ trackingNumber: 1 });
parcelSchema.index({ status: 1 });
parcelSchema.index({ 'history.timestamp': -1 });

module.exports = mongoose.model('Parcel', parcelSchema);