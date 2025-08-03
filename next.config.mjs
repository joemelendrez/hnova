// next.config.mjs - Fixed routing configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],

    // Allow images from external domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-wordpress-site.com', // Replace with your WordPress domain
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com', // For AWS hosted images
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net', // For CloudFront CDN
      },
    ],

    // Image caching
    minimumCacheTTL: 31536000, // 1 year
  },

  // Custom redirects to handle URL structure properly
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

      // ADD YOUR SPECIFIC BLOG POST REDIRECTS HERE (if needed)
      // Example format:
      // {
      //   source: '/your-blog-post-slug',
      //   destination: '/blog/your-blog-post-slug',
      //   permanent: true,
      // },
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

  // Headers for better caching and SEO
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

      // Cache API responses with revalidation
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },

      // Security and performance headers
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
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },

  // Compress responses
  compress: true,

  // Generate static pages at build time
  output: 'standalone',

  // PoweredBy header removal
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,

  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,

          // Separate vendor chunks for better caching
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },

          // Separate common chunks
          common: {
            minChunks: 2,
            chunks: 'all',
            name: 'common',
            priority: 5,
            enforce: true,
          },
        },
      };
    }

    // Add support for reading .md files if needed
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });

    return config;
  },

  // Environment variables available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Page extensions (add this if you're using custom extensions)
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Trailing slash configuration
  trailingSlash: false,

  // Asset prefix for CDN (if using one)
  // assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.habitnova.com' : '',

  // Base path if deploying to a subdirectory
  // basePath: '/blog',
};

export default nextConfig;
