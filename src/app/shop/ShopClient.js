// app/shop/ShopClient.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard';

// Shopify client setup
let shopifyClient = null;

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
  // Dynamic import for client-side only
  import('shopify-buy').then((ShopifyBuy) => {
    shopifyClient = ShopifyBuy.default.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    });
  });
}

// Format Shopify product for our components
function formatShopifyProduct(shopifyProduct) {
  const variant = shopifyProduct.variants[0];
  const images = shopifyProduct.images || [];

  // Extract price values - Shopify returns prices as objects
  const getPrice = (priceObj) => {
    if (!priceObj) return '0.00';
    if (typeof priceObj === 'string') return parseFloat(priceObj).toFixed(2);
    if (typeof priceObj === 'object' && priceObj.amount)
      return parseFloat(priceObj.amount).toFixed(2);
    return '0.00';
  };

  const price = getPrice(variant?.price);
  const compareAtPrice = getPrice(variant?.compareAtPrice);

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    price: price,
    regular_price: compareAtPrice || price,
    sale_price: price,
    on_sale: compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price),
    stock_status: variant?.available ? 'instock' : 'outofstock',
    images: images.map((img) => ({
      src: img.src || img.transformedSrc,
      alt: img.altText || shopifyProduct.title,
    })),
    description: shopifyProduct.description,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    shopifyId: shopifyProduct.id,
    variantId: variant?.id, // This is crucial for cart functionality
    // Include full variant data for individual product pages
    variants: shopifyProduct.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: getPrice(v.price),
      compareAtPrice: getPrice(v.compareAtPrice),
      available: v.available,
    })),
  };
}

