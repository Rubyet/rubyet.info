/**
 * AI Routes - Routes for AI-powered content generation
 */

const express = require('express');
const router = express.Router();
const {
  improveTitle,
  generateExcerpt,
  helpContent,
  suggestTags,
  generateSEO
} = require('../controllers/aiController');

// AI Content Generation Routes
router.post('/improve-title', improveTitle);
router.post('/generate-excerpt', generateExcerpt);
router.post('/help-content', helpContent);
router.post('/suggest-tags', suggestTags);
router.post('/generate-seo', generateSEO);

module.exports = router;
