'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowRight, TrendingUp,ShoppingBag, Zap } from 'lucide-react';
import {
  getFeaturedPosts,
  getAllPosts,
  formatPostData,
  preloadCriticalData,
  getCacheStats,
} from '@/lib/wordpress';
import FeaturedArticlesSkeleton from './FeaturedArticlesSkeleton';

const FeaturedArticles = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cacheHit, setCacheHit] = useState(false);
  const [loadTime, setLoadTime] = useState(0);

  // Parallax and shrink effects
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [100, -50]); // Moves up as you scroll
  const opacity = useTransform(scrollY, [0, 300], [0.95, 1]); // Subtle fade in
  
  // Shrink effect - section gets smaller as you scroll away from it
  const scale = useTransform(scrollY, [800, 1400], [1, 0.95]); // Shrinks from 100% to 95%
  const borderRadius = useTransform(scrollY, [800, 1400], [36, 40]); // Bottom corners get more rounded

  // Memoize fallback posts to prevent recreation on every render
  const fallbackPosts = useMemo(
    () => [
      {
        id: 'fallback-1',
        title: 'The 2-Minute Rule: Why Starting Small Leads to Big Changes',
        excerpt:
          'Discover how breaking habits down into 2-minute actions can create lasting transformation in your life.',
        category: 'Habit Formation',
        readTime: '5 min read',
        image:
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
        slug: 'the-2-minute-rule-why-starting-small-leads-to-big-changes',
      },
      {
        id: 'fallback-2',
        title: 'Breaking the Dopamine Loop: Understanding Digital Addiction',
        excerpt:
          'Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.',
        category: 'Digital Wellness',
        readTime: '8 min read',
        image:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=400&fit=crop',
        slug: 'breaking-the-dopamine-loop-understanding-digital-addiction',
      },
      {
        id: 'fallback-3',
        title: 'The Habit Stacking Method: Building New Routines That Stick',
        excerpt:
          'How to link new habits to existing ones for automatic behavior change.',
        category: 'Productivity',
        readTime: '6 min read',
        image:
          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop',
        slug: 'the-habit-stacking-method-building-new-routines-that-stick',
      },
      {
        id: 'fallback-4',
        title: 'Why Willpower Fails (And What Actually Works)',
        excerpt:
          'The surprising science behind why relying on willpower alone sabotages your habit change efforts.',
        category: 'Psychology',
        readTime: '7 min read',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
        slug: 'why-willpower-fails-and-what-actually-works',
      },
    ],
    []
  );

  // Optimized data fetching with performance tracking
  const fetchFeaturedPosts = useCallback(async () => {
    const startTime = performance.now();

    try {
      setLoading(true);
      setError(null);

      console.log('🎯 FeaturedArticles: Starting data fetch');

      // Try to use preloaded critical data first (fastest)
      const criticalData = await preloadCriticalData();

      if (criticalData?.featured && criticalData.featured.length > 0) {
        console.log('📦 FeaturedArticles: Using preloaded data (CACHE HIT)');
        setCacheHit(true);

        const formattedPosts = criticalData.featured.map((edge) => {
          const post = edge.node || edge;
          return formatPostData(post);
        });

        setFeaturedPosts(formattedPosts);
      } else {
        // Fallback to individual API calls
        console.log('🌐 FeaturedArticles: Fetching from API');
        setCacheHit(false);

        let posts = await getFeaturedPosts();

        if (!posts || posts.length === 0) {
          console.log(
            '📋 FeaturedArticles: No featured posts, getting recent posts'
          );
          const allPosts = await getAllPosts(4);
          posts = allPosts.edges || [];
        }

        const formattedPosts = posts.map((edge) => {
          const post = edge.node || edge;
          return formatPostData(post);
        });

        setFeaturedPosts(formattedPosts);
      }

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      setLoadTime(duration);

      console.log(`✅ FeaturedArticles: Loaded in ${duration}ms`);
    } catch (err) {
      console.error('❌ FeaturedArticles: Error fetching posts:', err);
      setError('Failed to load featured articles');
      setCacheHit(false);

      // Use fallback posts
      setFeaturedPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  }, [fallbackPosts]);

  // Initialize data fetching
  useEffect(() => {
    fetchFeaturedPosts();
  }, [fetchFeaturedPosts]);

  // Performance indicator (development only)
  const PerformanceIndicator = () => {
    if (process.env.NODE_ENV !== 'development' || loading) return null;

    return (
      <div className="absolute top-8 right-8 z-20">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
            cacheHit
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
        >
          <Zap className="h-3 w-3" />
          {cacheHit ? 'CACHED' : 'API'} • {loadTime}ms
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 bg-white rounded-t-[2rem] lg:rounded-t-[3rem] -mt-16 lg:-mt-20 overflow-hidden"
      >
        <FeaturedArticlesSkeleton />
      </motion.div>
    );
  }

  if (error && featuredPosts.length === 0) {
    return (
      <motion.section 
        style={{ 
          y, 
          opacity, 
          scale,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius 
        }}
        className="relative z-10 bg-white rounded-t-[2rem] lg:rounded-t-[3rem] -mt-16 lg:-mt-20 pt-24 pb-20 shadow-2xl overflow-hidden"
      >
        <PerformanceIndicator />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#DBDBDB] bg-opacity-20 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
              <TrendingUp className="mr-2 h-4 w-4" />
              Most Popular This Week
            </div>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              Featured Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evidence-based insights and practical strategies to help you build
              better habits and break the ones holding you back.
            </p>
          </div>

          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">
              Unable to Load Articles
            </h3>
            <p className="text-gray-600">
              Please check back later or visit our blog directly.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center mt-4 px-6 py-3 bg-[#fe0000] text-white font-semibold rounded-lg hover:bg-[#dc2626] transition-colors duration-200"
            >
              View Blog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      style={{
        y,
        opacity,
        scale,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      }}
      className="relative z-10 bg-white rounded-t-[2rem] lg:rounded-t-[3rem] -mt-16 lg:-mt-20 pt-8 shadow-2xl overflow-hidden"
    >
      <PerformanceIndicator />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#DBDBDB] bg-opacity-20 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
            <TrendingUp className="mr-2 h-4 w-4" />
            Most Popular This Week
          </div>
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Featured Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based insights and practical strategies to help you build
            better habits and break the ones holding you back.
          </p>
        </motion.div>

        {/* Large Featured Article */}
        {featuredPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link href={`/blog/${featuredPosts[0].slug}`} className="group">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#DBDBDB]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={featuredPosts[0].image}
                      alt={featuredPosts[0].imageAlt || featuredPosts[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="eager" // Load featured image immediately
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#DBDBDB] text-[#1a1a1a] text-sm font-medium rounded-full shadow-lg">
                        Featured
                      </span>
                    </div>
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <span className="bg-[#fe0000] text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                        {featuredPosts[0].category}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      {featuredPosts[0].readTime}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-4 group-hover:text-[#fe0000] transition-colors duration-300 leading-tight">
                      {featuredPosts[0].title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {featuredPosts[0].excerpt}
                    </p>
                    <div className="flex items-center text-[#fe0000] font-semibold group-hover:text-[#dc2626] transition-colors duration-200">
                      Read Article
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid of Other Posts */}
        {featuredPosts.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: Math.min(index * 0.1, 0.5),
                }}
                className="h-full"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group h-full block"
                >
                  <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-[#DBDBDB] h-full flex flex-col group-hover:-translate-y-1">
                    <div className="relative h-48 flex-shrink-0 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.imageAlt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading={index < 2 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop';
                        }}
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-[#fe0000] text-white px-2 py-1 rounded text-xs font-medium mr-3">
                          {post.category}
                        </span>
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                      <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#fe0000] transition-colors duration-300 leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-[#fe0000] font-semibold group-hover:text-[#dc2626] transition-colors duration-200 mt-auto">
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="text-center mt-12 pb-8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-[#fe0000] text-white font-semibold rounded-lg hover:bg-[#dc2626] transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>

        {/* Cache Status Indicator (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600">
              <Zap className="h-4 w-4" />
              {cacheHit ? (
                <span className="text-green-700">
                  ✅ Loaded from cache ({loadTime}ms)
                </span>
              ) : (
                <span className="text-blue-700">
                  🌐 Loaded from API ({loadTime}ms)
                </span>
              )}
              {error && (
                <span className="text-orange-700">⚠️ Using fallback data</span>
              )}
            </div>
          </motion.div>
        )}
        {/* Tools & Resources Hub Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-20 mb-16"
        >
          <div className="bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] rounded-2xl p-8 lg:p-12 border border-gray-200">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-[#DBDBDB] bg-opacity-50 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Habit-Building Tools
              </div>
              <h3 className="text-3xl font-anton text-[#1a1a1a] mb-4 leading-tight">
                Turn Knowledge Into Action
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                Discover scientifically-designed tools, journals, and resources
                that make building better habits easier and more effective.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Tool Category 1 - Tracking & Planning */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#fe0000] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#1a1a1a] mb-3">
                  Tracking & Planning
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Habit trackers, planning journals, and progress monitoring
                  tools designed using behavioral psychology principles.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• 90-Day Habit Trackers</div>
                  <div>• Planning & Goal-Setting Journals</div>
                  <div>• Progress Visualization Tools</div>
                </div>
              </div>

              {/* Tool Category 2 - Focus & Productivity */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#fe0000] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#1a1a1a] mb-3">
                  Focus & Productivity
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Time-blocking systems, focus timers, and productivity
                  accessories that eliminate distractions and boost
                  concentration.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Pomodoro & Focus Timers</div>
                  <div>• Time-Blocking Templates</div>
                  <div>• Distraction Management Tools</div>
                </div>
              </div>

              {/* Tool Category 3 - Wellness & Mindfulness */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 bg-[#fe0000] bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h4 className="font-semibold text-[#1a1a1a] mb-3">
                  Wellness & Mindfulness
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Meditation aids, stress management tools, and wellness
                  accessories that support mental health and mindful living.
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>• Meditation & Breathing Tools</div>
                  <div>• Stress Management Accessories</div>
                  <div>• Sleep & Recovery Products</div>
                </div>
              </div>
            </div>

            {/* Featured Stats
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-8">
              <div>
                <div className="text-3xl font-bold text-[#fe0000] mb-1">
                  50+
                </div>
                <div className="text-sm text-gray-600">Curated Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#fe0000] mb-1">
                  4.8★
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#fe0000] mb-1">
                  2,000+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#fe0000] mb-1">
                  Free
                </div>
                <div className="text-sm text-gray-600">Shipping Available</div>
              </div>
            </div> */}

            {/* Call-to-Action */}
            <div className="text-center">
              <motion.a
                href="https://shop.habitnova.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#fe0000] text-white font-semibold rounded-lg hover:bg-[#dc2626] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingBag className="mr-3 h-5 w-5" />
                Visit Our Full Store
                <svg
                  className="ml-3 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </motion.a>

              <p className="text-gray-500 text-sm mt-4">
                Browse our complete collection of scientifically-backed habit
                formation tools
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturedArticles;