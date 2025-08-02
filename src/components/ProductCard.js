// components/ProductCard.js
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    slug,
    name,
    price,
    regular_price,
    sale_price,
    on_sale,
    images,
    stock_status
  } = product;

  const isInStock = stock_status === 'instock';
  const displayPrice = on_sale ? sale_price : price;
  const originalPrice = on_sale ? regular_price : null;
  const featuredImage = images && images[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Product Image */}
      <Link href={`/shop/products/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {featuredImage ? (
            <Image
              src={featuredImage.src}
              alt={featuredImage.alt || name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          
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
            ${displayPrice}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${
            isInStock
              ? 'bg-[#DBDBDB] hover:bg-[#1a1a1a] hover:text-white text-[#1a1a1a]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isInStock}
        >
          <ShoppingCart size={16} />
          {isInStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}