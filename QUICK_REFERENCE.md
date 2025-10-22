# 🚀 Quick Command Reference

## Essential Commands

### Development
```bash
# Start development server (http://localhost:3000)
npm start

# The browser will automatically open
# Changes will hot-reload automatically
```

### Building
```bash
# Create production build in /build folder
npm run build

# Test production build locally
npm install -g serve
serve -s build
```

### Testing
```bash
# Run tests in interactive watch mode
npm test

# Run tests with coverage
npm test -- --coverage
```

## Common Tasks

### 1. Update Personal Information
**Files to edit:**
- `src/components/Hero/Hero.jsx` - Name, title, social links
- `src/components/About/About.jsx` - Bio, stats
- `src/components/Contact/Contact.jsx` - Email, phone, location
- `src/components/Footer/Footer.jsx` - Social links

### 2. Add/Update Projects
**Edit:** `src/data/projectsData.jsx`
```jsx
{
  id: 10,
  title: "Your New Project",
  description: "Project description",
  image: "/img/work-10.jpg",
  category: "web", // web, mobile, fullstack
  technologies: ["React", "Node.js"],
  github: "https://github.com/username/repo",
  demo: "https://demo-url.com"
}
```

### 3. Update Skills
**Edit:** `src/data/skillsData.jsx`
```jsx
{
  id: 11,
  name: "New Skill",
  level: 85, // 0-100
  category: "Frontend" // Frontend, Backend, Database, DevOps
}
```

### 4. Add Work Experience
**Edit:** `src/data/experienceData.jsx`
```jsx
{
  id: 4,
  role: "Job Title",
  company: "Company Name",
  location: "City, Country",
  period: "Jan 2024 - Present",
  description: "Job description",
  achievements: [
    "Achievement 1",
    "Achievement 2"
  ],
  technologies: ["Tech1", "Tech2"]
}
```

### 5. Change Theme Colors
**Edit:** `src/styles/index.css`
```css
:root {
  --primary-gradient: linear-gradient(135deg, #YOUR_COLOR_1, #YOUR_COLOR_2);
  --secondary-gradient: linear-gradient(135deg, #YOUR_COLOR_3, #YOUR_COLOR_4);
}
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Or specify different port
$env:PORT=3001; npm start
```

### Dependencies Issues
```bash
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Build Errors
```bash
# Clear build folder
Remove-Item -Recurse -Force build

# Rebuild
npm run build
```

## Deployment

### Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

**Or use drag-and-drop:**
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `build` folder

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json:
"homepage": "https://yourusername.github.io/repo-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

## File Locations Quick Reference

```
📁 Components:       src/components/[ComponentName]/[ComponentName].jsx
📁 Data Files:       src/data/[dataName].jsx
📁 Styles:           src/components/[ComponentName]/[ComponentName].css
📁 Global Styles:    src/styles/index.css
📁 Images:           public/img/
📁 Config:           package.json, public/manifest.json
📁 Documentation:    *.md files in root
```

## Environment Variables

**Create `.env` file in root:**
```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

**Restart server after adding env vars!**

## Git Commands

```bash
# Initial commit
git init
git add .
git commit -m "Initial commit: Modern React portfolio"

# Push to GitHub
git remote add origin https://github.com/Rubyet/portfolio.git
git branch -M main
git push -u origin main

# Update after changes
git add .
git commit -m "Update: [describe changes]"
git push
```

## Performance Checks

```bash
# Run Lighthouse audit
npm run build
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Check bundle size
npm run build
dir build/static/js/*.js  # Windows PowerShell
```

## Quick Customization Checklist

- [ ] Update name in Hero component
- [ ] Update social links (GitHub, LinkedIn)
- [ ] Add at least 3-4 real projects
- [ ] Update skills with your tech stack
- [ ] Add work experience (last 5 years)
- [ ] Replace placeholder images
- [ ] Set up contact form (EmailJS)
- [ ] Update meta tags in public/index.html
- [ ] Test on mobile devices
- [ ] Run production build
- [ ] Deploy to hosting platform

## Need Help?

1. **Check documentation:** README.md, SETUP.md, QUICKSTART.md
2. **Review guides:** CUSTOMIZATION_CHECKLIST.md, OPTIMIZATION_GUIDE.md
3. **Migration info:** MIGRATION_SUMMARY.md
4. **React docs:** https://react.dev
5. **Community:** Stack Overflow, Reddit r/reactjs

---

## Most Common First-Time Tasks

### 1. First Run (After Setup)
```bash
npm install
npm start
```

### 2. Add Your First Project
```bash
# 1. Add image to public/img/my-project.jpg
# 2. Edit src/data/projectsData.jsx
# 3. Add project object with your details
# 4. Save and check browser (auto-reloads)
```

### 3. Change Your Name
```bash
# Edit src/components/Hero/Hero.jsx
# Find: <h1>Rubyet Hossain</h1>
# Replace with: <h1>Your Name</h1>
```

### 4. Update Contact Info
```bash
# Edit src/components/Contact/Contact.jsx
# Update email, phone, location
# Edit src/components/Footer/Footer.jsx
# Update social media links
```

### 5. Deploy Your Site
```bash
npm run build
# Upload 'build' folder to Netlify or Vercel
```

---

**Save this file for quick reference! 📌**

