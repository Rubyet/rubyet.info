import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getYearsOfExperience } from '../../utils/dateUtils';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const yearsOfExperience = getYearsOfExperience();

  const [githubStats, setGithubStats] = useState({
    repos: '18+',
    followers: '...',
  });

  useEffect(() => {
    // Fetch GitHub stats dynamically
    fetch('https://api.github.com/users/Rubyet')
      .then(response => response.json())
      .then(data => {
        setGithubStats({
          repos: data.public_repos || '18+',
          followers: data.followers || '...',
        });
      })
      .catch(error => {
        console.error('Error fetching GitHub stats:', error);
        // Keep default values on error
      });
  }, []);

  const stats = [
    { number: yearsOfExperience, label: 'Years of Experience', icon: '⚡' },
    { number: githubStats.repos, label: 'Open Source Projects', icon: '🎮' },
    { number: '9+', label: 'Major Projects Delivered', icon: '🏆' },
    { number: githubStats.followers, label: 'GitHub Followers', icon: '🌟' },
  ];

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">📖 Character Profile</h2>
          <p className="section-subtitle">
            Level {yearsOfExperience} Developer | Main Quest: Building The Future
          </p>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="about-story">
              <h3>🎮 Hello! I'm Rubyet Hossain - The Main Character</h3>
              <p>
                I'm a full-stack developer from <strong>Dhaka, Bangladesh</strong>, and honestly? 
                My original character build was specced for <em>'Game Developer,'</em> but I got... let's say, 
                deeply side-tracked by the <em>'Game Player'</em> class. (Turns out, I was really good at 
                the "testing" phase. Just kidding, I am lazy and try to find how to make life easy in the 
                most complex way.)
              </p>
              <p>
                That gaming dream never faded; it just <strong>respawned</strong>. I've channeled that same 
                passion into the real world's most complex, ever-evolving MMO: <strong>the tech industry</strong>. 
                I'm the main character in my own developer story, and I'm here to level up.
              </p>
              
              <h4>⚔️ My Character Sheet (Skills & Stats)</h4>
              <p>
                I'm a full-stack developer whose 'skill tree' is heavily invested in <strong>Java (Spring Boot)</strong>, 
                <strong>PHP</strong>, <strong>Laravel</strong>, <strong>JavaScript</strong>, and <strong>Android development</strong>. 
                I use these skills to build scalable web applications and mobile solutions.
              </p>
              <p>
                With over <strong>{yearsOfExperience} years of experience</strong> in the field, I've contributed to major enterprise 
                projects including payment gateways, airline booking systems, and dealer management platforms. 
                Whether it's an e-commerce platform or a mobile app, I bring dedication and clean code to every quest.
              </p>
              
              <h4>🤖 The New Expansion: Embracing AI</h4>
              <p>
                The game world is getting a <strong>massive update with AI</strong>, and the difficulty is scaling. 
                My strategy? Embrace it, master the new mechanics, and use it to change how the game is played. 
                I'm adapting my build to not just keep pace, but to reach the top of the leaderboard.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🎯</span>
                <div>
                  <h4>Main Quest</h4>
                  <p>Engineer elegant solutions for complex (and sometimes boss-level) problems</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">💡</span>
                <div>
                  <h4>Strategy</h4>
                  <p>User-centered design with clean, maintainable code (no spaghetti code in my inventory!)</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🚀</span>
                <div>
                  <h4>Final Boss</h4>
                  <p>Build impactful products that make a real-world difference and conquer this game</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-stats"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
