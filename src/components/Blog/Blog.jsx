import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiClock, FiArrowRight } from 'react-icons/fi';
import './Blog.css';
import { blogData } from '../../data/blogData.jsx';

const Blog = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="blog" id="blog" ref={ref}>
      <div className="blog-container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Latest Blog Posts</h2>
          <p className="section-subtitle">
            Thoughts, stories, and insights from my journey
          </p>
        </motion.div>

        <div className="blog-grid">
          {blogData.map((post, index) => (
            <motion.article
              key={post.id}
              className="blog-card"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">
                    <FiClock /> {post.date}
                  </span>
                  <span className="blog-read-time">{post.readTime} min read</span>
                </div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <a href={post.link} className="blog-link">
                  Read More <FiArrowRight />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
