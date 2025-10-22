# 🚀 GitHub Actions Deployment Setup Guide

This guide will help you set up automatic deployment to your FTP server using GitHub Actions.

## 📋 Prerequisites

- GitHub repository created for this project
- FTP server credentials (already provided)
- Git installed on your local machine
- Push access to the repository

## 🔧 Step-by-Step Setup

### Step 1: Initialize Git Repository (If Not Done)

```powershell
# Navigate to your project directory
cd "c:\Personal Drive\Project\rubyet.info"

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Modern React portfolio"

# Add remote repository
git remote add origin https://github.com/Rubyet/rubyet.info.git

# Push to master branch
git branch -M master
git push -u origin master
```

### Step 2: Add GitHub Secrets

**IMPORTANT:** Never commit FTP credentials directly to your code!

1. **Go to your GitHub repository**
   - Navigate to: https://github.com/Rubyet/rubyet.info

2. **Access Settings**
   - Click on **Settings** tab (top navigation)

3. **Navigate to Secrets**
   - In the left sidebar, click **Secrets and variables**
   - Click **Actions**

4. **Add FTP Username Secret**
   - Click **New repository secret**
   - Name: `FTP_USERNAME`
   - Value: `xxxxxx` #hidden as its sensitive
   - Click **Add secret**

5. **Add FTP Password Secret**
   - Click **New repository secret** again
   - Name: `FTP_PASSWORD`
   - Value: `xxxxxx` #hidden as its sensitive
   - Click **Add secret**

### Step 3: Verify Workflow File

The workflow file has been created at:
```
.github/workflows/deploy.yml
```

This file will:
- ✅ Trigger on every push to `master` branch
- ✅ Install Node.js and dependencies
- ✅ Build your React app
- ✅ Deploy the `build` folder to your FTP server

### Step 4: Test the Deployment

1. **Make a small change** (optional test)
   ```powershell
   # Edit any file or just commit the workflow
   git add .
   git commit -m "Add GitHub Actions deployment workflow"
   git push origin master
   ```

2. **Monitor the deployment**
   - Go to your repository on GitHub
   - Click the **Actions** tab
   - Watch the workflow run in real-time
   - You'll see: Checkout → Setup Node → Install → Build → Deploy

3. **Check deployment status**
   - ✅ Green checkmark = Successful deployment
   - ❌ Red X = Failed (check logs)

## 🔍 Troubleshooting

### Issue: Workflow Not Running

**Solution:**
1. Ensure the `.github/workflows/deploy.yml` file is committed
2. Check that you're pushing to the `master` branch
3. Verify GitHub Actions are enabled in repository settings

### Issue: FTP Connection Failed

**Possible causes:**
1. **Wrong credentials** - Double-check secrets in GitHub
2. **Server issues** - Verify FTP server is accessible
3. **Port blocked** - Ensure port 21 is open

**How to debug:**
```yaml
# Add debug step to workflow (temporary)
- name: Test FTP Connection
  run: |
    echo "Testing FTP connection..."
    curl -v ftp://ftp.rubyet.info --user "${{ secrets.FTP_USERNAME }}:${{ secrets.FTP_PASSWORD }}"
```

### Issue: Build Failed

**Common causes:**
1. **Missing dependencies** - Check package.json
2. **Build errors** - Check error logs in Actions tab
3. **Memory issues** - Might need to optimize build

**Solution:**
```powershell
# Test build locally first
npm run build

# If it works locally, check GitHub Actions logs
```

### Issue: Files Not Deploying to Correct Directory

**Check FTP server structure:**
- Ensure `server-dir` in workflow matches your hosting structure
- Common paths: `./`, `./public_html/`, `./www/`, `./httpdocs/`

**Update if needed:**
```yaml
server-dir: ./public_html/  # Change this to match your server
```

## 📁 FTP Server Directory Structure

After deployment, your FTP server should have:

```
/ (root)
├── index.html
├── manifest.json
├── favicon.ico
├── static/
│   ├── css/
│   │   └── main.*.css
│   ├── js/
│   │   └── main.*.js
│   └── media/
└── img/
    └── (your images)
```

## 🎯 Workflow Features

### Automatic Triggers
- ✅ Push to `master` branch → Auto deploy
- ✅ Pull request to `master` → Build test (no deploy)

### Build Process
1. Checkout latest code
2. Setup Node.js 18
3. Install dependencies (`npm ci`)
4. Build production bundle
5. Upload to FTP server

### Security
- ✅ Credentials stored as GitHub Secrets
- ✅ Not visible in logs or code
- ✅ Encrypted at rest

## 🔐 Security Best Practices

### 1. Never Commit Credentials
```bash
# ❌ NEVER do this:
# username: main_deployer@rubyet.info

# ✅ ALWAYS do this:
# username: ${{ secrets.FTP_USERNAME }}
```

