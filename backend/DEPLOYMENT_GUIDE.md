# Backend Deployment Guide for admin.rubyet.info

## Prerequisites
- cPanel access with Node.js support
- SSH access (optional but recommended)
- Domain admin.rubyet.info pointing to your hosting

## Step-by-Step Deployment

### 1. Upload Files via FTP (Already done by GitHub Actions)
The GitHub Actions workflow automatically uploads backend files to your server.

### 2. Configure Node.js Application in cPanel

#### Via cPanel Interface:
1. Log into cPanel
2. Navigate to **"Setup Node.js App"** or **"Node.js Selector"**
3. Click **"Create Application"**
4. Configure:
   ```
   Node.js version: 18.x or higher
   Application mode: Production
   Application root: /home/yourusername/admin.rubyet.info (or your backend directory)
   Application URL: admin.rubyet.info
   Application startup file: server.js
   Environment variables:
     - NODE_ENV=production
     - PORT=5000
     - JWT_SECRET=<generate a secure random string>
   ```
5. Click **"Create"**

### 3. Install Dependencies
In the cPanel Node.js App terminal or via SSH:
```bash
cd /path/to/backend
npm install --production
```

### 4. Setup Environment File
```bash
# Copy and edit the production environment file
cp .env.production .env

# Edit with your secure values
nano .env
```

**IMPORTANT:** Change `JWT_SECRET` to a secure random string:
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Create Required Directories
```bash
mkdir -p data logs
chmod 755 data logs
```

### 6. Start the Application

#### Option A: Via cPanel
- In the Node.js App interface, click **"Start"** or **"Restart"**

#### Option B: Via PM2 (if installed)
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Option C: Manual Start
```bash
nohup node server.js > logs/server.log 2>&1 &
```

### 7. Verify Deployment
Test these endpoints:
- https://admin.rubyet.info/ (should show the landing page)
- https://admin.rubyet.info/api/health (should return JSON with status)
- https://admin.rubyet.info/api/posts (should return posts array)

### 8. Configure Apache/Nginx (if needed)

If you need to proxy requests, ensure your .htaccess or nginx config is set up:

**For Apache (.htaccess already included):**
The .htaccess file will proxy all requests to your Node.js app.

**For Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name admin.rubyet.info;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers (in case Node.js CORS doesn't work)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        if ($request_method = 'OPTIONS') {
            return 200;
        }
    }
}
```

## Troubleshooting

### 503 Service Unavailable
- **Cause:** Node.js app is not running
- **Fix:** Start the application via cPanel Node.js App interface or PM2

### CORS Errors
- **Cause:** Application not running or CORS middleware not loaded
- **Fix:** 
  1. Restart the application
  2. Check .htaccess is in place
  3. Verify CORS configuration in server.js

### Port Already in Use
- **Cause:** Previous instance still running
- **Fix:** 
  ```bash
  # Find and kill the process
  lsof -ti:5000 | xargs kill -9
  # Or via PM2
  pm2 kill
  ```

### Module Not Found Errors
- **Cause:** Dependencies not installed
- **Fix:** 
  ```bash
  rm -rf node_modules package-lock.json
  npm install --production
  ```

### Cannot Find Data Files
- **Cause:** data/ directory doesn't exist
- **Fix:**
  ```bash
  mkdir -p data
  # The app will create posts.json, contacts.json, etc. on first run
  ```

## Monitoring

### Check Application Status
```bash
# Via PM2
pm2 status
pm2 logs rubyet-api

# Manual
ps aux | grep node
tail -f logs/server.log
```

### View Logs
```bash
# Application logs
tail -f logs/out.log
tail -f logs/err.log

# System logs (if using systemd)
journalctl -u rubyet-api -f
```

## Updating the Application

After GitHub Actions deploys new code:

1. **Via cPanel:**
   - Go to Node.js App
   - Click **"Restart"**

2. **Via PM2:**
   ```bash
   pm2 restart rubyet-api
   ```

3. **Via SSH:**
   ```bash
   cd /path/to/backend
   npm install --production  # If package.json changed
   pm2 restart rubyet-api
   # or kill and restart manually
   ```

## Security Checklist
- [ ] Changed default JWT_SECRET
- [ ] Changed default admin password (ryt_admin / Admin@2024!)
- [ ] Enabled HTTPS/SSL for admin.rubyet.info
- [ ] Set proper file permissions (644 for files, 755 for directories)
- [ ] Configured firewall to allow only necessary ports
- [ ] Set NODE_ENV=production
- [ ] Removed .env from version control (already in .gitignore)

## Quick Commands Reference

```bash
# Install dependencies
npm install --production

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Restart application
pm2 restart rubyet-api

# View logs
pm2 logs rubyet-api

# Stop application
pm2 stop rubyet-api

# Manual start
node server.js

# Background start
nohup node server.js &

# Check if running
curl http://localhost:5000/api/health
curl https://admin.rubyet.info/api/health
```

## Support

If you encounter issues:
1. Check the logs: `pm2 logs` or `tail -f logs/server.log`
2. Verify Node.js version: `node --version` (should be 18+)
3. Check if port is available: `lsof -i:5000`
4. Test locally: `curl http://localhost:5000/api/health`
5. Check DNS: `nslookup admin.rubyet.info`

## Post-Deployment Checklist
- [ ] Application is running (check PM2 status or cPanel)
- [ ] Health check endpoint works: https://admin.rubyet.info/api/health
- [ ] Landing page loads: https://admin.rubyet.info/
- [ ] CORS headers present (check browser Network tab)
- [ ] API endpoints accessible from frontend
- [ ] Admin login works
- [ ] SSL certificate installed and valid
