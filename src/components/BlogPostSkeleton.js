// src/components/BlogPostSkeleton.js
'use client';

const BlogPostSkeleton = () => {
  return (
    <div className="pt-16 lg:pt-20 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="w-24 h-4 bg-gray-200 rounded mb-8"></div>
      </div>

      {/* Header Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        {/* Category Badge */}
        <div className="w-32 h-6 bg-gray-200 rounded-full mb-6"></div>

        {/* Title */}
        <div className="space-y-4 mb-6">
          <div className="w-full h-8 bg-gray-200 rounded"></div>
          <div className="w-3/4 h-8 bg-gray-200 rounded"></div>
        </div>

        {/* Excerpt */}
        <div className="space-y-3 mb-8">
          <div className="w-full h-4 bg-gray-200 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Meta Information */}
        <div className="flex gap-6 mb-8">
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Share Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <div className="mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full h-64 md:h-96 lg:h-[500px] bg-gray-200 rounded-2xl"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="space-y-6">
          {/* Paragraphs */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}

          {/* Subheading */}
          <div className="w-2/3 h-6 bg-gray-200 rounded mt-8 mb-4"></div>

          {/* More paragraphs */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Posts Skeleton */}
      <div className="bg-[#DBDBDB] bg-opacity-10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-48 h-8 bg-gray-200 rounded mb-8 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-20 h-4 bg-gray-200 rounded mr-3"></div>
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
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
