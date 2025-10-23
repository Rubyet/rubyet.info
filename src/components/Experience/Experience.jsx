import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiBriefcase, FiCalendar } from 'react-icons/fi';
import './Experience.css';
import { experienceData } from '../../data/experienceData.jsx';

const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="experience" id="experience" ref={ref}>
      <div className="experience-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">💼 Campaign History</h2>
          <p className="section-subtitle">5+ years of leveling up in the tech MMO</p>
        </motion.div>

        <div className="timeline">
          {experienceData.map((exp, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="timeline-content">
                <div className="timeline-icon">
                  <FiBriefcase />
                </div>
                <motion.div
                  className="timeline-card"
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="timeline-header">
                    <h3>{exp.position}</h3>
                    <span className="company">{exp.company}</span>
                  </div>
                  <div className="timeline-meta">
                    <span className="date">
                      <FiCalendar /> {exp.period}
                    </span>
                    <span className="location">{exp.location}</span>
                  </div>
                  <p className="timeline-description">{exp.description}</p>
                  <div className="timeline-achievements">
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="achievement-item">
                        <span className="achievement-bullet">▹</span>
                        {achievement}
                      </div>
                    ))}
                  </div>
                  <div className="timeline-skills">
                    {exp.technologies.map((tech, i) => (
                      <span key={i} className="skill-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
