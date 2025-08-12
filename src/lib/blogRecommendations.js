// src/lib/blogRecommendations.js
// Utility functions to enhance blog post recommendations for products

/**
 * Product-specific blog post mapping
 * Maps product handles/types to specific blog categories or posts
 */
export const PRODUCT_BLOG_MAPPING = {
  // Product handles mapped to relevant categories
  'habit-tracking-journal': ['habit-formation', 'productivity'],
  'digital-detox-journal': ['digital-wellness', 'mindfulness'],
  'morning-routine-planner': ['productivity', 'habit-formation'],
  'productivity-power-pack': ['productivity', 'psychology'],
  'mindfulness-habit-kit': ['mindfulness', 'psychology'],
  'evening-routine-guide': ['habit-formation', 'mindfulness'],
  'habit-stacking-workbook': ['habit-formation', 'psychology'],
  'focus-enhancement-toolkit': ['productivity', 'digital-wellness'],
  'sleep-optimization-guide': ['habit-formation', 'wellness'],
  'exercise-habit-builder': ['habit-formation', 'wellness'],
  
  // Product types mapped to categories
  'journal': ['habit-formation', 'productivity'],
  'digital-wellness': ['digital-wellness', 'mindfulness'],
  'productivity': ['productivity', 'psychology'],
  'template': ['productivity', 'habit-formation'],
  'workbook': ['habit-formation', 'psychology'],
  'guide': ['habit-formation', 'productivity'],
  'toolkit': ['productivity', 'digital-wellness'],
  'planner': ['productivity', 'habit-formation'],
};

/**
 * Get recommended categories for a product
 */
export function getRecommendedCategories(product) {
  if (!product) return ['habit-formation', 'productivity'];

  // Check product handle first
  if (product.handle && PRODUCT_BLOG_MAPPING[product.handle]) {
    return PRODUCT_BLOG_MAPPING[product.handle];
  }

  // Check product type
  if (product.productType && PRODUCT_BLOG_MAPPING[product.productType.toLowerCase()]) {
    return PRODUCT_BLOG_MAPPING[product.productType.toLowerCase()];
  }

  // Check tags for matches
  if (product.tags && Array.isArray(product.tags)) {
    for (const tag of product.tags) {
      const normalizedTag = tag.toLowerCase().replace(/\s+/g, '-');
      if (PRODUCT_BLOG_MAPPING[normalizedTag]) {
        return PRODUCT_BLOG_MAPPING[normalizedTag];
      }
    }
  }

  // Default categories based on product analysis
  const productText = [
    product.title,
    product.description,
    ...(product.tags || [])
  ].join(' ').toLowerCase();

  if (productText.includes('digital') || productText.includes('screen') || productText.includes('phone')) {
    return ['digital-wellness', 'mindfulness'];
  }
  
  if (productText.includes('morning') || productText.includes('routine')) {
    return ['productivity', 'habit-formation'];
  }
  
  if (productText.includes('journal') || productText.includes('tracking')) {
    return ['habit-formation', 'productivity'];
  }
  
  if (productText.includes('mindful') || productText.includes('meditation')) {
    return ['mindfulness', 'psychology'];
  }

  // Default categories
  return ['habit-formation', 'productivity'];
}

/**
 * Generate contextual titles and subtitles based on product
 */
