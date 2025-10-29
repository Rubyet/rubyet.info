const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const postController = require('../controllers/postController');

// GET routes
router.get('/', asyncHandler(postController.getAllPosts));
router.get('/search', asyncHandler(postController.searchPosts));
router.get('/tag/:tag', asyncHandler(postController.getPostsByTag));
router.get('/id/:id', asyncHandler(postController.getPostById));
router.get('/slug/:slug', asyncHandler(postController.getPostBySlug));
router.get('/:id/related', asyncHandler(postController.getRelatedPosts));

// POST routes
router.post('/', asyncHandler(postController.createPost));
router.post('/:id/view', asyncHandler(postController.incrementViews));

// PUT routes
router.put('/:id', asyncHandler(postController.updatePost));

// DELETE routes
router.delete('/:id', asyncHandler(postController.deletePost));

module.exports = router;
