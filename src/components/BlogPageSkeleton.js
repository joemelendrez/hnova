// src/components/BlogPageSkeleton.js
'use client'

const BlogPageSkeleton = () => {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section - Keep Title Fixed */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog.
                        </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Evidence-based insights, practical strategies, and the latest research 
              on habit formation and behavior change.
            </p>
            
            {/* Search Bar Skeleton */}
            <div className="max-w-md mx-auto relative">
              <div className="w-full h-12 bg-white rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter Skeleton */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto">
            <div className="w-5 h-5 bg-gray-300 rounded animate-pulse flex-shrink-0"></div>
            {['All', 'Habit Formation', 'Digital Wellness', 'Productivity', 'Psychology', 'Mindfulness'].map((category, index) => (
              <div
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  index === 0
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid Skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                  <div className="relative h-48">
                    <div className="w-full h-full bg-gray-200"></div>
                    <div className="absolute top-4 left-4">
                      <div className="w-20 h-5 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm mb-3">
                      <div className="w-16 h-4 bg-gray-200 rounded mr-2"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full mx-2"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded mr-1"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-5 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="w-full h-3 bg-gray-200 rounded"></div>
                      <div className="w-full h-3 bg-gray-200 rounded"></div>
                      <div className="w-2/3 h-3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 h-4 bg-gray-300 rounded"></div>
                      <div className="w-4 h-4 bg-gray-200 rounded ml-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlogPageSkeleton