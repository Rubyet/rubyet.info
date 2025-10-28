# Deployment Guide

## GitHub Secrets Required

Go to **Settings → Secrets and variables → Actions** and add these secrets:

### FTP Credentials (Main Site)
- `FTP_USERNAME` - Your FTP username for rubyet.info
- `FTP_PASSWORD` - Your FTP password for rubyet.info

### FTP Credentials (Admin/Backend Subdomain)
- `FTP_USERNAME_ADMIN` - Your FTP username for admin.rubyet.info
- `FTP_PASSWORD_ADMIN` - Your FTP password for admin.rubyet.info
  *(Note: This might be the same as main site credentials, but specified separately for flexibility)*

### EmailJS Configuration
- `REACT_APP_EMAILJS_SERVICE_ID` - Your EmailJS service ID
- `REACT_APP_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID  
- `REACT_APP_EMAILJS_PUBLIC_KEY` - Your EmailJS public key

### Backend API URL
- `REACT_APP_API_URL` - Production API base URL: `https://admin.rubyet.info/api`
  *(This is the base URL - service functions will append endpoints like `/posts`, `/tags`, etc.)*

## Auto-Deployment Process

When you push to the `master` branch:

1. ✅ GitHub Actions builds the frontend React app
2. ✅ Deploys frontend build to **rubyet.info** (includes `.htaccess` for routing)
3. ✅ Deploys backend code to **admin.rubyet.info** subdomain
4. ✅ Both sites update automatically

**Architecture:**
- **Frontend**: `https://rubyet.info` - React portfolio/blog
- **Backend API**: `https://admin.rubyet.info/api` - Node.js/Express API
  - Base URL: `https://admin.rubyet.info`
  - API endpoints: `/api/posts`, `/api/tags`, etc.
- **Separate subdomains** = No proxy needed, cleaner architecture

## Post-Deployment Steps (cPanel)

After the first deployment:

### Step 1: Setup Backend Subdomain (admin.rubyet.info)

1. Login to **cPanel**
2. Go to **"Subdomains"**
3. Create subdomain:
   - **Subdomain**: `admin`
   - **Domain**: `rubyet.info`
   - **Document Root**: Auto-generated (e.g., `public_html/admin`)
4. Note the document root path - backend files will be deployed here

### Step 2: Setup Environment Variables

1. Open **cPanel Terminal** (or use SSH)
2. Navigate to admin subdomain folder:
   ```bash
   cd public_html/admin  # Or whatever path cPanel created
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   nano .env
   ```

4. Update `.env` with production values:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://rubyet.info
   ```
   Press `Ctrl+X`, then `Y`, then `Enter` to save

### Step 3: Install Dependencies

In the same terminal:
```bash
npm install --production
```

**Note**: If you prefer to use cPanel's "Run NPM Install" button later (Step 4), you can skip this step. However, installing via terminal is more reliable and shows clear error messages if something fails.

### Step 4: Setup Node.js Application

1. Go to cPanel → **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js version**: 18.x or higher (latest available)
   - **Application mode**: Production
   - **Application root**: `public_html/admin` (path to admin subdomain)
   - **Application URL**: `admin.rubyet.info` (your subdomain)
   - **Application startup file**: `server.js`
   - **Passenger log file**: Leave default

4. **Add Environment Variables** (in the same form):
   - Add `PORT` = `5000`
   - Add `NODE_ENV` = `production`
   - Add `FRONTEND_URL` = `https://rubyet.info`

5. Click **"Create"**

**Important**: 
- The backend will be accessible at `https://admin.rubyet.info/api/posts`
- No Apache proxy needed since it's a separate subdomain
- cPanel will handle the routing automatically

### Step 5: Test the Backend

1. In cPanel **"Setup Node.js App"**, click **"Start App"**
2. Visit `https://admin.rubyet.info/api/posts` in your browser
3. You should see JSON response with blog posts


## Updating Production

### Automatic Updates
Push to master branch - GitHub Actions deploys frontend and backend automatically.

### After Auto-Deployment

When GitHub Actions completes deployment:

**Option 1: Using Terminal (Recommended)**
1. Login to **cPanel Terminal**
2. Run:
   ```bash
   cd public_html/admin  # Backend subdomain path
   npm install --production
   ```
3. Go to **"Setup Node.js App"**
4. Find your application (admin.rubyet.info) and click **"Restart"**

**Option 2: Using cPanel UI**
1. Login to **cPanel**
2. Go to **"Setup Node.js App"**
3. Find your backend application
4. Click **"Stop App"**
5. Click **"Run NPM Install"** (may show error but usually works)
6. Click **"Start App"**

**Note**: If "Run NPM Install" shows an error about "return code None", ignore it - the installation likely succeeded. Just start the app and test if it works.

### Quick Restart (Terminal)

If you have SSH access:
```bash
# Login to cPanel Terminal or SSH
cd public_html/backend

# Restart via cPanel Node.js manager (recommended)
# Or manually:
pkill -f "node.*server.js"
# Then restart via cPanel "Setup Node.js App"
```


## Environment-Specific Data

Each environment maintains its own data:

- **Local**: `backend/data/` on your development machine
- **Production**: `backend/data/` on your server

Data files are excluded from git and deployment, keeping environments separate.

## Troubleshooting

### Backend not responding

1. **Check if app is running**:
   - cPanel → "Setup Node.js App" → Check status
   - If stopped, click "Start App"

