const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data directory and file paths
const DATA_DIR = path.join(__dirname, 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');

// Initialize data directory and files
async function initializeDataFiles() {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('✓ Data directory initialized');

    // Initialize posts.json if it doesn't exist
    try {
      await fs.access(POSTS_FILE);
      console.log('✓ posts.json exists');
    } catch {
      const samplePosts = [
        {
          id: uuidv4(),
          title: 'Getting Started with React and Modern Web Development',
          slug: 'getting-started-with-react',
          content: '<h2>Introduction</h2><p>React has revolutionized the way we build user interfaces. In this comprehensive guide, we\'ll explore the fundamentals of React and how it fits into the modern web development ecosystem.</p><h3>Why React?</h3><p>React offers several advantages including component-based architecture, virtual DOM for performance, and a rich ecosystem of tools and libraries.</p>',
          excerpt: 'Learn the fundamentals of React and modern web development practices.',
          coverImage: '/img/post-1.jpg',
          author: 'Rubyet Hossain',
          publishedDate: new Date('2024-01-15').toISOString(),
          updatedDate: new Date('2024-01-15').toISOString(),
          status: 'published',
          tags: ['React', 'JavaScript', 'Web Development'],
          seoTitle: 'Getting Started with React - Complete Guide',
          seoDescription: 'Learn React from scratch with this comprehensive guide covering components, hooks, and best practices.',
          views: 1250
        },
        {
          id: uuidv4(),
          title: 'Understanding JavaScript Async/Await',
          slug: 'understanding-javascript-async-await',
          content: '<h2>Mastering Asynchronous JavaScript</h2><p>Async/await is a modern way to handle asynchronous operations in JavaScript. It makes asynchronous code look and behave more like synchronous code.</p><h3>The Basics</h3><p>The async keyword is used to declare an async function, while await is used to wait for a Promise to resolve.</p>',
          excerpt: 'Master asynchronous JavaScript with async/await patterns and best practices.',
          coverImage: '/img/post-2.jpg',
          author: 'Rubyet Hossain',
          publishedDate: new Date('2024-02-10').toISOString(),
          updatedDate: new Date('2024-02-10').toISOString(),
          status: 'published',
          tags: ['JavaScript', 'Async', 'Programming'],
          seoTitle: 'JavaScript Async/Await - Complete Tutorial',
          seoDescription: 'Learn how to use async/await in JavaScript with practical examples and best practices.',
          views: 890
        }
      ];
      await fs.writeFile(POSTS_FILE, JSON.stringify(samplePosts, null, 2));
      console.log('✓ posts.json created with sample data');
    }

    // Initialize analytics.json if it doesn't exist
    try {
      await fs.access(ANALYTICS_FILE);
      console.log('✓ analytics.json exists');
    } catch {
      await fs.writeFile(ANALYTICS_FILE, JSON.stringify({}, null, 2));
      console.log('✓ analytics.json created');
    }
  } catch (error) {
    console.error('Error initializing data files:', error);
    process.exit(1);
  }
}