export function getContextualContent(product) {
  if (!product) {
    return {
      title: "Related Articles",
      subtitle: "Learn more about building better habits"
    };
  }

  const productType = product.productType?.toLowerCase() || '';
  const title = product.title?.toLowerCase() || '';
  const tags = product.tags?.map(tag => tag.toLowerCase()) || [];
  const description = product.description?.toLowerCase() || '';

  // Combine all text for analysis
  const allText = [title, productType, description, ...tags].join(' ');

  // Journal-specific content
  if (productType.includes('journal') || title.includes('journal') || allText.includes('tracking')) {
    return {
      title: "Maximize Your Journaling Practice",
      subtitle: "Evidence-based techniques to get the most from your habit journal"
    };
  }

  // Digital wellness content
  if (tags.includes('digital-wellness') || allText.includes('digital') || allText.includes('detox') || allText.includes('screen')) {
    return {
      title: "Digital Wellness Resources",
      subtitle: "Science-backed strategies for a healthier relationship with technology"
    };
  }

  // Productivity content
  if (productType.includes('productivity') || allText.includes('productivity') || allText.includes('planner') || allText.includes('efficiency')) {
    return {
      title: "Boost Your Productivity",
      subtitle: "Research-proven methods to optimize your daily routines and habits"
    };
  }

  // Mindfulness content
  if (tags.includes('mindfulness') || allText.includes('mindfulness') || allText.includes('meditation') || allText.includes('awareness')) {
    return {
      title: "Mindful Habit Building",
      subtitle: "Integrate mindfulness practices into your daily routine for lasting change"
    };
  }

  // Morning routine content
  if (allText.includes('morning') || allText.includes('routine')) {
    return {
      title: "Perfect Your Morning Routine",
      subtitle: "Start your day right with these evidence-based morning habits"
    };
  }

  // Evening routine content
  if (allText.includes('evening') || allText.includes('night') || allText.includes('sleep')) {
    return {
      title: "Evening Routine Mastery",
      subtitle: "Wind down effectively and prepare for better habits tomorrow"
    };
  }

  // Habit stacking content
  if (allText.includes('stacking') || allText.includes('chain') || allText.includes('sequence')) {
    return {
      title: "Master Habit Stacking",
      subtitle: "Learn to chain habits together for exponential behavior change"
    };
  }

  // Beginner content
  if (allText.includes('beginner') || allText.includes('start') || allText.includes('getting started')) {
    return {
      title: "Getting Started with Better Habits",
      subtitle: "Essential foundations for successful habit formation"
    };
  }

  // Advanced content
  if (allText.includes('advanced') || allText.includes('mastery') || allText.includes('expert')) {
    return {
      title: "Advanced Habit Strategies",
      subtitle: "Take your habit practice to the next level with expert techniques"
    };
  }

  // Default content
  return {
    title: "Continue Your Habit Journey",
    subtitle: "Discover proven strategies for lasting behavior change"
  };
}

/**
 * Enhanced keyword extraction for better blog matching
 */
export function extractEnhancedKeywords(product) {
  if (!product) return [];

  const allText = [
    product.title,
    product.description,
    product.productType,
    ...(product.tags || [])
  ].filter(Boolean).join(' ').toLowerCase();

  // Comprehensive habit-related keywords with categories
  const keywordCategories = {
    // Core habit concepts (highest priority)
    habits: [
      'habit', 'habits', 'routine', 'ritual', 'practice', 'formation', 
      'building', 'breaking', 'change', 'behavioral', 'behavior', 
      'consistency', 'discipline', 'willpower', 'motivation'
    ],
    
    // Tools and methods (high priority)
    tools: [
      'tracking', 'journal', 'planner', 'template', 'worksheet', 
      'guide', 'system', 'method', 'framework', 'strategy', 
      'technique', 'approach', 'process'
    ],
    
    // Time-based habits (medium priority)
    timing: [
      'morning', 'evening', 'daily', 'weekly', 'monthly', 'schedule', 
      'time', 'routine', 'ritual', 'start', 'end', 'begin', 'finish'
    ],
    
    // Wellness categories (medium priority)
    wellness: [
      'digital', 'wellness', 'detox', 'mindfulness', 'meditation', 
      'focus', 'productivity', 'health', 'fitness', 'exercise', 
      'sleep', 'nutrition', 'stress', 'anxiety'
    ],
    
    // Psychology terms (medium priority)
    psychology: [
      'psychology', 'psychological', 'cognitive', 'mental', 'mind', 
      'brain', 'neuroscience', 'dopamine', 'reward', 'trigger', 
      'cue', 'response', 'feedback', 'loop'
    ],
    
    // Goals and outcomes (lower priority)
    outcomes: [
      'goal', 'goals', 'success', 'achievement', 'improvement', 
      'transformation', 'change', 'progress', 'growth', 'development', 
      'results', 'outcome', 'benefit', 'advantage'
    ],

    // Specific habit types (context-specific)
    habitTypes: [
      'reading', 'writing', 'exercise', 'meditation', 'journaling',
      'planning', 'organizing', 'cleaning', 'cooking', 'learning',
      'studying', 'working', 'focusing', 'breathing', 'stretching'
    ]
  };

  const foundKeywords = [];
  
  Object.entries(keywordCategories).forEach(([category, keywords]) => {
    const matches = keywords.filter(keyword => allText.includes(keyword));
    if (matches.length > 0) {
      foundKeywords.push({ category, keywords: matches });
    }
  });

  return foundKeywords;
}

