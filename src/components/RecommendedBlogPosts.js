// src/components/RecommendedBlogPosts.js
//
// Usage in your product page:
// import RecommendedBlogPosts from '@/components/RecommendedBlogPosts';
//
// <RecommendedBlogPosts
//   product={product}
//   maxPosts={3}
//   title="Related Articles"
//   subtitle="Learn more about building better habits"
// />

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Loader } from 'lucide-react';
import {
  getAllPosts,
  getPostsByCategory,
  formatPostData,
} from '@/lib/wordpress';
import {
  getRecommendedCategories,
  getContextualContent,
  filterAndSortPosts,
  getFallbackPosts,
  trackBlogRecommendation,
  blogRecommendationCache,
} from '@/lib/blogRecommendations';

const RecommendedBlogPosts = ({
  product,
  maxPosts = 3,
  title,
  subtitle,
  showCTA = true,
  className = '',
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get contextual content based on product
  const contextualContent = getContextualContent(product);
  const displayTitle = title || contextualContent.title;
  const displaySubtitle = subtitle || contextualContent.subtitle;

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check cache first
        const cachedPosts = blogRecommendationCache.get(product, maxPosts);
        if (cachedPosts) {
          setPosts(cachedPosts);
          setLoading(false);
          return;
        }

        let recommendedPosts = [];
        const recommendedCategories = getRecommendedCategories(product);

        // Strategy 1: Get posts from recommended categories
        for (const category of recommendedCategories) {
          if (recommendedPosts.length >= maxPosts * 2) break; // Get more than needed for filtering

          try {
            const categoryData = await getPostsByCategory(category, 10);
            if (categoryData?.edges) {
              const categoryPosts = categoryData.edges.map((edge) =>
                formatPostData(edge.node)
              );
              recommendedPosts = [...recommendedPosts, ...categoryPosts];
            }
          } catch (categoryError) {
            console.warn(`Error fetching category ${category}:`, categoryError);
          }
        }

        // Strategy 2: If not enough posts, get recent posts
        if (recommendedPosts.length < maxPosts) {
          try {
            const recentData = await getAllPosts(maxPosts * 2);
            if (recentData?.edges) {
              const recentPosts = recentData.edges.map((edge) =>
                formatPostData(edge.node)
              );
              recommendedPosts = [...recommendedPosts, ...recentPosts];
            }
          } catch (recentError) {
            console.warn('Error fetching recent posts:', recentError);
          }
        }

        // Filter, score, and sort posts by relevance
        const filteredPosts = filterAndSortPosts(
          recommendedPosts,
          product,
          maxPosts
        );

        // If still not enough posts, use fallback
        if (filteredPosts.length < maxPosts) {
          const fallback = getFallbackPosts(
            product,
            maxPosts - filteredPosts.length
          );
          filteredPosts.push(...fallback.mockPosts);
        }

        // Remove duplicates and limit
        const uniquePosts = filteredPosts
          .filter(
            (post, index, self) =>
              index === self.findIndex((p) => p.id === post.id)
          )
          .slice(0, maxPosts);

        // Cache the results
        blogRecommendationCache.set(product, maxPosts, uniquePosts);
        setPosts(uniquePosts);

        // Track recommendation display
        trackBlogRecommendation('recommendations_displayed', {
          productHandle: product?.handle,
          productType: product?.productType,
          postCount: uniquePosts.length,
        });
      } catch (err) {
        console.error('Error fetching recommended posts:', err);
        setError(err.message);

        // Use fallback posts
        const fallback = getFallbackPosts(product, maxPosts);
        setPosts(fallback.mockPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedPosts();
  }, [product, maxPosts]);

  // Handle blog post click tracking
  const handlePostClick = (post, index) => {
    trackBlogRecommendation('blog_post_clicked', {
      productHandle: product?.handle,
      productType: product?.productType,
      postSlug: post.slug,
      position: index + 1,
    });
  };

  // Decode HTML entities for display
  const decodeHtmlEntities = (text) => {
    if (!text) return '';

    if (typeof window !== 'undefined') {
      const textArea = document.createElement('textarea');
      textArea.innerHTML = text;
      return textArea.value;
    }

    return text
      .replace(/&#8217;/g, "'")
      .replace(/&#8220;/g, '"')
      .replace(/&#8221;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
  };

  if (loading) {
    return (
      <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(maxPosts)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && posts.length === 0) {
    return null; // Don't show section if error and no fallback posts
  }

  if (posts.length === 0) {
    return null; // Don't show section if no posts to display
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
            {displayTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group h-full flex flex-col"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="h-full flex flex-col"
                onClick={() => handlePostClick(post, index)}
              >
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <img
                    src={post.image || '/images/blog/default.jpg'}
                    alt={decodeHtmlEntities(post.imageAlt || post.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/blog/default.jpg';
                    }}
                  />

                  {/* Category Badge */}
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#f10000] text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  )}

                  {/* Relevance Score Badge (for debugging - remove in production) */}
                  {process.env.NODE_ENV === 'development' &&
                    post.relevanceScore && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                          Score: {post.relevanceScore}
                        </span>
                      </div>
                    )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Read Time */}
                  {post.readTime && (
                    <div className="flex items-center text-gray-500 text-sm mb-3 flex-shrink-0">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-[#F10000] transition-colors line-clamp-2 flex-shrink-0">
                    {decodeHtmlEntities(post.title)}
                  </h3>

                  {/* Excerpt - This will grow to fill available space */}
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                    {decodeHtmlEntities(post.excerpt)}
                  </p>

                  {/* Read More Link - This will stick to bottom */}
                  <div className="flex items-center text-[#1a1a1a] font-medium group-hover:text-[#F10000] transition-colors flex-shrink-0 mt-auto">
                    <BookOpen className="h-4 w-4 mr-2" />
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Articles CTA */}
        {showCTA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-[#F10000] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              onClick={() =>
                trackBlogRecommendation('view_all_clicked', {
                  productHandle: product?.handle,
                  productType: product?.productType,
                })
              }
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Explore All Articles
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecommendedBlogPosts;
