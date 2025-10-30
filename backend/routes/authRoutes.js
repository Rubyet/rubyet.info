const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  login,
  verifyTokenController,
  changePassword,
  getCurrentUser
} = require('../controllers/authController');

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.get('/verify', authenticate, verifyTokenController);
router.get('/me', authenticate, getCurrentUser);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
