const fs = require('fs').promises;
const path = require('path');

// Data directory and file paths
const DATA_DIR = path.join(__dirname, '..', 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');
const ANALYTICS_FILE = path.join(DATA_DIR, 'analytics.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Initialize data directory and files
async function initializeDataFiles() {
  try {
    // Create data directory if it doesn't exist
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('✓ Data directory initialized');

    // Initialize posts.json if it doesn't exist
    await initializePostsFile();

    // Initialize analytics.json if it doesn't exist
    await initializeAnalyticsFile();

    // Initialize contacts.json if it doesn't exist
    await initializeContactsFile();
  } catch (error) {
    console.error('Error initializing data files:', error);
    throw error;
  }
}

async function initializePostsFile() {
  try {
    await fs.access(POSTS_FILE);
    console.log('✓ posts.json exists');
  } catch {
    const { v4: uuidv4 } = require('uuid');
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
}

async function initializeAnalyticsFile() {
  try {
    await fs.access(ANALYTICS_FILE);
    console.log('✓ analytics.json exists');
  } catch {
    await fs.writeFile(ANALYTICS_FILE, JSON.stringify({}, null, 2));
    console.log('✓ analytics.json created');
  }
}

async function initializeContactsFile() {
  try {
    await fs.access(CONTACTS_FILE);
    console.log('✓ contacts.json exists');
  } catch {
    await fs.writeFile(CONTACTS_FILE, JSON.stringify([], null, 2));
    console.log('✓ contacts.json created');
  }
}

module.exports = {
  DATA_DIR,
  POSTS_FILE,
  ANALYTICS_FILE,
  CONTACTS_FILE,
  initializeDataFiles
};
