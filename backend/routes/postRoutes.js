const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const { authenticate, isAdmin } = require('../middleware/auth');
const postController = require('../controllers/postController');

// GET routes
router.get('/', asyncHandler(postController.getAllPosts));
router.get('/search', asyncHandler(postController.searchPosts));
router.get('/tag/:tag', asyncHandler(postController.getPostsByTag));
router.get('/id/:id', asyncHandler(postController.getPostById));
router.get('/slug/:slug', asyncHandler(postController.getPostBySlug));
router.get('/:id/related', asyncHandler(postController.getRelatedPosts));

// POST routes (protected - admin only)
router.post('/', authenticate, isAdmin, asyncHandler(postController.createPost));
router.post('/:id/view', asyncHandler(postController.incrementViews));

// PUT routes (protected - admin only)
router.put('/:id', authenticate, isAdmin, asyncHandler(postController.updatePost));

// DELETE routes (protected - admin only)
router.delete('/:id', authenticate, isAdmin, asyncHandler(postController.deletePost));

module.exports = router;
