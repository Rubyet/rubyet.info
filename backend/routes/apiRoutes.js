const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const postController = require('../controllers/postController');

// Statistics routes
router.get('/statistics', asyncHandler(postController.getStatistics));
router.get('/tags', asyncHandler(postController.getAllTags));

// Import/Export routes
router.get('/export', asyncHandler(postController.exportPosts));
router.post('/import', asyncHandler(postController.importPosts));

module.exports = router;
