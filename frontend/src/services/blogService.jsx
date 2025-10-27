// API Configuration// API Configurationimport { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';import slugify from 'slugify';

/**

 * Blog Service - Manages blog posts via backend API

 */

/**const BLOG_STORAGE_KEY = 'portfolio_blog_posts';

// Helper function to handle API requests

async function apiRequest(endpoint, options = {}) { * Blog Service - Manages blog posts via backend APIconst ANALYTICS_STORAGE_KEY = 'portfolio_blog_analytics';

  try {

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { */

      headers: {

        'Content-Type': 'application/json',/**

        ...options.headers,

      },// Helper function to handle API requests * Blog Service - Manages blog posts using localStorage

      ...options,

    });async function apiRequest(endpoint, options = {}) { */



    if (!response.ok) {  try {class BlogService {

      throw new Error(`API Error: ${response.statusText}`);

    }    const response = await fetch(`${API_BASE_URL}${endpoint}`, {  constructor() {



    return await response.json();      headers: {    this.initializeStorage();

  } catch (error) {

    console.error('API Request failed:', error);        'Content-Type': 'application/json',  }

    throw error;

  }        ...options.headers,

}

      },  // Initialize storage with sample data if empty

// Get all posts (with optional filter)

export async function getAllPosts(filter = 'all') {      ...options,  initializeStorage() {

  const params = filter !== 'all' ? `?filter=${filter}` : '';

  return await apiRequest(`/posts${params}`);    });    if (!localStorage.getItem(BLOG_STORAGE_KEY)) {

}

      const samplePosts = [

// Get post by ID

export async function getPostById(id) {    if (!response.ok) {        {

  return await apiRequest(`/posts/id/${id}`);

}      throw new Error(`API Error: ${response.statusText}`);          id: uuidv4(),



// Get post by slug    }          title: 'Getting Started with React and Modern Web Development',

export async function getPostBySlug(slug) {

  return await apiRequest(`/posts/slug/${slug}`);          slug: 'getting-started-with-react',

}

    return await response.json();          content: '<h2>Introduction</h2><p>React has revolutionized the way we build user interfaces...</p>',

// Create new post

export async function createPost(postData) {  } catch (error) {          excerpt: 'Learn the fundamentals of React and modern web development practices.',

  return await apiRequest('/posts', {

    method: 'POST',    console.error('API Request failed:', error);          coverImage: '/img/post-1.jpg',

    body: JSON.stringify(postData),

  });    throw error;          author: 'Rubyet Hossain',

}

  }          publishedDate: new Date('2024-01-15').toISOString(),

// Update post

export async function updatePost(id, updates) {}          status: 'published',

  return await apiRequest(`/posts/${id}`, {

    method: 'PUT',          tags: ['React', 'JavaScript', 'Web Development'],

    body: JSON.stringify(updates),

  });// Get all posts (with optional filter)          seoTitle: 'Getting Started with React - Complete Guide',

}

export async function getAllPosts(filter = 'all') {          seoDescription: 'Learn React from scratch with this comprehensive guide covering components, hooks, and best practices.',

// Delete post

export async function deletePost(id) {  const params = filter !== 'all' ? `?filter=${filter}` : '';          views: 1250

  return await apiRequest(`/posts/${id}`, {

    method: 'DELETE',  return await apiRequest(`/posts${params}`);        }

  });

}}      ];



// Increment post views      localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(samplePosts));

export async function incrementViews(id) {

  return await apiRequest(`/posts/${id}/view`, {// Get post by ID    }

    method: 'POST',

  });export async function getPostById(id) {

}

  return await apiRequest(`/posts/id/${id}`);    if (!localStorage.getItem(ANALYTICS_STORAGE_KEY)) {

// Search posts

export async function searchPosts(query, status = 'all') {}      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify({}));

  const params = new URLSearchParams();

  if (query) params.append('q', query);    }

  if (status !== 'all') params.append('status', status);

  return await apiRequest(`/posts/search?${params.toString()}`);// Get post by slug  }

}

export async function getPostBySlug(slug) {

// Get posts by tag

export async function getPostsByTag(tag) {  return await apiRequest(`/posts/slug/${slug}`);  // Get all posts (with optional filter)

  return await apiRequest(`/posts/tag/${tag}`);

}}  getAllPosts(filter = 'all') {



// Get all tags    const posts = JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || '[]');

export async function getAllTags() {

  return await apiRequest('/tags');// Create new post    

}

export async function createPost(postData) {    if (filter === 'published') {

// Get related posts

export async function getRelatedPosts(postId) {  return await apiRequest('/posts', {      return posts.filter(post => post.status === 'published');

  return await apiRequest(`/posts/${postId}/related`);

}    method: 'POST',    } else if (filter === 'draft') {



// Get statistics    body: JSON.stringify(postData),      return posts.filter(post => post.status === 'draft');

export async function getStatistics() {

  return await apiRequest('/statistics');  });    }

}

}    

// Export posts

export async function exportPosts() {    return posts;

  const data = await apiRequest('/export');

  // Update post  }

  // Download as JSON file

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });export async function updatePost(id, updates) {

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');  return await apiRequest(`/posts/${id}`, {  // Get a single post by slug

  a.href = url;

  a.download = `blog-export-${new Date().toISOString().split('T')[0]}.json`;    method: 'PUT',  getPostBySlug(slug) {

  document.body.appendChild(a);

  a.click();    body: JSON.stringify(updates),    const posts = this.getAllPosts();

  document.body.removeChild(a);

  URL.revokeObjectURL(url);  });    return posts.find(post => post.slug === slug);

  

  return data;}  }

}



