# Rubyet Portfolio with Blog System# 🚀 Modern Portfolio Website - Rubyet



Complete portfolio website with integrated blog management system featuring separate backend and frontend.A highly modern, fully responsive React portfolio website showcasing a 5-year software engineering journey. Built with cutting-edge technologies and featuring glassmorphism design, smooth animations, and modular architecture for easy customization.



## 📁 Project Structure![Deploy Status](https://github.com/Rubyet/rubyet.info/actions/workflows/deploy.yml/badge.svg)



```## ✨ Features

rubyet.info/

├── backend/          # Node.js/Express API server- **Modern Design**: Glassmorphism effects, gradient backgrounds, and smooth animations

│   ├── data/        # JSON file storage (NOT in git)- **Dark/Light Mode**: Toggle between themes with smooth transitions

│   ├── server.js    # Main server file- **Fully Responsive**: Optimized for all devices from mobile to desktop

│   ├── package.json- **Modular Architecture**: Easy to customize and extend

│   └── .env- **Smooth Animations**: Powered by Framer Motion

│- **Type Animation**: Dynamic typing effect in hero section

├── frontend/         # React application- **Scroll Animations**: Elements animate as you scroll

│   ├── src/- **Contact Form**: Integrated contact form (easily connect to EmailJS)

│   ├── public/- **SEO Friendly**: Optimized meta tags and semantic HTML

│   ├── package.json- **Auto Deployment**: GitHub Actions for automatic FTP deployment

│   └── .env

│## 🎯 Sections

└── README.md        # This file

```1. **Hero** - Eye-catching introduction with animated gradient background

2. **About** - Personal story with statistics and highlights

## 🚀 Getting Started3. **Experience** - Timeline of professional journey

4. **Skills** - Interactive skill bars with categories

### Prerequisites5. **Projects** - Filterable portfolio showcase

- Node.js 16+ and npm installed6. **Testimonials** - Client reviews and feedback

- Git7. **Blog** - Latest articles and thoughts

8. **Contact** - Get in touch form with contact information

### Installation9. **Footer** - Social links and quick navigation



1. **Clone the repository**## 🛠️ Technologies Used

```bash

git clone https://github.com/Rubyet/rubyet.info.git- **React** 18.2.0 - UI Library

cd rubyet.info- **Framer Motion** - Animation library

```- **React Icons** - Icon library

- **React Type Animation** - Typing effect

2. **Setup Backend**- **React Intersection Observer** - Scroll animations

```bash- **CSS3** - Modern styling with glassmorphism

cd backend

npm install## 📦 Installation

cp .env.example .env  # Configure your environment

npm start  # Starts on port 5000### Prerequisites

```

- Node.js (v14 or higher)

3. **Setup Frontend** (in a new terminal)- npm or yarn

```bash

cd frontend### Steps

npm install

cp .env.example .env  # Configure your environment1. **Install dependencies**

npm start  # Starts on port 3000   ```bash

```   npm install

   ```

## 🔧 Configuration

2. **Configure Environment Variables (for Contact Form)**

### Backend (.env)   

```   Copy `.env.local` and add your EmailJS credentials:

PORT=5000   ```bash

NODE_ENV=development   # Open .env.local and add:

FRONTEND_URL=http://localhost:3000   REACT_APP_EMAILJS_SERVICE_ID=your_service_id

```   REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id

   REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key

### Frontend (.env)   ```

```   

REACT_APP_API_URL=http://localhost:5000/api   📖 **See [EMAILJS_SETUP.md](EMAILJS_SETUP.md)** for complete EmailJS setup instructions

REACT_APP_EMAILJS_SERVICE_ID=your_service_id

REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id3. **Start the development server**

REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key   ```bash

```   npm start

   ```

## 📦 Data Storage

4. **Build for production**

- **Local Development**: Data stored in `backend/data/` (excluded from git)   ```bash

- **Production**: Each environment has its own `data/` folder   npm run build

- **Format**: JSON files (`posts.json`, `analytics.json`)   ```

- **Backup**: Use export/import features in admin dashboard

The app will open at `http://localhost:3000`

## 🌐 Deployment

## 🎨 Customization Guide

### Local Development

1. Run backend: `cd backend && npm run dev`### 1. Personal Information

