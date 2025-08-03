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

    // Generate rating (you can replace this with actual review data)
    const generateRating = (productId) => {
      // Generate consistent "fake" rating based on product ID
      const seed = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      return 4.2 + (seed % 8) / 10; // Ratings between 4.2 and 4.9
    };

    const generateReviewCount = (productId) => {
      const seed = productId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      return 50 + (seed % 300); // Review counts between 50 and 350
    };

    const isOnSale =
      compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);

    return {
      id: shopifyProduct.id,
      name: shopifyProduct.title,
      slug: shopifyProduct.handle,
      price: price,
      originalPrice: isOnSale ? compareAtPrice : null,
      rating: generateRating(shopifyProduct.id),
      reviewCount: generateReviewCount(shopifyProduct.id),
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
      },
      // ... your other fallback products
    ];
  }

  const ProductCard = ({ product, index }) => {
    const [addingToCart, setAddingToCart] = useState(false);
    const { addToCart, cartLoading } = useCart();

    const isOnSale =
      product.originalPrice &&
      parseFloat(product.originalPrice) > parseFloat(product.price);

    const savings = isOnSale
      ? (
          ((parseFloat(product.originalPrice) - parseFloat(product.price)) /
            parseFloat(product.originalPrice)) *
          100
        ).toFixed(0)
      : 0;

    // Handle adding to cart
    const handleAddToCart = async (e) => {
      e.preventDefault(); // Prevent navigation
      e.stopPropagation(); // Stop event bubbling

      if (
        !product.available ||
        addingToCart ||
        cartLoading ||
        !product.variantId
      )
        return;

      setAddingToCart(true);

      try {
        await addToCart(product.variantId, 1);
        console.log('Product added to cart successfully!');
        // Optional: Show a toast notification here
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart. Please try again.');
      } finally {
        setAddingToCart(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="h-full"
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 h-full flex flex-col">
          {/* Product Image - Make this a link */}
          <Link href={`/shop/products/${product.slug}`} className="block">
            <div className="relative h-48 flex-shrink-0 bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop';
                }}
              />

              {/* Badges */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      product.badge === 'BESTSELLER'
                        ? 'bg-[#1a1a1a] text-white'
                        : product.badge === 'NEW'
                        ? 'bg-blue-600 text-white'
                        : product.badge === 'SALE'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-600 text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                    {savings}% OFF
                  </span>
                </div>
              )}

              {/* Out of Stock Overlay */}
              {!product.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <span className="text-white font-medium text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Product Info */}
          <div className="p-6 flex flex-col flex-grow">
            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : ''
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Product Name - Also a link */}
            <Link href={`/shop/products/${product.slug}`}>
              <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 hover:text-gray-700 transition-colors leading-tight cursor-pointer">
                {product.name}
              </h3>
            </Link>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">
              {product.description}
            </p>

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold text-[#1a1a1a]">
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {isOnSale && (
                <span className="text-gray-500 line-through ml-2 text-lg">
                  ${parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                !product.available ||
                addingToCart ||
                cartLoading ||
                !product.variantId
              }
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 mb-3 ${
                product.available && product.variantId
                  ? addingToCart || cartLoading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#1a1a1a] hover:bg-gray-800 text-white transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              {addingToCart || cartLoading
                ? 'Adding...'
                : product.available && product.variantId
                ? 'Add to Cart'
                : 'Out of Stock'}
            </button>

            {/* View Details Link */}
            <Link
              href={`/shop/products/${product.slug}`}
              className="flex items-center justify-center text-[#1a1a1a] font-medium hover:text-gray-700 transition-colors text-sm"
            >
              View Details
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

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
              <div
                key={i}
                className="bg-white rounded-xl animate-pulse h-80"
              ></div>
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
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Keep your existing social proof, CTA, and testimonial sections */}
        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white rounded-xl p-8 mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-[#1a1a1a] mr-2" />
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  {products.length > 0
                    ? `${Math.min(products.length * 2500, 10000)}+`
                    : '10,000+'}
                </span>
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </div>

            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-500 mr-2 fill-current" />
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  {products.length > 0
                    ? (
                        products.reduce((sum, p) => sum + p.rating, 0) /
                        products.length
                      ).toFixed(1)
                    : '4.8'}
                </span>
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>

            <div>
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-[#1a1a1a] mr-2" />
                <span className="text-3xl font-bold text-[#1a1a1a]">90%</span>
              </div>
              <p className="text-gray-600">Success Rate</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.0 }}
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

        {/* Customer Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 bg-[#1a1a1a] rounded-xl p-8 text-white text-center"
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <blockquote className="text-xl italic mb-4">
              "The Habit Formation Toolkit completely transformed my daily
              routine. I went from struggling with consistency to building 5 new
              habits that stuck for over 6 months!"
            </blockquote>
            <cite className="text-[#DBDBDB] font-medium">
              — Sarah M., Verified Customer
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductFeatured;
