import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FiClock, 
  FiCalendar, 
  FiTag, 
  FiArrowLeft,
  FiShare2,
  FiLinkedin,
  FiTwitter,
  FiFacebook
} from 'react-icons/fi';
import * as blogService from '../services/blogService';
import './BlogDetail.css';

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [readProgress, setReadProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = () => {
      const foundPost = blogService.getPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        blogService.incrementViews(slug);
        const related = blogService.getRelatedPosts(slug, 3);
        setRelatedPosts(related);
      }
      setLoading(false);
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const shareUrl = window.location.href;
  const shareTitle = post?.title || '';

  const handleShare = (platform) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-error">
        <h2>Post Not Found</h2>
        <p>The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" className="back-link">
          <FiArrowLeft /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.seoTitle || post.title} | Rubyet Hossain</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.seoTitle || post.title} />
        <meta property="og:description" content={post.seoDescription || post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={shareUrl} />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.seoTitle || post.title} />
        <meta name="twitter:description" content={post.seoDescription || post.excerpt} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}

        {/* Schema.org markup */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "datePublished": post.publishedDate,
            "dateModified": post.updatedAt,
            "author": {
              "@type": "Person",
              "name": post.author.name
            }
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <div className="reading-progress-bar" style={{ width: `${readProgress}%` }} />

      <div className="blog-detail-page">
        {/* Back Button */}
        <motion.div
          className="blog-detail-back"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/blog" className="back-link">
            <FiArrowLeft /> Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.article
          className="blog-article"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <header className="article-header">
            {post.coverImage && (
              <motion.img
                src={post.coverImage}
                alt={post.title}
                className="article-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            )}

            <div className="article-header-content">
              <h1>{post.title}</h1>
              
              <div className="article-meta">
                <div className="meta-item">
                  <FiCalendar />
                  <span>{formatDate(post.publishedDate)}</span>
                </div>
                <div className="meta-item">
                  <FiClock />
                  <span>{blogService.calculateReadingTime(post.content)} min read</span>
                </div>
                <div className="meta-item">
                  <span>{post.views || 0} views</span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="article-tags">
                  <FiTag />
                  {post.tags.map(tag => (
                    <Link key={tag} to={`/blog?tag=${tag}`} className="tag-link">
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="article-share">
            <h3>
              <FiShare2 /> Share this post
            </h3>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <FiTwitter /> Twitter
              </button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin">
                <FiLinkedin /> LinkedIn
              </button>
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <FiFacebook /> Facebook
              </button>
              <button onClick={handleCopyLink} className="share-btn copy">
                <FiShare2 /> Copy Link
              </button>
            </div>
          </div>
        </motion.article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            className="related-posts"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Related Posts</h2>
            <div className="related-posts-grid">
              {relatedPosts.map(relatedPost => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="related-post-card"
                >
                  {relatedPost.coverImage && (
                    <img src={relatedPost.coverImage} alt={relatedPost.title} />
                  )}
                  <div className="related-post-content">
                    <h3>{relatedPost.title}</h3>
                    <p>{relatedPost.excerpt}</p>
                    <div className="related-post-meta">
                      <span>{formatDate(relatedPost.publishedDate)}</span>
                      <span>•</span>
                      <span>{blogService.calculateReadingTime(relatedPost.content)} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
};

export default BlogDetail;
