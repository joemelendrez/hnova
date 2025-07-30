// src/app/blog/page.js
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Clock, ArrowRight, Filter, Loader, X } from 'lucide-react'
import { 
  getAllPosts, 
  searchPosts, 
  getPostsByCategory, 
  getCategories,
  formatPostData
} from '@/lib/wordpress'
import BlogPageSkeleton from '@/components/BlogPageSkeleton'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([]) // Changed to array
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([]) // Store category objects
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [endCursor, setEndCursor] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  
  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true)
        
        // Fetch posts and categories in parallel
        const [postsData, categoriesData] = await Promise.all([
          getAllPosts(12),
          getCategories()
        ])
        
        // Format posts
        const formattedPosts = postsData.edges.map(edge => formatPostData(edge.node))
        setPosts(formattedPosts)
        setHasNextPage(postsData.pageInfo.hasNextPage)
        setEndCursor(postsData.pageInfo.endCursor)
        
        // Set up categories with both name and slug
        const categoryList = categoriesData.map(edge => ({
          name: edge.node.name,
          slug: edge.node.slug
        }))
        setCategories(categoryList)
        
      } catch (error) {
        console.error('Error fetching blog data:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchInitialData()
  }, [])
  
  // Handle search
  useEffect(() => {
    if (!searchTerm) {
      // Reset to category filter when search is cleared
      if (selectedCategories.length === 0) {
        fetchAllPosts()
      } else {
        handleCategoryFilter()
      }
      return
    }
    
    const searchDebounce = setTimeout(async () => {
      try {
        setSearching(true)
        const searchData = await searchPosts(searchTerm, 12)
        const formattedPosts = searchData.edges.map(edge => formatPostData(edge.node))
        setPosts(formattedPosts)
        setHasNextPage(false) // Disable load more for search results
        setEndCursor(null)
      } catch (error) {
        console.error('Error searching posts:', error)
        setPosts([])
      } finally {
        setSearching(false)
      }
    }, 500)
    
    return () => clearTimeout(searchDebounce)
  }, [searchTerm])

  // Handle category filtering when categories change
  useEffect(() => {
    if (!searchTerm) {
      handleCategoryFilter()
    }
  }, [selectedCategories])

  // Fetch all posts
  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      const postsData = await getAllPosts(12)
      const formattedPosts = postsData.edges.map(edge => formatPostData(edge.node))
      setPosts(formattedPosts)
      setHasNextPage(postsData.pageInfo.hasNextPage)
      setEndCursor(postsData.pageInfo.endCursor)
    } catch (error) {
      console.error('Error fetching all posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }
  
  // Handle category filtering
  const handleCategoryFilter = async () => {
    if (selectedCategories.length === 0) {
      // No categories selected, show all posts
      fetchAllPosts()
      return
    }

    try {
      setLoading(true)
      
      // Fetch posts for each selected category
      const categoryPromises = selectedCategories.map(categoryName => {
        const category = categories.find(cat => cat.name === categoryName)
        const categorySlug = category?.slug || categoryName.toLowerCase().replace(/\s+/g, '-')
        return getPostsByCategory(categorySlug, 50) // Get more posts to avoid duplicates
      })
      
      const categoryResults = await Promise.all(categoryPromises)
      
      // Combine and deduplicate posts
      const allPosts = []
      const seenIds = new Set()
      
      categoryResults.forEach(result => {
        result.edges.forEach(edge => {
          if (!seenIds.has(edge.node.id)) {
            seenIds.add(edge.node.id)
            allPosts.push(formatPostData(edge.node))
          }
        })
      })
      
      // Sort by date (newest first)
      allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
      
      setPosts(allPosts)
      setHasNextPage(false) // Disable load more for filtered results
      setEndCursor(null)
      
    } catch (error) {
      console.error('Error fetching category posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // Toggle category selection
  const toggleCategory = (categoryName) => {
    setSearchTerm('') // Clear search when changing categories
    setSelectedCategories(prev => {
      if (prev.includes(categoryName)) {
        // Remove category
        return prev.filter(cat => cat !== categoryName)
      } else {
        // Add category
        return [...prev, categoryName]
      }
    })
  }

  // Clear all category filters
  const clearAllCategories = () => {
    setSelectedCategories([])
  }
  
  // Load more posts (only works when no filters are applied)
  const loadMorePosts = async () => {
    if (!hasNextPage || loadingMore || selectedCategories.length > 0) return
    
    try {
      setLoadingMore(true)
      const postsData = await getAllPosts(12, endCursor)
      const formattedPosts = postsData.edges.map(edge => formatPostData(edge.node))
      
      setPosts(prevPosts => [...prevPosts, ...formattedPosts])
      setHasNextPage(postsData.pageInfo.hasNextPage)
      setEndCursor(postsData.pageInfo.endCursor)
      
    } catch (error) {
      console.error('Error loading more posts:', error)
    } finally {
      setLoadingMore(false)
    }
  }
  
  // Show skeleton while loading
  if (loading && posts.length === 0) {
    return <BlogPageSkeleton />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              The Habit Nova Blog
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
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500 flex-shrink-0" />
            <span className="text-sm font-medium text-gray-700">Filter by categories:</span>
            {selectedCategories.length > 0 && (
              <button
                onClick={clearAllCategories}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          
          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-3 py-1 bg-[#1a1a1a] text-white text-sm font-medium rounded-full"
                >
                  {category}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="ml-2 hover:bg-gray-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => toggleCategory(category.name)}
                disabled={searching || loading}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap disabled:opacity-50 ${
                  selectedCategories.includes(category.name)
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Summary */}
          {selectedCategories.length > 0 && !searchTerm && (
            <div className="mb-8">
              <p className="text-gray-600">
                Showing articles from: <span className="font-semibold">{selectedCategories.join(', ')}</span>
              </p>
            </div>
          )}

          {loading && posts.length === 0 ? (
            // Loading State
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-[#1a1a1a]" />
              <span className="ml-2 text-gray-600">Loading articles...</span>
            </div>
          ) : searching ? (
            // Searching State
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#1a1a1a] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Searching articles...</span>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group">
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative h-48">
                          <img
                            src={post.image}
                            alt={post.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/images/blog/default.jpg'
                            }}
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
                          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
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
              
              {/* Load More Button - Only show when no filters are applied */}
              {hasNextPage && !searchTerm && selectedCategories.length === 0 && (
                <div className="text-center mt-12">
                  <button
                    onClick={loadMorePosts}
                    disabled={loadingMore}
                    className="inline-flex items-center px-8 py-3 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Articles
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            // Empty State
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try adjusting your search terms.`
                  : selectedCategories.length > 0 
                    ? `No articles found in the selected categories: ${selectedCategories.join(', ')}`
                    : 'No articles available.'
                }
              </p>
              {(searchTerm || selectedCategories.length > 0) && (
                <div className="space-x-4">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-[#1a1a1a] font-semibold hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearAllCategories}
                      className="text-[#1a1a1a] font-semibold hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}