import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="hero-greeting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🎮 Press START to Begin
          </motion.div>

          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            RUBYET HOSSAIN
            <span className="player-tag">[ Main Character ]</span>
          </motion.h1>

          <div className="hero-title">
            <span className="title-prefix">Class: </span>
            <TypeAnimation
              sequence={[
                'Full Stack Developer 💻',
                2000,
                'Java Springboot Specialist ☕',
                2000,
                'PHP & Laravel Expert 🐘',
                2000,
                'Android Developer 🤖',
                2000,
                'Code Warrior ⚔️',
                2000,
                'Tech Enthusiast 🎯',
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="typing-text"
            />
          </div>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span className="status-text">Status:</span> On a quest to build scalable applications & conquer the tech industry's ultimate MMO
            <br />
            <span className="location-text">📍 Home Base:</span> <span className="highlight">Dhaka, Bangladesh</span>
            <br />
            <span className="achievement-text">🏆 Achievement Unlocked:</span> <span className="highlight">Arctic Code Vault Contributor</span>
          </motion.p>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="cta-button primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('projects')}
            >
              🎯 View Quest Log
            </motion.button>
            <motion.button
              className="cta-button secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('contact')}
            >
              💬 Join Party
            </motion.button>
          </motion.div>

          <motion.div
            className="hero-social"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.a
              href="https://github.com/Rubyet"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              className="social-link"
            >
              <FiGithub />
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/rubyethossain"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              className="social-link"
            >
              <FiLinkedin />
            </motion.a>
            <motion.a
              href="https://www.facebook.com/rubyethossain.rittick"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -5 }}
              className="social-link"
            >
              <FiMail />
            </motion.a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="scroll-icon"
            onClick={() => scrollToSection('about')}
          >
            <FiArrowDown />
          </motion.div>
          <span>Scroll Down</span>
        </motion.div>

        {/* Animated Background Elements */}
        <div className="hero-background">
          <motion.div
            className="gradient-orb orb-1"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="gradient-orb orb-2"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.div
            className="gradient-orb orb-3"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
