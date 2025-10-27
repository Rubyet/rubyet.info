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

### Production Server Setup (cPanel)

After deploying via GitHub Actions:

#### Option 1: Using cPanel Terminal (Recommended)

1. **Login to cPanel** and open "Terminal"

2. **Navigate to backend folder**:
   ```bash
   cd public_html/backend
   ```

3. **Install dependencies**:
   ```bash
   npm install --production
   ```

4. **Create production `.env` file**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Update with production values:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://rubyet.info
   ```
   Press `Ctrl+X`, then `Y`, then `Enter` to save

5. **Setup Node.js Application in cPanel**:
   - Go to cPanel → **"Setup Node.js App"**
   - Click **"Create Application"**
   - **Node.js version**: Choose latest (18.x or higher)
   - **Application mode**: Production
   - **Application root**: `backend`
   - **Application URL**: `backend` (or subdomain if preferred)
   - **Application startup file**: `server.js`
   - **Environment variables**: Add your variables:
     - `PORT=5000`
     - `NODE_ENV=production`
     - `FRONTEND_URL=https://rubyet.info`
   - Click **"Create"**

6. **Start the application**:
   - The app should auto-start
   - Click **"Stop App"** then **"Start App"** to restart
   - Check **"Open"** to verify it's running

7. **Configure .htaccess for API access** (if needed):
   Create or update `public_html/.htaccess`:
   ```apache
   # Proxy API requests to Node.js backend
   RewriteEngine On
   RewriteCond %{REQUEST_URI} ^/backend/api/
   RewriteRule ^backend/api/(.*)$ http://localhost:5000/api/$1 [P,L]
   ```

#### Option 2: Using SSH (if SSH access is available)

1. **SSH into your server**:
   ```bash
   ssh username@rubyet.info
   ```

2. **Navigate to backend folder**:
   ```bash
   cd ~/public_html/backend
   ```

3. **Install dependencies**:
   ```bash
   npm install --production
   ```

4. **Create production `.env` file**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   Update with production values, then save

5. **Use cPanel Node.js App Manager** (as described in Option 1, step 5-6)

### Updating Production

When you push to master branch, GitHub Actions will automatically:
1. Build the frontend
2. Deploy frontend to root directory
3. Deploy backend code to `/backend/` folder

**After auto-deployment:**

1. **Login to cPanel**
2. Go to **"Setup Node.js App"**
3. Find your backend application
4. Click **"Stop App"**
5. Click **"Run NPM Install"** (if dependencies changed)
6. Click **"Start App"**

### Monitoring & Logs

**In cPanel Node.js App Manager:**
- View **"Log"** to see application output
- Check **"Error log"** for errors
- Monitor **"CPU and Memory"** usage

**Common Issues:**

1. **App won't start**: Check environment variables are set correctly
2. **502 Bad Gateway**: Backend isn't running, restart the app
3. **CORS errors**: Verify `FRONTEND_URL` in `.env` matches your domain
4. **Port conflicts**: Ensure PORT in cPanel matches `.env` file

### Environment-Specific Data

Each environment (local/production) maintains its own `data/` folder:
- Local: `backend/data/` on your computer
- Production: `backend/data/` on your server

Data files are excluded from deployment and git, so they remain separate.

### Alternative: Using PM2 (Advanced)

If your host supports PM2 via SSH:

```bash
# Install PM2 globally
npm install -g pm2

# Start the server
pm2 start server.js --name rubyet-blog-api

# Save PM2 process list
pm2 save

# Set PM2 to start on server reboot
pm2 startup

# Restart after updates
pm2 restart rubyet-blog-api
```

**Note**: Most cPanel hosts prefer using the built-in Node.js App Manager over PM2.
