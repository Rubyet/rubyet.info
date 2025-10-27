import React from 'react';
import { FiGithub, FiLinkedin, FiFacebook, FiMail, FiHeart } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FiGithub />, url: 'https://github.com/Rubyet', label: 'GitHub' },
    { icon: <FiLinkedin />, url: 'https://www.linkedin.com/in/rubyethossain', label: 'LinkedIn' },
    { icon: <FiFacebook />, url: 'https://www.facebook.com/rubyethossain.rittick/', label: 'Facebook' },
    { icon: <FiMail />, url: 'mailto:rittick.2012@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-logo">
              Rubyet Hossain<span>.</span>
            </h3>
            <p className="footer-description">
              Full Stack Developer from Dhaka, Bangladesh. Passionate about creating
              robust web and mobile applications. Let's build something amazing together!
            </p>
            <div className="footer-social">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button onClick={() => scrollToSection(link.id)}>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Get In Touch</h4>
            <ul className="footer-contact">
              <li>
                <a href="mailto:rittick.2012@gmail.com">rittick.2012@gmail.com</a>
              </li>
              <li>
                <a href="https://github.com/Rubyet" target="_blank" rel="noopener noreferrer">
                  github.com/Rubyet
                </a>
              </li>
              <li>📍 Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Rubyet Hossain. All rights reserved. Made with{' '}
            <FiHeart className="heart-icon" /> in Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
