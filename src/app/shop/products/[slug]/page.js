// app/shop/products/[slug]/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../../hooks/useShopifyCart';

// Initialize Shopify client
let shopifyClient = null;

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
  import('shopify-buy').then((ShopifyBuy) => {
    shopifyClient = ShopifyBuy.default.buildClient({
      domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
    });
  });
}

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart, cartLoading } = useCart();

  // Format Shopify product
  function formatShopifyProduct(shopifyProduct) {
    const images = shopifyProduct.images || [];

    return {
      id: shopifyProduct.id,
      title: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      descriptionHtml: shopifyProduct.descriptionHtml,
      vendor: shopifyProduct.vendor,
      productType: shopifyProduct.productType,
      tags: shopifyProduct.tags || [],
      images: images.map((img) => ({
        src: img.src || img.transformedSrc,
        alt: img.altText || shopifyProduct.title,
      })),
      variants: shopifyProduct.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price:
          typeof variant.price === 'object'
            ? variant.price.amount
            : variant.price,
        compareAtPrice: variant.compareAtPrice
          ? typeof variant.compareAtPrice === 'object'
            ? variant.compareAtPrice.amount
            : variant.compareAtPrice
          : null,
        available: variant.available,
        selectedOptions: variant.selectedOptions || [],
      })),
    };
  }

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        if (!shopifyClient) {
          if (process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
            const ShopifyBuy = await import('shopify-buy');
            shopifyClient = ShopifyBuy.default.buildClient({
              domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
              storefrontAccessToken:
                process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
            });
          } else {
            throw new Error('Shopify not configured');
          }
        }

        const shopifyProduct = await shopifyClient.product.fetchByHandle(
          params.slug
        );

        if (!shopifyProduct) {
          setError('Product not found');
          return;
        }

        const formattedProduct = formatShopifyProduct(shopifyProduct);
        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);

        // Fallback product for development
        setProduct({
          id: 'fallback-1',
          title: 'Habit Tracking Journal - Premium Edition',
          handle: params.slug,
          description:
            'Transform your daily routine with this scientifically-designed habit tracking journal. Features 90 days of guided tracking, habit stacking worksheets, and progress visualization tools.',
          vendor: 'HabitNova',
          productType: 'Journals',
          tags: ['habit-tracking', 'productivity', 'journal'],
          images: [
            {
              src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
              alt: 'Habit Tracking Journal',
            },
            {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
              alt: 'Journal interior pages',
            },
          ],
          variants: [
            {
              id: 'variant-1',
              title: 'Default',
              price: '24.99',
              compareAtPrice: '29.99',
              available: true,
              selectedOptions: [],
            },
          ],
        });
        setSelectedVariant({
          id: 'variant-1',
          title: 'Default',
          price: '24.99',
          compareAtPrice: '29.99',
          available: true,
          selectedOptions: [],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.available) return;

    setAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      // Could show success message here
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error && !product) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice) >
      parseFloat(selectedVariant.price);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center text-gray-600 hover:text-[#1a1a1a] transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Shop
        </Link>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100"
            >
              <Image
                src={
                  product.images[selectedImage]?.src ||
                  '/placeholder-product.jpg'
                }
                alt={product.images[selectedImage]?.alt || product.title}
                fill
                className="object-cover"
                priority
              />
              {isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Sale
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[#1a1a1a]'
                        : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Vendor */}
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {product.vendor}
              </p>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight">
                {product.title}
              </h1>

              {/* Rating (placeholder) */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(47 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  ${selectedVariant?.price}
                </span>
                {isOnSale && (
                  <span className="text-xl text-gray-500 line-through">
                    ${selectedVariant?.compareAtPrice}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="prose prose-gray max-w-none"
            >
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </motion.div>

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant?.available || addingToCart || cartLoading
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-colors ${
                    selectedVariant?.available
                      ? 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart || cartLoading
                    ? 'Adding...'
                    : selectedVariant?.available
                    ? 'Add to Cart'
                    : 'Out of Stock'}
                </button>

                {/* Wishlist Button */}
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Share Button */}
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5" />
                <span>30-day return policy</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>

            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
