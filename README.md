# 🚀 Modern Portfolio Website - Rubyet

A highly modern, fully responsive React portfolio website showcasing a 5-year software engineering journey. Built with cutting-edge technologies and featuring glassmorphism design, smooth animations, and modular architecture for easy customization.

![Deploy Status](https://github.com/Rubyet/rubyet.info/actions/workflows/deploy.yml/badge.svg)

## ✨ Features

- **Modern Design**: Glassmorphism effects, gradient backgrounds, and smooth animations
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Modular Architecture**: Easy to customize and extend
- **Smooth Animations**: Powered by Framer Motion
- **Type Animation**: Dynamic typing effect in hero section
- **Scroll Animations**: Elements animate as you scroll
- **Contact Form**: Integrated contact form (easily connect to EmailJS)
- **SEO Friendly**: Optimized meta tags and semantic HTML
- **Auto Deployment**: GitHub Actions for automatic FTP deployment

## 🎯 Sections

1. **Hero** - Eye-catching introduction with animated gradient background
2. **About** - Personal story with statistics and highlights
3. **Experience** - Timeline of professional journey
4. **Skills** - Interactive skill bars with categories
5. **Projects** - Filterable portfolio showcase
6. **Testimonials** - Client reviews and feedback
7. **Blog** - Latest articles and thoughts
8. **Contact** - Get in touch form with contact information
9. **Footer** - Social links and quick navigation

## 🛠️ Technologies Used

- **React** 18.2.0 - UI Library
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **React Type Animation** - Typing effect
- **React Intersection Observer** - Scroll animations
- **CSS3** - Modern styling with glassmorphism

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Steps

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

The app will open at `http://localhost:3000`

## 🎨 Customization Guide

### 1. Personal Information

Edit the data files in `src/data/`:
- `experienceData.js` - Your work experience
- `skillsData.js` - Your technical skills
- `projectsData.js` - Your projects
- `testimonialsData.js` - Client testimonials
- `blogData.js` - Blog posts

### 2. Colors & Theme

Edit `src/styles/index.css` to change the color scheme

### 3. Images

Replace images in `public/img/` with your own

### 4. Social Links

Update in `src/components/Hero/Hero.js` and `src/components/Footer/Footer.js`

### 5. Contact Information

Update in `src/components/Contact/Contact.js`

## 📱 Responsive Design

Fully responsive with breakpoints at 968px, 768px, and 480px

## 🌐 Deployment

### Automatic FTP Deployment (Current Setup)
This project is configured for automatic deployment via GitHub Actions!

**Every push to `master` branch automatically:**
1. ✅ Builds the React app
2. ✅ Deploys to FTP server
3. ✅ Updates live website

**Setup Instructions:**
1. Add GitHub Secrets (Settings → Secrets → Actions):
   - `FTP_USERNAME`: Your FTP username
   - `FTP_PASSWORD`: Your FTP password
2. Push to master branch
3. Check Actions tab for deployment status

📖 **See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions**

### Alternative Deployment Options

#### Netlify
1. Push to GitHub
2. Connect repository at netlify.com
3. Build command: `npm run build`
4. Publish directory: `build`

#### Vercel
1. Push to GitHub
2. Import project at vercel.com
3. Auto-detects React settings
4. Deploy with one click

#### GitHub Pages
```bash
npm install --save-dev gh-pages
# Add to package.json: "homepage": "https://username.github.io/repo"
npm run deploy
```

## 📄 File Structure

```
src/
├── components/       # All React components
├── data/            # Data files for easy customization
├── styles/          # Global styles
├── App.js
└── index.js
```

## 👤 Author

**Rubyet**
- GitHub: [@Rubyet](https://github.com/Rubyet)

---

**Made with ❤️ by Rubyet**
