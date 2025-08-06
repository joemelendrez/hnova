// app/shop/products/[slug]/page.js
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
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
  const [currentImages, setCurrentImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const { addToCart, cartLoading } = useCart();

  // Format Shopify product with enhanced variant image mapping
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
        id: img.id,
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
        // Include variant image if available
        image: variant.image ? {
          src: variant.image.src || variant.image.transformedSrc,
          alt: variant.image.altText || variant.title,
          id: variant.image.id,
        } : null,
      })),
    };
  }

  // Get variant-specific images
  const getVariantImages = (variant) => {
    if (!variant || !product) return product?.images || [];

    // Method 1: Direct variant image
    if (variant.image) {
      return [variant.image, ...product.images.filter(img => img.id !== variant.image.id)];
    }

    // Method 2: Map by variant options (color, style, etc.)
    if (variant.selectedOptions && product.images.length > 1) {
      const matchedImages = [];
      const remainingImages = [...product.images];

      for (const option of variant.selectedOptions) {
        const optionValue = option.value.toLowerCase();
        
        // Look for image with matching alt text
        const altMatch = remainingImages.find(img => {
          const altText = (img.alt || '').toLowerCase();
          return altText.includes(optionValue) || 
                 altText.includes(option.name.toLowerCase());
        });

        if (altMatch) {
          matchedImages.push(altMatch);
          const index = remainingImages.indexOf(altMatch);
          remainingImages.splice(index, 1);
        }

        // Look for image with matching filename/src
        const srcMatch = remainingImages.find(img => {
          const filename = (img.src || '').toLowerCase();
          return filename.includes(optionValue);
        });

        if (srcMatch && !matchedImages.includes(srcMatch)) {
          matchedImages.push(srcMatch);
          const index = remainingImages.indexOf(srcMatch);
          remainingImages.splice(index, 1);
        }
      }

      if (matchedImages.length > 0) {
        return [...matchedImages, ...remainingImages];
      }
    }

    // Method 3: Map by variant index
    if (product.variants.length > 1 && product.images.length > 1) {
      const variantIndex = product.variants.findIndex(v => v.id === variant.id);
      if (variantIndex >= 0 && variantIndex < product.images.length) {
        const primaryImage = product.images[variantIndex];
        const otherImages = product.images.filter((_, index) => index !== variantIndex);
        return [primaryImage, ...otherImages];
      }
    }

    // Method 4: Map by SKU or title patterns
    if (variant.sku || variant.title) {
      const searchTerms = [
        variant.sku?.toLowerCase(),
        variant.title?.toLowerCase(),
      ].filter(Boolean);

      for (const term of searchTerms) {
        const matchingImage = product.images.find(img => {
          const altText = (img.alt || '').toLowerCase();
          const filename = (img.src || '').toLowerCase();
          
          return altText.includes(term) || filename.includes(term);
        });

        if (matchingImage) {
          const otherImages = product.images.filter(img => img !== matchingImage);
          return [matchingImage, ...otherImages];
        }
      }
    }

    // Fallback to all product images
    return product.images;
  };

  // Update images when variant changes
  useEffect(() => {
    if (selectedVariant && product) {
      const variantImages = getVariantImages(selectedVariant);
      setCurrentImages(variantImages);
      setSelectedImage(0); // Reset to first image when variant changes
    } else if (product) {
      setCurrentImages(product.images);
    }
  }, [selectedVariant, product]);

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

        // Enhanced fallback product with variant images
        setProduct({
          id: 'fallback-1',
          title: 'Habit Tracking Journal - Premium Edition',
          handle: params.slug,
          description:
            'Transform your daily routine with this scientifically-designed habit tracking journal. Features 90 days of guided tracking, habit stacking worksheets, and progress visualization tools.',
          vendor: 'Habit Nova',
          productType: 'Journals',
          tags: ['habit-tracking', 'productivity', 'journal'],
          images: [
            {
              src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
              alt: 'Habit Tracking Journal - Black',
              id: 'img-1',
            },
            {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
              alt: 'Habit Tracking Journal - Blue',
              id: 'img-2',
            },
            {
              src: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=600&fit=crop',
              alt: 'Journal interior pages',
              id: 'img-3',
            },
            {
              src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=600&fit=crop',
              alt: 'Premium leather version',
              id: 'img-4',
            },
          ],
          variants: [
            {
              id: 'variant-1',
              title: 'Standard Edition - Black',
              price: '24.99',
              compareAtPrice: '29.99',
              available: true,
              selectedOptions: [{ name: 'Color', value: 'Black' }],
              image: {
                src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
                alt: 'Habit Tracking Journal - Black',
                id: 'img-1',
              },
            },
            {
              id: 'variant-2',
              title: 'Standard Edition - Blue',
              price: '24.99',
              compareAtPrice: '29.99',
              available: true,
              selectedOptions: [{ name: 'Color', value: 'Blue' }],
              image: {
                src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
                alt: 'Habit Tracking Journal - Blue',
                id: 'img-2',
              },
            },
            {
              id: 'variant-3',
              title: 'Premium Leather',
              price: '39.99',
              compareAtPrice: '49.99',
              available: true,
              selectedOptions: [{ name: 'Material', value: 'Leather' }],
              image: {
                src: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=600&fit=crop',
                alt: 'Premium leather version',
                id: 'img-4',
              },
            },
            {
              id: 'variant-4',
              title: 'Deluxe Bundle',
              price: '59.99',
              compareAtPrice: null,
              available: false,
              selectedOptions: [{ name: 'Type', value: 'Bundle' }],
            },
          ],
        });
        setSelectedVariant({
          id: 'variant-1',
          title: 'Standard Edition - Black',
          price: '24.99',
          compareAtPrice: '29.99',
          available: true,
          selectedOptions: [{ name: 'Color', value: 'Black' }],
          image: {
            src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
            alt: 'Habit Tracking Journal - Black',
            id: 'img-1',
          },
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug]);

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setShowVariantDropdown(false);
  };

  // Handle image navigation
  const nextImage = () => {
    setSelectedImage((prev) => 
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) => 
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.available) return;

    setAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      // Could show success message here
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Get variant options for quick selection
  const getVariantOptions = () => {
    if (!product?.variants || product.variants.length <= 1) return [];
    
    const options = {};
    product.variants.forEach(variant => {
      if (variant.selectedOptions) {
        variant.selectedOptions.forEach(option => {
          if (!options[option.name]) {
            options[option.name] = new Set();
          }
          options[option.name].add(option.value);
        });
      }
    });
    
    return Object.entries(options).map(([name, values]) => ({
      name,
      values: Array.from(values)
    }));
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
            className="inline-flex items-center bg-[#1a1a1a] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
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

  const hasMultipleVariants = product?.variants?.length > 1;
  const variantOptions = getVariantOptions();

  return (
    <div className="pt-16 lg:pt-20">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#DBDBDB] bg-opacity-10 hover:bg-opacity-20 transition-colors duration-200 py-6 mb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-gray-600 hover:text-[#1a1a1a] transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </motion.div>

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
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 group cursor-zoom-in"
              onClick={() => setImageZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImages[selectedImage]?.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Image
                    src={
                      currentImages[selectedImage]?.src ||
                      '/placeholder-product.webp'
                    }
                    alt={currentImages[selectedImage]?.alt || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Sale
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </div>

              {/* Navigation arrows for multiple images */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImage ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {currentImages.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[#1a1a1a]'
                        : 'border-gray-200 hover:border-gray-400'
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
                  ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
                </span>
                {isOnSale && (
                  <span className="text-xl text-gray-500 line-through">
                    $
                    {parseFloat(selectedVariant?.compareAtPrice || 0).toFixed(
                      2
                    )}
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

            {/* Quick Variant Options */}
            {variantOptions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="space-y-4"
              >
                {variantOptions.map(option => (
                  <div key={option.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {option.name}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map(value => {
                        const isSelected = selectedVariant?.selectedOptions?.some(
                          opt => opt.name === option.name && opt.value === value
                        );
                        
                        const variantWithOption = product.variants.find(v =>
                          v.selectedOptions?.some(opt => 
                            opt.name === option.name && opt.value === value
                          )
                        );
                        
                        return (
                          <button
                            key={value}
                            onClick={() => {
                              if (variantWithOption) {
                                handleVariantChange(variantWithOption);
                              }
                            }}
                            disabled={!variantWithOption?.available}
                            className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                              isSelected
                                ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                : variantWithOption?.available
                                ? 'border-gray-300 hover:border-gray-400'
                                : 'border-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {value}
                            {!variantWithOption?.available && (
                              <span className="ml-1 text-xs">(Out of Stock)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Variant Selection Dropdown (for complex variants) */}
            {hasMultipleVariants && variantOptions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Select Variant:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{selectedVariant?.title}</span>
                      <span className="text-sm text-gray-600">
                        ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
                        {!selectedVariant?.available && (
                          <span className="text-red-500 ml-2">Out of Stock</span>
                        )}
                      </span>
                    </div>
                    <ChevronDown 
                      className={`h-5 w-5 transform transition-transform ${
                        showVariantDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Variant Dropdown */}
                  {showVariantDropdown && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedVariant?.id === variant.id ? 'bg-gray-50' : ''
                          } ${!variant.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!variant.available}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{variant.title}</div>
                              <div className="text-sm text-gray-600">
                                ${parseFloat(variant.price).toFixed(2)}
                                {variant.compareAtPrice && (
                                  <span className="ml-2 line-through text-gray-400">
                                    ${parseFloat(variant.compareAtPrice).toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!variant.available && (
                              <span className="text-sm text-red-500 font-medium">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

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

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {imageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentImages[selectedImage]?.src || '/placeholder-product.webp'}
                alt={currentImages[selectedImage]?.alt || product.title}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
              />
              
              {/* Close button */}
              <button
                onClick={() => setImageZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation for zoomed view */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <span className="text-white text-sm">
                  {selectedImage + 1} / {currentImages.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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