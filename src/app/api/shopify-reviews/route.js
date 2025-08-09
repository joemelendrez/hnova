// src/app/api/shopify-reviews/route.js
import { NextResponse } from 'next/server';

// Shopify review integration for popular review apps
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productHandle = searchParams.get('product');
  const productId = searchParams.get('productId');
  const reviewApp = searchParams.get('app') || 'detect'; // judge.me, loox, yotpo, etc.

  if (!productHandle && !productId) {
    return NextResponse.json(
      { error: 'Product handle or ID required' },
      { status: 400 }
    );
  }

  try {
    // First, get product details from Shopify
    const product = await getShopifyProduct(productHandle, productId);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Detect or use specified review app
    const detectedApp = reviewApp === 'detect' ? 
      await detectReviewApp(product) : reviewApp;

    // Fetch reviews based on the review app
    const reviews = await fetchReviewsByApp(detectedApp, product);
    
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
      },
      reviewApp: detectedApp,
      reviews: reviews,
      summary: {
        totalReviews: reviews.length,
        averageRating: calculateAverageRating(reviews),
        ratingBreakdown: calculateRatingBreakdown(reviews),
      }
    });

  } catch (error) {
    console.error('Error fetching Shopify reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews: ' + error.message },
      { status: 500 }
    );
  }
}

// Get product from Shopify Admin API
async function getShopifyProduct(handle, id) {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!shopifyDomain || !accessToken) {
    throw new Error('Shopify credentials not configured');
  }

  let url;
  if (id) {
    url = `https://${shopifyDomain}/admin/api/2024-01/products/${id}.json`;
  } else {
    url = `https://${shopifyDomain}/admin/api/2024-01/products.json?handle=${handle}`;
  }

  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const data = await response.json();
  return id ? data.product : data.products[0];
}

// Detect which review app is being used
async function detectReviewApp(product) {
  // Check metafields for review app indicators
  const metafields = await getProductMetafields(product.id);
  
  // Judge.me detection
  if (metafields.some(m => m.namespace === 'judgeme' || m.namespace === 'spr')) {
    return 'judgeme';
  }
  
  // Loox detection
  if (metafields.some(m => m.namespace === 'loox' || m.key === 'loox_reviews')) {
    return 'loox';
  }
  
  // Yotpo detection
  if (metafields.some(m => m.namespace === 'yotpo' || m.namespace === 'reviews')) {
    return 'yotpo';
  }
  
  // Stamped.io detection
  if (metafields.some(m => m.namespace === 'stamped' || m.namespace === 'reviews.io')) {
    return 'stamped';
  }
  
  // Rivyo detection
  if (metafields.some(m => m.namespace === 'rivyo')) {
    return 'rivyo';
  }
  
  // Default to Judge.me (most common)
  return 'judgeme';
}

// Get product metafields
async function getProductMetafields(productId) {
  const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  const url = `https://${shopifyDomain}/admin/api/2024-01/products/${productId}/metafields.json`;
  
  const response = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    console.warn('Could not fetch metafields:', response.status);
    return [];
  }
  
  const data = await response.json();
  return data.metafields || [];
}

// Fetch reviews based on the detected app
async function fetchReviewsByApp(app, product) {
  switch (app.toLowerCase()) {
    case 'judgeme':
      return await fetchJudgemeReviews(product);
    case 'loox':
      return await fetchLooxReviews(product);
    case 'yotpo':
      return await fetchYotpoReviews(product);
    case 'stamped':
      return await fetchStampedReviews(product);
    case 'rivyo':
      return await fetchRivyoReviews(product);
    default:
      return await fetchGenericShopifyReviews(product);
  }
}

