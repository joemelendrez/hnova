// lib/shopify.js
import Client from 'shopify-buy';

// Initialize Shopify client
let shopifyClient = null;

if (
  process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN &&
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN
) {
  shopifyClient = Client.buildClient({
    domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
    storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  });
}

// Format Shopify product for our components
export function formatShopifyProduct(shopifyProduct) {
  const variant = shopifyProduct.variants[0];
  const images = shopifyProduct.images || [];

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    price: variant?.price || '0.00',
    regular_price: variant?.compareAtPrice || variant?.price || '0.00',
    sale_price: variant?.price || '0.00',
    on_sale:
      variant?.compareAtPrice &&
      parseFloat(variant.compareAtPrice) > parseFloat(variant.price),
    stock_status: variant?.available ? 'instock' : 'outofstock',
    images: images.map((img) => ({
      src: img.src,
      alt: img.altText || shopifyProduct.title,
    })),
    description: shopifyProduct.description,
    descriptionHtml: shopifyProduct.descriptionHtml,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    tags: shopifyProduct.tags,
    shopifyId: shopifyProduct.id,
    variantId: variant?.id,
    variants: shopifyProduct.variants,
  };
}

// Get all products
export async function getProducts() {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const products = await shopifyClient.product.fetchAll();
    return products.map(formatShopifyProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// Get single product by handle
export async function getProduct(handle) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const product = await shopifyClient.product.fetchByHandle(handle);
    return product ? formatShopifyProduct(product) : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Get products by collection
export async function getProductsByCollection(collectionHandle) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const collection = await shopifyClient.collection.fetchWithProducts(
      collectionHandle
    );
    return collection.products.map(formatShopifyProduct);
  } catch (error) {
    console.error('Error fetching collection products:', error);
    throw error;
  }
}

// Create checkout
export async function createCheckout() {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const checkout = await shopifyClient.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

// Add line items to checkout
export async function addToCheckout(checkoutId, lineItemsToAdd) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const checkout = await shopifyClient.checkout.addLineItems(
      checkoutId,
      lineItemsToAdd
    );
    return checkout;
  } catch (error) {
    console.error('Error adding to checkout:', error);
    throw error;
  }
}

// Update line items in checkout
export async function updateCheckout(checkoutId, lineItemsToUpdate) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const checkout = await shopifyClient.checkout.updateLineItems(
      checkoutId,
      lineItemsToUpdate
    );
    return checkout;
  } catch (error) {
    console.error('Error updating checkout:', error);
    throw error;
  }
}

// Remove line items from checkout
export async function removeFromCheckout(checkoutId, lineItemIdsToRemove) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const checkout = await shopifyClient.checkout.removeLineItems(
      checkoutId,
      lineItemIdsToRemove
    );
    return checkout;
  } catch (error) {
    console.error('Error removing from checkout:', error);
    throw error;
  }
}

// Get checkout by ID
export async function getCheckout(checkoutId) {
  if (!shopifyClient) {
    throw new Error('Shopify client not initialized');
  }

  try {
    const checkout = await shopifyClient.checkout.fetch(checkoutId);
    return checkout;
  } catch (error) {
    console.error('Error fetching checkout:', error);
    throw error;
  }
}

export default shopifyClient;
