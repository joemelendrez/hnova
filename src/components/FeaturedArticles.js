// src/components/FeaturedArticles.js - Optimized with new image component
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { BlogPostImage, HeroImage } from './OptimizedWordpressImage';
import {
  getFeaturedPosts,
  getAllPosts,
  formatPostData,
  preloadCriticalData,
} from '@/lib/wordpress';
import FeaturedArticlesSkeleton from './FeaturedArticlesSkeleton';

const FeaturedArticles = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=2560&h=1707&fit=crop',
          altText: 'Person writing in journal about habit formation'
        },
        slug: 'the-2-minute-rule-why-starting-small-leads-to-big-changes',
      },
      {
        id: 'fallback-2',
        title: 'Breaking the Dopamine Loop: Understanding Digital Addiction',
        excerpt:
          'Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.',
        category: 'Digital Wellness',
        readTime: '8 min read',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=2560&h=1707&fit=crop',
          altText: 'Smartphone with notification icons showing digital addiction'
        },
        slug: 'breaking-the-dopamine-loop-understanding-digital-addiction',
      },
      {
        id: 'fallback-3',
        title: 'The Habit Stacking Method: Building New Routines That Stick',
        excerpt:
          'How to link new habits to existing ones for automatic behavior change.',
        category: 'Productivity',
        readTime: '6 min read',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=2560&h=1707&fit=crop',
          altText: 'Stack of books representing habit stacking method'
        },
        slug: 'the-habit-stacking-method-building-new-routines-that-stick',
      },
      {
        id: 'fallback-4',
        title: 'Why Willpower Fails (And What Actually Works)',
        excerpt:
          'The surprising science behind why relying on willpower alone sabotages your habit change efforts.',
        category: 'Psychology',
        readTime: '7 min read',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1559291001-693fb9166cba?w=2560&h=1707&fit=crop',
          altText: 'Brain scan showing willpower and decision-making areas'
        },
        slug: 'why-willpower-fails-and-what-actually-works',
      },
    ],
    []
  );

  // Optimized data loading
  const fetchFeaturedPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try preloaded data first
      const criticalData = await preloadCriticalData();
      if (criticalData?.featuredPosts) {
        setFeaturedPosts(criticalData.featuredPosts.slice(0, 4));
        setLoading(false);
        return;
      }

      // Fallback to API calls
      let posts = [];
      
      try {
        posts = await getFeaturedPosts(4);
      } catch (featuredError) {
        console.warn('Featured posts failed, falling back to all posts:', featuredError);
        const allPosts = await getAllPosts(4);
        posts = allPosts.slice(0, 4);
      }

      if (posts && posts.length > 0) {
        const formattedPosts = posts.map(formatPostData);
        setFeaturedPosts(formattedPosts);
      } else {
        setFeaturedPosts(fallbackPosts);
      }
    } catch (err) {
      console.error('Error loading featured posts:', err);
      setError(err.message);
      setFeaturedPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  }, [fallbackPosts]);

  useEffect(() => {
    fetchFeaturedPosts();
  }, [fetchFeaturedPosts]);

  if (loading) {
    return <FeaturedArticlesSkeleton />;
  }

  if (error && featuredPosts.length === 0) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-anton uppercase text-[#1a1a1a] mb-4">
            Featured Articles
          </h2>
          <p className="text-gray-600">
            Unable to load articles. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const [mainPost, ...otherPosts] = featuredPosts;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-anton uppercase text-[#1a1a1a] mb-4">
          Featured Articles
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Evidence-based insights and practical strategies to transform your habits and daily routines
        </p>
      </motion.div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Featured Article */}
        {mainPost && (
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:row-span-2"
          >
            <Link 
              href={`/blog/${mainPost.slug}`} 
              className="group block h-full"
            >
              <div className="relative h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                {/* Hero Image - Using optimized component */}
                <div className="relative h-80 lg:h-96 overflow-hidden">
                  <HeroImage 
                    post={mainPost}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#DBDBDB] text-[#1a1a1a] px-3 py-1 rounded-full text-sm font-medium">
                      <TrendingUp className="inline w-4 h-4 mr-1" />
                      {mainPost.category || 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-anton uppercase text-[#1a1a1a] mb-4 group-hover:text-gray-700 transition-colors">
                      {mainPost.title}
                    </h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
                      {mainPost.excerpt}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {mainPost.readTime || '5 min read'}
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#DBDBDB] group-hover:text-[#1a1a1a] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.article>
        )}

        {/* Secondary Articles */}
        <div className="space-y-6">
          {otherPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Link 
                href={`/blog/${post.slug}`} 
                className="group block"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="flex">
                    {/* Thumbnail - Using optimized component */}
                    <div className="w-32 sm:w-40 flex-shrink-0">
                      <BlogPostImage 
                        post={post}
                        className="w-full h-32 object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <Zap className="w-4 h-4 text-[#DBDBDB] mr-1" />
                          <span className="text-xs text-gray-500 uppercase font-medium">
                            {post.category || 'Insight'}
                          </span>
                        </div>
                        <h3 className="text-lg font-anton uppercase text-[#1a1a1a] mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {post.readTime || '5 min read'}
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#DBDBDB] group-hover:text-[#1a1a1a] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      {/* View All Articles CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center mt-12"
      >
        <Link 
          href="/blog" 
          className="inline-flex items-center bg-[#DBDBDB] text-[#1a1a1a] px-8 py-4 rounded-lg font-medium hover:bg-gray-300 transition-colors group"
        >
          View All Articles
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
};

export default FeaturedArticles;