2. Run frontend: `cd frontend && npm start`

Edit the data files in `src/data/`:

### Production (FTP)- `experienceData.js` - Your work experience

1. **Build frontend**: `cd frontend && npm run build`- `skillsData.js` - Your technical skills

2. **Upload structure**:- `projectsData.js` - Your projects

   ```- `testimonialsData.js` - Client testimonials

   your-server/- `blogData.js` - Blog posts

   ├── backend/          # Upload entire backend folder

   │   ├── server.js### 2. Colors & Theme

   │   ├── package.json

   │   ├── .env (configure for production)Edit `src/styles/index.css` to change the color scheme

   │   └── data/ (will be created automatically)

   └── (frontend build files at root or public_html)### 3. Images

   ```

Replace images in `public/img/` with your own

3. **On server**:

```bash### 4. Social Links

cd backend

npm install --productionUpdate in `src/components/Hero/Hero.js` and `src/components/Footer/Footer.js`

npm start

```### 5. Contact Information



4. **Update frontend .env** with production API URL:Update in `src/components/Contact/Contact.js`

```

REACT_APP_API_URL=https://yourdomain.com/backend/api## 📱 Responsive Design

```

Fully responsive with breakpoints at 968px, 768px, and 480px

## 🔐 Admin Access

## 🌐 Deployment

Default credentials:

- Username: `admin`### Automatic FTP Deployment (Current Setup)

- Password: `admin123`This project is configured for automatic deployment via GitHub Actions!



**⚠️ Change these in `frontend/src/services/authService.jsx` for production!****Every push to `master` branch automatically:**

1. ✅ Builds the React app

## 📱 Features2. ✅ Deploys to FTP server

3. ✅ Updates live website

### Frontend

- Portfolio showcase with dark/light mode**Setup Instructions:**

- Blog listing with search and tags

- Individual blog post pages with SEO1. **Add FTP Credentials** (Settings → Secrets → Actions):

- Admin dashboard for blog management   - `FTP_USERNAME`: Your FTP username

- Rich text editor with preview   - `FTP_PASSWORD`: Your FTP password

- Image upload support

- Export/Import functionality2. **Add EmailJS Credentials** (Settings → Secrets → Actions):

   - `REACT_APP_EMAILJS_SERVICE_ID`: Your EmailJS service ID

### Backend API   - `REACT_APP_EMAILJS_TEMPLATE_ID`: Your EmailJS template ID

- RESTful API endpoints   - `REACT_APP_EMAILJS_PUBLIC_KEY`: Your EmailJS public key

- JSON file-based storage

- CRUD operations for posts3. Push to master branch

- Search and filtering4. Check Actions tab for deployment status

- Analytics tracking

- Automatic data initialization📖 **See [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) for step-by-step GitHub secrets configuration**



## 🛠️ Development### Alternative Deployment Options



### Backend Development#### Netlify

```bash1. Push to GitHub

cd backend2. Connect repository at netlify.com

npm run dev  # Uses nodemon for auto-restart3. Build command: `npm run build`

```4. Publish directory: `build`



### Frontend Development#### Vercel

```bash1. Push to GitHub

cd frontend2. Import project at vercel.com

npm start  # Hot reload enabled3. Auto-detects React settings

```4. Deploy with one click



## 📝 API Endpoints#### GitHub Pages

```bash

See `backend/README.md` for complete API documentation.npm install --save-dev gh-pages

# Add to package.json: "homepage": "https://username.github.io/repo"

## 🤝 Contributingnpm run deploy

```

1. Fork the repository

2. Create a feature branch## 📄 File Structure

3. Commit your changes

4. Push to the branch```

5. Open a Pull Requestsrc/

├── components/       # All React components

## 📄 License├── data/            # Data files for easy customization

├── styles/          # Global styles

MIT License - see LICENSE file for details├── App.js

└── index.js

## 👤 Author```



**Rubyet Hossain**## 👤 Author

- Website: [rubyet.info](https://rubyet.info)

- GitHub: [@Rubyet](https://github.com/Rubyet)**Rubyet**

- GitHub: [@Rubyet](https://github.com/Rubyet)

## 🙏 Acknowledgments

---

- React and Create React App

- Express.js**Made with ❤️ by Rubyet**

- React Quill for rich text editing
- Framer Motion for animations
