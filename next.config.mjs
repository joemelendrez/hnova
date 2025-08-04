// next.config.mjs - Fixed for ES modules (no require)
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // React 19 and Next.js 15 compatibility
  experimental: {
    // Enable optimizations for React 19
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

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

  // Webpack optimizations for React 19 and Framer Motion 12+
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,

          // Separate framer-motion into its own chunk
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 30,
          },

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

  // Page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Trailing slash configuration
  trailingSlash: false,
};

export default nextConfig;