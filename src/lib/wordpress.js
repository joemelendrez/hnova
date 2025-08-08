// src/lib/wordpress.js - Enhanced with comprehensive caching

const WORDPRESS_API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  'https://cms.habitnova.com/graphql';

// Memory cache for ultra-fast access
const memoryCache = new Map();
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache configuration for different data types
const CACHE_CONFIG = {
  POSTS: {
    memory: 5 * 60 * 1000, // 5 minutes in memory
    browser: 10, // 10 minutes in localStorage
    revalidate: 300, // 5 minutes Next.js cache
  },
  FEATURED: {
    memory: 10 * 60 * 1000, // 10 minutes in memory
    browser: 20, // 20 minutes in localStorage
    revalidate: 600, // 10 minutes Next.js cache
  },
  CATEGORIES: {
    memory: 30 * 60 * 1000, // 30 minutes in memory
    browser: 120, // 2 hours in localStorage
    revalidate: 3600, // 1 hour Next.js cache
  },
  INDIVIDUAL_POST: {
    memory: 15 * 60 * 1000, // 15 minutes in memory
    browser: 60, // 1 hour in localStorage
    revalidate: 1800, // 30 minutes Next.js cache
  },
  SEARCH: {
    memory: 2 * 60 * 1000, // 2 minutes in memory
    browser: 5, // 5 minutes in localStorage
    revalidate: 180, // 3 minutes Next.js cache
  },
};

// Enhanced fetch function with intelligent caching
async function fetchAPI(query, { variables } = {}, cacheType = 'POSTS') {
  if (
    !process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL ===
      'https://your-wordpress-site.com/graphql'
  ) {
    console.warn(
      'WordPress API URL not configured. Please set NEXT_PUBLIC_WORDPRESS_API_URL in .env.local'
    );
    throw new Error('WordPress API URL not configured');
  }

  const config = CACHE_CONFIG[cacheType];
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
  }

  try {
    const res = await fetch(WORDPRESS_API_URL, {
      headers,
      method: 'POST',
      body: JSON.stringify({ query, variables }),
      next: {
        revalidate: config.revalidate,
        tags: [`wordpress-${cacheType.toLowerCase()}`],
      },
      cache: 'force-cache',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
    }

    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(
        `GraphQL error: ${json.errors[0]?.message || 'Unknown error'}`
      );
    }

    return json.data;
  } catch (error) {
    console.error('WordPress API Error:', error.message);
    throw error;
  }
}

// Memory cache utilities
function setMemoryCache(key, data, ttl = MEMORY_CACHE_TTL) {
  memoryCache.set(key, {
    data,
    expires: Date.now() + ttl,
    created: Date.now(),
  });
}

function getMemoryCache(key) {
  const cached = memoryCache.get(key);
  if (!cached) return null;

  if (Date.now() > cached.expires) {
    memoryCache.delete(key);
    return null;
  }

  return cached.data;
}

// Browser storage cache utilities (client-side only)
function setBrowserCache(key, data, ttlMinutes = 10) {
  if (typeof window === 'undefined') return;

  try {
    const item = {
      data,
      expires: Date.now() + ttlMinutes * 60 * 1000,
      created: Date.now(),
      version: '1.0', // For cache invalidation if needed
    };
    localStorage.setItem(`hn_cache_${key}`, JSON.stringify(item));
  } catch (error) {
    console.warn('Browser cache storage failed:', error);
  }
}

function getBrowserCache(key) {
  if (typeof window === 'undefined') return null;

  try {
    const item = localStorage.getItem(`hn_cache_${key}`);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expires) {
      localStorage.removeItem(`hn_cache_${key}`);
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.warn('Browser cache retrieval failed:', error);
    return null;
  }
}

