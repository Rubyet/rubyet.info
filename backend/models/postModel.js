const fs = require('fs').promises;
const { POSTS_FILE } = require('../config/database');

class PostModel {
  constructor() {
    // In-memory cache
    this.cache = null;
    this.cacheTimestamp = null;
    this.CACHE_TTL = 60000; // Cache for 60 seconds (1 minute)
  }

  /**
   * Check if cache is valid
   * @returns {boolean} Cache validity
   */
  isCacheValid() {
    if (!this.cache || !this.cacheTimestamp) {
      return false;
    }
    return (Date.now() - this.cacheTimestamp) < this.CACHE_TTL;
  }

  /**
   * Invalidate cache (call after write operations)
   */
  invalidateCache() {
    this.cache = null;
    this.cacheTimestamp = null;
  }

  /**
   * Read all posts from file with caching
   * @returns {Promise<Array>} Array of posts
   */
  async findAll() {
    try {
      // Return cached data if valid
      if (this.isCacheValid()) {
        return [...this.cache]; // Return copy to prevent mutations
      }

      // Read from file
      const data = await fs.readFile(POSTS_FILE, 'utf8');
      const posts = JSON.parse(data);
      
      // Update cache
      this.cache = posts;
      this.cacheTimestamp = Date.now();
      
      return [...posts]; // Return copy
    } catch (error) {
      console.error('Error reading posts:', error);
      return [];
    }
  }

  /**
   * Find post by ID
   * @param {string} id - Post ID
   * @returns {Promise<Object|null>} Post object or null
   */
  async findById(id) {
    const posts = await this.findAll();
    return posts.find(p => p.id === id) || null;
  }

  /**
   * Find post by slug
   * @param {string} slug - Post slug
   * @returns {Promise<Object|null>} Post object or null
   */
  async findBySlug(slug) {
    const posts = await this.findAll();
    return posts.find(p => p.slug === slug) || null;
  }

  /**
   * Find posts by filter
   * @param {string} filter - Filter type ('published', 'draft', or 'all')
   * @returns {Promise<Array>} Filtered posts
   */
  async findByStatus(filter = 'all') {
    try {
      let posts = await this.findAll();
      
      if (filter === 'published') {
        posts = posts.filter(post => post.status === 'published');
      } else if (filter === 'draft') {
        posts = posts.filter(post => post.status === 'draft');
      }
      
      // Sort safely with fallback for missing dates
      return posts.sort((a, b) => {
        const dateA = a.publishedDate ? new Date(a.publishedDate) : new Date(0);
        const dateB = b.publishedDate ? new Date(b.publishedDate) : new Date(0);
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error in findByStatus:', error);
      return [];
    }
  }

  /**
   * Search posts
   * @param {string} query - Search query
   * @param {string} status - Post status filter
   * @returns {Promise<Array>} Matching posts
   */
  async search(query, status = 'all') {
    let posts = await this.findAll();
    
    if (status && status !== 'all') {
      posts = posts.filter(post => post.status === status);
    }
    
    if (query) {
      const q = query.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q) ||
        post.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    return posts;
  }

  /**
   * Find posts by tag
   * @param {string} tag - Tag to filter by
   * @returns {Promise<Array>} Posts with the tag
   */
  async findByTag(tag) {
    const posts = await this.findAll();
    return posts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase()) &&
      post.status === 'published'
    );
  }

  /**
   * Find related posts
   * @param {string} id - Post ID
   * @param {number} limit - Maximum number of related posts
   * @returns {Promise<Array>} Related posts
   */
  async findRelated(id, limit = 3) {
    const posts = await this.findAll();
    const currentPost = posts.find(p => p.id === id);
    
    if (!currentPost) {
      return [];
    }
    
    return posts
      .filter(post => 
        post.id !== id &&
        post.status === 'published' &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit);
  }

  /**
   * Get all tags with counts
   * @returns {Promise<Array>} Tags with post counts
   */
  async getTags() {
    const posts = await this.findAll();
    const publishedPosts = posts.filter(post => post.status === 'published');
    
    const tagCounts = {};
    publishedPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get statistics
   * @returns {Promise<Object>} Post statistics
   */
  async getStatistics() {
    const posts = await this.findAll();
    
    return {
      totalPosts: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      drafts: posts.filter(p => p.status === 'draft').length,
      totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0)
    };
  }

  /**
   * Create new post
   * @param {Object} postData - Post data
   * @returns {Promise<Object>} Created post
   */
  async create(postData) {
    const posts = await this.findAll();
    posts.push(postData);
    await this.save(posts);
    return postData;
  }

  /**
   * Update post
   * @param {string} id - Post ID
   * @param {Object} updates - Updated data
   * @returns {Promise<Object|null>} Updated post or null
   */
  async update(id, updates) {
    const posts = await this.findAll();
    const index = posts.findIndex(p => p.id === id);
    
    if (index === -1) {
      return null;
    }
    
    posts[index] = { ...posts[index], ...updates };
    await this.save(posts);
    return posts[index];
  }

  /**
   * Delete post
   * @param {string} id - Post ID
   * @returns {Promise<boolean>} Success status
   */
  async delete(id) {
    const posts = await this.findAll();
    const filteredPosts = posts.filter(p => p.id !== id);
    
    if (filteredPosts.length === posts.length) {
      return false;
    }
    
    await this.save(filteredPosts);
    return true;
  }

  /**
   * Increment post views
   * @param {string} id - Post ID
   * @returns {Promise<number|null>} Updated view count or null
   */
  async incrementViews(id) {
    const posts = await this.findAll();
    const post = posts.find(p => p.id === id);
    
    if (!post) {
      return null;
    }
    
    post.views = (post.views || 0) + 1;
    await this.save(posts);
    return post.views;
  }

  /**
   * Save posts to file
   * @param {Array} posts - Posts array to save
   * @returns {Promise<boolean>} Success status
   */
  async save(posts) {
    try {
      await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
      
      // Invalidate cache after write
      this.invalidateCache();
      
      return true;
    } catch (error) {
      console.error('Error writing posts:', error);
      return false;
    }
  }
}

module.exports = new PostModel();
