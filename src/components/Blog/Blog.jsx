import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FiClock, FiArrowRight, FiSearch, FiTag, FiX } from 'react-icons/fi';
import './Blog.css';
import * as blogService from '../../services/blogService';

const Blog = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const publishedPosts = blogService.getAllPosts('published');
    setPosts(publishedPosts);
    setFilteredPosts(publishedPosts);
    
    const tags = blogService.getAllTags();
    setAllTags(tags);
  }, []);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) {
      setSelectedTag(tagParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let result = posts;

    // Filter by tag
    if (selectedTag) {
      result = blogService.getPostsByTag(selectedTag);
    }

    // Filter by search
    if (searchQuery.trim()) {
      result = blogService.searchPosts(searchQuery, 'published');
    }

    setFilteredPosts(result);
  }, [selectedTag, searchQuery, posts]);

  const handleTagClick = (tag) => {
    if (tag === selectedTag) {
      setSelectedTag('');
      setSearchParams({});
    } else {
      setSelectedTag(tag);
      setSearchParams({ tag });
    }
    setSearchQuery('');
  };

  const handleClearFilters = () => {
    setSelectedTag('');
    setSearchQuery('');
    setSearchParams({});
    setFilteredPosts(posts);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

        {/* Search and Filters */}
        <motion.div
          className="blog-filters"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div className="tags-filter">
              <FiTag />
              <div className="tags-list">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`tag-button ${selectedTag === tag ? 'active' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(selectedTag || searchQuery) && (
            <button onClick={handleClearFilters} className="clear-filters">
              <FiX /> Clear Filters
            </button>
          )}
        </motion.div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredPosts.length === 0 ? (
            <motion.div
              className="no-posts"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
            >
              <p>No posts found. Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className="blog-card"
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                {post.coverImage && (
                  <div className="blog-image">
                    <img src={post.coverImage} alt={post.title} />
                    {post.tags && post.tags[0] && (
                      <span className="blog-category">{post.tags[0]}</span>
                    )}
                  </div>
                )}
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">
                      <FiClock /> {formatDate(post.publishedDate)}
                    </span>
                    <span className="blog-read-time">
                      {blogService.calculateReadingTime(post.content)} min read
                    </span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="blog-link">
                    Read More <FiArrowRight />
                  </Link>
                </div>
              </motion.article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Blog;
