import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSave, FiArrowLeft, FiEye, FiEyeOff, FiX, FiSun, FiMoon, FiZap, FiRefreshCw, FiEdit3, FiTag } from 'react-icons/fi';
import RichTextEditor from '../components/admin/RichTextEditor/RichTextEditor';
import ImageUpload from '../components/admin/ImageUpload/ImageUpload';
import * as blogService from '../services/apiService';
import './BlogEditor.css';

const BlogEditor = ({ darkMode, toggleTheme }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: [],
    seoTitle: '',
    seoDescription: '',
    status: 'draft'
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    title: false,
    excerpt: false,
    content: false,
    tags: false,
    seo: false
  });

  useEffect(() => {
    const loadPost = async () => {
      if (isEditMode) {
        try {
          const post = await blogService.getPostById(id);
          setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt || '',
            coverImage: post.coverImage || '',
            tags: post.tags || [],
            seoTitle: post.seoTitle || '',
            seoDescription: post.seoDescription || '',
            status: post.status
          });
        } catch (error) {
          console.error('Error loading post:', error);
          alert('Post not found');
          navigate('/admin/blog');
        }
      }
    };
    loadPost();
  }, [id, isEditMode, navigate]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate SEO fields if empty
    if (field === 'title' && !formData.seoTitle) {
      setFormData(prev => ({ ...prev, seoTitle: value }));
    }
    if (field === 'excerpt' && !formData.seoDescription) {
      setFormData(prev => ({ ...prev, seoDescription: value }));
    }
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // ==================== AI ASSISTANCE FUNCTIONS ====================

  const handleImproveTitle = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a title first');
      return;
    }

    setAiLoading(prev => ({ ...prev, title: true }));
    try {
      const response = await blogService.improveTitle(formData.title);
      setFormData(prev => ({ ...prev, title: response.improved }));
    } catch (error) {
      console.error('AI Error:', error);
      alert(error.message || 'Failed to improve title. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, title: false }));
    }
  };

  const handleGenerateExcerpt = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter title and content first');
      return;
    }

    setAiLoading(prev => ({ ...prev, excerpt: true }));
    try {
      const response = await blogService.generateExcerpt(formData.title, formData.content);
      setFormData(prev => ({ ...prev, excerpt: response.excerpt }));
    } catch (error) {
      console.error('AI Error:', error);
      alert(error.message || 'Failed to generate excerpt. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, excerpt: false }));
    }
  };

  const handleContentHelp = async () => {
    const topic = formData.title.trim() || prompt('Enter a topic for content generation:');
    if (!topic) return;

    setAiLoading(prev => ({ ...prev, content: true }));
    try {
      const response = await blogService.helpWithContent(topic, formData.content);
      // Append AI content to existing content
      const newContent = formData.content.trim() 
        ? `${formData.content}\n\n${response.content}`
        : response.content;
      setFormData(prev => ({ ...prev, content: newContent }));
    } catch (error) {
      console.error('AI Error:', error);
      alert(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, content: false }));
    }
  };

  const handleSuggestTags = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter title and content first');
      return;
    }

    setAiLoading(prev => ({ ...prev, tags: true }));
    try {
      const response = await blogService.suggestTags(formData.title, formData.content);
      // Add suggested tags that aren't already in the list
      const newTags = response.tags.filter(tag => !formData.tags.includes(tag));
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ...newTags] }));
    } catch (error) {
      console.error('AI Error:', error);
      alert(error.message || 'Failed to suggest tags. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, tags: false }));
    }
  };

  const handleGenerateSEO = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter title and content first');
      return;
    }

    setAiLoading(prev => ({ ...prev, seo: true }));
    try {
      const response = await blogService.generateSEO(
        formData.title, 
        formData.content, 
        formData.excerpt
      );
      setFormData(prev => ({
        ...prev,
        seoTitle: response.seoTitle,
        seoDescription: response.seoDescription
      }));
    } catch (error) {
      console.error('AI Error:', error);
      alert(error.message || 'Failed to generate SEO. Please try again.');
    } finally {
      setAiLoading(prev => ({ ...prev, seo: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim() || formData.content === '<p><br></p>') {
      newErrors.content = 'Content is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (publish = false) => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    try {
      const postData = {
        ...formData,
        status: publish ? 'published' : 'draft'
      };

      if (isEditMode) {
        await blogService.updatePost(id, postData);
      } else {
        await blogService.createPost(postData);
      }

      navigate('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const readingTime = blogService.calculateReadingTime(formData.content);

  return (
    <div className="blog-editor-page">
      {/* Header */}
      <motion.header 
        className="editor-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="editor-header-content">
          <Link to="/admin/blog" className="back-btn">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="editor-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="preview-btn"
            >
              {showPreview ? <FiEyeOff /> : <FiEye />}
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="save-btn draft"
            >
              <FiSave /> Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="save-btn publish"
            >
              <FiEye /> {isEditMode ? 'Update & Publish' : 'Publish'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Editor Content */}
      <motion.div 
        className="editor-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {showPreview ? (
          // Preview Mode
          <div className="preview-mode">
            <div className="preview-header">
              {formData.coverImage && (
                <img 
                  src={formData.coverImage} 
                  alt={formData.title}
                  className="preview-cover"
                />
              )}
              <h1>{formData.title || 'Untitled Post'}</h1>
              <div className="preview-meta">
                <span>{new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>{readingTime} min read</span>
              </div>
              {formData.tags.length > 0 && (
                <div className="preview-tags">
                  {formData.tags.map(tag => (
                    <span key={tag} className="preview-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet...</p>' }}
            />
          </div>
        ) : (
          // Edit Mode
          <div className="editor-form">
            {/* Title */}
            <div className="form-section">
              <label className="form-label">
                Title <span className="required">*</span>
                <button
                  type="button"
                  onClick={handleImproveTitle}
                  disabled={aiLoading.title || !formData.title.trim()}
                  className="ai-btn ai-btn-inline"
                  title="Improve with AI"
                >
                  <FiZap /> {aiLoading.title ? 'Improving...' : 'AI Improve'}
                </button>
              </label>
              <input
                type="text"
                className={`title-input ${errors.title ? 'error' : ''}`}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter post title..."
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            {/* Excerpt */}
            <div className="form-section">
              <label className="form-label">
                Excerpt <span className="required">*</span>
                <button
                  type="button"
                  onClick={handleGenerateExcerpt}
                  disabled={aiLoading.excerpt || !formData.title.trim() || !formData.content.trim()}
                  className="ai-btn ai-btn-inline"
                  title="Generate with AI"
                >
                  <FiZap /> {aiLoading.excerpt ? 'Generating...' : 'AI Generate'}
                </button>
              </label>
              <textarea
                className={`excerpt-input ${errors.excerpt ? 'error' : ''}`}
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Brief summary of the post (recommended 150-160 characters)"
                rows={3}
              />
              <span className="char-count">
                {formData.excerpt.length} characters
              </span>
              {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
            </div>

            {/* Cover Image */}
            <div className="form-section">
              <label className="form-label">Cover Image</label>
              <ImageUpload
                value={formData.coverImage}
                onChange={(value) => handleChange('coverImage', value)}
                label="Upload or drop cover image"
              />
            </div>

            {/* Content */}
            <div className="form-section">
              <label className="form-label">
                Content <span className="required">*</span>
                <button
                  type="button"
                  onClick={handleContentHelp}
                  disabled={aiLoading.content}
                  className="ai-btn ai-btn-inline"
                  title="Get AI help with content"
                >
                  <FiEdit3 /> {aiLoading.content ? 'Generating...' : 'AI Help'}
                </button>
              </label>
              <div className={errors.content ? 'error-border' : ''}>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleChange('content', value)}
                  placeholder="Write your amazing content here..."
                />
              </div>
              {errors.content && <span className="error-message">{errors.content}</span>}
              <span className="reading-time">
                Estimated reading time: {readingTime} minutes
              </span>
            </div>

            {/* Tags */}
            <div className="form-section">
              <label className="form-label">
                Tags
                <button
                  type="button"
                  onClick={handleSuggestTags}
                  disabled={aiLoading.tags || !formData.title.trim() || !formData.content.trim()}
                  className="ai-btn ai-btn-inline"
                  title="Suggest tags with AI"
                >
                  <FiTag /> {aiLoading.tags ? 'Suggesting...' : 'AI Suggest'}
                </button>
              </label>
              <div className="tags-container">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="tag-remove"
                    >
                      <FiX />
                    </button>
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddTag} className="tag-input-form">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tags (press Enter)"
                  className="tag-input"
                />
              </form>
            </div>

            {/* SEO Section */}
            <div className="seo-section">
              <h3>
                SEO Settings
                <button
                  type="button"
                  onClick={handleGenerateSEO}
                  disabled={aiLoading.seo || !formData.title.trim() || !formData.content.trim()}
                  className="ai-btn"
                  title="Generate SEO with AI"
                >
                  <FiRefreshCw /> {aiLoading.seo ? 'Generating...' : 'AI Generate SEO'}
                </button>
              </h3>
              <div className="form-section">
                <label className="form-label">SEO Title</label>
                <input
                  type="text"
                  className="seo-input"
                  value={formData.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value)}
                  placeholder="Optimized title for search engines"
                  maxLength={60}
                />
                <span className="char-count">
                  {formData.seoTitle.length}/60 characters
                </span>
              </div>
              <div className="form-section">
                <label className="form-label">SEO Description</label>
                <textarea
                  className="seo-input"
                  value={formData.seoDescription}
                  onChange={(e) => handleChange('seoDescription', e.target.value)}
                  placeholder="Meta description for search engines"
                  rows={3}
                  maxLength={160}
                />
                <span className="char-count">
                  {formData.seoDescription.length}/160 characters
                </span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BlogEditor;
