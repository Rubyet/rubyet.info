import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiAward, FiBookOpen, FiCalendar, FiMapPin, FiStar, FiCheckCircle } from 'react-icons/fi';
import { educationData, certificationsData, achievementsData } from '../../data/educationData.jsx';
import './Education.css';

const Education = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="education-section" id="education">
      <div className="education-container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="education-content"
        >
          {/* Section Header */}
          <motion.div className="section-header" variants={itemVariants}>
            <h2 className="section-title">
              <FiBookOpen className="section-icon" />
              Education & Qualifications
            </h2>
            <p className="section-subtitle">
              My academic journey and continuous learning path
            </p>
          </motion.div>

          {/* Education Timeline */}
          <div className="education-timeline">
            {educationData.map((edu, index) => (
              <motion.div
                key={edu.id}
                className="education-card"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="education-card-inner">
                  {/* Left side - Logo and timeline */}
                  <div className="education-left">
                    <div 
                      className="education-logo-container"
                      style={{ '--brand-color': edu.color }}
                    >
                      <div className="education-logo">
                        <FiBookOpen size={32} />
                      </div>
                    </div>
                    {index !== educationData.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>

                  {/* Right side - Content */}
                  <div className="education-right">
                    <div className="education-header">
                      <div className="education-degree-section">
                        <h3 className="education-degree">{edu.degree}</h3>
                        <div className="education-institution">
                          <FiMapPin className="location-icon" />
                          <span className="institution-name">{edu.institution}</span>
                        </div>
                      </div>
                      <div className="education-meta">
                        <span className="education-period">
                          <FiCalendar className="calendar-icon" />
                          {edu.period}
                        </span>
                        <span className="education-grade">
                          <FiStar className="star-icon" />
                          {edu.grade}
                        </span>
                      </div>
                    </div>

                    <p className="education-description">{edu.description}</p>

                    {/* Highlights */}
                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="education-highlights">
                        <h4 className="highlights-title">
                          <FiAward className="highlights-icon" />
                          Highlights
                        </h4>
                        <ul className="highlights-list">
                          {edu.highlights.map((highlight, idx) => (
                            <li key={idx} className="highlight-item">
                              <FiCheckCircle className="check-icon" />
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Key Courses */}
                    {edu.courses && edu.courses.length > 0 && (
                      <div className="education-courses">
                        <h4 className="courses-title">Key Courses</h4>
                        <div className="courses-tags">
                          {edu.courses.map((course, idx) => (
                            <span key={idx} className="course-tag">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connect Banner for Alumni */}
                    <div className="alumni-connect">
                      <p className="alumni-text">
                        🎓 Alumni of <strong>{edu.institution}</strong>? Let's connect and share experiences!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications Section */}
          {certificationsData && certificationsData.length > 0 && (
            <motion.div className="certifications-section" variants={itemVariants}>
              <h3 className="subsection-title">
                <FiAward className="subsection-icon" />
                Certifications & Online Learning
              </h3>
              <div className="certifications-grid">
                {certificationsData.map((cert) => (
                  <motion.a
                    key={cert.id}
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="certification-card"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="certification-icon">
                      <FiAward size={24} />
                    </div>
                    <h4 className="certification-title">{cert.title}</h4>
                    <p className="certification-issuer">{cert.issuer}</p>
                    <p className="certification-date">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="certification-id">ID: {cert.credentialId}</p>
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}

          {/* Achievements Section */}
          {achievementsData && achievementsData.length > 0 && (
            <motion.div className="achievements-section" variants={itemVariants}>
              <h3 className="subsection-title">
                <FiStar className="subsection-icon" />
                Academic Achievements & Awards
              </h3>
              <div className="achievements-grid">
                {achievementsData.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    className="achievement-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="achievement-icon">
                      <FiStar size={24} />
                    </div>
                    <h4 className="achievement-title">{achievement.title}</h4>
                    <p className="achievement-organization">{achievement.organization}</p>
                    <p className="achievement-year">{achievement.year}</p>
                    <p className="achievement-description">{achievement.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Call to Action for Alumni Connection */}
          <motion.div className="education-cta" variants={itemVariants}>
            <div className="cta-card">
              <h3 className="cta-title">Connect with Fellow Alumni</h3>
              <p className="cta-description">
                Studied at the same institution? I'd love to connect, share experiences, 
                and explore collaboration opportunities!
              </p>
              <a href="#contact" className="cta-button">
                Let's Connect
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Education;