// Import posts

export async function importPosts(fileOrData) {// Delete post  // Get a single post by ID

  let posts;

  export async function deletePost(id) {  getPostById(id) {

  if (fileOrData instanceof File) {

    const text = await fileOrData.text();  return await apiRequest(`/posts/${id}`, {    const posts = this.getAllPosts();

    const data = JSON.parse(text);

    posts = data.posts || data;    method: 'DELETE',    return posts.find(post => post.id === id);

  } else {

    posts = fileOrData.posts || fileOrData;  });  }

  }

  }

  return await apiRequest('/import', {

    method: 'POST',  // Create a new post

    body: JSON.stringify({ posts }),

  });// Increment post views  createPost(postData) {

}

export async function incrementViews(id) {    const posts = this.getAllPosts();

// Calculate reading time (client-side utility)

export function calculateReadingTime(content) {  return await apiRequest(`/posts/${id}/view`, {    

  const wordsPerMinute = 200;

  const text = content.replace(/<[^>]*>/g, '');    method: 'POST',    const newPost = {

  const wordCount = text.split(/\s+/).length;

  return Math.ceil(wordCount / wordsPerMinute);  });      id: uuidv4(),

}

}      ...postData,

// Generate unique slug (client-side utility)

export function generateUniqueSlug(title, existingSlugs = []) {      slug: this.generateUniqueSlug(postData.title),

  let slug = title

    .toLowerCase()// Search posts      publishedDate: postData.status === 'published' ? new Date().toISOString() : null,

    .replace(/[^a-z0-9]+/g, '-')

    .replace(/(^-|-$)/g, '');export async function searchPosts(query, status = 'all') {      views: 0,

  

  let counter = 1;  const params = new URLSearchParams();      createdAt: new Date().toISOString(),

  let uniqueSlug = slug;

    if (query) params.append('q', query);      updatedAt: new Date().toISOString()

  while (existingSlugs.includes(uniqueSlug)) {

    uniqueSlug = `${slug}-${counter}`;  if (status !== 'all') params.append('status', status);    };

    counter++;

  }  return await apiRequest(`/posts/search?${params.toString()}`);

  

  return uniqueSlug;}    posts.unshift(newPost); // Add to beginning

}

    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));

export default {

  getAllPosts,// Get posts by tag    

  getPostById,

  getPostBySlug,export async function getPostsByTag(tag) {    return newPost;

  createPost,

  updatePost,  return await apiRequest(`/posts/tag/${tag}`);  }

  deletePost,

  incrementViews,}

  searchPosts,

  getPostsByTag,  // Update an existing post

  getAllTags,

  getRelatedPosts,// Get all tags  updatePost(id, updateData) {

  getStatistics,

  exportPosts,export async function getAllTags() {    const posts = this.getAllPosts();

  importPosts,

  calculateReadingTime,  return await apiRequest('/tags');    const index = posts.findIndex(post => post.id === id);

  generateUniqueSlug,

};}    


    if (index === -1) {

// Get related posts      throw new Error('Post not found');

export async function getRelatedPosts(postId) {    }

  return await apiRequest(`/posts/${postId}/related`);

}    const updatedPost = {

      ...posts[index],

// Get statistics      ...updateData,

export async function getStatistics() {      updatedAt: new Date().toISOString()

  return await apiRequest('/statistics');    };

}

    // Update slug if title changed

