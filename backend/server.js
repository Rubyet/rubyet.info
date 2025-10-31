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

// Track server start time
const SERVER_START_TIME = new Date();
const startupLogs = [];

// Helper to log with timestamp
const logWithTimestamp = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  console.log(logMessage);
  startupLogs.push(logMessage);
};

// ==================== MIDDLEWARE ==================
// Trust proxy for LiteSpeed/Passenger compatibility
app.set('trust proxy', true);

// Configure CORS to allow all origins
app.use(cors());
app.use(express.json({ limit: REQUEST_SIZE_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: REQUEST_SIZE_LIMIT }));

// Serve static files from public directory
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ==================== ROUTES ======================

// Root route - serve landing page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Health check with comprehensive info
app.get('/api/health', (req, res) => {
  const now = new Date();
  const uptime = Math.floor((now - SERVER_START_TIME) / 1000); // seconds
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  
  res.json({ 
    status: 'ok', 
    message: 'Blog API is running',
    timestamp: now.toISOString(),
    serverStartTime: SERVER_START_TIME.toISOString(),
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    uptimeSeconds: uptime,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    logs: startupLogs
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
    logWithTimestamp('Starting server initialization...');
    
    // Initialize data files
    logWithTimestamp('Initializing data files...');
    await initializeDataFiles();
    logWithTimestamp('✓ Data files initialized');
    
    // Initialize admin user
    logWithTimestamp('Initializing admin user...');
    await initializeAdmin();
    logWithTimestamp('✓ Admin user initialized');
    
    // Check if running under Passenger (LiteSpeed/Apache)
    if (typeof(PhusionPassenger) !== 'undefined') {
      logWithTimestamp('✓ Running under Passenger - server managed externally');
      PhusionPassenger.on('exit', function() {
        logWithTimestamp('Passenger is shutting down');
      });
    } else {
      // Only call listen() when NOT running under Passenger
      app.listen(PORT, () => {
        logWithTimestamp(`Server listening on port ${PORT}`);
        console.log('\n' + '='.repeat(50));
        console.log('🚀 Blog API Server Started Successfully!');
        console.log('='.repeat(50));
        console.log(`📍 Port: ${PORT}`);
        console.log(`🌐 API URL: http://localhost:${PORT}/api`);
        console.log(`✅ Health Check: http://localhost:${PORT}/api/health`);
        console.log(`⏰ Started at: ${SERVER_START_TIME.toISOString()}`);
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
        console.log('  • POST   /api/auth/reset-password');
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
        logWithTimestamp('Server startup complete!');
      });
    }
    
    logWithTimestamp('✓ Server initialization complete');
  } catch (error) {
    const errorMsg = `Failed to start server: ${error.message}`;
    logWithTimestamp(`❌ ${errorMsg}`);
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  const errorMsg = `Unhandled Promise Rejection: ${err.message}`;
  logWithTimestamp(`❌ ${errorMsg}`);
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  const errorMsg = `Uncaught Exception: ${err.message}`;
  logWithTimestamp(`❌ ${errorMsg}`);
  console.error('❌ Uncaught Exception:', err);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