// Intelligent cache key generation
function generateCacheKey(prefix, params = {}) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}:${params[key]}`)
    .join('|');
  return `${prefix}_${sortedParams || 'default'}`;
}

// Cache-first data fetching with fallback chain
async function fetchWithCache(cacheKey, fetchFunction, cacheType = 'POSTS') {
  const config = CACHE_CONFIG[cacheType];

  // 1. Check memory cache first (fastest)
  const memoryData = getMemoryCache(cacheKey);
  if (memoryData) {
    console.log(`📦 Cache HIT (Memory): ${cacheKey}`);
    return memoryData;
  }

  // 2. Check browser cache (fast)
  const browserData = getBrowserCache(cacheKey);
  if (browserData) {
    console.log(`💾 Cache HIT (Browser): ${cacheKey}`);
    // Promote to memory cache for next time
    setMemoryCache(cacheKey, browserData, config.memory);
    return browserData;
  }

  // 3. Fetch from API (slow)
  console.log(`🌐 Cache MISS: Fetching ${cacheKey}`);
  try {
    const data = await fetchFunction();

    // Cache the fresh data
    setMemoryCache(cacheKey, data, config.memory);
    setBrowserCache(cacheKey, data, config.browser);

    return data;
  } catch (error) {
    console.error(`Failed to fetch ${cacheKey}:`, error);
    throw error;
  }
}

// HTML entity decoder function
const decodeHtmlEntities = (text) => {
  if (!text) return '';

  if (typeof window !== 'undefined') {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
  } else {
    return text
      .replace(/&#8217;/g, "'")
      .replace(/&#8216;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&#8211;/g, '–')
      .replace(/&#8212;/g, '—')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }
};

// GraphQL Queries (keeping your existing ones)
export const GET_ALL_POSTS = `
  query GetAllPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          content
          date
          modified
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featuredPost
            customExcerpt
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_FEATURED_POSTS = `
  query GetFeaturedPosts {
    posts(first: 4, where: { status: PUBLISH }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          content
          date
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featuredPost
            customExcerpt
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($slug: String!) {
    postBy(slug: $slug) {
      id
      title
      content
      slug
      excerpt
      content
      date
      modified
      categories {
        edges {
          node {
            name
            slug
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      acfBlogFields {
        readTime
        featuredPost
        customExcerpt
      }
    }
  }
`;

export const SEARCH_POSTS = `
  query SearchPosts($search: String!, $first: Int = 20) {
    posts(first: $first, where: { search: $search, status: PUBLISH }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          content
          date
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featuredPost
            customExcerpt
          }
        }
      }
    }
  }
`;

export const GET_POSTS_BY_CATEGORY = `
  query GetPostsByCategory($categoryName: String!, $first: Int = 20) {
    posts(first: $first, where: { categoryName: $categoryName, status: PUBLISH }) {
      edges {
        node {
          id
          title
          slug
          excerpt
          content
          date
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          acfBlogFields {
            readTime
            featuredPost
            customExcerpt
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CATEGORIES = `
  query GetCategories {
    categories(first: 20, where: { hideEmpty: true }) {
      edges {
        node {
          id
          name
          slug
          count
        }
      }
    }
  }
