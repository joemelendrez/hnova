// src/utils/priceUtils.js
// Create this file for consistent price formatting across your app

/**
 * Format price to always show 2 decimal places
 * @param {string|number|object} price - Price value from Shopify
 * @returns {string} Formatted price string (e.g., "24.99")
 */
export function formatPrice(price) {
  if (!price) return '0.00';

  // Handle Shopify price objects
  if (typeof price === 'object' && price.amount) {
    return parseFloat(price.amount).toFixed(2);
  }

  // Handle string or number prices
  return parseFloat(price).toFixed(2);
}

/**
 * Format price with currency symbol
 * @param {string|number|object} price - Price value from Shopify
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} Formatted price with currency (e.g., "$24.99")
 */
export function formatPriceWithCurrency(price, currency = '$') {
  return `${currency}${formatPrice(price)}`;
}

/**
 * Check if a product is on sale
 * @param {string|number} price - Current price
 * @param {string|number} compareAtPrice - Original price
 * @returns {boolean} True if on sale
 */
export function isOnSale(price, compareAtPrice) {
  if (!compareAtPrice) return false;
  return parseFloat(compareAtPrice) > parseFloat(price);
}

/**
 * Calculate discount percentage
 * @param {string|number} price - Sale price
 * @param {string|number} compareAtPrice - Original price
 * @returns {number} Discount percentage (e.g., 20 for 20% off)
 */
export function getDiscountPercentage(price, compareAtPrice) {
  if (!compareAtPrice || !isOnSale(price, compareAtPrice)) return 0;

  const originalPrice = parseFloat(compareAtPrice);
  const salePrice = parseFloat(price);
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;

  return Math.round(discount);
}
