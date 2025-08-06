// next.config.mjs - Fixed configuration for Netlify deployment
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    // Enable modern formats
    formats: ['image/webp', 'image/avif'],

    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640, 750, 828, 1080, 1200],

    // REMOVED INVALID 'quality' KEY - This is set per-image, not globally

    // Allow images from WordPress and CDN domains
    remotePatterns: [
      // WordPress.com CDN (i0, i1, i2.wp.com)
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i1.wp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i2.wp.com',
        port: '',
        pathname: '/**',
      },
      // Direct WordPress site (replace with your actual domain)
      {
        protocol: 'https',
        hostname: 'cms.habitnova.com', // Replace with your WordPress domain
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      // Bluehost WordPress sites pattern
      {
        protocol: 'https',
        hostname: '*.bluehost.com',
        port: '',
        pathname: '/**',
      },
      // Generic WordPress hosting patterns
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.wpengine.com',
        port: '',
        pathname: '/**',
      },
      // Unsplash for fallback images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // AWS S3 (if using for WordPress media)
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Shopify domains (if using shop)
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: '*.myshopify.com',
        pathname: '/**',
      },
    ],

    // Cache images for 1 year
    minimumCacheTTL: 31536000,
    
    // Disable dangerous SVG handling for security
    dangerouslyAllowSVG: false,
  },

  // Optimize bundle and caching
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Custom headers for better caching
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images with revalidation
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // Cache background images and videos
      {
        source: '/(.*\\.(webp|mp4|webm|jpg|jpeg|png))',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Performance and security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Custom redirects for blog posts and URL structure
  async redirects() {
    return [
      // Handle old blog URL patterns if needed
      {
        source: '/blog/:slug*/page/:page',
        destination: '/blog/:slug*',
        permanent: true,
      },
      // Redirect URLs with 3+ hyphenated words to blog (likely blog posts)
      // This matches URLs like: /10-daily-habits-of-6-figure-freelancers
      // But NOT short URLs like: /about or /contact-us
      {
        source: '/:slug([a-z0-9]+-[a-z0-9]+-[a-z0-9-]+)',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },

  // URL rewrites to handle complex routing
  async rewrites() {
    return [
      // Ensure blog posts with any length slug work correctly
      {
        source: '/blog/:slug*',
        destination: '/blog/:slug*',
      },
    ];
  },

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },

  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Trailing slash configuration
  trailingSlash: false,

  // For Netlify deployment - use standalone for better performance
  // Remove output: 'export' if you want to use Netlify's Next.js runtime
  // output: 'export', // Uncomment this line only if you need static export
};

export default nextConfig;