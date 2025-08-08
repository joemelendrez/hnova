// src/app/blog/page.js - Updated with enhanced readTime calculation
'use client';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Clock,
  ArrowRight,
  Filter,
  Loader,
  X,
  Zap,
  Database,
} from 'lucide-react';
import {
  getAllPosts,
  searchPosts,
  getPostsByCategory,
  getCategories,
  preloadCriticalData,
  getCacheStats,
  warmupCache,
} from '@/lib/wordpress';
import BlogPageSkeleton from '@/components/BlogPageSkeleton';

// Enhanced formatPostData function for blog page
function formatPostDataEnhanced(post) {
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

  // Decode HTML entities
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

  // Format date
  const formatDate = (dateString) => {
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

// Enhanced calculateReadTime function
function calculateReadTime(content) {
  if (!content || typeof content !== 'string') {
    return '1 min read';
  }

  // Remove HTML tags and decode entities for accurate word count
  const cleanContent = content
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
  console.log(
    `Word count for calculation: ${wordCount}, content length: ${cleanContent.length}`
  ); // Debug log

  // Average reading speed (words per minute)
  const wordsPerMinute = 200;

  // Calculate read time
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  // Format the output
  if (readTimeMinutes === 1) {
    return '1 min read';
  } else {
    return `${readTimeMinutes} min read`;
  }
}


export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    memory: { count: 0 },
    browser: { count: 0 },
  });
  const [showCacheStats, setShowCacheStats] = useState(false);

  // Memoize expensive computations
  const filteredPostsCount = useMemo(() => posts.length, [posts]);
  const hasActiveFilters = useMemo(
    () => searchTerm.length > 0 || selectedCategories.length > 0,
    [searchTerm, selectedCategories]
  );


  // Optimized initial data loading with preloading
  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);
      console.time('Initial Data Load');

      // Try to use preloaded critical data first
      const criticalData = await preloadCriticalData();

      if (criticalData) {
        // Use the preloaded data with enhanced formatting
        const formattedPosts = criticalData.posts.edges.map((edge) =>
          formatPostDataEnhanced(edge.node)
        );
        const categoryList = criticalData.categories.map((edge) => ({
          name: edge.node.name,
          slug: edge.node.slug,
        }));

        setPosts(formattedPosts);
        setHasNextPage(criticalData.posts.pageInfo.hasNextPage);
        setEndCursor(criticalData.posts.pageInfo.endCursor);
        setCategories(categoryList);

        console.log('✅ Used preloaded critical data');
      } else {
        // Fallback to individual API calls
        const [postsData, categoriesData] = await Promise.all([
          getAllPosts(12),
          getCategories(),
        ]);

        const formattedPosts = postsData.edges.map((edge) =>
          formatPostDataEnhanced(edge.node)
        );
        setPosts(formattedPosts);
        setHasNextPage(postsData.pageInfo.hasNextPage);
        setEndCursor(postsData.pageInfo.endCursor);

        const categoryList = categoriesData.map((edge) => ({
          name: edge.node.name,
          slug: edge.node.slug,
        }));
        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setPosts([]);
    } finally {
      setLoading(false);
      console.timeEnd('Initial Data Load');
      // Update cache stats
      setCacheStats(getCacheStats());
    }
  }, []);

  // Initialize cache warmup and fetch data
  useEffect(() => {
    warmupCache(); // Start warming up cache in background
    fetchInitialData();
  }, [fetchInitialData]);

  // Optimized search with debouncing
  useEffect(() => {
    if (!searchTerm.trim()) {
      // Reset to category filter when search is cleared
      if (selectedCategories.length === 0) {
        fetchAllPosts();
      } else {
        handleCategoryFilter();
      }
      return;
    }

    const searchDebounce = setTimeout(async () => {
      try {
        setSearching(true);
        console.time(`Search: ${searchTerm}`);

        const searchData = await searchPosts(searchTerm, 12);
        const formattedPosts = searchData.edges.map((edge) =>
          formatPostDataEnhanced(edge.node)
        );
        setPosts(formattedPosts);
        setHasNextPage(false); // Disable load more for search results
        setEndCursor(null);

        console.timeEnd(`Search: ${searchTerm}`);
      } catch (error) {
        console.error('Error searching posts:', error);
        setPosts([]);
      } finally {
        setSearching(false);
        setCacheStats(getCacheStats()); // Update cache stats after search
      }
    }, 500);

    return () => clearTimeout(searchDebounce);
  }, [searchTerm, selectedCategories]);

  // Handle category filtering when categories change
  useEffect(() => {
    if (!searchTerm) {
      handleCategoryFilter();
    }
  }, [selectedCategories]);

  // Optimized fetch all posts with caching
  const fetchAllPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.time('Fetch All Posts');

      const postsData = await getAllPosts(12);
      const formattedPosts = postsData.edges.map((edge) =>
        formatPostDataEnhanced(edge.node)
      );
      setPosts(formattedPosts);
      setHasNextPage(postsData.pageInfo.hasNextPage);
      setEndCursor(postsData.pageInfo.endCursor);

      console.timeEnd('Fetch All Posts');
    } catch (error) {
      console.error('Error fetching all posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized category filtering with parallel requests and deduplication
  const handleCategoryFilter = useCallback(async () => {
    if (selectedCategories.length === 0) {
      fetchAllPosts();
      return;
    }

    try {
      setLoading(true);
      console.time(`Category Filter: ${selectedCategories.join(', ')}`);

      // Fetch posts for each selected category in parallel
      const categoryPromises = selectedCategories.map((categoryName) => {
        const category = categories.find((cat) => cat.name === categoryName);
        const categorySlug =
          category?.slug || categoryName.toLowerCase().replace(/\s+/g, '-');
        return getPostsByCategory(categorySlug, 50); // Get more posts to avoid duplicates
      });

      const categoryResults = await Promise.all(categoryPromises);

      // Combine and deduplicate posts efficiently
      const postsMap = new Map();

      categoryResults.forEach((result) => {
        result.edges.forEach((edge) => {
          if (!postsMap.has(edge.node.id)) {
            postsMap.set(edge.node.id, formatPostDataEnhanced(edge.node));
          }
        });
      });

      // Convert to array and sort by date (newest first)
      const allPosts = Array.from(postsMap.values()).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setPosts(allPosts);
      setHasNextPage(false); // Disable load more for filtered results
      setEndCursor(null);

      console.timeEnd(`Category Filter: ${selectedCategories.join(', ')}`);
    } catch (error) {
      console.error('Error fetching category posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategories, categories, fetchAllPosts]);

  // Optimized category toggle
  const toggleCategory = useCallback((categoryName) => {
    setSearchTerm(''); // Clear search when changing categories
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  }, []);

  // Clear all category filters
  const clearAllCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  // Optimized load more with caching
  const loadMorePosts = useCallback(async () => {
    if (!hasNextPage || loadingMore || selectedCategories.length > 0) return;

    try {
      setLoadingMore(true);
      console.time('Load More Posts');

      const postsData = await getAllPosts(12, endCursor);
      const formattedPosts = postsData.edges.map((edge) =>
        formatPostDataEnhanced(edge.node)
      );

      setPosts((prevPosts) => [...prevPosts, ...formattedPosts]);
      setHasNextPage(postsData.pageInfo.hasNextPage);
      setEndCursor(postsData.pageInfo.endCursor);

      console.timeEnd('Load More Posts');
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
      setCacheStats(getCacheStats()); // Update cache stats
    }
  }, [hasNextPage, loadingMore, selectedCategories.length, endCursor]);

  // Show skeleton while loading
  if (loading && posts.length === 0) {
    return <BlogPageSkeleton />;
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog.</h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Evidence-based insights, practical strategies, and the latest
              research on habit formation and behavior change.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white text-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#DBDBDB] focus:outline-none"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Performance Stats Bar (Development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-blue-700">
                  <Zap className="h-4 w-4" />
                  <span>
                    Cache: {cacheStats.memory.count} memory,{' '}
                    {cacheStats.browser.count} browser
                  </span>
                </div>
                <div className="flex items-center gap-1 text-green-700">
                  <Database className="h-4 w-4" />
                  <span>{filteredPostsCount} articles loaded</span>
                </div>
              </div>
              <button
                onClick={() => setShowCacheStats(!showCacheStats)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {showCacheStats ? 'Hide' : 'Show'} Details
              </button>
            </div>

            {showCacheStats && (
              <div className="mt-2 pt-2 border-t border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-xs text-blue-600">
                  <div>
                    <strong>Memory Cache:</strong> {cacheStats.memory.count}{' '}
                    entries
                    <div className="mt-1 max-h-20 overflow-y-auto">
                      {cacheStats.memory.entries?.slice(0, 5).map((key, i) => (
                        <div key={i} className="truncate">
                          {key}
                        </div>
                      ))}
                      {cacheStats.memory.entries?.length > 5 && (
                        <div>
                          +{cacheStats.memory.entries.length - 5} more...
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Browser Cache:</strong> {cacheStats.browser.count}{' '}
                    entries ({cacheStats.browser.sizeKB}KB)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">
              Filter by categories:
            </span>
            {selectedCategories.length > 0 && (
              <button
                onClick={clearAllCategories}
                className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {selectedCategories.map((category) => (
                <motion.span
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center px-3 py-1 bg-accent-hover text-white text-sm font-medium rounded-full whitespace-nowrap flex-shrink-0"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-2 hover:bg-gray-700 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Category Buttons - Scrollable */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => toggleCategory(category.name)}
                disabled={searching || loading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 disabled:opacity-50 ${
                  selectedCategories.includes(category.name)
                    ? 'bg-accent text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Scroll indicator */}
          {categories.length > 4 && (
            <div className="text-xs text-gray-400 mt-2 text-center">
              ← Scroll to see more categories →
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: Math.min(index * 0.1, 0.8),
            }}
            className="flex" // ensure child can stretch if needed
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group flex flex-col flex-grow"
            >
              <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col h-full">
                <div className="relative h-48 flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading={index < 6 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      e.currentTarget.src = '/images/blog/default.jpg';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-accent-hover text-white px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Body: grows to fill space */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  {/* Spacer is implicit because flex-grow on excerpt if needed */}
                </div>

                {/* Footer: stays at bottom */}
                <div className="px-6 pb-6">
                  <div className="flex items-center text-[#1a1a1a] font-semibold group-hover:text-gray-700">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </article>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
