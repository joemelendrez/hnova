// src/components/BlogPostClient.js
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  ArrowRight,
  ChevronUp,
} from 'lucide-react';
import TableOfContents from '@/components/TableOfContents';
import MobileTableOfContents from '@/components/MobileTableOfContents';

const BlogPostClient = ({ post, relatedPosts = [] }) => {
  const [copied, setCopied] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  // Track scroll for scroll-to-top button
  useEffect(() => {
    const updateScrollState = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = decodeHtmlEntities(post.title);

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareTitle)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format content for display with HTML entity decoding and heading IDs
  const formatContent = (content) => {
    if (!content) return '';

    let decodedContent = decodeHtmlEntities(content);

    // Clean up WordPress content
    decodedContent = decodedContent
      .replace(/<!--.*?-->/g, '') // Remove comments
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/\[.*?\]/g, ''); // Remove shortcodes

    // Add IDs to headings for TOC navigation
    let headingCounter = 0;
    decodedContent = decodedContent.replace(
      /<(h[2-4])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attributes, content) => {
        const id = `heading-${headingCounter}`;
        headingCounter++;

        if (!attributes.includes('id=')) {
          return `<${tag} id="${id}" ${attributes} style="scroll-margin-top: 120px;">${content}</${tag}>`;
        }
        return match;
      }
    );

    return decodedContent;
  };

  const formattedContent = formatContent(post.content);

  return (
    <>
      <article className="pt-16 lg:pt-20">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4"></div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-[#DBDBDB] bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 py-6 mb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/blog"
                className="inline-flex items-center text-gray-600 hover:text-[#1a1a1a] transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block bg-accent-hover text-white px-4 py-2 rounded-full text-sm font-medium">
                {decodeHtmlEntities(post.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              {decodeHtmlEntities(post.title)}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {decodeHtmlEntities(post.excerpt)}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Share:</span>
              <button
                onClick={shareToFacebook}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </button>
              <button
                onClick={shareToTwitter}
                className="p-2 text-gray-600 hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </button>
              <button
                onClick={shareToLinkedIn}
                className="p-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </button>
              <button
                onClick={copyLink}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 rounded-lg hover:bg-gray-100"
                aria-label="Copy link"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        {post.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <img
                src={post.image}
                alt={decodeHtmlEntities(post.imageAlt || post.title)}
                className="w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Mobile Table of Contents */}
            <MobileTableOfContents content={formattedContent} />

            {/* Article Content */}
            <div
              id="article-content"
              className="blog-content prose prose-lg max-w-none prose-headings:text-[#1a1a1a] prose-a:text-[#1a1a1a] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a1a1a] prose-blockquote:border-l-[#1a1a1a] prose-blockquote:text-gray-700"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
          </motion.div>
        </div>

        {/* Desktop Table of Contents - Fixed positioning */}
        <TableOfContents content={formattedContent} />

        {/* Article Footer */}
        <footer className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="border-t border-gray-200 pt-8"
          >
            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                Filed Under:
              </h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/blog?category=${post.categorySlug}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#DBDBDB] transition-colors duration-200"
                >
                  {decodeHtmlEntities(post.category)}
                </Link>
              </div>
            </div>

            {/* Share Again */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">
                  Share this article:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={shareToFacebook}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="p-2 text-gray-600 hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={shareToLinkedIn}
                    className="p-2 text-gray-600 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                  >
                    <Linkedin className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <Link
                href="/blog"
                className="text-[#1a1a1a] font-semibold hover:underline"
              >
                ← More Articles
              </Link>
            </div>
          </motion.div>
        </footer>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-[#DBDBDB] bg-opacity-10 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-[#1a1a1a] mb-8 text-center">
                  Related Articles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="group"
                      >
                        <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="relative h-48">
                            <img
                              src={relatedPost.image}
                              alt={decodeHtmlEntities(
                                relatedPost.imageAlt || relatedPost.title
                              )}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/images/blog/default.jpg';
                              }}
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="bg-accent-hover text-white px-2 py-1 rounded text-xs font-medium mr-3">
                                {decodeHtmlEntities(relatedPost.category)}
                              </span>
                              <Clock className="h-4 w-4 mr-1" />
                              {relatedPost.readTime}
                            </div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                              {decodeHtmlEntities(relatedPost.title)}
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                              {decodeHtmlEntities(relatedPost.excerpt)}
                            </p>
                            <div className="flex items-center text-[#1a1a1a] font-semibold group-hover:text-gray-700">
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </article>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-[#1a1a1a] text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200 z-40"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
      )}
    </>
  );
};

export default BlogPostClient;
