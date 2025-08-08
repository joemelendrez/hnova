import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ExternalLink, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../app/hooks/useShopifyCart';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null
  );
  const [showVariants, setShowVariants] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const { addToCart } = useCart(); // Remove cartLoading from here

  const { slug, name, images, placeholder, variants = [] } = product;

  // Use selected variant or fallback to product-level data
  const currentVariant = selectedVariant || {
    id: product.variantId || product.id,
    price: product.price,
    compareAtPrice: product.regular_price,
    available: product.stock_status === 'instock',
    title: 'Default',
  };

  // Function to get variant-specific image
  const getVariantImage = (variant) => {
    if (!variant) return null;

    // Method 1: Check if variant has direct image reference
    if (variant.image?.src) {
      return variant.image;
    }

    // Method 2: Map by variant options (color, style, etc.)
    if (variant.selectedOptions && images?.length > 1) {
      for (const option of variant.selectedOptions) {
        const optionValue = option.value.toLowerCase();

        // Look for image with matching alt text
        const matchingImage = images.find((img) => {
          const altText = (img.alt || '').toLowerCase();
          return (
            altText.includes(optionValue) ||
            altText.includes(option.name.toLowerCase())
          );
        });

        if (matchingImage) return matchingImage;

        // Look for image with matching filename/src
        const filenameMatch = images.find((img) => {
          const filename = (img.src || '').toLowerCase();
          return filename.includes(optionValue);
        });

        if (filenameMatch) return filenameMatch;
      }
    }

    // Method 3: Map by variant index (if images are in same order as variants)
    if (variants.length > 1 && images?.length > 1) {
      const variantIndex = variants.findIndex((v) => v.id === variant.id);
      if (variantIndex >= 0 && variantIndex < images.length) {
        return images[variantIndex];
      }
    }

    // Method 4: Map by SKU or title patterns
    if (variant.sku || variant.title) {
      const searchTerms = [
        variant.sku?.toLowerCase(),
        variant.title?.toLowerCase(),
      ].filter(Boolean);

      for (const term of searchTerms) {
        const matchingImage = images?.find((img) => {
          const altText = (img.alt || '').toLowerCase();
          const filename = (img.src || '').toLowerCase();

          return altText.includes(term) || filename.includes(term);
        });

        if (matchingImage) return matchingImage;
      }
    }

    return null;
  };

  // Update current image when variant changes
  useEffect(() => {
    if (selectedVariant) {
      const variantImage = getVariantImage(selectedVariant);
      if (variantImage) {
        setCurrentImage(variantImage);
        setImageError(false); // Reset image error when switching variants
      } else {
        setCurrentImage(images?.[0] || null);
      }
    } else {
      setCurrentImage(images?.[0] || null);
    }
  }, [selectedVariant, images]);

  // Initialize current image on component mount
  useEffect(() => {
    const initialVariant = product.variants?.[0];
    if (initialVariant) {
      const variantImage = getVariantImage(initialVariant);
      setCurrentImage(variantImage || images?.[0] || null);
    } else {
      setCurrentImage(images?.[0] || null);
    }
  }, []);

  const isInStock = currentVariant.available;
  const displayPrice = currentVariant.price;
  const originalPrice = currentVariant.compareAtPrice;
  const onSale =
    originalPrice && parseFloat(originalPrice) > parseFloat(displayPrice);

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setShowVariants(false);
  };

  // Handle adding to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock || addingToCart) return; // Only check local addingToCart state

    const variantId = currentVariant.id;
    if (!variantId) {
      console.error('No variant ID found for product:', product);
      alert('Error: Product variant not found');
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart(variantId, 1);
      console.log('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Image handling with variant support
  const getImageSrc = () => {
    if (imageError) {
      return placeholder || '/placeholder-product.webp';
    }
    return currentImage?.src || placeholder || '/placeholder-product.webp';
  };

  const getImageAlt = () => {
    if (imageError) {
      return `${name} - Product Image`;
    }
    return currentImage?.alt || name;
  };

  // Check if product has multiple variants
  const hasMultipleVariants = variants.length > 1;

  // Get unique variant options for display (colors, sizes, etc.)
  const getVariantOptions = () => {
    if (!hasMultipleVariants) return [];

    const optionMap = new Map();
    variants.forEach((variant) => {
      if (variant.selectedOptions) {
        variant.selectedOptions.forEach((option) => {
          if (!optionMap.has(option.name)) {
            optionMap.set(option.name, new Set());
          }
          optionMap.get(option.name).add(option.value);
        });
      }
    });

    return Array.from(optionMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  };

  const variantOptions = getVariantOptions();

  return (
    <div className="bg-[#dbdbdb] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Product Image */}
      <Link href={`/shop/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={getImageSrc()}
            alt={getImageAlt()}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />

          {/* Sale Badge */}
          {onSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              SALE
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}

          {/* Variant Indicator Dots (if multiple images available) */}
          {hasMultipleVariants && images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    currentImage?.src === images[index]?.src
                      ? 'bg-white'
                      : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
              {images.length > 3 && (
                <div className="w-1.5 h-1.5 rounded-full bg-white bg-opacity-50" />
              )}
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/shop/products/${slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-[#1a1a1a] transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
        </Link>

        {/* Quick Variant Options (for visual variants like colors) */}
        {variantOptions.length > 0 && (
          <div className="mb-3">
            {variantOptions.map((option) => (
              <div key={option.name} className="mb-2">
                <div className="text-xs text-gray-600 mb-1">{option.name}:</div>
                <div className="flex gap-1 flex-wrap">
                  {option.values.slice(0, 4).map((value) => {
                    const isSelected = selectedVariant?.selectedOptions?.some(
                      (opt) => opt.name === option.name && opt.value === value
                    );

                    return (
                      <button
                        key={value}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Find variant with this option value
                          const newVariant = variants.find((v) =>
                            v.selectedOptions?.some(
                              (opt) =>
                                opt.name === option.name && opt.value === value
                            )
                          );

                          if (newVariant) {
                            handleVariantChange(newVariant);
                          }
                        }}
                        className={`px-2 py-1 text-xs border rounded transition-colors ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-black hover:border-gray-400 text-black'
                        }`}
                        title={value}
                      >
                        {value.length > 8
                          ? value.substring(0, 8) + '...'
                          : value}
                      </button>
                    );
                  })}
                  {option.values.length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{option.values.length - 4}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Variant Selection Dropdown (if needed for complex variants) */}
        {hasMultipleVariants && variantOptions.length === 0 && (
          <div className="mb-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVariants(!showVariants);
                }}
                className="w-full flex items-center justify-between p-2 text-sm border border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                <span className="truncate">
                  {selectedVariant?.title || 'Select variant'}
                </span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform ${
                    showVariants ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Variant Dropdown */}
              {showVariants && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleVariantChange(variant);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        selectedVariant?.id === variant.id ? 'bg-gray-100' : ''
                      } ${
                        !variant.available
                          ? 'text-gray-400 cursor-not-allowed'
                          : ''
                      }`}
                      disabled={!variant.available}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{variant.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ${parseFloat(variant.price).toFixed(2)}
                          </span>
                          {!variant.available && (
                            <span className="text-xs text-red-500">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#1a1a1a]">
            ${parseFloat(displayPrice).toFixed(2)}
          </span>
          {originalPrice && onSale && (
            <span className="text-sm text-gray-500 line-through">
              ${parseFloat(originalPrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Selected Variant Info */}
        {hasMultipleVariants && selectedVariant && (
          <div className="text-xs text-gray-600 mb-3">
            Selected: {selectedVariant.title}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock || addingToCart} // Removed cartLoading from here
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            isInStock
              ? addingToCart // Only check local addingToCart state
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#1a1a1a] hover:bg-[#dbdbdb] hover:text-white text-white'
              : 'bg-black text-white cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={16} />
          {addingToCart // Only check local addingToCart state
            ? 'Adding...'
            : isInStock
            ? 'Add to Cart'
            : 'Out of Stock'}
        </button>

        {/* View Product Link */}
        <Link
          href={`/shop/products/${slug}`}
          className="mt-2 w-full flex items-center justify-center gap-2 py-2 px-4 text-sm text-gray-600 hover:text-[#1a1a1a] transition-colors"
        >
          <ExternalLink size={14} />
          View Details
        </Link>
      </div>
    </div>
  );
}
