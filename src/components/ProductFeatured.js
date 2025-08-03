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

const ProductFeatured = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock products - replace with actual Shopify data
  const featuredProducts = [
    {
      id: 1,
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
    {
      id: 2,
      name: 'Digital Detox Journal',
      slug: 'digital-detox-journal',
      price: '24.99',
      originalPrice: '34.99',
      rating: 4.6,
      reviewCount: 189,
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      badge: 'NEW',
      description:
        'Break free from digital addiction with structured exercises and daily reflection prompts.',
      features: [
        '30-Day Challenge',
        'Screen Time Tracker',
        'Mindfulness Exercises',
        'Progress Milestones',
      ],
    },
    {
      id: 3,
      name: 'Productivity Power Pack',
      slug: 'productivity-power-pack',
      price: '39.99',
      originalPrice: null,
      rating: 4.9,
      reviewCount: 156,
      image:
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=400&fit=crop',
      badge: null,
      description:
        'Time-blocking templates, focus timers, and priority matrices for maximum productivity.',
      features: [
        'Time Blocking Templates',
        'Focus Session Timer',
        'Priority Matrix',
        'Weekly Reviews',
      ],
    },
    {
      id: 4,
      name: 'Mindfulness Habit Kit',
      slug: 'mindfulness-habit-kit',
      price: '19.99',
      originalPrice: '29.99',
      rating: 4.7,
      reviewCount: 203,
      image:
        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=400&fit=crop',
      badge: 'SALE',
      description:
        'Daily meditation trackers, gratitude journals, and mindfulness exercises for inner peace.',
      features: [
        'Meditation Tracker',
        'Gratitude Journal',
        'Breathing Exercises',
        'Daily Reflections',
      ],
    },
  ];

  useEffect(() => {
    // Simulate loading from Shopify
    const timer = setTimeout(() => {
      setProducts(featuredProducts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const ProductCard = ({ product, index, isFeatured = false }) => {
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

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className={`h-full ${isFeatured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
      >
        <Link
          href={`/shop/products/${product.slug}`}
          className="group h-full block"
        >
          <div
            className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 h-full flex ${
              isFeatured ? 'lg:flex-row' : 'flex-col'
            }`}
          >
            {/* Product Image */}
            <div
              className={`relative ${
                isFeatured ? 'lg:w-1/2 h-64 lg:h-auto' : 'h-48'
              } flex-shrink-0`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              {product.badge && (
                <div className="absolute top-4 left-4">
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
                <div className="absolute top-4 right-4">
                  <span className="bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                    {savings}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div
              className={`p-6 flex flex-col flex-grow ${
                isFeatured ? 'lg:w-1/2' : ''
              }`}
            >
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

              {/* Product Name */}
              <h3
                className={`font-bold text-[#1a1a1a] mb-3 group-hover:text-gray-700 transition-colors leading-tight ${
                  isFeatured ? 'text-2xl' : 'text-lg'
                }`}
              >
                {product.name}
              </h3>

              {/* Description */}
              <p
                className={`text-gray-600 mb-4 leading-relaxed flex-grow ${
                  isFeatured ? 'text-base' : 'text-sm'
                }`}
              >
                {product.description}
              </p>

              {/* Features (Featured product only) */}
              {isFeatured && (
                <div className="mb-6">
                  <h4 className="font-semibold text-[#1a1a1a] mb-3">
                    What's Included:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {product.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-700"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span
                    className={`font-bold text-[#1a1a1a] ${
                      isFeatured ? 'text-2xl' : 'text-xl'
                    }`}
                  >
                    ${product.price}
                  </span>
                  {isOnSale && (
                    <span className="text-gray-500 line-through ml-2 text-lg">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex items-center text-[#1a1a1a] font-semibold group-hover:text-gray-700 mt-auto">
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Product
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

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

          {/* Loading skeleton */}
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

  const featuredProduct = products.find((p) => p.isFeatured);
  const otherProducts = products.filter((p) => !p.isFeatured);

  return (
    <section className="py-20 bg-[#b9b9bd] bg-opacity-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
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

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Featured Product (Large) */}
          {featuredProduct && (
            <ProductCard
              product={featuredProduct}
              index={0}
              isFeatured={true}
            />
          )}

          {/* Other Products */}
          {otherProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index + 1} />
          ))}
        </div>

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
                  10,000+
                </span>
              </div>
              <p className="text-gray-600">Happy Customers</p>
            </div>

            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-500 mr-2 fill-current" />
                <span className="text-3xl font-bold text-[#1a1a1a]">4.8</span>
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
