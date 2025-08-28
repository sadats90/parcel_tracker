const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const { protect, generateToken } = require('../middleware/auth');
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

// POST /api/auth/register - Register a new user
router.post('/register',
  [
    body('name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { name, email, password, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user
      const user = new User({
        name,
        email,
        password,
        phone
      });

      const savedUser = await user.save();

      // Generate token
      const token = generateToken(savedUser._id);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: savedUser.profile,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/auth/login - Login user
router.post('/login',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Update last login
      await user.updateLastLogin();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.profile,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/auth/me - Get current user profile
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user.profile
    }
  });
});

// GET /api/auth/users - Get all users (Admin only)
router.get('/users', requireAdmin, async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true }).select('name email role');
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile',
  protect,
  [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .trim(),
    body('phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please enter a valid phone number')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { name, phone } = req.body;
      const user = await User.findById(req.user._id);

      if (name) user.name = name;
      if (phone) user.phone = phone;

      const updatedUser = await user.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: updatedUser.profile
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/auth/password - Change password
router.put('/password',
  protect,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters')
  ],
  handleValidationErrors,
  async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router; 