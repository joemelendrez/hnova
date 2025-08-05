// Updated Product Page with Variant Selection
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
import { useCart } from '../app/hooks/useShopifyCart';

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
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart, cartLoading } = useCart();

  // Format Shopify product with full variant data
  function formatShopifyProduct(shopifyProduct) {
    const images = shopifyProduct.images || [];

    // Get price helper
    const getPrice = (priceObj) => {
      if (!priceObj) return '0.00';
      if (typeof priceObj === 'string') return parseFloat(priceObj).toFixed(2);
      if (typeof priceObj === 'object' && priceObj.amount)
        return parseFloat(priceObj.amount).toFixed(2);
      return '0.00';
    };

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
      // Include all variant information
      variants: shopifyProduct.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price: getPrice(variant.price),
        compareAtPrice: variant.compareAtPrice ? getPrice(variant.compareAtPrice) : null,
        available: variant.available,
        selectedOptions: variant.selectedOptions || [],
        image: variant.image ? {
          src: variant.image.src || variant.image.transformedSrc,
          alt: variant.image.altText || shopifyProduct.title
        } : null,
      })),
      // Extract option types (Size, Color, etc.)
      options: shopifyProduct.options || [],
    };
  }

  // Find variant based on selected options
  const findVariantByOptions = (product, selectedOptions) => {
    if (!product?.variants || Object.keys(selectedOptions).length === 0) {
      return product?.variants?.[0];
    }

    return product.variants.find(variant => {
      return variant.selectedOptions.every(option => 
        selectedOptions[option.name] === option.value
      );
    }) || product.variants[0];
  };

  // Handle option change (Size, Color, etc.)
  const handleOptionChange = (optionName, optionValue) => {
    const newSelectedOptions = {
      ...selectedOptions,
      [optionName]: optionValue
    };
    
    setSelectedOptions(newSelectedOptions);
    
    // Find the variant that matches the selected options
    const matchingVariant = findVariantByOptions(product, newSelectedOptions);
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
      
      // Update image if variant has its own image
      if (matchingVariant.image) {
        const variantImageIndex = product.images.findIndex(
          img => img.src === matchingVariant.image.src
        );
        if (variantImageIndex !== -1) {
          setSelectedImage(variantImageIndex);
        }
      }
    }
  };

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
              storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
            });
          } else {
            throw new Error('Shopify not configured');
          }
        }

        console.log('Fetching product with handle:', params.slug);
        const shopifyProduct = await shopifyClient.product.fetchByHandle(params.slug);

        if (!shopifyProduct) {
          setError('Product not found');
          return;
        }

        console.log('Raw Shopify product:', shopifyProduct);
        console.log('Product variants:', shopifyProduct.variants);
        console.log('Product options:', shopifyProduct.options);

        const formattedProduct = formatShopifyProduct(shopifyProduct);
        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants[0]);
        
        // Initialize selected options with first variant's options
        if (formattedProduct.variants[0]?.selectedOptions) {
          const initialOptions = {};
          formattedProduct.variants[0].selectedOptions.forEach(option => {
            initialOptions[option.name] = option.value;
          });
          setSelectedOptions(initialOptions);
        }

      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
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
      console.log('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/shop"
            className="bg-[#1a1a1a] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale = selectedVariant?.compareAtPrice && 
                   parseFloat(selectedVariant.compareAtPrice) > parseFloat(selectedVariant.price);

  return (
    <div className="pt-16 lg:pt-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#1a1a1a]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#1a1a1a]">
              Shop
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-[#1a1a1a] font-medium">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]?.src || product.images[0]?.src}
                  alt={product.images[selectedImage]?.alt || product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-[#1a1a1a]'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Back Link */}
              <Link
                href="/shop"
                className="inline-flex items-center text-gray-600 hover:text-[#1a1a1a] transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Shop
              </Link>

              {/* Product Title */}
              <div>
                <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
                  {product.title}
                </h1>
                <p className="text-gray-600">by {product.vendor}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-[#1a1a1a]">
                  ${selectedVariant?.price || '0.00'}
                </span>
                {isOnSale && (
                  <span className="text-xl text-gray-500 line-through">
                    ${selectedVariant?.compareAtPrice}
                  </span>
                )}
                {isOnSale && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Save ${(parseFloat(selectedVariant?.compareAtPrice) - parseFloat(selectedVariant?.price)).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Variant Options (Size, Color, etc.) */}
              {product.options && product.options.length > 0 && (
                <div className="space-y-4">
                  {product.options.map((option) => (
                    <div key={option.id}>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const isSelected = selectedOptions[option.name] === value;
                          
                          // Check if this combination is available
                          const testOptions = { ...selectedOptions, [option.name]: value };
                          const testVariant = findVariantByOptions(product, testOptions);
                          const isAvailable = testVariant?.available;
                          
                          return (
                            <button
                              key={value}
                              onClick={() => handleOptionChange(option.name, value)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                                  : isAvailable
                                  ? 'border-gray-300 hover:border-[#1a1a1a] bg-white text-gray-700'
                                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:border-[#1a1a1a] transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-medium text-lg w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:border-[#1a1a1a] transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    selectedVariant?.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    selectedVariant?.available ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {selectedVariant?.available ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant?.available || 
                    addingToCart || 
                    cartLoading ||
                    !selectedVariant?.id
                  }
                  className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium transition-all ${
                    selectedVariant?.available && selectedVariant?.id
                      ? addingToCart || cartLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-[#1a1a1a] hover:bg-gray-800 text-white transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {addingToCart || cartLoading
                      ? 'Adding to Cart...'
                      : selectedVariant?.available && selectedVariant?.id
                      ? `Add to Cart - $${selectedVariant?.price}`
                      : 'Out of Stock'}
                  </span>
                </button>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:border-[#1a1a1a] transition-colors">
                    <Heart className="h-4 w-4" />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-lg hover:border-[#1a1a1a] transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Product Features */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Easy returns & exchanges</span>
                </div>
              </div>

              {/* Product Description */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                  Description
                </h3>
                <div 
                  className="prose prose-gray max-w-none text-gray-600"
                  dangerouslySetInnerHTML={{ 
                    __html: product.descriptionHtml || product.description 
                  }}
                />
              </div>

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Debug Info:</h4>
                  <p className="text-xs text-gray-600">Selected Variant ID: {selectedVariant?.id}</p>
                  <p className="text-xs text-gray-600">Total Variants: {product.variants?.length}</p>
                  <p className="text-xs text-gray-600">Options: {JSON.stringify(selectedOptions)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function (add this outside the component)
function findVariantByOptions(product, selectedOptions) {
  if (!product?.variants || Object.keys(selectedOptions).length === 0) {
    return product?.variants?.[0];
  }

  return product.variants.find(variant => {
    return variant.selectedOptions.every(option => 
      selectedOptions[option.name] === option.value
    );
  }) || product.variants[0];
}