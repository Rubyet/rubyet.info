const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { PORT, REQUEST_SIZE_LIMIT } = require('./config/constants');
const { initializeDataFiles } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const postRoutes = require('./routes/postRoutes');
const contactRoutes = require('./routes/contactRoutes');
const apiRoutes = require('./routes/apiRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');
const { initializeAdmin } = require('./controllers/authController');

const app = express();

// ==================== MIDDLEWARE ==================
app.use(cors());
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_SIZE_LIMIT }));

// ==================== ROUTES ======================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Blog API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/posts', postRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// ==================== ERROR HANDLING ====================
app.use(notFound);
app.use(errorHandler);

// ==================== SERVER STARTUP ====================
async function startServer() {
  try {
    // Initialize data files
    await initializeDataFiles();
    
    // Initialize admin user
    await initializeAdmin();
    
    // Start server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Blog API Server Started Successfully!');
      console.log('='.repeat(50));
      console.log(`📍 Port: ${PORT}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50) + '\n');
      console.log('📝 Available Endpoints:');
      console.log('  • GET    /api/posts');
      console.log('  • GET    /api/posts/id/:id');
      console.log('  • GET    /api/posts/slug/:slug');
      console.log('  • POST   /api/posts');
      console.log('  • PUT    /api/posts/:id');
      console.log('  • DELETE /api/posts/:id');
      console.log('  • GET    /api/contacts');
      console.log('  • POST   /api/contacts');
      console.log('  • GET    /api/statistics');
      console.log('  • GET    /api/tags');
      console.log('\n🔐 Auth Endpoints:');
      console.log('  • POST   /api/auth/login');
      console.log('  • GET    /api/auth/verify');
      console.log('  • GET    /api/auth/me');
      console.log('  • POST   /api/auth/change-password');
      console.log('\n🤖 AI Endpoints:');
      console.log('  • POST   /api/ai/improve-title');
      console.log('  • POST   /api/ai/generate-excerpt');
      console.log('  • POST   /api/ai/help-content');
      console.log('  • POST   /api/ai/suggest-tags');
      console.log('  • POST   /api/ai/generate-seo');
      console.log('='.repeat(50) + '\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
