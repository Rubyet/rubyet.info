import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const formRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('Sending your message...');
    
    try {
      // EmailJS configuration from environment variables
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      // Check if credentials are configured
      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS credentials not configured. Please check your .env.local file.');
      }

      // Template params that will be sent to your email
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'rittick.2012@gmail.com', // Your email
      };

      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setStatus('✅ Message sent successfully! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsLoading(false);
      
      // Clear status after 5 seconds
      setTimeout(() => setStatus(''), 5000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus('❌ Failed to send message. Please email me directly at rittick.2012@gmail.com');
      setIsLoading(false);
      
      // Clear error status after 7 seconds
      setTimeout(() => setStatus(''), 7000);
    }
  };

  const contactInfo = [
    {
      icon: <FiMail />,
      title: 'Email',
      value: 'rittick.2012@gmail.com',
      link: 'mailto:rittick.2012@gmail.com',
    },
    {
      icon: <FiPhone />,
      title: 'GitHub',
      value: 'github.com/Rubyet',
      link: 'https://github.com/Rubyet',
    },
    {
      icon: <FiMapPin />,
      title: 'Location',
      value: 'Dhaka, Bangladesh',
      link: '#',
    },
  ];

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="contact-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">
            Let's work together on your next project
          </p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3>Let's talk about everything!</h3>
            <p>
              Don't hesitate to reach out if you have a project in mind or just
              want to say hello. I'm always open to discussing new opportunities,
              creative ideas, or partnerships.
            </p>

            <div className="contact-info-items">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.link}
                  className="contact-info-item"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, x: 10 }}
                >
                  <div className="contact-icon">{item.icon}</div>
                  <div className="contact-details">
                    <h4>{item.title}</h4>
                    <p>{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="form-input"
                  rows="6"
                  disabled={isLoading}
                />
              </div>
              <motion.button
                type="submit"
                className="submit-btn"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Message'} <FiSend />
              </motion.button>
              {status && (
                <motion.p
                  className={`form-status ${status.includes('✅') ? 'success' : status.includes('❌') ? 'error' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {status}
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
