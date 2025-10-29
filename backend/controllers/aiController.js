/**
 * AI Controller - Handles AI-powered content generation requests
 */

const asyncHandler = require('../middleware/asyncHandler');
const aiService = require('../services/aiService');

/**
 * @route   POST /api/ai/improve-title
 * @desc    Improve blog post title
 * @access  Private (should be protected with auth in production)
 */
const improveTitle = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim().length === 0) {
    res.status(400);
    throw new Error('Title is required');
  }

  const improvedTitle = await aiService.improveTitle(title);

  res.json({
    success: true,
    original: title,
    improved: improvedTitle
  });
});

/**
 * @route   POST /api/ai/generate-excerpt
 * @desc    Generate excerpt from content
 * @access  Private
 */
const generateExcerpt = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const excerpt = await aiService.generateExcerpt(title, content);

  res.json({
    success: true,
    excerpt
  });
});

/**
 * @route   POST /api/ai/help-content
 * @desc    Get AI help with content
 * @access  Private
 */
const helpContent = asyncHandler(async (req, res) => {
  const { topic, currentContent } = req.body;

  if (!topic || topic.trim().length === 0) {
    res.status(400);
    throw new Error('Topic is required');
  }

  const content = await aiService.helpWithContent(topic, currentContent || '');

  res.json({
    success: true,
    content
  });
});

/**
 * @route   POST /api/ai/suggest-tags
 * @desc    Suggest tags for blog post
 * @access  Private
 */
const suggestTags = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const tags = await aiService.suggestTags(title, content);

  res.json({
    success: true,
    tags
  });
});

/**
 * @route   POST /api/ai/generate-seo
 * @desc    Generate SEO metadata
 * @access  Private
 */
const generateSEO = asyncHandler(async (req, res) => {
  const { title, content, excerpt } = req.body;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const seo = await aiService.generateSEO(title, content, excerpt || '');

  res.json({
    success: true,
    ...seo
  });
});

module.exports = {
  improveTitle,
  generateExcerpt,
  helpContent,
  suggestTags,
  generateSEO
};
