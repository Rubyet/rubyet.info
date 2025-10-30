const fs = require('fs').promises;
const path = require('path');
const { comparePassword, generateToken, createAdminCredentials } = require('../utils/auth');

const ADMIN_FILE = path.join(__dirname, '..', 'data', 'admin.json');

/**
 * Initialize admin user if not exists
 */
const initializeAdmin = async () => {
  try {
    // Check if admin file exists
    try {
      await fs.access(ADMIN_FILE);
      console.log('✅ Admin credentials file exists');
    } catch {
      // Create default admin user
      console.log('📝 Creating default admin user...');
      const defaultAdmin = await createAdminCredentials(
        'admin',
        'Admin@2024!', // Strong default password - CHANGE THIS!
        'admin@rubyet.info'
      );
      
      await fs.writeFile(ADMIN_FILE, JSON.stringify(defaultAdmin, null, 2));
      console.log('✅ Default admin user created');
      console.log('⚠️  Username: admin');
      console.log('⚠️  Password: Admin@2024! (CHANGE THIS IMMEDIATELY!)');
    }
  } catch (error) {
    console.error('❌ Error initializing admin:', error);
  }
};

/**
 * Login controller
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Read admin credentials
    const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf8'));

    // Check username
    if (adminData.username !== username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, adminData.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = generateToken({
      username: adminData.username,
      email: adminData.email,
      role: adminData.role
    });

    // Return success response
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        username: adminData.username,
        email: adminData.email,
        role: adminData.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
};

/**
 * Verify token controller
 */
const verifyTokenController = async (req, res) => {
  // If we reach here, the authenticate middleware has already verified the token
  res.json({
    success: true,
    user: req.user
  });
};

/**
 * Change password controller
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Read admin credentials
    const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf8'));

    // Verify current password
    const isValidPassword = await comparePassword(currentPassword, adminData.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    adminData.password = hashedPassword;
    adminData.passwordChangedAt = new Date().toISOString();

    // Save to file
    await fs.writeFile(ADMIN_FILE, JSON.stringify(adminData, null, 2));

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while changing password'
    });
  }
};

/**
 * Get current user info
 */
const getCurrentUser = async (req, res) => {
  try {
    const adminData = JSON.parse(await fs.readFile(ADMIN_FILE, 'utf8'));
    
    res.json({
      success: true,
      user: {
        username: adminData.username,
        email: adminData.email,
        role: adminData.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user info'
    });
  }
};

module.exports = {
  initializeAdmin,
  login,
  verifyTokenController,
  changePassword,
  getCurrentUser
};
