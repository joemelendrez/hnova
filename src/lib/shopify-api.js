// lib/shopify-api.js
import shopifyClient from './shopify';

// Get all products
export async function getProducts() {
  try {
    const products = await shopifyClient.product.fetchAll();
    return products.map(formatShopifyProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get single product
export async function getProduct(handle) {
  try {
    const product = await shopifyClient.product.fetchByHandle(handle);
    return formatShopifyProduct(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Format Shopify product for your components
function formatShopifyProduct(shopifyProduct) {
  const variant = shopifyProduct.variants[0];

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    slug: shopifyProduct.handle,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    on_sale:
      variant.compareAtPrice &&
      parseFloat(variant.compareAtPrice) > parseFloat(variant.price),
    stock_status: variant.available ? 'instock' : 'outofstock',
    images: shopifyProduct.images.map((img) => ({
      src: img.src,
      alt: img.altText || shopifyProduct.title,
    })),
    description: shopifyProduct.description,
    vendor: shopifyProduct.vendor,
    productType: shopifyProduct.productType,
    variants: shopifyProduct.variants,
  };
}

// Create checkout
export async function createCheckout() {
  try {
    const checkout = await shopifyClient.checkout.create();
    return checkout;
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw error;
  }
}

// Add to cart
export async function addToCart(checkoutId, variantId, quantity = 1) {
  try {
    const lineItemsToAdd = [
      {
        variantId: variantId,
        quantity: quantity,
      },
    ];

    const checkout = await shopifyClient.checkout.addLineItems(
      checkoutId,
      lineItemsToAdd
    );
    return checkout;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}
