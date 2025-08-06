// src/components/OptimizedWordPressImage.js
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Loader } from 'lucide-react';

const OptimizedWordPressImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  fill = false,
  quality = 85,
  placeholder = 'blur',
  ...props
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Function to optimize WordPress image URLs
  const optimizeWordPressImage = (originalUrl, targetWidth, targetHeight) => {
    if (!originalUrl) return '';

    // Handle i0.wp.com, i1.wp.com, i2.wp.com CDN URLs
    if (originalUrl.includes('.wp.com')) {
      // Remove existing fit parameters and SSL
      let cleanUrl = originalUrl.split('?')[0];
      
      // Add optimized parameters
      const params = new URLSearchParams();
      if (targetWidth) params.set('w', targetWidth);
      if (targetHeight) params.set('h', targetHeight);
      params.set('quality', quality);
      params.set('ssl', '1');
      params.set('strip', 'all'); // Remove metadata
      
      return `${cleanUrl}?${params.toString()}`;
    }

    // Handle regular WordPress media URLs
    if (originalUrl.includes('/wp-content/uploads/')) {
      // For direct WordPress uploads, we can add query parameters
      const params = new URLSearchParams();
      if (targetWidth) params.set('w', targetWidth);
      if (targetHeight) params.set('h', targetHeight);
      params.set('quality', quality);
      
      return `${originalUrl}?${params.toString()}`;
    }

    // Return original URL if no optimization possible
    return originalUrl;
  };

  // Generate responsive image sources
  const generateResponsiveSources = (originalUrl, baseWidth) => {
    const sizes = [
      { width: Math.ceil(baseWidth * 0.5), density: '1x' },
      { width: Math.ceil(baseWidth * 0.75), density: '1.5x' },
      { width: baseWidth, density: '2x' },
    ];

    return sizes.map(size => ({
      ...size,
      url: optimizeWordPressImage(originalUrl, size.width, height)
    }));
  };

  // Create optimized src and srcSet
  const optimizedSrc = optimizeWordPressImage(src, width, height);
  const responsiveSources = generateResponsiveSources(src, width);
  
  // Generate srcSet for responsive images
  const srcSet = responsiveSources
    .map(source => `${source.url} ${source.width}w`)
    .join(', ');

  // Blur data URL for placeholder
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="50%" height="20%" x="25%" y="40%" fill="#e5e7eb" rx="4"/>
    </svg>`
  ).toString('base64')}`;

  // Handle loading states
  const handleLoadingComplete = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  // Error fallback component
  if (error) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-gray-400 text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded"></div>
          <p className="text-sm">Image unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {loading && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
          style={{ width, height }}
        >
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* Next.js Image with optimization */}
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoadingComplete}
        onError={handleError}
        className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        {...props}
      />
    </div>
  );
};

// Specialized component for blog post cards
export const BlogPostImage = ({ post, className = '' }) => {
  return (
    <OptimizedWordPressImage
      src={post.featuredImage?.url || post.image}
      alt={post.featuredImage?.altText || post.title}
      width={400}
      height={300}
      className={`rounded-lg shadow-sm ${className}`}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
      placeholder="blur"
      quality={80}
    />
  );
};

// Specialized component for hero images
export const HeroImage = ({ post, className = '' }) => {
  return (
    <OptimizedWordPressImage
      src={post.featuredImage?.url || post.image}
      alt={post.featuredImage?.altText || post.title}
      width={1200}
      height={600}
      className={`rounded-lg shadow-lg ${className}`}
      sizes="(max-width: 768px) 100vw, 1200px"
      priority={true}
      quality={85}
    />
  );
};

// Specialized component for article content images
export const ContentImage = ({ src, alt, className = '' }) => {
  return (
    <OptimizedWordPressImage
      src={src}
      alt={alt}
      width={800}
      height={500}
      className={`rounded-lg shadow-md my-8 ${className}`}
      sizes="(max-width: 768px) 100vw, 800px"
      quality={85}
    />
  );
};

export default OptimizedWordPressImage;