2. **View logs**:
   - In "Setup Node.js App", click on your application
   - Check the **"Log"** and **"Error log"** sections
   - Look for startup errors or crashes

3. **Test backend directly**:
   ```bash
   curl http://localhost:5000/api/posts
   # or visit in browser: https://rubyet.info/backend/api/posts
   ```

### Common Issues

**"Error occurred during installation of modules... return code None":**
- This error is usually **harmless** - the installation likely succeeded
- cPanel just couldn't verify the app status properly
- **Solution**: Ignore the error and manually start the app
- Click **"Start App"** and test if it works
- Alternative: Install via Terminal instead:
  ```bash
  cd public_html/backend
  npm install --production
  ```
  Then start the app in cPanel UI

**"No such application or it's broken. Unable to find app venv folder":**
- This means the **Application root** path is incorrect
- Fix: Edit the application and change path to `public_html/backend`
- The path must be relative to your home directory
- If still fails, try absolute path: `/home/rubygoys/public_html/backend`

**App won't start:**
- Check environment variables in cPanel Node.js App Manager
- Verify `server.js` exists in `/backend/` folder
- Check logs for specific error messages

**502 Bad Gateway:**
- Backend is not running
- Restart the app in cPanel Node.js App Manager
- Check if port 5000 is already in use

**CORS errors:**
- Verify `FRONTEND_URL` in environment variables matches your domain
- Should be `https://rubyet.info` (no trailing slash)

**Module not found errors:**
- Run "Run NPM Install" in cPanel Node.js App Manager
- Or via terminal: `cd public_html/backend && npm install --production`

**API returns 404:**
- Check `.htaccess` rewrite rules
- Verify backend is actually running
- Check Application URL in Node.js App Manager

**React routes return 404 (e.g., /admin/login, /blog/:id):**
- Missing `.htaccess` in production root directory
- **Immediate Fix**: Manually create `.htaccess` in your `public_html/` folder via cPanel File Manager
- Add this content:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # React Router - Redirect all requests to index.html except for existing files
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
  </IfModule>
  ```
- **Permanent Fix**: The `.htaccess` is in `frontend/public/` and will be included in next deployment
- After creating `.htaccess`, clear browser cache and test:
  - `https://rubyet.info/admin/login`
  - `https://rubyet.info/blog/some-post-slug`

**Note**: If `.htaccess` already exists but routes still return 404:
- Check if `mod_rewrite` is enabled (contact hosting if not)
- Verify the file is in the correct location (`public_html/.htaccess`)
- Check file permissions (should be 644)
- Clear browser cache (Ctrl+Shift+R)

**Backend API not responding at admin.rubyet.info (404 Error):**
1. **Check subdomain exists**: Verify `admin.rubyet.info` is created in cPanel → Subdomains
2. **Check backend is running**:
   - cPanel → "Setup Node.js App" → Verify status is "Running"
   - Application URL should show `admin.rubyet.info`
3. **Test the API**: Visit `https://admin.rubyet.info/api/posts`
4. **Check DNS**: admin subdomain might take a few minutes to propagate
5. **Verify deployment**: Files should be in the subdomain's document root (e.g., `public_html/admin`)

**Frontend can't connect to backend:**
1. **Check REACT_APP_API_URL**: Should be `https://admin.rubyet.info/api` (includes `/api` path)
2. **CORS issue**: Verify backend `.env` has `FRONTEND_URL=https://rubyet.info`
3. **Mixed content**: If frontend is HTTPS, backend must also be HTTPS
4. **GitHub Secret**: Ensure `REACT_APP_API_URL` is set to `https://admin.rubyet.info/api`
5. **Test manually**: Visit `https://admin.rubyet.info/api/posts` - should return JSON

### View Logs (Terminal)

If you have SSH/Terminal access:
```bash
cd public_html/backend

# View Node.js app logs (location varies by cPanel setup)
# Usually in:
tail -f ~/public_html/backend/logs/app.log

# Or check cPanel error logs:
tail -f ~/logs/error_log
```

### Clear Cache and Restart

```bash
# In cPanel Terminal
cd public_html/backend
rm -rf node_modules package-lock.json
npm install --production

# Then restart via cPanel "Setup Node.js App"
```

### Check Node.js Version

```bash
node --version
# Should be 18.x or higher
```

If wrong version, update in cPanel "Setup Node.js App" settings.


## Important Notes

1. ⚠️ **Never commit `.env` files to git** - Keep secrets secure
2. ⚠️ **Data folder is excluded from deployment** - Each environment has its own data
3. ⚠️ **After GitHub auto-deployment** - Restart backend in cPanel Node.js App Manager
4. ⚠️ **Use cPanel Node.js App Manager** - Don't manually run `node server.js` (it won't persist)
5. ⚠️ **Check Node.js version** - Ensure 18.x or higher in cPanel
6. ⚠️ **Backend API URL** - Must match in GitHub Secrets and frontend `.env`
7. ⚠️ **Port conflicts** - If 5000 is taken, change PORT in .env and cPanel settings

## cPanel-Specific Tips

- **Node.js App Manager** is the recommended way to run backend (not PM2)
- **Application restarts** automatically on server reboot when configured in cPanel
- **Environment variables** should be set in cPanel UI, not just `.env` file
- **Logs** are accessible via cPanel UI under "Setup Node.js App"
- **Passenger** (cPanel's app server) handles process management automatically
