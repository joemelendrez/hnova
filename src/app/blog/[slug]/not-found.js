// src/app/blog/[slug]/not-found.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, BookOpen, Clock, Loader } from 'lucide-react';
import { getAllPosts, formatPostData } from '@/lib/wordpress';

export default function BlogPostNotFound() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  // Get the attempted slug from the URL for better suggestions
  const getAttemptedSlug = () => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const slugIndex = pathParts.findIndex((part) => part === 'blog') + 1;
      return pathParts[slugIndex] || '';
    }
    return '';
  };

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

          // Create search suggestions based on attempted slug
          const attemptedSlug = getAttemptedSlug();
          if (attemptedSlug) {
            const suggestions = findSimilarPosts(formattedPosts, attemptedSlug);
            setSearchSuggestions(suggestions);
          }
        }
      } catch (error) {
        console.error('Error fetching recent posts for 404 page:', error);
        // Use fallback posts if WordPress API fails
        setRecentPosts(getFallbackPosts());
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  // Find posts similar to the attempted slug
  const findSimilarPosts = (posts, attemptedSlug) => {
    const searchTerms = attemptedSlug
      .toLowerCase()
      .replace(/-/g, ' ')
      .split(' ')
      .filter((term) => term.length > 2);

    if (searchTerms.length === 0) return [];

    const scoredPosts = posts.map((post) => {
      let score = 0;
      const title = post.title.toLowerCase();
      const content = (post.excerpt || '').toLowerCase();
      const category = (post.category || '').toLowerCase();

      searchTerms.forEach((term) => {
        if (title.includes(term)) score += 10;
        if (content.includes(term)) score += 5;
        if (category.includes(term)) score += 8;
        if (
          post.keywords &&
          post.keywords.some((keyword) => keyword.toLowerCase().includes(term))
        )
          score += 7;
      });

      return { post, score };
    });

    return scoredPosts
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.post);
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

  const attemptedSlug = getAttemptedSlug();
  const hasSearchSuggestions = searchSuggestions.length > 0;

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 404 Header */}
        <div className="text-center mb-12">
          <div className="text-8xl font-bold text-[#DBDBDB] mb-4">404</div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DBDBDB] bg-opacity-20 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-[#1a1a1a]" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4 font-anton uppercase">
            Blog Post Not Found
          </h1>

          {attemptedSlug && (
            <p className="text-lg text-gray-600 mb-6">
              We couldn't find a post with the URL:{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                /{attemptedSlug}
              </code>
            </p>
          )}

          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            The habit formation article you're looking for doesn't exist or may
            have been moved. Let's help you find something valuable to read
            instead.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse All Articles
            </Link>

            <Link
              href="/start-here"
              className="inline-flex items-center px-6 py-3 bg-[#DBDBDB] text-[#1a1a1a] font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Start Here Guide
            </Link>
          </div>
        </div>

        {/* Search Suggestions (if we found similar posts) */}
        {hasSearchSuggestions && !loading && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6 font-anton uppercase text-center">
              Did you mean one of these?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchSuggestions.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="block bg-blue-50 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="flex items-center text-sm text-blue-600 mb-3">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium mr-3">
                      {post.category}
                    </span>
                    <Clock className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>

                  <h3 className="font-bold text-[#1a1a1a] group-hover:text-blue-800 transition-colors mb-3 leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 text-blue-600 font-semibold text-sm">
                    Read Article →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div className="bg-[#DBDBDB] bg-opacity-10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-8 font-anton uppercase text-center">
            {hasSearchSuggestions ? 'More Recent Articles' : 'Recent Articles'}
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <Loader className="h-8 w-8 animate-spin text-[#1a1a1a] mx-auto mb-4" />
              <p className="text-gray-600">Loading recent articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts
                .slice(0, hasSearchSuggestions ? 3 : 6)
                .map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="block bg-white rounded-lg p-6 hover:shadow-md transition-shadow duration-200 group border border-gray-200"
                  >
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-xs font-medium mr-3">
                        {post.category}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>

                    <h3 className="font-bold text-[#1a1a1a] group-hover:text-gray-700 transition-colors mb-3 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="mt-4 text-[#1a1a1a] font-semibold text-sm">
                      Read Article →
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Footer Help */}
        <div className="mt-12 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Still can't find what you're looking for?
            </h3>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
