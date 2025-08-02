// hooks/useShopifyCart.js
'use client';

import { useState, useEffect, useContext, createContext } from 'react';

const CartContext = createContext();

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

export function CartProvider({ children }) {
  const [checkout, setCheckout] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  // Initialize checkout on mount
  useEffect(() => {
    initializeCheckout();
  }, []);

  // Save checkout ID to localStorage
  useEffect(() => {
    if (checkout?.id) {
      localStorage.setItem('shopify_checkout_id', checkout.id);
    }
  }, [checkout?.id]);

  async function initializeCheckout() {
    try {
      // Check for existing checkout in localStorage
      const checkoutId = localStorage.getItem('shopify_checkout_id');

      if (checkoutId) {
        // Try to fetch existing checkout
        const existingCheckout = await shopifyClient?.checkout.fetch(
          checkoutId
        );
        if (existingCheckout && !existingCheckout.completedAt) {
          setCheckout(existingCheckout);
          return;
        }
      }

      // Create new checkout if none exists or previous was completed
      if (shopifyClient) {
        const newCheckout = await shopifyClient.checkout.create();
        setCheckout(newCheckout);
      }
    } catch (error) {
      console.error('Error initializing checkout:', error);
      // Create new checkout on error
      try {
        if (shopifyClient) {
          const newCheckout = await shopifyClient.checkout.create();
          setCheckout(newCheckout);
        }
      } catch (fallbackError) {
        console.error('Error creating fallback checkout:', fallbackError);
      }
    }
  }

  async function addToCart(variantId, quantity = 1) {
    if (!shopifyClient || !checkout) {
      console.error('Shopify client or checkout not initialized');
      return;
    }

    setCartLoading(true);
    try {
      const lineItemsToAdd = [
        {
          variantId: variantId,
          quantity: quantity,
        },
      ];

      const updatedCheckout = await shopifyClient.checkout.addLineItems(
        checkout.id,
        lineItemsToAdd
      );
      setCheckout(updatedCheckout);
      setCartOpen(true); // Open cart drawer after adding
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setCartLoading(false);
    }
  }

  async function removeFromCart(lineItemId) {
    if (!shopifyClient || !checkout) return;

    setCartLoading(true);
    try {
      const updatedCheckout = await shopifyClient.checkout.removeLineItems(
        checkout.id,
        [lineItemId]
      );
      setCheckout(updatedCheckout);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setCartLoading(false);
    }
  }

  async function updateCartQuantity(lineItemId, quantity) {
    if (!shopifyClient || !checkout) return;

    setCartLoading(true);
    try {
      const lineItemsToUpdate = [
        {
          id: lineItemId,
          quantity: quantity,
        },
      ];

      const updatedCheckout = await shopifyClient.checkout.updateLineItems(
        checkout.id,
        lineItemsToUpdate
      );
      setCheckout(updatedCheckout);
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    } finally {
      setCartLoading(false);
    }
  }

  function proceedToCheckout() {
    if (checkout?.webUrl) {
      window.location.href = checkout.webUrl;
    }
  }

  const cartCount =
    checkout?.lineItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const cartTotal = checkout?.totalPrice || {
    amount: '0.00',
    currencyCode: 'USD',
  };

  const value = {
    checkout,
    cartLoading,
    cartOpen,
    cartCount,
    cartTotal,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    proceedToCheckout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