// Judge.me Reviews Integration
async function fetchJudgemeReviews(product) {
  try {
    // Judge.me public API endpoint
    const shopDomain = process.env.SHOPIFY_STORE_DOMAIN?.replace('.myshopify.com', '');
    const url = `https://judge.me/api/v1/reviews?shop_domain=${shopDomain}&api_token=${process.env.JUDGEME_API_TOKEN}&product_id=${product.id}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('Judge.me API not available, trying alternative method');
      return await fetchJudgemeFallback(product);
    }
    
    const data = await response.json();
    
    return data.reviews?.map(review => ({
      id: review.id,
      author: review.reviewer?.name || 'Anonymous',
      rating: review.rating,
      title: review.title || '',
      content: review.body || '',
      date: review.created_at,
      verified: review.verified === 'yes',
      helpful: review.helpful_count || 0,
      images: review.pictures?.map(pic => ({
        src: pic.urls?.original || pic.url,
        alt: 'Customer photo'
      })) || [],
      source: 'judgeme',
      productId: product.id
    })) || [];
    
  } catch (error) {
    console.error('Error fetching Judge.me reviews:', error);
    return await fetchJudgemeFallback(product);
  }
}

// Judge.me fallback - fetch from metafields
async function fetchJudgemeFallback(product) {
  try {
    const metafields = await getProductMetafields(product.id);
    const reviewMetafield = metafields.find(m => 
      m.namespace === 'judgeme' || m.namespace === 'spr'
    );
    
    if (reviewMetafield && reviewMetafield.value) {
      const reviewData = JSON.parse(reviewMetafield.value);
      return formatMetafieldReviews(reviewData, 'judgeme');
    }
    
    return [];
  } catch (error) {
    console.error('Judge.me fallback failed:', error);
    return [];
  }
}

// Loox Reviews Integration
async function fetchLooxReviews(product) {
  try {
    // Loox doesn't have a public API, so we'll try to get from metafields
    const metafields = await getProductMetafields(product.id);
    const looxMetafield = metafields.find(m => 
      m.namespace === 'loox' || m.key === 'loox_reviews'
    );
    
    if (looxMetafield && looxMetafield.value) {
      const reviewData = JSON.parse(looxMetafield.value);
      return formatMetafieldReviews(reviewData, 'loox');
    }
    
    // Alternative: Try to fetch from Loox widget data
    return await fetchLooxFromWidget(product);
    
  } catch (error) {
    console.error('Error fetching Loox reviews:', error);
    return [];
  }
}

// Loox widget data extraction
async function fetchLooxFromWidget(product) {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const url = `https://${shopifyDomain}/products/${product.handle}`;
    
    const response = await fetch(url);
    const html = await response.text();
    
    // Look for Loox widget data in the HTML
    const looxDataMatch = html.match(/window\.looxReviews\s*=\s*(\{.*?\});/s);
    
    if (looxDataMatch) {
      const looxData = JSON.parse(looxDataMatch[1]);
      return formatLooxData(looxData);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Loox widget data:', error);
    return [];
  }
}

// Yotpo Reviews Integration
async function fetchYotpoReviews(product) {
  try {
    const yotpoAppKey = process.env.YOTPO_APP_KEY;
    
    if (!yotpoAppKey) {
      return await fetchYotpoFallback(product);
    }
    
    const url = `https://api.yotpo.com/v1/apps/${yotpoAppKey}/products/${product.id}/reviews.json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return await fetchYotpoFallback(product);
    }
    
    const data = await response.json();
    
    return data.reviews?.map(review => ({
      id: review.id,
      author: review.user?.display_name || 'Anonymous',
      rating: review.score,
      title: review.title || '',
      content: review.content || '',
      date: review.created_at,
      verified: review.verified_buyer,
      helpful: review.votes_up || 0,
      images: review.images?.map(img => ({
        src: img.original_url,
        alt: 'Customer photo'
      })) || [],
      source: 'yotpo',
      productId: product.id
    })) || [];
    
  } catch (error) {
    console.error('Error fetching Yotpo reviews:', error);
    return await fetchYotpoFallback(product);
  }
}

// Yotpo fallback
async function fetchYotpoFallback(product) {
  try {
    const metafields = await getProductMetafields(product.id);
    const yotpoMetafield = metafields.find(m => 
      m.namespace === 'yotpo' || m.namespace === 'reviews'
    );
    
    if (yotpoMetafield && yotpoMetafield.value) {
      const reviewData = JSON.parse(yotpoMetafield.value);
      return formatMetafieldReviews(reviewData, 'yotpo');
    }
    
    return [];
  } catch (error) {
    console.error('Yotpo fallback failed:', error);
    return [];
  }
}

// Stamped.io Reviews Integration
async function fetchStampedReviews(product) {
  try {
    const stampedApiKey = process.env.STAMPED_API_KEY;
    const stampedStoreHash = process.env.STAMPED_STORE_HASH;
    
    if (!stampedApiKey || !stampedStoreHash) {
      return await fetchStampedFallback(product);
    }
    
    const url = `https://stamped.io/api/widget/reviews?storeHash=${stampedStoreHash}&productId=${product.id}&apiKey=${stampedApiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return await fetchStampedFallback(product);
    }
    
    const data = await response.json();
    
    return data.data?.map(review => ({
      id: review.id,
      author: review.author || 'Anonymous',
      rating: review.rating,
      title: review.reviewTitle || '',
      content: review.reviewMessage || '',
      date: review.created,
      verified: review.verifiedBuyer || false,
      helpful: review.helpful || 0,
      images: review.photos?.map(photo => ({
        src: photo.src,
        alt: 'Customer photo'
      })) || [],
      source: 'stamped',
      productId: product.id
    })) || [];
    
  } catch (error) {
    console.error('Error fetching Stamped reviews:', error);
    return await fetchStampedFallback(product);
  }
}

