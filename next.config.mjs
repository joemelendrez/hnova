// next.config.mjs - Simplified ES module compatible version
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic optimizations
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cms.habitnova.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
      {
        protocol: 'https',
        hostname: '**.myshopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'habitnova-co.myshopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/shopifycloud/**',
      },
      {
        protocol: 'https',
        hostname: 'shopify-product-images.s3.amazonaws.com',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Custom redirects
  async redirects() {
    return [
      {
        source: '/blog/:slug*/page/:page',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/:slug([a-z0-9]+-[a-z0-9]+-[a-z0-9-]+)',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },

  // URL rewrites
  async rewrites() {
    return [
      {
        source: '/blog/:slug*',
        destination: '/blog/:slug*',
      },
    ];
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/logos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=300, stale-while-revalidate=86400',
          },
        ],
      },
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
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },

  // Basic optimizations
  compress: true,
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  trailingSlash: false,
};

export default nextConfig;