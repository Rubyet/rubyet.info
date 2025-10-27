# Rubyet Blog Backend

Node.js/Express backend for the blog system with JSON file-based storage.

## Features

- RESTful API for blog CRUD operations
- JSON file-based storage (no database required)
- Automatic data initialization
- Separate data for local and production environments

## Installation

```bash
npm install
```

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts (optional ?filter=published|draft)
- `GET /api/posts/id/:id` - Get post by ID
- `GET /api/posts/slug/:slug` - Get post by slug
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/view` - Increment post views

### Search & Filter
- `GET /api/posts/search?q=query&status=published` - Search posts
- `GET /api/posts/tag/:tag` - Get posts by tag
- `GET /api/posts/:id/related` - Get related posts

### Tags & Stats
- `GET /api/tags` - Get all tags with counts
- `GET /api/statistics` - Get blog statistics

### Import/Export
- `GET /api/export` - Export all posts as JSON
- `POST /api/import` - Import posts from JSON

## Data Storage

Data is stored in `backend/data/` directory:
- `posts.json` - Blog posts
- `analytics.json` - Analytics data

This directory is excluded from git and maintained separately for local and production.

## Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Deployment

The backend should be deployed to a folder named `backend` on your FTP server alongside the frontend.
