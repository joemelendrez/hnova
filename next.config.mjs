// next.config.mjs - Enhanced caching and performance configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better caching
  experimental: {
    // Enable partial prerendering for faster loading
    ppr: false, // Set to true when stable
    
    // Optimize server components
    serverComponentsExternalPackages: [],
    
    // Enable optimized package imports
    optimizePackageImports: ['framer-motion', 'lucide-react']
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
        hostname: 'habitnova.com', // Replace with your WordPress domain
      }
    ],
    
    // Image caching
    minimumCacheTTL: 31536000, // 1 year
  },

  // Headers for better caching
  async headers() {
    return [
      // Cache static assets aggressively
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // Cache API responses
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400'
          }
        ]
      },
      
      // Security and performance headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
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
          }
        }
      }
    }

    // Add webpack bundle analyzer in development
    if (dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      
      if (process.env.ANALYZE === 'true') {
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        )
      }
    }

    return config
  },
}

export default nextConfig