/**
 * Score posts based on relevance to product
 */
export function scorePostRelevance(post, product) {
  if (!post || !product) return 0;

  let score = 0;
  const productKeywords = extractEnhancedKeywords(product);
  const postText = [
    post.title,
    post.excerpt,
    post.category,
    ...(post.tags || [])
  ].join(' ').toLowerCase();

  // Score based on keyword categories with different weights
  productKeywords.forEach(({ category, keywords }) => {
    keywords.forEach(keyword => {
      if (postText.includes(keyword)) {
        // Different weights for different categories
        switch (category) {
          case 'habits':
            score += 5; // Highest weight for core habit concepts
            break;
          case 'tools':
            score += 4; // High weight for tools and methods
            break;
          case 'wellness':
            score += 3; // Medium weight for wellness topics
            break;
          case 'psychology':
            score += 3; // Medium weight for psychology
            break;
          case 'timing':
            score += 2; // Lower weight for timing
            break;
          case 'outcomes':
            score += 2; // Lower weight for outcomes
            break;
          case 'habitTypes':
            score += 2; // Context-specific habits
            break;
          default:
            score += 1;
        }
      }
    });
  });

  // Bonus scoring for title matches (titles are more important)
  productKeywords.forEach(({ keywords }) => {
    keywords.forEach(keyword => {
      if (post.title.toLowerCase().includes(keyword)) {
        score += 3; // Bonus for title matches
      }
    });
  });

  // Bonus for category matches
  const recommendedCategories = getRecommendedCategories(product);
  if (post.categorySlug && recommendedCategories.includes(post.categorySlug)) {
    score += 5; // High bonus for category matches
  }

  // Bonus for exact product type matches
  if (product.productType && post.title.toLowerCase().includes(product.productType.toLowerCase())) {
    score += 4;
  }

  // Penalty for very old posts (encourage fresh content)
  if (post.date) {
    const postDate = new Date(post.date);
    const monthsOld = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsOld > 12) {
      score -= 1; // Small penalty for posts older than a year
    }
  }

  return Math.max(0, score); // Ensure non-negative score
}

/**
 * Advanced blog post filtering and sorting
 */
export function filterAndSortPosts(posts, product, maxPosts = 3) {
  if (!posts || !Array.isArray(posts)) return [];

  // Score and sort posts
  const scoredPosts = posts
    .map(post => ({
      ...post,
      relevanceScore: scorePostRelevance(post, product)
    }))
    .filter(post => post.relevanceScore > 0) // Only include relevant posts
    .sort((a, b) => {
      // Primary sort: relevance score
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      // Secondary sort: date (newer first)
      return new Date(b.date || 0) - new Date(a.date || 0);
    })
    .slice(0, maxPosts);

  return scoredPosts;
}

/**
 * Fallback posts for when no relevant content is found
 */
