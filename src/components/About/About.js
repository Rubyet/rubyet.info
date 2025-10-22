import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './About.css';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const stats = [
    { number: '1,200+', label: 'GitHub Contributions' },
    { number: '18+', label: 'Public Repositories' },
    { number: '9+', label: 'Major Projects' },
    { number: '5+', label: 'Technologies Mastered' },
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
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            My journey as a software engineer
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
              <h3>Hello! I'm Rubyet Hossain</h3>
              <p>
                I'm a passionate full-stack developer from <strong>Dhaka, Bangladesh</strong>, with expertise
                in building scalable web applications and mobile solutions. My journey in tech has been
                driven by curiosity and a desire to create impactful digital experiences.
              </p>
              <p>
                I specialize in <strong>PHP, Laravel, JavaScript,</strong> and <strong>Android development</strong>.
                With over <strong>1,200+ contributions</strong> on GitHub and multiple projects ranging from
                e-commerce platforms to mobile applications, I've honed my skills across the full development stack.
              </p>
              <p>
                I'm recognized as an <strong>Arctic Code Vault Contributor</strong> and continuously strive
                to learn new technologies and best practices. Whether it's building a football fixture tracker
                or developing secure API authentication systems, I bring dedication and technical excellence
                to every project.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🎯</span>
                <div>
                  <h4>Mission</h4>
                  <p>Creating elegant solutions to complex problems</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">💡</span>
                <div>
                  <h4>Approach</h4>
                  <p>User-centered design with clean, maintainable code</p>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🚀</span>
                <div>
                  <h4>Goal</h4>
                  <p>Building products that make a difference</p>
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
