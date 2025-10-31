# Production Setup Guide for LiteSpeed/cPanel

## 🚨 CRITICAL: Install Dependencies First

The server crashes with "Cannot find module 'express'" because `node_modules` is missing in production.

### Step 1: SSH into Your Server

```bash
ssh your_username@162.0.217.227
cd ~/admin.rubyet.info
```

### Step 2: Install All Dependencies

```bash
# Make sure you're in the backend directory
cd ~/admin.rubyet.info

# Install all npm packages
npm install

# Verify installation
ls -la node_modules | head -20
```

**Required Packages** (from package.json):
- express
- bcryptjs
- jsonwebtoken
- cors
- dotenv
- uuid
- express-rate-limit
- multer

### Step 3: Set Up Environment Variables

Create `.env` file:

```bash
nano .env
```

Add these variables:

```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=24h
```

Save and exit (Ctrl+X, Y, Enter)

### Step 4: Restart the Node.js App

#### Option A: Via cPanel (Recommended)
1. Log into cPanel
2. Go to "Setup Node.js App"
3. Find your `admin.rubyet.info` application
4. Click **"Restart"** button
5. Wait 10-15 seconds for restart to complete

#### Option B: Via SSH
```bash
# Kill existing Node process
pkill -f "node.*server.js"

# Passenger will auto-restart the app on next request
```

### Step 5: Verify Server is Running

Check the health endpoint:

```bash
curl https://admin.rubyet.info/api/health
```

You should see:

```json
{
  "status": "ok",
  "message": "Blog API is running",
  "timestamp": "2025-10-31T...",
  "serverStartTime": "2025-10-31T...",
  "uptime": "0h 0m 15s",
  "uptimeSeconds": 15,
  "nodeVersion": "v20.19.4",
  "environment": "production",
  "port": "5000",
  "logs": [
    "[timestamp] Starting server initialization...",
    "[timestamp] Initializing data files...",
    "[timestamp] ✓ Data files initialized",
    "[timestamp] Initializing admin user...",
    "[timestamp] ✓ Admin user initialized",
    "[timestamp] ✓ Running under Passenger - server managed externally",
    "[timestamp] ✓ Server initialization complete"
  ]
}
```

## 🔧 Recent Fixes Applied

### 1. ✅ Trust Proxy Configuration
Added `app.set('trust proxy', true)` to fix rate limiting errors:
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false
```

### 2. ✅ Passenger Compatibility
Server now detects if running under Passenger and skips calling `app.listen()`:
```javascript
if (typeof(PhusionPassenger) !== 'undefined') {
  // Running under Passenger - don't call listen()
} else {
  // Standalone mode - call listen()
}
```

This fixes:
```
Error: http.Server.listen() was called more than once which is not allowed.
```

### 3. ✅ Enhanced Error Logging
All errors now include:
- Timestamps
- Stack traces
- Context information

### 4. ✅ Comprehensive Health Check
Health endpoint returns:
- Server uptime
- Start time
- All initialization logs
- Node.js version
- Environment mode

## 📊 Monitoring

### Check Server Logs

```bash
# View error logs
tail -f ~/admin.rubyet.info/logs/stderr.log

# View access logs
tail -f ~/admin.rubyet.info/logs/stdout.log
```

### Check if Node Modules are Installed

```bash
cd ~/admin.rubyet.info
npm list --depth=0
```

Should show all installed packages.

## 🐛 Troubleshooting

### Error: "Cannot find module 'express'"
**Solution:** Run `npm install` in the backend directory

### Error: "http.Server.listen() was called more than once"
**Solution:** Already fixed in latest code. Restart the app.

### Error: "ValidationError: The 'X-Forwarded-For' header"
**Solution:** Already fixed with `trust proxy` setting. Restart the app.

### 503 Service Unavailable
**Possible Causes:**
1. Dependencies not installed → Run `npm install`
2. App crashed → Check `stderr.log`
3. Syntax error in code → Check error logs
4. Need to restart → Restart via cPanel

## 📝 Deployment Checklist

- [ ] SSH into server
- [ ] Navigate to `~/admin.rubyet.info`
- [ ] Run `npm install`
- [ ] Create/update `.env` file
- [ ] Restart Node.js app via cPanel
- [ ] Test health check: `curl https://admin.rubyet.info/api/health`
- [ ] Test posts endpoint: `curl https://admin.rubyet.info/api/posts?filter=published`
- [ ] Check logs for errors: `tail -f logs/stderr.log`
- [ ] Verify frontend can fetch posts: https://rubyet.info

## 🚀 GitHub Actions Deployment

GitHub Actions FTP deployment is configured, but **it doesn't run npm install**. You must:

1. Let GitHub Actions deploy the files
2. Manually SSH and run `npm install` (one-time setup)
3. Restart the app via cPanel

**Note:** Once `node_modules` is installed, it persists across deployments. You only need to reinstall if you add new dependencies.

## 🔐 Security Notes

- Never commit `.env` to GitHub
- Keep `JWT_SECRET` secure and random
- Admin credentials stored encrypted with bcrypt
- Rate limiting configured (5 login attempts, 3 password reset attempts per 15 min)
- All POST/PUT/DELETE endpoints require JWT authentication

## 📞 Support

If issues persist after following this guide:
1. Check `~/admin.rubyet.info/logs/stderr.log` for detailed errors
2. Verify all dependencies installed: `npm list --depth=0`
3. Ensure `.env` file exists with proper values
4. Try manual restart: `pkill -f "node.*server.js"`
