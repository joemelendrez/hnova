'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Clock, ArrowRight, Filter } from 'lucide-react'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Habit Formation', 'Digital Wellness', 'Productivity', 'Psychology', 'Mindfulness']
  
  const blogPosts = [
    {
      id: 1,
      title: "The 2-Minute Rule: Why Starting Small Leads to Big Changes",
      excerpt: "Discover how breaking habits down into 2-minute actions can create lasting transformation in your life.",
      category: "Habit Formation",
      readTime: "5 min read",
      date: "Dec 15, 2024",
      image: "/images/blog/two-minute-rule.jpg"
    },
    {
      id: 2,
      title: "Breaking the Dopamine Loop: Understanding Digital Addiction",
      excerpt: "Learn the neuroscience behind social media addiction and proven strategies to reclaim your attention.",
      category: "Digital Wellness",
      readTime: "8 min read",
      date: "Dec 12, 2024",
      image: "/images/blog/dopamine-loop.jpg"
    },
    {
      id: 3,
      title: "The Habit Stacking Method: Building New Routines That Stick",
      excerpt: "How to link new habits to existing ones for automatic behavior change.",
      category: "Productivity",
      readTime: "6 min read",
      date: "Dec 10, 2024",
      image: "/images/blog/habit-stacking.jpg"
    },
    // Add more blog posts as needed
  ]
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })
  
  return (
    <div className="pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The HabitNova Blog
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Evidence-based insights, practical strategies, and the latest research 
              on habit formation and behavior change.
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
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
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
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#1a1a1a] text-white px-3 py-1 rounded-full text-xs font-medium">
                            {post.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{post.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
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
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}