// src/components/BlogPostClient.js
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Copy,
  Check,
  ArrowRight,
  ChevronUp
} from 'lucide-react'
import Button from '@/components/Button'

const BlogPostClient = ({ post, relatedPosts = [] }) => {
  const [copied, setCopied] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Track reading progress
  useEffect(() => {
    const updateReadingProgress = () => {
      const article = document.getElementById('article-content')
      if (!article) return

      const scrollTop = window.scrollY
      const docHeight = article.offsetHeight
      const winHeight = window.innerHeight
      const scrollPercent = scrollTop / (docHeight - winHeight)
      const readingPercent = Math.min(100, Math.max(0, scrollPercent * 100))
      
      setReadingProgress(readingPercent)
      setShowScrollTop(scrollTop > 400)
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [])

  // Share functions
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post.title

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')
  }

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank')
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Format content for display
  const formatContent = (content) => {
    // Remove WordPress specific tags and format for display
    return content
      .replace(/<!--.*?-->/g, '') // Remove comments
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/\[.*?\]/g, '') // Remove shortcodes
  }

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-[#DBDBDB] origin-left z-50"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: readingProgress / 100 }}
      />

      <article className="pt-16 lg:pt-20">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-gray-600 hover:text-[#1a1a1a] transition-colors duration-200 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </motion.div>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-block bg-[#1a1a1a] text-white px-4 py-2 rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
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
                {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-5 w-5" />}
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
                alt={post.imageAlt || post.title}
                className="w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          id="article-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16"
        >
          <div 
            className="prose prose-lg max-w-none prose-headings:text-[#1a1a1a] prose-headings:font-bold prose-a:text-[#1a1a1a] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1a1a1a] prose-blockquote:border-l-[#DBDBDB] prose-blockquote:text-gray-700"
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </motion.div>

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
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Filed Under:</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/blog?category=${post.categorySlug}`}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-[#DBDBDB] transition-colors duration-200"
                >
                  {post.category}
                </Link>
              </div>
            </div>

            {/* Share Again */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-medium">Share this article:</span>
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
                      <Link href={`/blog/${relatedPost.slug}`} className="group">
                        <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="relative h-48">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.imageAlt || relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.target.src = '/images/blog/default.jpg'
                              }}
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <span className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-xs font-medium mr-3">
                                {relatedPost.category}
                              </span>
                              <Clock className="h-4 w-4 mr-1" />
                              {relatedPost.readTime}
                            </div>
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                              {relatedPost.title}
                            </h3>
                            <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                              {relatedPost.excerpt}
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
  )
}

export default BlogPostClient