// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Helper function to handle API requests
 */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * Blog Service - Manages blog posts via backend API
 */
class BlogService {
  /**
   * Get all posts with optional filter
   */
  async getAllPosts(filter = 'all') {
    const params = filter !== 'all' ? `?filter=${filter}` : '';
    return await apiRequest(`/posts${params}`);
  }

  /**
   * Get a single post by slug
   */
  async getPostBySlug(slug) {
    return await apiRequest(`/posts/slug/${slug}`);
  }

  /**
   * Get a single post by ID
   */
  async getPostById(id) {
    return await apiRequest(`/posts/id/${id}`);
  }

  /**
   * Create a new post
   */
  async createPost(postData) {
    return await apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * Update an existing post
   */
  async updatePost(id, updates) {
    return await apiRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a post
   */
  async deletePost(id) {
    return await apiRequest(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Generate a unique slug from title
   */
  async generateUniqueSlug(title, excludeId = null) {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      try {
        const existingPost = await this.getPostBySlug(slug);
        if (!existingPost || (excludeId && existingPost.id === excludeId)) {
          break;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
      } catch (error) {
        // Post not found, slug is available
        break;
      }
    }
    
    return slug;
  }

  /**
   * Increment view count for a post
   */
  async incrementViews(slug) {
    try {
      return await apiRequest(`/posts/slug/${slug}/increment-views`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to increment views:', error);
    }
  }

  /**
   * Calculate reading time based on content
   */
  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const text = content.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  }

  /**
   * Search posts by query
   */
  async searchPosts(query, status = 'published') {
    const params = new URLSearchParams({ q: query });
    if (status !== 'all') {
      params.append('status', status);
    }
    return await apiRequest(`/posts/search?${params.toString()}`);
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tag, status = 'published') {
    const params = status !== 'all' ? `?status=${status}` : '';
    return await apiRequest(`/posts/tag/${tag}${params}`);
  }

  /**
   * Get all unique tags
   */
  async getAllTags() {
    return await apiRequest('/tags');
  }

  /**
   * Get related posts for a given post
   */
  async getRelatedPosts(slug, limit = 3) {
    return await apiRequest(`/posts/${slug}/related?limit=${limit}`);
  }

  /**
   * Get blog statistics
   */
  async getStatistics() {
    return await apiRequest('/statistics');
  }

  /**
   * Export all posts as JSON
   */
  async exportPosts() {
    const data = await apiRequest('/export');
    
    // Download as JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blog-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return data;
  }

  /**
   * Import posts from JSON file or data
   */
  async importPosts(fileOrData) {
    try {
      let data;
      
      if (fileOrData instanceof File) {
        const text = await fileOrData.text();
        data = JSON.parse(text);
      } else if (typeof fileOrData === 'string') {
        data = JSON.parse(fileOrData);
      } else {
        data = fileOrData;
      }
      
      return await apiRequest('/import', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }

  /**
   * Upload image to backend
   */
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  }

  /**
   * Get AI suggestions for blog content
   */
  async getAISuggestions(type, data) {
    try {
      return await apiRequest('/ai/suggestions', {
        method: 'POST',
        body: JSON.stringify({ type, data }),
      });
    } catch (error) {
      console.error('AI suggestions failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
const blogServiceInstance = new BlogService();

// Export named functions for convenience
export const getAllPosts = (filter) => blogServiceInstance.getAllPosts(filter);
export const getPostBySlug = (slug) => blogServiceInstance.getPostBySlug(slug);
export const getPostById = (id) => blogServiceInstance.getPostById(id);
export const createPost = (postData) => blogServiceInstance.createPost(postData);
export const updatePost = (id, updateData) => blogServiceInstance.updatePost(id, updateData);
export const deletePost = (id) => blogServiceInstance.deletePost(id);
export const generateUniqueSlug = (title, excludeId) => blogServiceInstance.generateUniqueSlug(title, excludeId);
export const incrementViews = (slug) => blogServiceInstance.incrementViews(slug);
export const calculateReadingTime = (content) => blogServiceInstance.calculateReadingTime(content);
export const searchPosts = (query, status) => blogServiceInstance.searchPosts(query, status);
export const getPostsByTag = (tag, status) => blogServiceInstance.getPostsByTag(tag, status);
export const getAllTags = () => blogServiceInstance.getAllTags();
export const getRelatedPosts = (slug, limit) => blogServiceInstance.getRelatedPosts(slug, limit);
export const getStatistics = () => blogServiceInstance.getStatistics();
export const exportPosts = () => blogServiceInstance.exportPosts();
export const importPosts = (jsonData) => blogServiceInstance.importPosts(jsonData);
export const uploadImage = (file) => blogServiceInstance.uploadImage(file);
export const getAISuggestions = (type, data) => blogServiceInstance.getAISuggestions(type, data);

// Export default instance
export default blogServiceInstance;