// Stamped fallback
async function fetchStampedFallback(product) {
  try {
    const metafields = await getProductMetafields(product.id);
    const stampedMetafield = metafields.find(m => 
      m.namespace === 'stamped' || m.namespace === 'reviews.io'
    );
    
    if (stampedMetafield && stampedMetafield.value) {
      const reviewData = JSON.parse(stampedMetafield.value);
      return formatMetafieldReviews(reviewData, 'stamped');
    }
    
    return [];
  } catch (error) {
    console.error('Stamped fallback failed:', error);
    return [];
  }
}

// Rivyo Reviews Integration
async function fetchRivyoReviews(product) {
  try {
    const metafields = await getProductMetafields(product.id);
    const rivyoMetafield = metafields.find(m => m.namespace === 'rivyo');
    
    if (rivyoMetafield && rivyoMetafield.value) {
      const reviewData = JSON.parse(rivyoMetafield.value);
      return formatMetafieldReviews(reviewData, 'rivyo');
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching Rivyo reviews:', error);
    return [];
  }
}

// Generic Shopify reviews (for custom implementations)
async function fetchGenericShopifyReviews(product) {
  try {
    const metafields = await getProductMetafields(product.id);
    
    // Look for any review-related metafields
    const reviewMetafields = metafields.filter(m => 
      m.namespace.includes('review') || 
      m.key.includes('review') ||
      m.namespace.includes('rating')
    );
    
    const allReviews = [];
    
    for (const metafield of reviewMetafields) {
      try {
        const reviewData = JSON.parse(metafield.value);
        const formatted = formatMetafieldReviews(reviewData, 'generic');
        allReviews.push(...formatted);
      } catch (e) {
        // Skip invalid JSON
        continue;
      }
    }
    
    return allReviews;
  } catch (error) {
    console.error('Error fetching generic reviews:', error);
    return [];
  }
}

// Format reviews from metafields
function formatMetafieldReviews(reviewData, source) {
  if (!reviewData || !Array.isArray(reviewData)) {
    return [];
  }
  
  return reviewData.map(review => ({
    id: review.id || Math.random().toString(36),
    author: review.author || review.name || review.customer_name || 'Anonymous',
    rating: parseInt(review.rating || review.score || 5),
    title: review.title || review.review_title || '',
    content: review.content || review.body || review.message || review.text || '',
    date: review.date || review.created_at || review.created || new Date().toISOString(),
    verified: review.verified || review.verified_buyer || false,
    helpful: parseInt(review.helpful || review.helpful_count || 0),
    images: review.images || review.photos || [],
    source: source,
    productId: review.product_id
  }));
}

// Format Loox specific data
function formatLooxData(looxData) {
  if (!looxData.reviews) return [];
  
  return looxData.reviews.map(review => ({
    id: review.id,
    author: review.customer?.name || 'Anonymous',
    rating: review.rating,
    title: '',
    content: review.text || '',
    date: review.created_at,
    verified: review.verified || false,
    helpful: 0,
    images: review.media?.map(m => ({
      src: m.url,
      alt: 'Customer photo'
    })) || [],
    source: 'loox',
    productId: review.product_id
  }));
}

// Calculate average rating
function calculateAverageRating(reviews) {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// Calculate rating breakdown
function calculateRatingBreakdown(reviews) {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      breakdown[rating]++;
    }
  });
  
  return breakdown;
}