'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Clock,
  Users,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { useCart } from '../app/hooks/useShopifyCart';
import ProductCard from './ProductCard';

const ProductFeatured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parallax and shrink effects to match FeaturedArticles
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [800, 1600], [50, -25]); // Moves up as you scroll
  const opacity = useTransform(scrollY, [800, 1100], [0.95, 1]); // Subtle fade in

  // Shrink effect - section gets smaller as you scroll away from it
  const scale = useTransform(scrollY, [1200, 1800], [1, 0.95]); // Shrinks from 100% to 95%
  const borderRadius = useTransform(scrollY, [1200, 1800], [48, 80]); // Bottom corners get more rounded

  // Initialize Shopify client
  useEffect(() => {
    async function fetchFeaturedProducts() {
      setLoading(true);
      setError(null);

      try {
        // Dynamic import for client-side only
        const ShopifyBuy = await import('shopify-buy');

        const shopifyClient = ShopifyBuy.default.buildClient({
          domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
          storefrontAccessToken:
            process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
        });

        console.log('🔄 Fetching featured products from Shopify...');

        // Fetch all products from Shopify
        const shopifyProducts = await shopifyClient.product.fetchAll();

        if (!shopifyProducts || shopifyProducts.length === 0) {
          console.warn('⚠️ No products found in Shopify store');
          setProducts([]);
          setError('No products found in store');
          return;
        }

        console.log(`✅ Found ${shopifyProducts.length} products`);

        // Format products for our component
        const formattedProducts = shopifyProducts.map((product, index) =>
          formatShopifyProduct(product, index)
        );

        // Sort by featured status and filter for homepage
        const featuredProducts = formattedProducts
          .sort((a, b) => {
            // Prioritize products with certain tags or criteria
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return 0;
          })
          .slice(0, 4); // Limit to 4 products for the grid

        setProducts(featuredProducts);
        console.log('✅ Featured products set:', featuredProducts.length);
      } catch (error) {
        console.error('❌ Error fetching Shopify products:', error);
        setError(error.message);

        // Fallback to mock data if Shopify fails
        setProducts(getFallbackProducts());
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  // Format Shopify product for our component - Updated with variants
  function formatShopifyProduct(shopifyProduct, index = 0) {
    const variant = shopifyProduct.variants[0];
    const images = shopifyProduct.images || [];

    // Extract price values
    const getPrice = (priceObj) => {
      if (!priceObj) return '0.00';
      if (typeof priceObj === 'string') return parseFloat(priceObj).toFixed(2);
      if (typeof priceObj === 'object' && priceObj.amount) {
        return parseFloat(priceObj.amount).toFixed(2);
      }
      return '0.00';
    };

    const price = getPrice(variant?.price);
    const compareAtPrice = getPrice(variant?.compareAtPrice);

    // Map variant images - Shopify variants can have associated images
    const mapVariantImages = (variants, productImages) => {
      return variants.map((v) => {
        let variantImage = null;

        // Check if variant has an associated image
        if (v.image) {
          variantImage = {
            id: v.image.id,
            src: v.image.src || v.image.transformedSrc,
            alt: v.image.altText || shopifyProduct.title,
          };
        }

        return {
          id: v.id,
          title: v.title,
          price: getPrice(v.price),
          compareAtPrice: getPrice(v.compareAtPrice),
          available: v.available,
          weight: v.weight,
          sku: v.sku,
          selectedOptions: v.selectedOptions || [],
          image: variantImage, // Add variant-specific image
        };
      });
    };

    // Determine if product is featured (you can customize this logic)
    const isFeatured =
      index === 0 ||
      shopifyProduct.tags?.includes('featured') ||
      shopifyProduct.productType?.toLowerCase().includes('toolkit') ||
      shopifyProduct.title?.toLowerCase().includes('complete');

    // Generate badge based on product data
    const getBadge = (product, isOnSale, createdAt) => {
      if (product.tags?.includes('bestseller')) return 'BESTSELLER';
      if (product.tags?.includes('new')) return 'NEW';
      if (isOnSale) return 'SALE';

      // Auto-detect new products (created within last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(createdAt) > thirtyDaysAgo) return 'NEW';

      return null;
    };

    // Manual review data for your products (temporary solution)
    const getProductReviews = (productHandle) => {
      const reviews = {
        'habit-formation-toolkit': { rating: 4.8, reviewCount: 247 },
        'digital-detox-journal': { rating: 4.6, reviewCount: 189 },
        'productivity-power-pack': { rating: 4.9, reviewCount: 156 },
        'mindfulness-habit-kit': { rating: 4.7, reviewCount: 203 },
        // Add your actual product handles here
      };
      return reviews[productHandle] || { rating: 4.5, reviewCount: 125 };
    };

    const reviewData = getProductReviews(shopifyProduct.handle);
    const isOnSale =
      compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      price: price,
      regular_price: compareAtPrice || price,
      sale_price: price,
      on_sale: isOnSale,
      originalPrice: isOnSale ? compareAtPrice : null,
      rating: reviewData.rating,
      reviewCount: reviewData.reviewCount,
      stock_status: variant?.available ? 'instock' : 'outofstock',
      images: images.map((img) => ({
        src: img.src || img.transformedSrc,
        alt: img.altText || shopifyProduct.title,
      })),
      // Keep legacy image property for backward compatibility
      image:
        images[0]?.src ||
        images[0]?.transformedSrc ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
      badge: getBadge(shopifyProduct, isOnSale, shopifyProduct.createdAt),
      description:
        shopifyProduct.description ||
        'High-quality product to help you build better habits.',
      features: extractFeatures(shopifyProduct),
      isFeatured: isFeatured,
      shopifyId: shopifyProduct.id,
      variantId: variant?.id,
      available: variant?.available || false,
      vendor: shopifyProduct.vendor,
      productType: shopifyProduct.productType,
      // Include full variant data for cart functionality and product pages
      variants: mapVariantImages(shopifyProduct.variants, images),
    };
  }

  // Extract features from product description or use defaults
  function extractFeatures(product) {
    // Try to extract features from description
    const description = product.description || '';
    const features = [];

    // Look for bullet points or numbered lists in description
    const bulletMatches = description.match(/[•·▪▫-]\s*([^\n•·▪▫-]+)/g);
    if (bulletMatches && bulletMatches.length > 0) {
      return bulletMatches
        .map((match) => match.replace(/[•·▪▫-]\s*/, '').trim())
        .slice(0, 4);
    }

    // Look for numbered lists
    const numberMatches = description.match(/\d+\.\s*([^\n\d]+)/g);
    if (numberMatches && numberMatches.length > 0) {
      return numberMatches
        .map((match) => match.replace(/\d+\.\s*/, '').trim())
        .slice(0, 4);
    }

    // Generate features based on product type/tags
    if (product.productType?.toLowerCase().includes('journal')) {
      return [
        'Daily Tracking Pages',
        'Progress Charts',
        'Reflection Prompts',
        'Goal Setting Guide',
      ];
    }
    if (product.productType?.toLowerCase().includes('toolkit')) {
      return [
        'Comprehensive Guide',
        'Tracking Templates',
        'Progress Charts',
        'Bonus Resources',
      ];
    }
    if (product.tags?.includes('digital')) {
      return [
        'Instant Download',
        'Printable Format',
        'Mobile Friendly',
        'Lifetime Access',
      ];
    }

    // Default features
    return [
      'Premium Quality',
      'Expert Designed',
      'Proven Results',
      'Money-Back Guarantee',
    ];
  }

  // Updated fallback products with variant data
  function getFallbackProducts() {
    return [
      {
        id: 'fallback-1',
        name: 'The Complete Habit Formation Toolkit',
        slug: 'habit-formation-toolkit',
        price: '89.99',
        regular_price: '129.99',
        sale_price: '89.99',
        on_sale: true,
        originalPrice: '129.99',
        rating: 4.8,
        reviewCount: 247,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
            alt: 'Complete Habit Formation Toolkit',
          },
        ],
        image:
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        badge: 'BESTSELLER',
        description:
          'Everything you need to build lasting habits: 90-day tracker, habit stacking guide, weekly planners, and progress charts.',
        features: [
          '90-Day Habit Tracker',
          'Habit Stacking Guide',
          'Weekly Planning Sheets',
          'Progress Visualization',
        ],
        isFeatured: true,
        shopifyId: 'fallback-1',
        variantId: 'fallback-variant-1',
        available: true,
        productType: 'Toolkit',
        variants: [
          {
            id: 'fallback-variant-1',
            title: 'Default Title',
            price: '89.99',
            compareAtPrice: '129.99',
            available: true,
          },
        ],
      },
      {
        id: 'fallback-2',
        name: 'Digital Detox Journal',
        slug: 'digital-detox-journal',
        price: '24.99',
        regular_price: '24.99',
        sale_price: '24.99',
        on_sale: false,
        originalPrice: null,
        rating: 4.6,
        reviewCount: 189,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
            alt: 'Digital Detox Journal',
          },
        ],
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        badge: 'NEW',
        description:
          'Break free from digital overwhelm with guided prompts and tracking sheets.',
        features: [
          '30-Day Challenge',
          'Screen Time Tracker',
          'Mindfulness Exercises',
          'Progress Charts',
        ],
        isFeatured: false,
        shopifyId: 'fallback-2',
        variantId: 'fallback-variant-2',
        available: true,
        productType: 'Journal',
        variants: [
          {
            id: 'fallback-variant-2',
            title: 'Default Title',
            price: '24.99',
            compareAtPrice: null,
            available: true,
          },
        ],
      },
      {
        id: 'fallback-3',
        name: 'Productivity Power Pack',
        slug: 'productivity-power-pack',
        price: '49.99',
        regular_price: '49.99',
        sale_price: '49.99',
        on_sale: false,
        originalPrice: null,
        rating: 4.9,
        reviewCount: 156,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=400&fit=crop',
            alt: 'Productivity Power Pack',
          },
        ],
        image:
          'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=400&fit=crop',
        badge: null,
        description:
          'Complete productivity system with time-blocking templates and focus techniques.',
        features: [
          'Time Blocking Templates',
          'Focus Sessions Guide',
          'Weekly Reviews',
          'Goal Setting Framework',
        ],
        isFeatured: false,
        shopifyId: 'fallback-3',
        variantId: 'fallback-variant-3',
        available: true,
        productType: 'Planner',
        variants: [
          {
            id: 'fallback-variant-3',
            title: 'Default Title',
            price: '49.99',
            compareAtPrice: null,
            available: true,
          },
        ],
      },
      {
        id: 'fallback-4',
        name: 'Mindfulness Habit Kit',
        slug: 'mindfulness-habit-kit',
        price: '34.99',
        regular_price: '39.99',
        sale_price: '34.99',
        on_sale: true,
        originalPrice: '39.99',
        rating: 4.7,
        reviewCount: 203,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop',
            alt: 'Mindfulness Habit Kit',
          },
        ],
        image:
          'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop',
        badge: 'SALE',
        description:
          'Develop mindfulness habits with guided meditations and reflection exercises.',
        features: [
          'Guided Meditations',
          'Daily Reflections',
          'Breathing Exercises',
          'Progress Tracking',
        ],
        isFeatured: false,
        shopifyId: 'fallback-4',
        variantId: 'fallback-variant-4',
        available: true,
        productType: 'Wellness',
        variants: [
          {
            id: 'fallback-variant-4',
            title: 'Default Title',
            price: '34.99',
            compareAtPrice: '39.99',
            available: true,
          },
        ],
      },
    ];
  }

  // Loading state
  if (loading) {
    return (
      <motion.section
        style={{
          y,
          opacity,
          scale,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
        className="relative z-10 bg-[#1a1a1a] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full text-black text-sm font-medium mb-4">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
              Featured Products
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Habit Formation Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white bg-opacity-5 rounded-xl animate-pulse h-80"
              ></div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <motion.section
        style={{
          y,
          opacity,
          scale,
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        }}
        className="relative z-10 bg-[#1a1a1a]  overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Unable to load products. Please try again later.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-white text-[#1a1a1a] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      style={{
        y,
        opacity,
        scale,
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius,
      }}
    
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with New whileInView Animation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-200px 0px -200px 0px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-200px 0px -200px 0px' }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="inline-flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full text-black text-sm font-medium mb-4"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Featured Products
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-200px 0px -200px 0px' }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            className="text-4xl font-bold text-white mb-4"
          >
            Habit Formation Tools
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-200px 0px -200px 0px' }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Our bestselling tools that have helped thousands build better habits
            and transform their routines. Explore our complete store below for
            the full collection of proven resources.
          </motion.p>
        </motion.div>

        {/* Products Grid - Unified 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-center"
        >
          <motion.a
            href="https://shop.habitnova.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-[#f10000] text-white font-semibold rounded-lg hover:bg-[#cd1718] transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingBag className="mr-3 h-5 w-5" />
            Visit Our Complete Store
            <svg
              className="ml-3 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ProductFeatured;