`;

// Cached API Functions
export async function getAllPosts(first = 20, after = null) {
  const cacheKey = generateCacheKey('all_posts', { first, after });

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(
        GET_ALL_POSTS,
        {
          variables: { first, after },
        },
        'POSTS'
      );
      return data?.posts || { edges: [], pageInfo: {} };
    },
    'POSTS'
  ).catch((error) => {
    console.error('Error fetching all posts:', error.message);
    return getFallbackPosts(first);
  });
}

export async function getFeaturedPosts() {
  const cacheKey = 'featured_posts';

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(GET_FEATURED_POSTS, {}, 'FEATURED');
      const allPosts = data?.posts?.edges || [];
      const featuredPosts = allPosts.filter(
        (edge) => edge.node.acfBlogFields?.featuredPost === true
      );
      return featuredPosts.length > 0 ? featuredPosts : allPosts.slice(0, 4);
    },
    'FEATURED'
  ).catch((error) => {
    console.error('Error fetching featured posts:', error.message);
    return getFallbackPosts(4).edges;
  });
}

export async function getPostBySlug(slug) {
  const cacheKey = generateCacheKey('post_by_slug', { slug });

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(
        GET_POST_BY_SLUG,
        {
          variables: { slug },
        },
        'INDIVIDUAL_POST'
      );
      return data?.postBy;
    },
    'INDIVIDUAL_POST'
  ).catch((error) => {
    console.error('Error fetching post by slug:', error.message);
    return null;
  });
}

export async function searchPosts(searchTerm, first = 20) {
  const cacheKey = generateCacheKey('search', { searchTerm, first });

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(
        SEARCH_POSTS,
        {
          variables: { search: searchTerm, first },
        },
        'SEARCH'
      );
      return data?.posts || { edges: [] };
    },
    'SEARCH'
  ).catch((error) => {
    console.error('Error searching posts:', error.message);
    return { edges: [] };
  });
}

export async function getPostsByCategory(categoryName, first = 20) {
  const cacheKey = generateCacheKey('posts_by_category', {
    categoryName,
    first,
  });

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(
        GET_POSTS_BY_CATEGORY,
        {
          variables: { categoryName, first },
        },
        'POSTS'
      );
      return data?.posts || { edges: [], pageInfo: {} };
    },
    'POSTS'
  ).catch((error) => {
    console.error('Error fetching posts by category:', error.message);
    return { edges: [], pageInfo: {} };
  });
}

export async function getCategories() {
  const cacheKey = 'categories';

  return fetchWithCache(
    cacheKey,
    async () => {
      const data = await fetchAPI(GET_CATEGORIES, {}, 'CATEGORIES');
      return data?.categories?.edges || [];
    },
    'CATEGORIES'
  ).catch((error) => {
    console.error('Error fetching categories:', error.message);
    return [
      { node: { name: 'Habit Formation', slug: 'habit-formation' } },
      { node: { name: 'Digital Wellness', slug: 'digital-wellness' } },
      { node: { name: 'Productivity', slug: 'productivity' } },
      { node: { name: 'Psychology', slug: 'psychology' } },
      { node: { name: 'Mindfulness', slug: 'mindfulness' } },
    ];
  });
}

// Batch loading for better performance
export async function preloadCriticalData() {
  console.log('🚀 Preloading critical blog data...');

  try {
    // Load in parallel for speed
    const [posts, featured, categories] = await Promise.allSettled([
      getAllPosts(12),
      getFeaturedPosts(),
      getCategories(),
    ]);

    const result = {
      posts:
        posts.status === 'fulfilled'
          ? posts.value
          : { edges: [], pageInfo: {} },
      featured: featured.status === 'fulfilled' ? featured.value : [],
      categories: categories.status === 'fulfilled' ? categories.value : [],
    };

    console.log('✅ Critical data preloaded successfully');
    return result;
  } catch (error) {
    console.error('❌ Error preloading critical data:', error);
    return null;
  }
}

// Cache management utilities
export function clearCache() {
  // Clear memory cache
  memoryCache.clear();

  // Clear browser cache
  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('hn_cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  console.log('🧹 All caches cleared');
}

export function getCacheStats() {
  const memorySize = memoryCache.size;
  let browserSize = 0;
  let totalBrowserSize = 0;

  if (typeof window !== 'undefined') {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('hn_cache_')) {
        browserSize++;
        try {
          totalBrowserSize += localStorage.getItem(key).length;
        } catch (e) {}
      }
    });
  }

  return {
    memory: {
      count: memorySize,
      entries: Array.from(memoryCache.keys()),
    },
    browser: {
      count: browserSize,
      sizeKB: Math.round(totalBrowserSize / 1024),
    },
  };
}

// Warm up cache for better initial performance
export function warmupCache() {
  if (typeof window !== 'undefined') {
    // Preload critical data in the background
    setTimeout(() => {
      preloadCriticalData().catch(console.error);
    }, 1000);
  }
}

// Enhanced formatPostData function with better readTime handling
export function formatPostData(post) {
  const cleanExcerpt = post.excerpt?.replace(/<[^>]*>/g, '') || '';

  // Enhanced readTime calculation - checks for empty/null ACF values
  const getReadTime = () => {
    const acfReadTime = post.acfBlogFields?.readTime;

    // Check if ACF readTime exists and is not empty/null/whitespace
    if (
      acfReadTime &&
      typeof acfReadTime === 'string' &&
      acfReadTime.trim() !== ''
    ) {
      return acfReadTime.trim();
    }

    // Fallback to calculated read time using content or excerpt
    const contentForCalculation = post.content || cleanExcerpt || '';
    return calculateReadTime(contentForCalculation);
  };

  return {
    id: post.id,
    title: decodeHtmlEntities(post.title || ''),
    slug: post.slug,
    excerpt: decodeHtmlEntities(
      post.acfBlogFields?.customExcerpt || cleanExcerpt || ''
    ),
    category: decodeHtmlEntities(
      post.categories?.edges?.[0]?.node?.name || 'Uncategorized'
    ),
    categorySlug: post.categories?.edges?.[0]?.node?.slug || 'uncategorized',
    readTime: getReadTime(), // Use the enhanced function
    date: formatDate(post.date),
    image:
      post.featuredImage?.node?.sourceUrl ||
      'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=600&h=400&fit=crop&crop=center',
    imageAlt: decodeHtmlEntities(
      post.featuredImage?.node?.altText || post.title || ''
    ),
    featured: post.acfBlogFields?.featuredPost || false,
    content: decodeHtmlEntities(post.content || ''),
  };
}

export function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

// Enhanced calculateReadTime function
export function calculateReadTime(content) {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }

  // Remove HTML tags and decode entities for accurate word count
  const cleanContent = decodeHtmlEntities(content)
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  if (!cleanContent) {
    return '1 min read';
  }
  // Count words more accurately
  const words = cleanContent
    .split(/\s+/)
    .filter((word) => word.length > 0 && /\w/.test(word)); // Only count words with actual letters/numbers

  const wordCount = words.length;

  // Average reading speed (words per minute)
  const wordsPerMinute = 200; // Slightly slower than 225 for better user experience

  // Calculate read time
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Format the output
  if (readTimeMinutes === 1) {
    return '1 min read';
  } else {
    return `${readTimeMinutes} min read`;
  }
}

// Your existing fallback data function
function getFallbackPosts(count = 20) {
  const fallbackPosts = [
    {
      node: {
        id: 'fallback-1',
        title: 'The 2-Minute Rule: Why Starting Small Leads to Big Changes',
        slug: 'the-2-minute-rule-why-starting-small-leads-to-big-changes',
        excerpt:
          'Discover how breaking habits down into 2-minute actions can create lasting transformation in your life.',
        date: '2024-12-15T00:00:00',
        categories: {
          edges: [
            { node: { name: 'Habit Formation', slug: 'habit-formation' } },
          ],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
            altText: 'Person writing in journal',
          },
        },
        acfBlogFields: {
          readTime: '5 min read',
          featuredPost: true,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-2',
        title: 'Breaking the Dopamine Loop: Understanding Digital Addiction',
        slug: 'breaking-the-dopamine-loop-understanding-digital-addiction',
        excerpt:
          'Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.',
        date: '2024-12-12T00:00:00',
        categories: {
          edges: [
            { node: { name: 'Digital Wellness', slug: 'digital-wellness' } },
          ],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
            altText: 'Smartphone and laptop',
          },
        },
        acfBlogFields: {
          readTime: '8 min read',
          featuredPost: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-3',
        title: 'The Habit Stacking Method: Building New Routines That Stick',
        slug: 'the-habit-stacking-method-building-new-routines-that-stick',
        excerpt:
          'How to link new habits to existing ones for automatic behavior change.',
        date: '2024-12-10T00:00:00',
        categories: {
          edges: [{ node: { name: 'Productivity', slug: 'productivity' } }],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
            altText: 'Stack of books',
          },
        },
        acfBlogFields: {
          readTime: '6 min read',
          featuredPost: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-4',
        title: 'Why Willpower Fails (And What Actually Works)',
        slug: 'why-willpower-fails-and-what-actually-works',
        excerpt:
          'The surprising science behind why relying on willpower alone sabotages your habit change efforts.',
        date: '2024-12-08T00:00:00',
        categories: {
          edges: [{ node: { name: 'Psychology', slug: 'psychology' } }],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
            altText: 'Brain illustration',
          },
        },
        acfBlogFields: {
          readTime: '7 min read',
          featuredPost: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
    {
      node: {
        id: 'fallback-5',
        title: 'Sleeping Smarter, Not Longer: The New Rules of Productivity',
        slug: 'sleeping-smarter-not-longer-the-new-rules-of-productivity',
        excerpt:
          "Smart sleep isn't about sleeping longer; it's about optimizing sleep quality for peak productivity.",
        date: '2024-12-05T00:00:00',
        categories: {
          edges: [{ node: { name: 'Productivity', slug: 'productivity' } }],
        },
        featuredImage: {
          node: {
            sourceUrl:
              'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=400&fit=crop',
            altText: 'Person sleeping peacefully',
          },
        },
        acfBlogFields: {
          readTime: '5 min read',
          featuredPost: false,
          customExcerpt: '',
        },
        content:
          '<p>This is fallback content for development. Connect to WordPress to see real content.</p>',
      },
    },
  ];

  return {
    edges: fallbackPosts.slice(0, count),
    pageInfo: { hasNextPage: false, endCursor: null },
  };
}