// Helper function to read posts
async function readPosts() {
  try {
    const data = await fs.readFile(POSTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

// Helper function to write posts
async function writePosts(posts) {
  try {
    await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing posts:', error);
    return false;
  }
}

// Helper function to read analytics
async function readAnalytics() {
  try {
    const data = await fs.readFile(ANALYTICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading analytics:', error);
    return {};
  }
}

// Helper function to write analytics
async function writeAnalytics(analytics) {
  try {
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing analytics:', error);
    return false;
  }
}

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Calculate reading time
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Blog API is running' });
});

// Get all posts (with optional filter)
app.get('/api/posts', async (req, res) => {
  try {
    const { filter } = req.query;
    let posts = await readPosts();
    
    if (filter === 'published') {
      posts = posts.filter(post => post.status === 'published');
    } else if (filter === 'draft') {
      posts = posts.filter(post => post.status === 'draft');
    }
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by ID
app.get('/api/posts/id/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Get single post by slug
app.get('/api/posts/slug/:slug', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.slug === req.params.slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const posts = await readPosts();
    
    const newPost = {
      id: uuidv4(),
      ...req.body,
      slug: generateSlug(req.body.title),
      publishedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      views: 0
    };
    
    // Check for duplicate slug
    let slug = newPost.slug;
    let counter = 1;
    while (posts.some(p => p.slug === slug)) {
      slug = `${newPost.slug}-${counter}`;
      counter++;
    }
    newPost.slug = slug;
    
    posts.push(newPost);
    await writePosts(posts);
    
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const index = posts.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const updatedPost = {
      ...posts[index],
      ...req.body,
      id: req.params.id,
      updatedDate: new Date().toISOString()
    };
    
    // Update slug if title changed
    if (req.body.title && req.body.title !== posts[index].title) {
      let slug = generateSlug(req.body.title);
      let counter = 1;
      while (posts.some((p, i) => p.slug === slug && i !== index)) {
        slug = `${generateSlug(req.body.title)}-${counter}`;
        counter++;
      }
      updatedPost.slug = slug;
    }
    
    posts[index] = updatedPost;
    await writePosts(posts);
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    
    if (filteredPosts.length === posts.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await writePosts(filteredPosts);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Increment post views
app.post('/api/posts/:id/view', async (req, res) => {
  try {
    const posts = await readPosts();
    const post = posts.find(p => p.id === req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.views = (post.views || 0) + 1;
    await writePosts(posts);
    
    res.json({ views: post.views });
  } catch (error) {
    res.status(500).json({ error: 'Failed to increment views' });
  }
});

// Search posts
app.get('/api/posts/search', async (req, res) => {
  try {
    const { q, status } = req.query;
    let posts = await readPosts();
    
    if (status && status !== 'all') {
      posts = posts.filter(post => post.status === status);
    }
    
    if (q) {
      const query = q.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

// Get posts by tag
app.get('/api/posts/tag/:tag', async (req, res) => {
  try {
    const posts = await readPosts();
    const filteredPosts = posts.filter(post => 
      post.tags.some(tag => tag.toLowerCase() === req.params.tag.toLowerCase()) &&
      post.status === 'published'
    );
    
    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts by tag' });
  }
});

// Get all tags
app.get('/api/tags', async (req, res) => {
  try {
    const posts = await readPosts();
    const publishedPosts = posts.filter(post => post.status === 'published');
    
    const tagCounts = {};
    publishedPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const tags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
});

// Get related posts
app.get('/api/posts/:id/related', async (req, res) => {
  try {
    const posts = await readPosts();
    const currentPost = posts.find(p => p.id === req.params.id);
    
    if (!currentPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const relatedPosts = posts
      .filter(post => 
        post.id !== req.params.id &&
        post.status === 'published' &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, 3);
    
    res.json(relatedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch related posts' });
  }
});

// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const posts = await readPosts();
    
    const stats = {
      totalPosts: posts.length,
      published: posts.filter(p => p.status === 'published').length,
      drafts: posts.filter(p => p.status === 'draft').length,
      totalViews: posts.reduce((sum, post) => sum + (post.views || 0), 0)
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Export all posts
app.get('/api/export', async (req, res) => {
  try {
    const posts = await readPosts();
    res.json({ posts, exportDate: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export posts' });
  }
});

// Import posts
app.post('/api/import', async (req, res) => {
  try {
    const { posts } = req.body;
    
    if (!Array.isArray(posts)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    await writePosts(posts);
    res.json({ message: 'Posts imported successfully', count: posts.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to import posts' });
  }
});

// Start server
async function startServer() {
  await initializeDataFiles();
  
  app.listen(PORT, () => {
    console.log(`\n🚀 Blog API Server running on port ${PORT}`);
    console.log(`📝 Data directory: ${DATA_DIR}`);
    console.log(`✨ API endpoint: http://localhost:${PORT}/api`);
  });
}

startServer();