// Export posts    if (updateData.title && updateData.title !== posts[index].title) {

export async function exportPosts() {      updatedPost.slug = this.generateUniqueSlug(updateData.title, id);

  const data = await apiRequest('/export');    }

  

  // Download as JSON file    // Set publish date if publishing for first time

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });    if (updateData.status === 'published' && posts[index].status !== 'published') {

  const url = URL.createObjectURL(blob);      updatedPost.publishedDate = new Date().toISOString();

  const a = document.createElement('a');    }

  a.href = url;

  a.download = `blog-export-${new Date().toISOString().split('T')[0]}.json`;    posts[index] = updatedPost;

  document.body.appendChild(a);    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));

  a.click();    

  document.body.removeChild(a);    return updatedPost;

  URL.revokeObjectURL(url);  }

  

  return data;  // Delete a post

}  deletePost(id) {

    const posts = this.getAllPosts();

// Import posts    const filteredPosts = posts.filter(post => post.id !== id);

export async function importPosts(fileOrData) {    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(filteredPosts));

  let posts;    return true;

    }

  if (fileOrData instanceof File) {

    const text = await fileOrData.text();  // Generate unique slug

    const data = JSON.parse(text);  generateUniqueSlug(title, excludeId = null) {

    posts = data.posts || data;    const baseSlug = slugify(title, { lower: true, strict: true });

  } else {    const posts = this.getAllPosts();

    posts = fileOrData.posts || fileOrData;    

  }    let slug = baseSlug;

      let counter = 1;

  return await apiRequest('/import', {    

    method: 'POST',    const checkSlugExists = (slugToCheck) => {

    body: JSON.stringify({ posts }),      return posts.some(post => post.slug === slugToCheck && post.id !== excludeId);

  });    };

}    

    while (checkSlugExists(slug)) {

// Calculate reading time (client-side utility)      slug = `${baseSlug}-${counter}`;

export function calculateReadingTime(content) {      counter++;

  const wordsPerMinute = 200;    }

  const text = content.replace(/<[^>]*>/g, '');    

  const wordCount = text.split(/\s+/).length;    return slug;

  return Math.ceil(wordCount / wordsPerMinute);  }

}

  // Increment view count

// Generate unique slug (client-side utility)  incrementViews(slug) {

export function generateUniqueSlug(title, existingSlugs = []) {    const posts = this.getAllPosts();

  let slug = title    const post = posts.find(p => p.slug === slug);

    .toLowerCase()    

    .replace(/[^a-z0-9]+/g, '-')    if (post) {

    .replace(/(^-|-$)/g, '');      post.views = (post.views || 0) + 1;

        localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));

  let counter = 1;    }

  let uniqueSlug = slug;  }

  

  while (existingSlugs.includes(uniqueSlug)) {  // Calculate reading time (words per minute: 200)

    uniqueSlug = `${slug}-${counter}`;  calculateReadingTime(content) {

    counter++;    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags

  }    const words = text.trim().split(/\s+/).length;

      const minutes = Math.ceil(words / 200);

  return uniqueSlug;    return minutes;

}  }



export default {  // Search posts

  getAllPosts,  searchPosts(query, status = 'published') {

  getPostById,    const posts = this.getAllPosts(status);

  getPostBySlug,    const lowerQuery = query.toLowerCase();

  createPost,    

  updatePost,    return posts.filter(post => 

  deletePost,      post.title.toLowerCase().includes(lowerQuery) ||

  incrementViews,      post.excerpt.toLowerCase().includes(lowerQuery) ||

  searchPosts,      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))

  getPostsByTag,    );

  getAllTags,  }

  getRelatedPosts,

  getStatistics,  // Get posts by tag

  exportPosts,  getPostsByTag(tag, status = 'published') {

  importPosts,    const posts = this.getAllPosts(status);

  calculateReadingTime,    return posts.filter(post => 

  generateUniqueSlug,      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())

};    );

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
