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

// Enhanced format Shopify product with better variant handling
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

  // Check if product has multiple variants with different options
  const hasVariants = shopifyProduct.variants.length > 1;
  const variantOptions = shopifyProduct.options || [];

  // Get price range for products with multiple variants
  const getPriceRange = (variants) => {
    const prices = variants.map(v => parseFloat(getPrice(v.price)));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return { min: minPrice.toFixed(2), max: minPrice.toFixed(2), same: true };
    }
    return { min: minPrice.toFixed(2), max: maxPrice.toFixed(2), same: false };
  };

  const priceRange = getPriceRange(shopifyProduct.variants);

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
    variantId: variant?.id,
    
    // Enhanced variant data
    hasVariants: hasVariants,
    variantOptions: variantOptions,
    priceRange: priceRange,
    availableVariants: shopifyProduct.variants.filter(v => v.available),
    
    // Include full variant data for selection
    variants: shopifyProduct.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: getPrice(v.price),
      compareAtPrice: getPrice(v.compareAtPrice),
      available: v.available,
      selectedOptions: v.selectedOptions || [],
      // Add individual variant properties
      option1: v.selectedOptions?.[0]?.value || null,
      option2: v.selectedOptions?.[1]?.value || null,
      option3: v.selectedOptions?.[2]?.value || null,
    })),
  };
}

// Enhanced ProductCard component with variant selection
const EnhancedProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Initialize selected options based on first variant
  useEffect(() => {
    if (product.variantOptions.length > 0) {
      const initialOptions = {};
      product.variantOptions.forEach((option, index) => {
        initialOptions[option.name] = selectedVariant?.selectedOptions?.[index]?.value || option.values[0];
      });
      setSelectedOptions(initialOptions);
    }
  }, [product]);

  // Find variant based on selected options
  const findVariantByOptions = (options) => {
    return product.variants.find(variant => {
      return product.variantOptions.every((option, index) => {
        const selectedValue = options[option.name];
        const variantValue = variant.selectedOptions?.[index]?.value;
        return selectedValue === variantValue;
      });
    });
  };

  // Handle option change
  const handleOptionChange = (optionName, value) => {
    const newOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(newOptions);
    
    const newVariant = findVariantByOptions(newOptions);
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  };

  const currentPrice = selectedVariant?.price || product.price;
  const currentComparePrice = selectedVariant?.compareAtPrice;
  const isOnSale = currentComparePrice && parseFloat(currentComparePrice) > parseFloat(currentPrice);
  const isAvailable = selectedVariant?.available || false;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]?.src || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
            SALE
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2">
          {product.name}
        </h3>

        {/* Variant Options */}
        {product.hasVariants && product.variantOptions.map((option) => (
          <div key={option.name} className="mb-3">
            <label className="text-xs font-medium text-gray-700 block mb-1">
              {option.name}:
            </label>
            <div className="flex flex-wrap gap-1">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                const testOptions = { ...selectedOptions, [option.name]: value };
                const testVariant = findVariantByOptions(testOptions);
                const isDisabled = !testVariant || !testVariant.available;

                return (
                  <button
                    key={value}
                    onClick={() => !isDisabled && handleOptionChange(option.name, value)}
                    disabled={isDisabled}
                    className={`px-2 py-1 text-xs border rounded transition-colors ${
                      isSelected
                        ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white'
                        : isDisabled
                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-[#1a1a1a]'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {product.hasVariants && !product.priceRange.same ? (
            <span className="text-lg font-bold text-[#1a1a1a]">
              ${product.priceRange.min} - ${product.priceRange.max}
            </span>
          ) : (
            <>
              <span className="text-lg font-bold text-[#1a1a1a]">
                ${currentPrice}
              </span>
              {isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  ${currentComparePrice}
                </span>
              )}
            </>
          )}
        </div>

        {/* Stock Status */}
        {product.hasVariants && (
          <div className="text-xs text-gray-500 mb-3">
            {isAvailable ? (
              <span className="text-green-600">✓ In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        )}

        {/* Add to Cart / View Product */}
        <div className="space-y-2">
          {product.hasVariants ? (
            <button
              onClick={() => {
                // Add to cart with selected variant
                if (isAvailable && selectedVariant) {
                  console.log('Add to cart:', selectedVariant.id);
                  // Your add to cart logic here
                }
              }}
              disabled={!isAvailable}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isAvailable
                  ? 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
          ) : (
            <ProductCard product={product} />
          )}
          
          <a
            href={`/shop/products/${product.slug}`}
            className="block w-full text-center py-2 px-4 text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

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

        // Format products with enhanced variant data
        const formattedProducts = shopifyProducts.map(formatShopifyProduct);
        console.log('Formatted products with variants:', formattedProducts);

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
              product.categories?.some((cat) => cat.slug === selectedCategory)
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

  // Enhanced fallback products with variants
  function getFallbackProducts() {
    return [
      {
        id: 'fallback-1',
        name: 'Habit Tracking Journal',
        slug: 'habit-tracking-journal',
        price: '24.99',
        regular_price: '29.99',
        sale_price: '24.99',
        on_sale: true,
        stock_status: 'instock',
        images: [
          {
            src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
            alt: 'Habit Tracking Journal',
          },
        ],
        productType: 'Journals',
        hasVariants: true,
        variantOptions: [
          {
            name: 'Color',
            values: ['Blue', 'Black', 'Red']
          },
          {
            name: 'Size',
            values: ['Small', 'Large']
          }
        ],
        variants: [
          { id: 'var-1', title: 'Blue / Small', price: '24.99', available: true, selectedOptions: [{value: 'Blue'}, {value: 'Small'}] },
          { id: 'var-2', title: 'Blue / Large', price: '29.99', available: true, selectedOptions: [{value: 'Blue'}, {value: 'Large'}] },
          { id: 'var-3', title: 'Black / Small', price: '24.99', available: false, selectedOptions: [{value: 'Black'}, {value: 'Small'}] },
          { id: 'var-4', title: 'Black / Large', price: '29.99', available: true, selectedOptions: [{value: 'Black'}, {value: 'Large'}] },
          { id: 'var-5', title: 'Red / Small', price: '24.99', available: true, selectedOptions: [{value: 'Red'}, {value: 'Small'}] },
          { id: 'var-6', title: 'Red / Large', price: '29.99', available: true, selectedOptions: [{value: 'Red'}, {value: 'Large'}] },
        ],
        priceRange: { min: '24.99', max: '29.99', same: false },
        variantId: 'var-1',
        shopifyId: 'fallback-1',
      },
      // Add more fallback products with variants as needed...
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
              Habit Formation Tools.
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
                  {/* Use EnhancedProductCard for products with variants */}
                  {product.hasVariants ? (
                    <EnhancedProductCard product={product} />
                  ) : (
                    <ProductCard product={product} />
                  )}
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
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Habit Formation Tools.
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Discover scientifically-backed tools and products to help you
              build better habits and transform your daily routine.
            </p>
          </div>
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