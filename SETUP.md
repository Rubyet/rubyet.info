# Quick Setup Guide

## 🚀 Getting Started

Follow these steps to get your portfolio up and running:

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages including:
- React and React DOM
- Framer Motion (animations)
- React Icons
- React Type Animation
- React Intersection Observer

### Step 2: Start Development Server

```powershell
npm start
```

Your portfolio will open at `http://localhost:3000`

### Step 3: Customize Your Content

#### Update Your Personal Information:

1. **Experience** - Edit `src/data/experienceData.js`
   - Add your job positions
   - Update companies, dates, and descriptions
   - List your achievements

2. **Skills** - Edit `src/data/skillsData.js`
   - Add/remove skill categories
   - Update skill names and proficiency levels

3. **Projects** - Edit `src/data/projectsData.js`
   - Add your project details
   - Update images, links, and technologies

4. **Testimonials** - Edit `src/data/testimonialsData.js`
   - Add client testimonials
   - Update names, positions, and feedback

5. **Blog** - Edit `src/data/blogData.js`
   - Add blog posts
   - Update titles, excerpts, and links

#### Update Contact Information:

Edit `src/components/Contact/Contact.js`:
```javascript
const contactInfo = [
  { title: 'Email', value: 'your.email@example.com' },
  { title: 'Phone', value: '+1 (555) 123-4567' },
  { title: 'Location', value: 'Your City, Country' },
];
```

#### Update Social Links:

Edit `src/components/Hero/Hero.js` and `src/components/Footer/Footer.js`:
```javascript
<a href="https://github.com/yourusername" target="_blank">
  <FiGithub />
</a>
```

### Step 4: Replace Images

Replace the following images in `public/img/`:
- `intro-bg.jpg` - Hero section background
- `work-1.jpg` through `work-6.jpg` - Project screenshots
- `post-1.jpg` through `post-3.jpg` - Blog post images
- `testimonial-2.jpg`, `testimonial-4.jpg` - Testimonial photos

### Step 5: Customize Colors (Optional)

Edit `src/styles/index.css` to change the color scheme:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change these hex colors to your preferred colors */
}
```

### Step 6: Build for Production

When ready to deploy:

```powershell
npm run build
```

This creates an optimized production build in the `build` folder.

## 📱 Testing Responsiveness

Test your portfolio on different screen sizes:
- Desktop: > 968px
- Tablet: 768px - 968px
- Mobile: < 768px

Use Chrome DevTools (F12) to test different device sizes.

## 🐛 Common Issues

### Issue: npm install fails
**Solution**: Make sure you have Node.js v14+ installed
```powershell
node --version
```

### Issue: Port 3000 already in use
**Solution**: Kill the process or use a different port
```powershell
npm start -- --port 3001
```

### Issue: Images not showing
**Solution**: 
1. Check that images are in `public/img/` folder
2. Use the correct path: `/img/filename.jpg` (not `./img/`)

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Run development server
3. ✅ Customize all data files
4. ✅ Replace images with your own
5. ✅ Update contact information
6. ✅ Test on different devices
7. ✅ Build for production
8. ✅ Deploy to hosting platform

## 🌐 Deployment Options

### Netlify (Recommended)
1. Create account at netlify.com
2. Drag and drop your `build` folder
3. Or connect your GitHub repository

### Vercel
1. Create account at vercel.com
2. Import your GitHub repository
3. Vercel handles build automatically

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/repository-name"
   ```
3. Deploy: `npm run deploy`

## 💡 Tips

- Use high-quality images (but optimize them for web)
- Keep descriptions concise and impactful
- Update your portfolio regularly with new projects
- Test contact form before deploying
- Enable HTTPS on your hosting platform
- Add Google Analytics for tracking visitors

## 🆘 Need Help?

- Check the main README.md for detailed documentation
- Review component files for inline comments
- Test changes in development mode before building

---

Happy coding! 🎉
