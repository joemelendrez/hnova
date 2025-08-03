// src/app/not-found.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  Home,
  Compass,
  Loader,
} from 'lucide-react';
import { getAllPosts, formatPostData } from '@/lib/wordpress';
import Button from '@/components/Button';

export default function NotFound() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Fetch recent posts from WordPress
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);

        // Fetch recent posts with timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 5000)
        );

        const postsPromise = getAllPosts(6); // Get 6 recent posts
        const postsData = await Promise.race([postsPromise, timeoutPromise]);

        if (postsData?.edges && postsData.edges.length > 0) {
          const formattedPosts = postsData.edges.map((edge) =>
            formatPostData(edge.node)
          );
          setRecentPosts(formattedPosts);

          // Generate some search suggestions based on popular topics
          const suggestions = generateSearchSuggestions(formattedPosts);
          setSearchSuggestions(suggestions);
        }
      } catch (error) {
        console.error('Error fetching recent posts for 404 page:', error);
        // Use fallback posts if WordPress API fails
        setRecentPosts(getFallbackPosts());
        setSearchSuggestions(getFallbackSearchSuggestions());
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Generate search suggestions from posts
  const generateSearchSuggestions = (posts) => {
    const categories = [...new Set(posts.map((post) => post.category))];
    const keywords = [
      'habit formation',
      'breaking bad habits',
      'productivity',
      'digital wellness',
    ];

    return [...categories.slice(0, 3), ...keywords.slice(0, 2)];
  };

  // Fallback posts if WordPress API is unavailable
  const getFallbackPosts = () => [
    {
      id: 'fallback-1',
      title: 'The 2-Minute Rule: Why Starting Small Leads to Big Changes',
      slug: 'the-2-minute-rule-why-starting-small-leads-to-big-changes',
      excerpt:
        'Discover how breaking habits down into 2-minute actions creates lasting transformation.',
      category: 'Habit Formation',
      readTime: '5 min read',
      date: 'Dec 15, 2024',
    },
    {
      id: 'fallback-2',
      title: 'Breaking the Dopamine Loop: Understanding Digital Addiction',
      slug: 'breaking-the-dopamine-loop-understanding-digital-addiction',
      excerpt:
        'Learn the neuroscience behind social media addiction and proven strategies to reclaim attention.',
      category: 'Digital Wellness',
      readTime: '8 min read',
      date: 'Dec 12, 2024',
    },
    {
      id: 'fallback-3',
      title: 'The Habit Stacking Method: Building New Routines That Stick',
      slug: 'the-habit-stacking-method-building-new-routines-that-stick',
      excerpt:
        'How to link new habits to existing ones for automatic behavior change.',
      category: 'Productivity',
      readTime: '6 min read',
      date: 'Dec 10, 2024',
    },
  ];

  const getFallbackSearchSuggestions = () => [
    'Habit Formation',
    'Digital Wellness',
    'Productivity',
    'habit formation',
    'breaking bad habits',
  ];

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 404 Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-8xl md:text-9xl font-anton text-[#DBDBDB] mb-4 uppercase">
            404
          </div>

          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#DBDBDB] bg-opacity-20 rounded-full mb-8">
            <Compass className="h-10 w-10 text-[#1a1a1a]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-anton text-[#1a1a1a] mb-6 uppercase">
            Page Not Found
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            The page you're looking for doesn't exist, but don't worry—we have
            plenty of evidence-based content to help you build better habits.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button href="/" variant="primary" size="large" className="group">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Button>

            <Button
              href="/blog"
              variant="secondary"
              size="large"
              className="group"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Browse Articles
            </Button>
          </div>
        </motion.div>

        {/* Quick Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-anton text-[#1a1a1a] mb-6 uppercase text-center">
              Popular Topics
            </h2>

            <div className="flex flex-wrap gap-3 justify-center">
              {searchSuggestions.map((suggestion, index) => (
                <Link
                  key={index}
                  href={`/blog?search=${encodeURIComponent(suggestion)}`}
                  className="px-4 py-2 bg-[#DBDBDB] bg-opacity-20 hover:bg-opacity-30 text-[#1a1a1a] rounded-full transition-colors duration-200 font-medium"
                >
                  {suggestion}
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Articles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#DBDBDB] bg-opacity-10 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-anton text-[#1a1a1a] mb-8 uppercase text-center">
            Recent Articles
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <Loader className="h-8 w-8 animate-spin text-[#1a1a1a] mx-auto mb-4" />
              <p className="text-gray-600 font-roboto">
                Loading recent articles...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group h-full block"
                    >
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200 h-full flex flex-col">
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                              {post.category}
                            </span>
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>

                          <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                            {post.title}
                          </h3>

                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3 flex-grow">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center text-[#1a1a1a] font-semibold group-hover:text-gray-700 mt-auto">
                            Read Article
                            <ArrowLeft className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200 rotate-180" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* View All Articles */}
              <div className="text-center mt-12">
                <Button
                  href="/blog"
                  variant="primary"
                  size="large"
                  className="group"
                >
                  View All Articles
                  <ArrowLeft className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200 rotate-180" />
                </Button>
              </div>
            </>
          )}
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-anton uppercase">
              Still Need Help?
            </h3>

            <p className="text-gray-600 mb-6 font-roboto">
              Can't find what you're looking for? We're here to help you on your
              habit transformation journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/blog"
                className="inline-flex items-center text-[#1a1a1a] hover:underline font-medium"
              >
                <Search className="mr-2 h-4 w-4" />
                Search our blog
              </Link>

              <span className="hidden sm:block text-gray-400">•</span>

              <Link
                href="/contact"
                className="inline-flex items-center text-[#1a1a1a] hover:underline font-medium"
              >
                Contact us for help
              </Link>

              <span className="hidden sm:block text-gray-400">•</span>

              <Link
                href="/start-here"
                className="inline-flex items-center text-[#1a1a1a] hover:underline font-medium"
              >
                New? Start here
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-12 text-center"
        >
          <p className="text-lg text-gray-600 font-roboto italic">
            "Every expert was once a beginner. Every pro was once an amateur.
            Every icon was once an unknown."
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Start your habit transformation today
          </p>
        </motion.div>
      </div>
    </div>
  );
}
