'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
          storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
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

  // Format Shopify product for our component
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

    // Determine if product is featured (you can customize this logic)
    const isFeatured = index === 0 || 
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

    const isOnSale = compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      price: price,
      originalPrice: isOnSale ? compareAtPrice : null,
      rating: reviewData.rating,
      reviewCount: reviewData.reviewCount,
      image: images[0]?.src || images[0]?.transformedSrc || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
      badge: getBadge(shopifyProduct, isOnSale, shopifyProduct.createdAt),
      description: shopifyProduct.description || 'High-quality product to help you build better habits.',
      features: extractFeatures(shopifyProduct),
      isFeatured: isFeatured,
      shopifyId: shopifyProduct.id,
      variantId: variant?.id,
      available: variant?.available || false,
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
        .map(match => match.replace(/[•·▪▫-]\s*/, '').trim())
        .slice(0, 4);
    }

    // Look for numbered lists
    const numberMatches = description.match(/\d+\.\s*([^\n\d]+)/g);
    if (numberMatches && numberMatches.length > 0) {
      return numberMatches
        .map(match => match.replace(/\d+\.\s*/, '').trim())
        .slice(0, 4);
    }

    // Generate features based on product type/tags
    if (product.productType?.toLowerCase().includes('journal')) {
      return ['Daily Tracking Pages', 'Progress Charts', 'Reflection Prompts', 'Goal Setting Guide'];
    }
    if (product.productType?.toLowerCase().includes('toolkit')) {
      return ['Comprehensive Guide', 'Tracking Templates', 'Progress Charts', 'Bonus Resources'];
    }
    if (product.tags?.includes('digital')) {
      return ['Instant Download', 'Printable Format', 'Mobile Friendly', 'Lifetime Access'];
    }

    // Default features
    return ['Premium Quality', 'Expert Designed', 'Proven Results', 'Money-Back Guarantee'];
  }

  // Fallback products (your existing mock data as backup)
  function getFallbackProducts() {
    return [
      {
        id: 'fallback-1',
        name: 'The Complete Habit Formation Toolkit',
        slug: 'habit-formation-toolkit',
        price: '89.99',
        originalPrice: '129.99',
        rating: 4.8,
        reviewCount: 247,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        badge: 'BESTSELLER',
        description: 'Everything you need to build lasting habits: 90-day tracker, habit stacking guide, weekly planners, and progress charts.',
        features: ['90-Day Habit Tracker', 'Habit Stacking Guide', 'Weekly Planning Sheets', 'Progress Visualization'],
        isFeatured: true,
      },
      // ... your other fallback products
    ];
  }

  // Remove the custom ProductCard since we're using the shared one
  // const ProductCard = ({ product, index }) => { ... }

  // Loading state (keep your existing loading JSX)
  if (loading) {
    return (
      <section className="py-20 bg-[#DBDBDB] bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2 animate-pulse"></div>
              Featured Products
            </div>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
              Habit Formation Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 lg:row-span-2 bg-white rounded-xl animate-pulse h-96"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl animate-pulse h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <section className="py-20 bg-[#DBDBDB] bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Unable to load products. Please try again later.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    );
  }

  const featuredProduct = null; // Remove featured product logic
  const otherProducts = products; // All products are treated equally

  // Keep your existing render JSX structure - just replace the products data
  return (
    <section className="py-20 bg-[#b9b9bd] bg-opacity-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Keep existing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-50 rounded-full text-[#1a1a1a] text-sm font-medium mb-4">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Featured Products
          </div>
          <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4">
            Habit Formation Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scientifically-designed tools and resources to help you build better
            habits, break bad ones, and transform your daily routine.
          </p>
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
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
          >
            Shop All Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>

       
      </div>
    </section>
  );
};

export default ProductFeatured;