### 2. Use Environment Variables for Sensitive Data
```yaml
env:
  FTP_USER: ${{ secrets.FTP_USERNAME }}
  FTP_PASS: ${{ secrets.FTP_PASSWORD }}
```

### 3. Rotate Credentials Regularly
- Change FTP password every 3-6 months
- Update GitHub secrets when changed

### 4. Limit FTP User Permissions
- FTP user should only have access to web directory
- No access to system files or other users' directories

## 🔄 Deployment Workflow

```
Code Change → Commit → Push to Master
                           ↓
                    GitHub Actions Triggered
                           ↓
                    Install Dependencies
                           ↓
                      Build React App
                           ↓
                    Upload to FTP Server
                           ↓
                      ✅ Live Website
```

## 📊 Monitoring Deployments

### View Deployment History
1. Go to repository **Actions** tab
2. See all workflow runs
3. Click any run to see detailed logs

### Email Notifications
GitHub automatically sends email notifications for:
- ✅ Successful deployments
- ❌ Failed deployments

### Deployment Status Badge
Add to your README.md:
```markdown
![Deploy Status](https://github.com/Rubyet/rubyet.info/actions/workflows/deploy.yml/badge.svg)
```

## ⚡ Advanced Configuration

### Deploy to Subdirectory
```yaml
server-dir: ./public_html/portfolio/
```

### Deploy Only Specific Files
```yaml
exclude: |
  **/.git*
  **/.git*/**
  **/node_modules/**
  **/*.map
  **/README.md
```

### Add Slack Notifications
```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "✅ Portfolio deployed successfully!"
      }
```

### Deploy to Multiple Environments
```yaml
# Production deployment
- name: Deploy to Production
  if: github.ref == 'refs/heads/master'
  uses: SamKirkland/FTP-Deploy-Action@v4.3.4
  with:
    server: ftp.rubyet.info
    # ... production settings

# Staging deployment  
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  uses: SamKirkland/FTP-Deploy-Action@v4.3.4
  with:
    server: staging.rubyet.info
    # ... staging settings
```

## 🧪 Testing Before Push

Always test locally before pushing:

```powershell
# 1. Test build
npm run build

# 2. Test build output locally
npx serve -s build

# 3. Verify everything works
# Open http://localhost:3000 in browser

# 4. Only then push to GitHub
git add .
git commit -m "Your commit message"
git push origin master
```

## 📝 Git Workflow Best Practices

### Feature Branch Workflow
```powershell
# Create feature branch
git checkout -b feature/new-project

# Make changes and commit
git add .
git commit -m "Add new project to portfolio"

# Push feature branch
git push origin feature/new-project

# Create Pull Request on GitHub
# Review changes
# Merge to master → Auto deployment triggers!
```

### Hotfix Workflow
```powershell
# Quick fix needed?
git checkout -b hotfix/fix-typo

# Make fix
git add .
git commit -m "Fix typo in about section"

# Push and create PR
git push origin hotfix/fix-typo

# After merge to master → Auto deploy
```

## 🎨 Customizing the Workflow

### Change Build Command
```yaml
- name: Build project
  run: npm run build:prod  # Your custom command
```

### Add Linting Before Build
```yaml
- name: Run linter
  run: npm run lint

- name: Run tests
  run: npm test
```

### Add Build Cache
```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## 🌐 Domain Setup (After First Deploy)

1. **Verify files uploaded**
   - Use FTP client to check server
   - Ensure `index.html` is in root

2. **Configure domain**
   - Point your domain to FTP server IP
   - Wait for DNS propagation (24-48 hours)

3. **SSL Certificate (Recommended)**
   - Use Let's Encrypt for free SSL
   - Or your hosting provider's SSL

4. **Test live site**
   - Visit https://rubyet.info
   - Check all features work

## 📞 Getting Help

### Useful Resources
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [FTP Deploy Action](https://github.com/SamKirkland/FTP-Deploy-Action)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

### Common Commands
```powershell
# Check git status
git status

# View commit history
git log --oneline

# View remote repository
git remote -v

# Force push (use carefully!)
git push origin master --force
```

## ✅ Deployment Checklist

Before pushing to master:
- [ ] Build works locally (`npm run build`)
- [ ] No console errors
- [ ] All links work
- [ ] Images load correctly
- [ ] Mobile responsive
- [ ] Contact form configured
- [ ] GitHub secrets configured
- [ ] .github/workflows/deploy.yml committed

After first deployment:
- [ ] Check GitHub Actions tab
- [ ] Verify build succeeded
- [ ] Check FTP server has files
- [ ] Test live website
- [ ] Verify all pages work
- [ ] Check mobile view
- [ ] Test form submission

## 🎉 You're All Set!

Your automatic deployment is configured! Every time you push to master:

1. ⚙️ GitHub Actions starts
2. 📦 Builds your React app
3. 🚀 Deploys to your FTP server
4. ✅ Live in minutes!

**Happy coding! 🚀**

---

**Last Updated:** October 2025
