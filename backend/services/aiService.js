/**
 * AI Service - Handles AI-powered content generation
 * Uses Hugging Face Inference API (Free tier)
 * Falls back to rule-based generation if API is unavailable
 */

const axios = require('axios');

// Hugging Face API Configuration
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY || '';
const USE_FALLBACK = !HF_API_KEY || HF_API_KEY === 'hf_placeholder' || HF_API_KEY === 'your_huggingface_api_key_here';

/**
 * Make a request to Hugging Face API
 */
async function callHuggingFaceAPI(prompt, model = 'gpt2') {
  if (USE_FALLBACK) {
    throw new Error('FALLBACK');
  }

  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { 
        inputs: prompt,
        options: { wait_for_model: true }
      },
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (Array.isArray(response.data) && response.data[0]) {
      return response.data[0].generated_text || response.data[0].summary_text || '';
    }

    return response.data.generated_text || response.data.summary_text || '';
  } catch (error) {
    console.error('AI API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // For any API error, use fallback instead of failing
    throw new Error('FALLBACK');
  }
}

/**
 * Improve blog title
 */
async function improveTitle(currentTitle) {
  try {
    const prompt = `Improve this blog title to make it more engaging and SEO-friendly: "${currentTitle}"\n\nImproved title:`;
    const result = await callHuggingFaceAPI(prompt);
    return result.split('\n')[0].replace(/^["']|["']$/g, '').substring(0, 60);
  } catch (error) {
    // Fallback: Rule-based title improvement
    if (error.message === 'FALLBACK') {
      return improveTitleFallback(currentTitle);
    }
    throw error;
  }
}

/**
 * Fallback: Rule-based title improvement
 */
function improveTitleFallback(title) {
  // Capitalize words properly
  const words = title.split(' ');
  const improved = words.map((word, index) => {
    // Keep acronyms and already capitalized words
    if (word.toUpperCase() === word && word.length > 1) return word;
    
    // Capitalize first and important words
    const lowercase = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of'];
    if (index === 0 || !lowercase.includes(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
    return word.toLowerCase();
  }).join(' ');

  // Add power words if title is short
  if (improved.length < 40) {
    const powerWords = ['Complete', 'Ultimate', 'Essential', 'Comprehensive', 'Expert'];
    const randomPower = powerWords[Math.floor(Math.random() * powerWords.length)];
    
    // Check if it's a "how to" title
    if (improved.toLowerCase().startsWith('how to')) {
      return `${randomPower} Guide: ${improved}`;
    }
  }

  return improved.substring(0, 60);
}

/**
 * Generate excerpt from content
 */
async function generateExcerpt(title, content) {
  try {
    const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const contentPreview = plainContent.substring(0, 500);
    const prompt = `Create a 150 character excerpt for: ${title}. Content: ${contentPreview}\n\nExcerpt:`;
    const result = await callHuggingFaceAPI(prompt);
    return result.substring(0, 160);
  } catch (error) {
    if (error.message === 'FALLBACK') {
      return generateExcerptFallback(title, content);
    }
    throw error;
  }
}

/**
 * Fallback: Rule-based excerpt generation
 */
function generateExcerptFallback(title, content) {
  const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Get first meaningful sentences
  const sentences = plainContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
  let excerpt = sentences[0] || plainContent.substring(0, 160);
  
  // Trim to 160 characters
  if (excerpt.length > 160) {
    excerpt = excerpt.substring(0, 157) + '...';
  }
  
  return excerpt;
}

/**
 * Help with content - expand or improve content
 */
async function helpWithContent(topic, currentContent = '') {
  try {
    const prompt = `Write 2-3 paragraphs about: ${topic}`;
    const result = await callHuggingFaceAPI(prompt);
    const paragraphs = result.split(/\n\n+/).map(p => `<p>${p.trim()}</p>`).join('\n');
    return paragraphs || `<p>${result}</p>`;
  } catch (error) {
    if (error.message === 'FALLBACK') {
      return helpWithContentFallback(topic, currentContent);
    }
    throw error;
  }
}

/**
 * Fallback: Template-based content generation
 */
function helpWithContentFallback(topic, currentContent = '') {
  const templates = [
    `<p>${topic} is an important concept that many people want to understand better. Let's explore the key aspects and why it matters.</p>
     <p>When learning about ${topic}, it's essential to start with the fundamentals. This foundation will help you build a comprehensive understanding of the subject.</p>
     <p>As you continue your journey with ${topic}, remember that practice and continuous learning are key to mastery. Take your time to explore different resources and perspectives.</p>`,
    
    `<p>Understanding ${topic} can open up new opportunities and enhance your skills. This guide will help you get started on the right path.</p>
     <p>The key to success with ${topic} is consistency and dedication. Start with small steps and gradually build your expertise over time.</p>
     <p>Whether you're a beginner or looking to advance your knowledge, ${topic} offers endless possibilities for growth and development.</p>`,
    
    `<p>If you're interested in ${topic}, you're in the right place. This topic has gained significant attention and for good reason.</p>
     <p>Many experts agree that ${topic} is becoming increasingly relevant in today's world. Learning about it now will give you a valuable advantage.</p>
     <p>Take the time to explore ${topic} thoroughly. The insights you gain will be worth the investment of your time and effort.</p>`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Suggest tags based on title and content
 */
async function suggestTags(title, content) {
  try {
    const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const prompt = `Suggest tags for: ${title}. ${plainContent.substring(0, 200)}\n\nTags:`;
    const result = await callHuggingFaceAPI(prompt);
    const tags = result.toLowerCase().split(/[,\n]/).map(t => t.trim()).filter(t => t.length > 0 && t.length < 30).slice(0, 8);
    return tags;
  } catch (error) {
    if (error.message === 'FALLBACK') {
      return suggestTagsFallback(title, content);
    }
    throw error;
  }
}

/**
 * Fallback: Extract keywords as tags
 */
function suggestTagsFallback(title, content) {
  const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const text = `${title} ${plainContent}`.toLowerCase();
  
  // Common stop words to exclude
  const stopWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their'];
  
  // Extract words and count frequency
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  const frequency = {};
  
  words.forEach(word => {
    if (!stopWords.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });
  
  // Sort by frequency and take top 8
  const tags = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
  
  return tags.length > 0 ? tags : ['blog', 'article', 'content'];
}

/**
 * Generate SEO metadata
 */
async function generateSEO(title, content, excerpt) {
  try {
    const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const prompt = `Create SEO title and description for: ${title}\n\nSEO Title: `;
    const result = await callHuggingFaceAPI(prompt);
    return {
      seoTitle: title.substring(0, 60),
      seoDescription: (excerpt || plainContent.substring(0, 160))
    };
  } catch (error) {
    if (error.message === 'FALLBACK') {
      return generateSEOFallback(title, content, excerpt);
    }
    throw error;
  }
}

/**
 * Fallback: Rule-based SEO generation
 */
function generateSEOFallback(title, content, excerpt) {
  const plainContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // SEO Title: Keep original or add year
  let seoTitle = title;
  if (seoTitle.length < 50) {
    const year = new Date().getFullYear();
    seoTitle = `${title} - ${year} Guide`;
  }
  seoTitle = seoTitle.substring(0, 60);
  
  // SEO Description: Use excerpt or first sentences
  let seoDescription = excerpt;
  if (!seoDescription) {
    const sentences = plainContent.split(/[.!?]+/).filter(s => s.trim().length > 20);
    seoDescription = sentences.slice(0, 2).join('. ') + '.';
  }
  seoDescription = seoDescription.substring(0, 160);
  
  return {
    seoTitle,
    seoDescription
  };
}

module.exports = {
  improveTitle,
  generateExcerpt,
  helpWithContent,
  suggestTags,
  generateSEO
};
