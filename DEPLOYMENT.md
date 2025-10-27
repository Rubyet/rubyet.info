# Deployment Guide

## GitHub Secrets Required

Go to **Settings → Secrets and variables → Actions** and add these secrets:

### FTP Credentials
- `FTP_USERNAME` - Your FTP username
- `FTP_PASSWORD` - Your FTP password

### EmailJS Configuration
- `REACT_APP_EMAILJS_SERVICE_ID` - Your EmailJS service ID
- `REACT_APP_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID  
- `REACT_APP_EMAILJS_PUBLIC_KEY` - Your EmailJS public key

### Backend API URL
- `REACT_APP_API_URL` - Production API URL (e.g., `https://rubyet.info/backend/api`)

## Auto-Deployment Process

When you push to the `master` branch:

1. ✅ GitHub Actions builds the frontend React app
2. ✅ Deploys frontend build to FTP root directory (includes `.htaccess` for routing)
3. ✅ Deploys backend code to `/backend/` folder on FTP
4. ✅ Website updates automatically

**Important**: The `.htaccess` file in `frontend/public/` is automatically included in the build and deployed. This file ensures React Router works correctly on the server (e.g., `/admin/login` routes work).

## Post-Deployment Steps (cPanel)

After the first deployment:

### Step 1: Setup Environment Variables

1. Login to **cPanel**
2. Open **Terminal** (or use SSH if available)
3. Navigate to backend folder:
   ```bash
   cd public_html/backend
   ```

4. Create environment file:
   ```bash
   cp .env.example .env
   nano .env
   ```

5. Update `.env` with production values:
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://rubyet.info
   ```
   Press `Ctrl+X`, then `Y`, then `Enter` to save

### Step 2: Install Dependencies

In the same terminal:
```bash
npm install --production
```

**Note**: If you prefer to use cPanel's "Run NPM Install" button later (Step 3), you can skip this step. However, installing via terminal is more reliable and shows clear error messages if something fails.

### Step 3: Setup Node.js Application

1. Go to cPanel → **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js version**: 18.x or higher (latest available)
   - **Application mode**: Production
   - **Application root**: `public_html/backend` (NOT just `backend`)
   - **Application URL**: Leave empty or choose a subdomain
   - **Application startup file**: `server.js`
   - **Passenger log file**: Leave default

4. **Add Environment Variables** (in the same form):
   - Add `PORT` = `5000`
   - Add `NODE_ENV` = `production`
   - Add `FRONTEND_URL` = `https://rubyet.info`

5. Click **"Create"**

**Important**: 
- Use the **full path** `public_html/backend` for Application root
- If you see "No such application" error, the path is wrong
- The path should be relative to your home directory (`/home/rubygoys/`)
- So `public_html/backend` becomes `/home/rubygoys/public_html/backend`

### Step 4: Configure Apache Proxy (if needed)

If you want API accessible at `http://rubyet.info/backend/api/`:

1. Go to cPanel → **"File Manager"**
2. Navigate to `public_html/`
3. Edit `.htaccess` (or create if doesn't exist)
4. Add these lines:
   ```apache
   # Proxy API requests to Node.js backend
   RewriteEngine On
   RewriteCond %{REQUEST_URI} ^/backend/api/
   RewriteRule ^backend/api/(.*)$ http://localhost:5000/api/$1 [P,L]
   ```

5. Save the file

### Step 5: Start the Backend

1. In cPanel **"Setup Node.js App"**, find your application
2. Click **"Start App"** (if not already started)
3. Verify it's running by clicking **"Open"** or visiting `https://rubyet.info/backend/api/posts`


## Updating Production

### Automatic Updates
Push to master branch - GitHub Actions deploys frontend and backend automatically.

### After Auto-Deployment

When GitHub Actions completes deployment:

**Option 1: Using Terminal (Recommended)**
1. Login to **cPanel Terminal**
2. Run:
   ```bash
   cd public_html/backend
   npm install --production
   ```
3. Go to **"Setup Node.js App"**
4. Find your application and click **"Restart"**

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

**React routes return 404 (e.g., /admin/login):**
- Missing or incorrect `.htaccess` in root directory
- **Quick Fix**: Manually create `.htaccess` in your `public_html/` folder via cPanel File Manager
- Add this content:
  ```apache
  <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/backend/
    RewriteRule ^ index.html [L]
  </IfModule>
  ```
- Or wait for next deployment - the `.htaccess` is now in `frontend/public/` and will be included
- After creating/updating `.htaccess`, clear browser cache and try again

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
