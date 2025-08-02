// lib/woocommerce-api.js
import WooCommerce from './woocommerce';

// Get all products
export async function getProducts(params = {}) {
  try {
    const response = await WooCommerce.get('products', {
      per_page: params.per_page || 20,
      page: params.page || 1,
      category: params.category || '',
      search: params.search || '',
      status: 'publish',
      stock_status: 'instock'
    });
    
    return {
      products: response.data,
      totalPages: parseInt(response.headers['x-wp-totalpages']),
      totalProducts: parseInt(response.headers['x-wp-total'])
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalPages: 0, totalProducts: 0 };
  }
}

// Get single product
export async function getProduct(slug) {
  try {
    const response = await WooCommerce.get('products', { slug });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get product categories
export async function getProductCategories() {
  try {
    const response = await WooCommerce.get('products/categories', {
      per_page: 100,
      hide_empty: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Create order
export async function createOrder(orderData) {
  try {
    const response = await WooCommerce.post('orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}