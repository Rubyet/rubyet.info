const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { authenticate } = require('../middleware/auth');
const {
  login,
  verifyTokenController,
  changePassword,
  getCurrentUser,
  resetPassword
} = require('../controllers/authController');

// Rate limiter for login attempts (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for password reset (3 attempts per 15 minutes)
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts
  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes with rate limiting
router.post('/login', loginLimiter, login);
router.post('/reset-password', resetLimiter, resetPassword);

// Protected routes (require authentication)
router.get('/verify', authenticate, verifyTokenController);
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