export function getFallbackPosts(product, maxPosts = 3) {
  const fallbackCategories = getRecommendedCategories(product);
  
  const baseMockPosts = [
    {
      id: 'fallback-1',
      title: 'The Science of Habit Formation',
      slug: 'science-of-habit-formation',
      excerpt: 'Understand the neurological basis of how habits form and how to use this knowledge to build better routines.',
      category: 'Psychology',
      categorySlug: 'psychology',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 5
    },
    {
      id: 'fallback-2',
      title: 'Building Habits That Stick',
      slug: 'building-habits-that-stick',
      excerpt: 'Practical strategies backed by research to create lasting behavioral changes in your daily life.',
      category: 'Habit Formation',
      categorySlug: 'habit-formation',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 5
    },
    {
      id: 'fallback-3',
      title: 'Productivity Habits for Success',
      slug: 'productivity-habits-for-success',
      excerpt: 'Discover the daily habits that high-achievers use to maximize their productivity and accomplish their goals.',
      category: 'Productivity',
      categorySlug: 'productivity',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 4
    },
    {
      id: 'fallback-4',
      title: 'Digital Wellness: Reclaiming Your Time',
      slug: 'digital-wellness-reclaiming-your-time',
      excerpt: 'Learn evidence-based strategies to reduce screen time and build a healthier relationship with technology.',
      category: 'Digital Wellness',
      categorySlug: 'digital-wellness',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 4
    },
    {
      id: 'fallback-5',
      title: 'Mindful Habit Formation',
      slug: 'mindful-habit-formation',
      excerpt: 'Integrate mindfulness practices into your habit-building routine for greater awareness and success.',
      category: 'Mindfulness',
      categorySlug: 'mindfulness',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 3
    },
    {
      id: 'fallback-6',
      title: 'The Power of Morning Routines',
      slug: 'power-of-morning-routines',
      excerpt: 'Transform your mornings and set yourself up for daily success with these evidence-based routine strategies.',
      category: 'Productivity',
      categorySlug: 'productivity',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      date: new Date().toISOString(),
      relevanceScore: 4
    }
  ];

  // Filter and sort fallback posts based on recommended categories
  const relevantFallbacks = baseMockPosts
    .filter(post => fallbackCategories.includes(post.categorySlug))
    .slice(0, maxPosts);

  // If not enough category-specific posts, fill with general ones
  if (relevantFallbacks.length < maxPosts) {
    const remaining = baseMockPosts
      .filter(post => !fallbackCategories.includes(post.categorySlug))
      .slice(0, maxPosts - relevantFallbacks.length);
    relevantFallbacks.push(...remaining);
  }

  return {
    categories: fallbackCategories,
    mockPosts: relevantFallbacks.slice(0, maxPosts)
  };
}

/**
 * Analytics tracking for blog recommendations
 */
export function trackBlogRecommendation(eventType, data) {
  if (typeof window !== 'undefined') {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag('event', eventType, {
        event_category: 'blog_recommendations',
        event_label: data.productHandle || 'unknown',
        custom_parameters: {
          product_type: data.productType,
          blog_post_slug: data.postSlug,
          recommendation_position: data.position,
          post_count: data.postCount
        }
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', 'BlogRecommendation', {
        event_type: eventType,
        product_handle: data.productHandle,
        product_type: data.productType
      });
    }

    // Generic analytics
    if (window.analytics) {
      window.analytics.track('Blog Recommendation', {
        event_type: eventType,
        product_handle: data.productHandle,
        product_type: data.productType,
        blog_post_slug: data.postSlug,
        position: data.position
      });
    }

    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Blog Recommendation Event:', eventType, data);
    }
  }
}

/**
 * A/B test different recommendation strategies
 */
export function getRecommendationStrategy(product) {
  // Simple A/B test based on product ID or handle
  const identifier = product?.id || product?.handle || '';
  const lastChar = identifier.slice(-1);
  const isEven = parseInt(lastChar) % 2 === 0;
  
  return isEven ? 'keyword_based' : 'category_based';
}

/**
 * Cache management for blog recommendations
 */
class BlogRecommendationCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 10 * 60 * 1000; // 10 minutes TTL
    this.maxSize = 100; // Maximum cache entries
  }

  generateKey(product, maxPosts) {
    const productId = product?.handle || product?.id || 'unknown';
    return `${productId}_${maxPosts}`;
  }

  get(product, maxPosts) {
    const key = this.generateKey(product, maxPosts);
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      // Move to end (LRU)
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached.data;
    }
    
    // Remove expired entry
    if (cached) {
      this.cache.delete(key);
    }
    
    return null;
  }

  set(product, maxPosts, data) {
    const key = this.generateKey(product, maxPosts);
    
    // Implement LRU eviction
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp < this.ttl) {
        validEntries++;
      } else {
        expiredEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton cache instance
export const blogRecommendationCache = new BlogRecommendationCache();

// Cleanup expired cache entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    blogRecommendationCache.cleanup();
  }, 5 * 60 * 1000);
}