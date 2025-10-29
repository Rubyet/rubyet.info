import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './styles/App.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Layout Components
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import About from './components/About/About.jsx';
import Experience from './components/Experience/Experience.jsx';
import Education from './components/Education/Education.jsx';
import Skills from './components/Skills/Skills.jsx';
import Projects from './components/Projects/Projects.jsx';
import Testimonials from './components/Testimonials/Testimonials.jsx';
import Blog from './components/Blog/Blog.jsx';
import Contact from './components/Contact/Contact.jsx';
import Footer from './components/Footer/Footer.jsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.jsx';

// Page Components
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BlogEditor from './pages/BlogEditor';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Home Page Component
  const HomePage = () => (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Experience />
      <Education />
      <Skills />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  );

  // Blog Page Component
  const BlogPage = () => (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <Blog />
      <Footer />
      <ScrollToTop />
    </>
  );

  // Blog Detail Page Wrapper
  const BlogDetailPage = () => (
    <>
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <BlogDetail />
      <Footer />
      <ScrollToTop />
    </>
  );

  // Admin Pages Wrapper
  const AdminDashboardPage = () => (
    <>
      <AdminDashboard darkMode={darkMode} toggleTheme={toggleTheme} />
      <ScrollToTop />
    </>
  );

  const BlogEditorPage = () => (
    <>
      <BlogEditor darkMode={darkMode} toggleTheme={toggleTheme} />
      <ScrollToTop />
    </>
  );

  const AdminLoginPage = () => (
    <>
      <AdminLogin darkMode={darkMode} toggleTheme={toggleTheme} />
      <ScrollToTop />
    </>
  );

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog"
                element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/new"
                element={
                  <ProtectedRoute>
                    <BlogEditorPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blog/edit/:id"
                element={
                  <ProtectedRoute>
                    <BlogEditorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
