'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Clock, ArrowRight, TrendingUp } from 'lucide-react'

const FeaturedArticles = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "The 2-Minute Rule: Why Starting Small Leads to Big Changes",
      excerpt: "Discover how breaking habits down into 2-minute actions can create lasting transformation in your life.",
      category: "Habit Formation",
      readTime: "5 min read",
      image: "/images/blog/two-minute-rule.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Breaking the Dopamine Loop: Understanding Digital Addiction",
      excerpt: "Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.",
      category: "Digital Wellness",
      readTime: "8 min read",
      image: "/images/blog/dopamine-loop.jpg"
    },
    {
      id: 3,
      title: "The Habit Stacking Method: Building New Routines That Stick",
      excerpt: "How to link new habits to existing ones for automatic behavior change.",
      category: "Productivity",
      readTime: "6 min read",
      image: "/images/blog/habit-stacking.jpg"
    },
    {
      id: 4,
      title: "Why Willpower Fails (And What Actually Works)",
      excerpt: "The surprising science behind why relying on willpower alone sabotages your habit change efforts.",
      category: "Psychology",
      readTime: "7 min read",
      image: "/images/blog/willpower-fails.jpg"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
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
            Evidence-based insights and practical strategies to help you build better habits and break the ones holding you back.
          </p>
        </motion.div>

        {/* Featured Article (Large) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link href={`/blog/the-2-minute-rule`} className="group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={featuredPosts[0].image}
                    alt={featuredPosts[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#DBDBDB] text-[#1a1a1a] text-sm font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-full text-xs font-medium mr-3">
                      {featuredPosts[0].category}
                    </span>
                    <Clock className="h-4 w-4 mr-1" />
                    {featuredPosts[0].readTime}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] mb-4 group-hover:text-gray-700 transition-colors">
                    {featuredPosts[0].title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {featuredPosts[0].excerpt}
                  </p>
                  <div className="flex items-center text-[#1a1a1a] font-semibold group-hover:text-gray-700">
                    Read Article
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Other Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, '-')}`} className="group">
                <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-[#1a1a1a] text-white px-2 py-1 rounded text-xs font-medium mr-3">
                        {post.category}
                      </span>
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
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

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedArticles