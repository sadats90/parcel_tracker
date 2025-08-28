const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Parcel = require('../models/parcel');
const User = require('../models/user');
const { validateTrackingNumber, validateCoordinates } = require('../utils/validation');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// POST /api/parcels - Create a new parcel (Admin only)
router.post('/',
  requireAdmin,
  [
    body('trackingNumber')
      .isLength({ min: 5, max: 20 })
      .withMessage('Tracking number must be between 5 and 20 characters')
      .custom(validateTrackingNumber),
    body('status')
      .isIn(['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'])
      .withMessage('Invalid status'),
    body('initialHistory.location')
      .notEmpty()
      .withMessage('Initial location is required'),
    body('initialHistory.latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('initialHistory.longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('userId')
      .optional()
      .isMongoId()
      .withMessage('Invalid user ID')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { trackingNumber, status, initialHistory, userId } = req.body;

      // Check if parcel with tracking number already exists
      const existingParcel = await Parcel.findOne({ 
        trackingNumber: trackingNumber.toUpperCase() 
      });
      
      if (existingParcel) {
        return res.status(409).json({
          success: false,
          message: 'Parcel with this tracking number already exists'
        });
      }

      // Determine which user should own the parcel
      let parcelOwner = req.user._id;
      if (userId) {
        // Verify the user exists
        const targetUser = await User.findById(userId);
        if (!targetUser) {
          return res.status(404).json({
            success: false,
            message: 'Specified user not found'
          });
        }
        parcelOwner = userId;
      }

      const parcel = new Parcel({
        user: parcelOwner,
        trackingNumber: trackingNumber.toUpperCase(),
        status,
        history: [{
          location: initialHistory.location,
          latitude: initialHistory.latitude,
          longitude: initialHistory.longitude,
          status
        }]
      });

      const savedParcel = await parcel.save();

      res.status(201).json({
        success: true,
        message: 'Parcel created successfully',
        data: savedParcel
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/parcels/:trackingNumber - Get parcel by tracking number
router.get('/:trackingNumber',
  protect,
  [
    param('trackingNumber')
      .isLength({ min: 5, max: 20 })
      .withMessage('Invalid tracking number format')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { trackingNumber } = req.params;
      
      // For admins, allow access to any parcel; for regular users, only their own parcels
      const query = { trackingNumber: trackingNumber.toUpperCase() };
      if (req.user.role !== 'admin') {
        query.user = req.user._id;
      }
      
      const parcel = await Parcel.findOne(query);

      if (!parcel) {
        return res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
      }

      res.json({
        success: true,
        data: parcel
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/parcels/:id/status - Add new status update to parcel's history
router.put('/:id/status',
  protect,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid parcel ID'),
    body('status')
      .isIn(['picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned'])
      .withMessage('Invalid status'),
    body('location')
      .notEmpty()
      .withMessage('Location is required'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, location, latitude, longitude } = req.body;

      // For admins, allow updating any parcel; for regular users, only their own parcels
      const query = { _id: id };
      if (req.user.role !== 'admin') {
        query.user = req.user._id;
      }
      
      const parcel = await Parcel.findOne(query);

      if (!parcel) {
        return res.status(404).json({
          success: false,
          message: 'Parcel not found'
        });
      }

      // Add new history entry
      parcel.history.push({
        location,
        latitude,
        longitude,
        status
      });

      const updatedParcel = await parcel.save();

      res.json({
        success: true,
        message: 'Status updated successfully',
        data: updatedParcel
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/parcels - List all parcels (with pagination)
router.get('/', protect, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const skip = (page - 1) * limit;

    // Build query - admins can see all parcels, regular users only their own
    const query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    if (status) {
      query.status = status;
    }

    const parcels = await Parcel.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Parcel.countDocuments(query);

    res.json({
      success: true,
      data: {
        parcels,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalParcels: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;