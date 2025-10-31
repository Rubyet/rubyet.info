const { v4: uuidv4 } = require('uuid');
const postModel = require('../models/postModel');
const { generateSlug, ensureUniqueSlug, formatDate } = require('../utils/helpers');

/**
 * @desc    Get all posts with optional filter
 * @route   GET /api/posts
 * @access  Public
 */
exports.getAllPosts = async (req, res) => {
  try {
    const { filter } = req.query;
    console.log(`[${new Date().toISOString()}] GET /api/posts - filter: ${filter || 'none'}`);
    const posts = await postModel.findByStatus(filter);
    console.log(`[${new Date().toISOString()}] Successfully retrieved ${posts.length} posts`);
    res.json(posts);
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ Error in getAllPosts:`, error);
    console.error(`[${timestamp}] Error message: ${error.message}`);
    console.error(`[${timestamp}] Stack trace:`, error.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch posts',
      timestamp: timestamp
    });
  }
};

/**
 * @desc    Get single post by ID
 * @route   GET /api/posts/id/:id
 * @access  Public
 */
exports.getPostById = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
};

/**
 * @desc    Get single post by slug
 * @route   GET /api/posts/slug/:slug
 * @access  Public
 */
exports.getPostBySlug = async (req, res) => {
  const post = await postModel.findBySlug(req.params.slug);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(post);
};

/**
 * @desc    Create new post
 * @route   POST /api/posts
 * @access  Private
 */
exports.createPost = async (req, res) => {
  const posts = await postModel.findAll();
  
  const baseSlug = generateSlug(req.body.title);
  const uniqueSlug = ensureUniqueSlug(baseSlug, posts);
  
  const newPost = {
    id: uuidv4(),
    ...req.body,
    slug: uniqueSlug,
    publishedDate: formatDate(),
    updatedDate: formatDate(),
    views: 0
  };
  
  const createdPost = await postModel.create(newPost);
  res.status(201).json(createdPost);
};

/**
 * @desc    Update post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
exports.updatePost = async (req, res) => {
  const posts = await postModel.findAll();
  const index = posts.findIndex(p => p.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  const updates = {
    ...req.body,
    updatedDate: formatDate()
  };
  
  // Update slug if title changed
  if (req.body.title && req.body.title !== posts[index].title) {
    const baseSlug = generateSlug(req.body.title);
    updates.slug = ensureUniqueSlug(baseSlug, posts, index);
  }
  
  const updatedPost = await postModel.update(req.params.id, updates);
  res.json(updatedPost);
};

/**
 * @desc    Delete post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
exports.deletePost = async (req, res) => {
  const success = await postModel.delete(req.params.id);
  
  if (!success) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json({ message: 'Post deleted successfully' });
};

/**
 * @desc    Increment post views
 * @route   POST /api/posts/:id/view
 * @access  Public
 */
exports.incrementViews = async (req, res) => {
  const views = await postModel.incrementViews(req.params.id);
  
  if (views === null) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json({ views });
};

/**
 * @desc    Search posts
 * @route   GET /api/posts/search
 * @access  Public
 */
exports.searchPosts = async (req, res) => {
  const { q, status } = req.query;
  const posts = await postModel.search(q, status);
  res.json(posts);
};

/**
 * @desc    Get posts by tag
 * @route   GET /api/posts/tag/:tag
 * @access  Public
 */
exports.getPostsByTag = async (req, res) => {
  const posts = await postModel.findByTag(req.params.tag);
  res.json(posts);
};

/**
 * @desc    Get all tags
 * @route   GET /api/tags
 * @access  Public
 */
exports.getAllTags = async (req, res) => {
  const tags = await postModel.getTags();
  res.json(tags);
};

/**
 * @desc    Get related posts
 * @route   GET /api/posts/:id/related
 * @access  Public
 */
exports.getRelatedPosts = async (req, res) => {
  const relatedPosts = await postModel.findRelated(req.params.id);
  
  if (relatedPosts === null) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  res.json(relatedPosts);
};

/**
 * @desc    Get post statistics
 * @route   GET /api/statistics
 * @access  Public
 */
exports.getStatistics = async (req, res) => {
  const stats = await postModel.getStatistics();
  res.json(stats);
};

/**
 * @desc    Export all posts
 * @route   GET /api/export
 * @access  Private
 */
exports.exportPosts = async (req, res) => {
  const posts = await postModel.findAll();
  res.json({ posts, exportDate: formatDate() });
};

/**
 * @desc    Import posts
 * @route   POST /api/import
 * @access  Private
 */
exports.importPosts = async (req, res) => {
  const { posts } = req.body;
  
  if (!Array.isArray(posts)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }
  
  await postModel.save(posts);
  res.json({ message: 'Posts imported successfully', count: posts.length });
};
