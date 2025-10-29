/**
 * Generate URL-friendly slug from title
 * @param {string} title - The title to convert to slug
 * @returns {string} URL-friendly slug
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Calculate estimated reading time for content
 * @param {string} content - HTML content to analyze
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} Estimated reading time in minutes
 */
function calculateReadingTime(content, wordsPerMinute = 200) {
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format date to ISO string
 * @param {Date} date - Date object to format
 * @returns {string} ISO formatted date string
 */
function formatDate(date = new Date()) {
  return date.toISOString();
}

/**
 * Ensure unique slug by appending counter if needed
 * @param {string} baseSlug - Base slug to make unique
 * @param {Array} existingItems - Array of items with slug property
 * @param {number} excludeIndex - Index to exclude from uniqueness check
 * @returns {string} Unique slug
 */
function ensureUniqueSlug(baseSlug, existingItems, excludeIndex = -1) {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingItems.some((item, index) => 
    item.slug === slug && index !== excludeIndex
  )) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

module.exports = {
  generateSlug,
  calculateReadingTime,
  formatDate,
  ensureUniqueSlug
};
