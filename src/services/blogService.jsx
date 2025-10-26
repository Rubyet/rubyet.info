import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';

const BLOG_STORAGE_KEY = 'portfolio_blog_posts';
const ANALYTICS_STORAGE_KEY = 'portfolio_blog_analytics';

/**
 * Blog Service - Manages blog posts using localStorage
 */
class BlogService {
  constructor() {
    this.initializeStorage();
  }

  // Initialize storage with sample data if empty
  initializeStorage() {
    if (!localStorage.getItem(BLOG_STORAGE_KEY)) {
      const samplePosts = [
        {
          id: uuidv4(),
          title: 'Getting Started with React and Modern Web Development',
          slug: 'getting-started-with-react',
          content: '<h2>Introduction</h2><p>React has revolutionized the way we build user interfaces...</p>',
          excerpt: 'Learn the fundamentals of React and modern web development practices.',
          coverImage: '/img/post-1.jpg',
          author: 'Rubyet Hossain',
          publishedDate: new Date('2024-01-15').toISOString(),
          status: 'published',
          tags: ['React', 'JavaScript', 'Web Development'],
          seoTitle: 'Getting Started with React - Complete Guide',
          seoDescription: 'Learn React from scratch with this comprehensive guide covering components, hooks, and best practices.',
          views: 1250
        }
      ];
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(samplePosts));
    }

    if (!localStorage.getItem(ANALYTICS_STORAGE_KEY)) {
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify({}));
    }
  }

  // Get all posts (with optional filter)
  getAllPosts(filter = 'all') {
    const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');
    
    if (filter === 'published') {
      return posts.filter(post => post.status === 'published');
    } else if (filter === 'draft') {
      return posts.filter(post => post.status === 'draft');
    }
    
    return posts;
  }

  // Get a single post by slug
  getPostBySlug(slug) {
    const posts = this.getAllPosts();
    return posts.find(post => post.slug === slug);
  }

  // Get a single post by ID
  getPostById(id) {
    const posts = this.getAllPosts();
    return posts.find(post => post.id === id);
  }

  // Create a new post
  createPost(postData) {
    const posts = this.getAllPosts();
    
    const newPost = {
      id: uuidv4(),
      ...postData,
      slug: this.generateUniqueSlug(postData.title),
      publishedDate: postData.status === 'published' ? new Date().toISOString() : null,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.unshift(newPost); // Add to beginning
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    
    return newPost;
  }

  // Update an existing post
  updatePost(id, updateData) {
    const posts = this.getAllPosts();
    const index = posts.findIndex(post => post.id === id);
    
    if (index === -1) {
      throw new Error('Post not found');
    }

    const updatedPost = {
      ...posts[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update slug if title changed
    if (updateData.title && updateData.title !== posts[index].title) {
      updatedPost.slug = this.generateUniqueSlug(updateData.title, id);
    }

    // Set publish date if publishing for first time
    if (updateData.status === 'published' && posts[index].status !== 'published') {
      updatedPost.publishedDate = new Date().toISOString();
    }

    posts[index] = updatedPost;
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    
    return updatedPost;
  }

  // Delete a post
  deletePost(id) {
    const posts = this.getAllPosts();
    const filteredPosts = posts.filter(post => post.id !== id);
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filteredPosts));
    return true;
  }

  // Generate unique slug
  generateUniqueSlug(title, excludeId = null) {
    const baseSlug = slugify(title, { lower: true, strict: true });
    const posts = this.getAllPosts();
    
    let slug = baseSlug;
    let counter = 1;
    
    const checkSlugExists = (slugToCheck) => {
      return posts.some(post => post.slug === slugToCheck && post.id !== excludeId);
    };
    
    while (checkSlugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return slug;
  }

  // Increment view count
  incrementViews(slug) {
    const posts = this.getAllPosts();
    const post = posts.find(p => p.slug === slug);
    
    if (post) {
      post.views = (post.views || 0) + 1;
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
    }
  }

  // Calculate reading time (words per minute: 200)
  calculateReadingTime(content) {
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  }

  // Search posts
  searchPosts(query, status = 'published') {
    const posts = this.getAllPosts(status);
    const lowerQuery = query.toLowerCase();
    
    return posts.filter(post => 
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get posts by tag
  getPostsByTag(tag, status = 'published') {
    const posts = this.getAllPosts(status);
    return posts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  // Get all unique tags
  getAllTags() {
    const posts = this.getAllPosts('published');
    const tagSet = new Set();
    
    posts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    
    return Array.from(tagSet);
  }

  // Get related posts
  getRelatedPosts(slug, limit = 3) {
    const currentPost = this.getPostBySlug(slug);
    if (!currentPost) return [];
    
    const allPosts = this.getAllPosts('published');
    
    // Score posts by matching tags
    const scoredPosts = allPosts
      .filter(post => post.slug !== slug)
      .map(post => {
        const matchingTags = post.tags.filter(tag => 
          currentPost.tags.includes(tag)
        ).length;
        return { ...post, score: matchingTags };
      })
      .filter(post => post.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return scoredPosts;
  }

  // Get statistics
  getStatistics() {
    const allPosts = this.getAllPosts();
    const publishedPosts = this.getAllPosts('published');
    const draftPosts = this.getAllPosts('draft');
    
    const totalViews = publishedPosts.reduce((sum, post) => sum + (post.views || 0), 0);
    
    return {
      total: allPosts.length,
      published: publishedPosts.length,
      drafts: draftPosts.length,
      totalViews,
      tags: this.getAllTags().length
    };
  }

  // Export/Import functionality
  exportPosts() {
    const posts = this.getAllPosts();
    return JSON.stringify(posts, null, 2);
  }

  importPosts(jsonData) {
    try {
      const posts = JSON.parse(jsonData);
      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const blogServiceInstance = new BlogService();

// Export named functions
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

// Also export default for backward compatibility
export default blogServiceInstance;
