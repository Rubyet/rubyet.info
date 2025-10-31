// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Loading callback function (will be set by App component)
let loadingCallbacks = {
  start: null,
  stop: null,
};

// Set loading callbacks
export function setLoadingCallbacks(startCallback, stopCallback) {
  loadingCallbacks.start = startCallback;
  loadingCallbacks.stop = stopCallback;
}

// Helper function to handle API requests
async function apiRequest(endpoint, options = {}) {
  // Start loading indicator
  if (loadingCallbacks.start) {
    const message = options.loadingMessage || 'Loading...';
    loadingCallbacks.start(message);
  }

  try {
    // Get auth token from localStorage
    const token = localStorage.getItem('admin_token');
    
    // Build headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        window.location.href = '/admin/login';
      }
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  } finally {
    // Stop loading indicator
    if (loadingCallbacks.stop) {
      loadingCallbacks.stop();
    }
  }
}

// Get all posts (with optional filter)
export async function getAllPosts(filter = 'all') {
  const params = filter !== 'all' ? `?filter=${filter}` : '';
  return await apiRequest(`/posts${params}`, { loadingMessage: 'Loading posts...' });
}

// Get post by ID
export async function getPostById(id) {
  return await apiRequest(`/posts/id/${id}`, { loadingMessage: 'Loading post...' });
}

// Get post by slug
export async function getPostBySlug(slug) {
  return await apiRequest(`/posts/slug/${slug}`, { loadingMessage: 'Loading post...' });
}

// Create new post
export async function createPost(postData) {
  return await apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
    loadingMessage: 'Creating post...',
  });
}

// Update post
export async function updatePost(id, updates) {
  return await apiRequest(`/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
    loadingMessage: 'Updating post...',
  });
}

// Delete post
export async function deletePost(id) {
  return await apiRequest(`/posts/${id}`, {
    method: 'DELETE',
    loadingMessage: 'Deleting post...',
  });
}

// Increment post views
export async function incrementViews(id) {
  return await apiRequest(`/posts/${id}/view`, {
    method: 'POST',
    loadingMessage: null, // Silent operation
  });
}

// Search posts
export async function searchPosts(query, status = 'all') {
  const params = new URLSearchParams();
  if (query) params.append('q', query);
  if (status !== 'all') params.append('status', status);
  return await apiRequest(`/posts/search?${params.toString()}`, { loadingMessage: 'Searching...' });
}

// Get posts by tag
export async function getPostsByTag(tag) {
  return await apiRequest(`/posts/tag/${tag}`, { loadingMessage: 'Loading posts...' });
}

// Get all tags
export async function getAllTags() {
  return await apiRequest('/tags', { loadingMessage: 'Loading tags...' });
}

// Get related posts
export async function getRelatedPosts(postId) {
  return await apiRequest(`/posts/${postId}/related`, { loadingMessage: 'Loading related posts...' });
}

// Get statistics
export async function getStatistics() {
  return await apiRequest('/statistics', { loadingMessage: 'Loading statistics...' });
}

// Export posts
export async function exportPosts() {
  const data = await apiRequest('/export', { loadingMessage: 'Exporting posts...' });
  
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

// Import posts
export async function importPosts(fileOrData) {
  let posts;
  
  if (fileOrData instanceof File) {
    const text = await fileOrData.text();
    const data = JSON.parse(text);
    posts = data.posts || data;
  } else {
    posts = fileOrData.posts || fileOrData;
  }
  
  return await apiRequest('/import', {
    method: 'POST',
    body: JSON.stringify({ posts }),
    loadingMessage: 'Importing posts...',
  });
}

// Calculate reading time (client-side utility)
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Generate unique slug (client-side utility)
export function generateUniqueSlug(title, existingSlugs = []) {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  let counter = 1;
  let uniqueSlug = slug;
  
  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

// ==================== AI ASSISTANCE FUNCTIONS ====================

// Improve title with AI
export async function improveTitle(title) {
  return await apiRequest('/ai/improve-title', {
    method: 'POST',
    body: JSON.stringify({ title }),
    loadingMessage: 'AI is improving your title...',
  });
}

// Generate excerpt with AI
export async function generateExcerpt(title, content) {
  return await apiRequest('/ai/generate-excerpt', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
    loadingMessage: 'AI is generating excerpt...',
  });
}

// Get AI help with content
export async function helpWithContent(topic, currentContent = '') {
  return await apiRequest('/ai/help-content', {
    method: 'POST',
    body: JSON.stringify({ topic, currentContent }),
    loadingMessage: 'AI is generating content...',
  });
}

// Suggest tags with AI
export async function suggestTags(title, content) {
  return await apiRequest('/ai/suggest-tags', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
    loadingMessage: 'AI is suggesting tags...',
  });
}

// Generate SEO metadata with AI
export async function generateSEO(title, content, excerpt) {
  return await apiRequest('/ai/generate-seo', {
    method: 'POST',
    body: JSON.stringify({ title, content, excerpt }),
    loadingMessage: 'AI is generating SEO metadata...',
  });
}

const apiService = {
  getAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  incrementViews,
  searchPosts,
  getPostsByTag,
  getAllTags,
  getRelatedPosts,
  getStatistics,
  exportPosts,
  importPosts,
  calculateReadingTime,
  generateUniqueSlug,
  // AI Functions
  improveTitle,
  generateExcerpt,
  helpWithContent,
  suggestTags,
  generateSEO,
  // Loading callbacks
  setLoadingCallbacks,
};

export default apiService;
