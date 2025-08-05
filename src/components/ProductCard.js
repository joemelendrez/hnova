import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../app/hooks/useShopifyCart';

export default function ProductCard({ product }) {
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, cartLoading } = useCart();

  const {
    slug,
    name,
    price,
    regular_price,
    sale_price,
    on_sale,
    images,
    stock_status,
    placeholder,
    variantId, // This is key for Shopify products
    shopifyId,
  } = product;

  const isInStock = stock_status === 'instock';
  const displayPrice = on_sale ? sale_price : price;
  const originalPrice = on_sale ? regular_price : null;
  const featuredImage = images && images[0];

  // Handle adding to cart
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!isInStock || addingToCart || cartLoading) return;

    // For Shopify products, we need the variantId
    const productVariantId = variantId || product.id;

    if (!productVariantId) {
      console.error('No variant ID found for product:', product);
      alert('Error: Product variant not found');
      return;
    }

    setAddingToCart(true);

    try {
      await addToCart(productVariantId, 1);
      // Optional: Show success message
      console.log('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Determine which image to show
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
          {on_sale && (
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

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-[#1a1a1a]">
            ${parseFloat(displayPrice).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${parseFloat(originalPrice).toFixed(2)}
            </span>
          )}
        </div>

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
