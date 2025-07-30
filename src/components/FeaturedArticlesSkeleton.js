// src/components/FeaturedArticlesSkeleton.js
'use client'

const FeaturedArticlesSkeleton = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Keep Title Fixed */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#DBDBDB] bg-opacity-20 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
            Most Popular This Week
          </div>
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Featured Articles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-based insights and practical strategies to help you build better habits and break the ones holding you back.
          </p>
        </div>

        {/* Featured Article Skeleton (Large) */}
        <div className="mb-12 animate-pulse">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto lg:min-h-[400px]">
                <div className="w-full h-full bg-gray-200"></div>
                <div className="absolute top-4 left-4">
                  <div className="w-20 h-6 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <div className="w-24 h-5 bg-gray-300 rounded-full mr-3"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="w-full h-7 bg-gray-200 rounded"></div>
                  <div className="w-4/5 h-7 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-32 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Articles Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-20 h-4 bg-gray-300 rounded mr-3"></div>
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
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button Skeleton */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center px-8 py-3 bg-gray-200 rounded-lg animate-pulse">
            <div className="w-32 h-5 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedArticlesSkeleton