// components/CartDrawer.js
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '../app/hooks/useShopifyCart';

export default function CartDrawer() {
  const {
    checkout,
    cartOpen,
    cartLoading,
    cartCount,
    cartTotal,
    setCartOpen,
    removeFromCart,
    updateCartQuantity,
    proceedToCheckout,
  } = useCart();

  const lineItems = checkout?.lineItems || [];

  // Format price from Shopify price object with proper decimal places
  const formatPrice = (price) => {
    if (typeof price === 'object' && price.amount) {
      return parseFloat(price.amount).toFixed(2);
    }
    if (typeof price === 'string' || typeof price === 'number') {
      return parseFloat(price || 0).toFixed(2);
    }
    return '0.00';
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Cart Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-[#1a1a1a]">
                Shopping Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {lineItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="bg-[#1a1a1a] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lineItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={
                            item.variant?.image?.src ||
                            item.variant?.image?.transformedSrc ||
                            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop'
                          }
                          alt={item.title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm leading-tight">
                          {item.title}
                        </h4>
                        {item.variant?.title !== 'Default Title' && (
                          <p className="text-xs text-gray-500 mt-1">
                            {item.variant?.title}
                          </p>
                        )}

                        {/* Price with proper formatting */}
                        <p className="font-bold text-[#1a1a1a] mt-2">
                          ${formatPrice(item.variant?.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1)
                            }
                            disabled={cartLoading || item.quantity <= 1}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1)
                            }
                            disabled={cartLoading}
                            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-3 w-3" />
                          </button>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={cartLoading}
                            className="ml-auto text-red-500 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {lineItems.length > 0 && (
              <div className="border-t p-6 space-y-4">
                {/* Subtotal with proper formatting */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Subtotal:</span>
                  <span className="text-xl font-bold text-[#1a1a1a]">
                    ${formatPrice(cartTotal)}
                  </span>
                </div>

                {/* Shipping Notice */}
                <p className="text-sm text-gray-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <button
                  onClick={proceedToCheckout}
                  disabled={cartLoading}
                  className="w-full bg-[#1a1a1a] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {cartLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Secure Checkout
                      <ExternalLink className="h-4 w-4" />
                    </>
                  )}
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full text-gray-600 py-2 text-sm hover:text-[#1a1a1a] transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