// Get unique product types as categories
function extractCategories(products) {
  const types = [
    ...new Set(products.map((p) => p.productType).filter(Boolean)),
  ];
  return types.map((type, index) => ({
    id: index + 1,
    name: type,
    slug: type.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function ShopClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchShopifyData() {
      setLoading(true);
      setError(null);

      try {
        // Wait for Shopify client to be ready
        if (!shopifyClient) {
          // Initialize client if not ready
          if (process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
            const ShopifyBuy = await import('shopify-buy');
            shopifyClient = ShopifyBuy.default.buildClient({
              domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
              storefrontAccessToken:
                process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
            });
          } else {
            throw new Error('Shopify credentials not configured');
          }
        }

        // Fetch products from Shopify
        const shopifyProducts = await shopifyClient.product.fetchAll();
        console.log('Fetched Shopify products:', shopifyProducts);

        if (!shopifyProducts || shopifyProducts.length === 0) {
          // Use fallback products if no Shopify products
          setProducts(getFallbackProducts());
          setCategories(getFallbackCategories());
          setError(
            'No products found in Shopify store. Showing sample products.'
          );
          return;
        }

        // Format products
        const formattedProducts = shopifyProducts.map(formatShopifyProduct);
        console.log('Formatted products with variant IDs:', formattedProducts);

        // Extract categories from product types
        const productCategories = extractCategories(formattedProducts);

        // Filter products if category is selected
        const filteredProducts = selectedCategory
          ? formattedProducts.filter(
              (product) =>
                product.productType &&
                product.productType.toLowerCase().replace(/\s+/g, '-') ===
                  selectedCategory
            )
          : formattedProducts;

        setProducts(filteredProducts);
        setCategories(productCategories);
      } catch (error) {
        console.error('Error fetching Shopify data:', error);
        setError(error.message);

        // Use fallback products on error
        const fallbackProducts = getFallbackProducts();
        const fallbackCategories = getFallbackCategories();

        const filteredProducts = selectedCategory
          ? fallbackProducts.filter((product) =>
              product.categories.some((cat) => cat.slug === selectedCategory)
            )
          : fallbackProducts;

        setProducts(filteredProducts);
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    }

    fetchShopifyData();
  }, [selectedCategory]);

  // Fallback products for development/testing
  function getFallbackProducts() {
    return [
      {
        id: 'fallback-1',
        name: 'Habit Tracking Journal - Premium Leather',
        slug: 'habit-tracking-journal-premium',
        price: '24.99',
        regular_price: '29.99',
        sale_price: '24.99',
        on_sale: true,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
            alt: 'Premium Leather Habit Tracking Journal',
          },
        ],
        categories: [{ id: 1, name: 'Journals', slug: 'journals' }],
        productType: 'Journals',
        description:
          'Track your daily habits with this premium leather-bound journal.',
        variantId: 'fallback-variant-1', // Add variant ID for fallback products
        shopifyId: 'fallback-1',
      },
      {
        id: 'fallback-2',
        name: '90-Day Productivity Planner',
        slug: 'productivity-planner-90-day',
        price: '19.99',
        regular_price: '19.99',
        on_sale: false,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
            alt: '90-Day Productivity Planner',
          },
        ],
        categories: [{ id: 2, name: 'Planners', slug: 'planners' }],
        productType: 'Planners',
        description:
          'Transform your productivity with this 90-day planning system.',
        variantId: 'fallback-variant-2',
        shopifyId: 'fallback-2',
      },
      {
        id: 'fallback-3',
        name: 'Meditation Timer with Chimes',
        slug: 'meditation-timer-chimes',
        price: '34.99',
        regular_price: '34.99',
        on_sale: false,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop',
            alt: 'Meditation Timer with Chimes',
          },
        ],
        categories: [{ id: 3, name: 'Wellness', slug: 'wellness' }],
        productType: 'Wellness',
        description:
          'Enhance your meditation practice with gentle chime intervals.',
        variantId: 'fallback-variant-3',
        shopifyId: 'fallback-3',
      },
      {
        id: 'fallback-4',
        name: 'Focus Time Blocking Set',
        slug: 'focus-time-blocking-set',
        price: '15.99',
        regular_price: '18.99',
        sale_price: '15.99',
        on_sale: true,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=400&fit=crop',
            alt: 'Focus Time Blocking Set',
          },
        ],
        categories: [{ id: 2, name: 'Planners', slug: 'planners' }],
        productType: 'Planners',
        description:
          'Visual time-blocking system to maximize your focus sessions.',
        variantId: 'fallback-variant-4',
        shopifyId: 'fallback-4',
      },
    ];
  }

  function getFallbackCategories() {
    return [
      { id: 1, name: 'Journals', slug: 'journals' },
      { id: 2, name: 'Planners', slug: 'planners' },
      { id: 3, name: 'Wellness', slug: 'wellness' },
    ];
  }

  if (loading) {
    return <ShopPageSkeleton />;
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 font-anton uppercase">
              Habit Formation Tools
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Discover scientifically-backed tools and products to help you
              build better habits and transform your daily routine.
            </p>
            {error && <p className="text-sm text-gray-400 mt-4">{error}</p>}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4 mb-12 justify-center"
            >
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-6 py-3 rounded-full transition-colors font-roboto text-sm font-medium ${
                  !selectedCategory
                    ? 'bg-[#1a1a1a] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-6 py-3 rounded-full transition-colors font-roboto text-sm font-medium ${
                    selectedCategory === category.slug
                      ? 'bg-[#1a1a1a] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </motion.div>
          )}

          {/* Products Grid */}
          {products.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 text-lg font-roboto">
                {selectedCategory
                  ? 'No products found in this category.'
                  : 'No products available.'}
              </p>
              {!error && (
                <p className="text-gray-400 text-sm mt-2">
                  Add products to your Shopify store to see them here.
                </p>
              )}
            </motion.div>
          )}

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 text-center bg-[#DBDBDB] bg-opacity-20 rounded-xl p-8"
          >
            <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 font-anton uppercase">
              More Products Coming Soon
            </h3>
            <p className="text-gray-600 font-roboto">
              We're carefully curating the best habit formation tools and will
              be adding more products regularly.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function ShopPageSkeleton() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section Skeleton */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="h-12 bg-gray-700 rounded w-96 mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-[500px] mx-auto animate-pulse"></div>
        </div>
      </section>

      {/* Products Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Skeleton */}
          <div className="flex gap-4 mb-12 justify-center">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 bg-gray-200 rounded-full w-32 animate-pulse"
              ></div>
            ))}
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
