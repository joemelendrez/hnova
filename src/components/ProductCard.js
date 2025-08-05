import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ExternalLink, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../app/hooks/useShopifyCart';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [showVariants, setShowVariants] = useState(false);
  const { addToCart, cartLoading } = useCart();
  
  const {
    slug,
    name,
    images,
    placeholder,
    variants = [],
  } = product;
  
  // Use selected variant or fallback to product-level data
  const currentVariant = selectedVariant || {
    id: product.variantId || product.id,
    price: product.price,
    compareAtPrice: product.regular_price,
    available: product.stock_status === 'instock',
    title: 'Default'
  };
  
  const isInStock = currentVariant.available;
  const displayPrice = currentVariant.price;
  const originalPrice = currentVariant.compareAtPrice;
  const onSale = originalPrice && parseFloat(originalPrice) > parseFloat(displayPrice);
  const featuredImage = images && images[0];
  
  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setShowVariants(false);
  };
  
  // Handle adding to cart
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isInStock || addingToCart || cartLoading) return;
    
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
  
  // Image handling
  const getImageSrc = () => {
    if (imageError) {
      return placeholder || '/placeholder-product.webp';
    }
    return featuredImage?.src || placeholder || '/placeholder-product.webp';
  };
  
  const getImageAlt = () => {
    if (imageError) {
      return `${name} - Product Image`;
    }
    return featuredImage?.alt || name;
  };
  
  // Check if product has multiple variants
  const hasMultipleVariants = variants.length > 1;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
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
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/shop/products/${slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-[#1a1a1a] transition-colors line-clamp-2 mb-2">
            {name}
          </h3>
        </Link>

        {/* Variant Selection (if multiple variants exist) */}
        {hasMultipleVariants && (
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
                  className={`transform transition-transform ${showVariants ? 'rotate-180' : ''}`}
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
                      } ${!variant.available ? 'text-gray-400 cursor-not-allowed' : ''}`}
                      disabled={!variant.available}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{variant.title}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            ${parseFloat(variant.price).toFixed(2)}
                          </span>
                          {!variant.available && (
                            <span className="text-xs text-red-500">Out of Stock</span>
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
          disabled={!isInStock || addingToCart || cartLoading}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            isInStock
              ? addingToCart || cartLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-[#DBDBDB] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={16} />
          {addingToCart || cartLoading
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