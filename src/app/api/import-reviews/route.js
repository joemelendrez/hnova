// app/api/import-reviews/route.js
import { NextResponse } from 'next/server';

// External review import system for Amazon, AliExpress, etc.
// This system allows you to import reviews from various sources for the same products

export async function POST(request) {
  try {
    const { productHandle, source, sourceUrl, reviews } = await request.json();

    // Validate the import request
    if (!productHandle || !source || !reviews || !Array.isArray(reviews)) {
      return NextResponse.json(
        { error: 'Invalid import data' },
        { status: 400 }
      );
    }

    // Process and format reviews from different sources
    const formattedReviews = await processExternalReviews(
      reviews,
      source,
      sourceUrl
    );

    // Store reviews in your database
    await storeImportedReviews(productHandle, source, formattedReviews);

    return NextResponse.json({
      success: true,
      imported: formattedReviews.length,
      productHandle,
      source,
    });
  } catch (error) {
    console.error('Review import error:', error);
    return NextResponse.json(
      { error: 'Failed to import reviews' },
      { status: 500 }
    );
  }
}

// Process reviews from different external sources
async function processExternalReviews(reviews, source, sourceUrl) {
  const processed = reviews.map((review) => {
    const baseReview = {
      id: generateReviewId(review, source),
      author: sanitizeAuthorName(review.author || review.name || 'Anonymous'),
      rating: normalizeRating(review.rating, source),
      title: sanitizeText(review.title || ''),
      content: sanitizeText(
        review.content || review.text || review.review || ''
      ),
      date: normalizeDate(
        review.date || review.created_at || review.reviewDate
      ),
      verified: determineVerificationStatus(review, source),
      helpful: normalizeHelpfulCount(
        review.helpful || review.votes || review.likes || 0
      ),
      images: processReviewImages(review.images || review.photos || []),
      variant: extractVariantInfo(review),
      source: source,
      sourceUrl: sourceUrl,
      imported: true,
      originalId: review.id || review.reviewId || null,
    };

    // Add source-specific metadata
    switch (source.toLowerCase()) {
      case 'amazon':
        return {
          ...baseReview,
          verifiedPurchase:
            review.verified_purchase || review.verified || false,
          vineCustomer: review.vine_customer || false,
          helpfulVotes: review.helpful_votes || 0,
          totalVotes: review.total_votes || 0,
        };

      case 'aliexpress':
        return {
          ...baseReview,
          country: review.country || '',
          productColor: review.product_color || review.color || '',
          productSize: review.product_size || review.size || '',
          shippingSpeed: review.shipping_speed || null,
          sellerService: review.seller_service || null,
        };

      case 'ebay':
        return {
          ...baseReview,
          feedbackType: review.feedback_type || 'positive',
          transactionId: review.transaction_id || null,
          itemCondition: review.item_condition || null,
        };

      case 'walmart':
        return {
          ...baseReview,
          incentivized: review.incentivized || false,
          syndicationSource: review.syndication_source || null,
        };

      default:
        return baseReview;
    }
  });

  // Filter out invalid reviews
  return processed.filter(
    (review) =>
      review.rating >= 1 && review.rating <= 5 && review.content.length > 10
  );
}

// Generate unique review ID
function generateReviewId(review, source) {
  const timestamp = Date.now();
  const sourcePrefix = source.toLowerCase().substring(0, 3);
  const originalId = review.id || review.reviewId || Math.random().toString(36);
  return `${sourcePrefix}_${originalId}_${timestamp}`;
}

// Sanitize author names to protect privacy
function sanitizeAuthorName(name) {
  if (!name || name.length < 2) return 'Anonymous';

  // Remove email addresses
  name = name.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');

  // Truncate long names and add privacy protection
  if (name.length > 20) {
    name = name.substring(0, 20) + '...';
  }

  // Add anonymization for privacy
  const words = name.trim().split(' ');
  if (words.length > 1) {
    // Show first name and last initial
    return `${words[0]} ${words[words.length - 1].charAt(0)}.`;
  }

  return name.trim() || 'Anonymous';
}

// Normalize ratings from different scales
function normalizeRating(rating, source) {
  if (!rating) return 5; // Default to 5 stars if no rating

  const numRating = parseFloat(rating);

  // Handle different rating scales
  switch (source.toLowerCase()) {
    case 'amazon':
    case 'aliexpress':
      // Usually 1-5 scale
      return Math.max(1, Math.min(5, Math.round(numRating)));

    case 'ebay':
      // Convert feedback score to star rating
      if (rating === 'positive') return 5;
      if (rating === 'neutral') return 3;
      if (rating === 'negative') return 1;
      return Math.max(1, Math.min(5, Math.round(numRating)));

    case 'walmart':
      // Usually 1-5 scale
      return Math.max(1, Math.min(5, Math.round(numRating)));

    default:
      // Assume 1-5 scale and normalize
      if (numRating <= 1) return Math.max(1, Math.min(5, numRating * 5));
      return Math.max(1, Math.min(5, Math.round(numRating)));
  }
}

// Sanitize and clean review text
function sanitizeText(text) {
  if (!text) return '';

  // Remove URLs
  text = text.replace(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
    ''
  );

  // Remove email addresses
  text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');

  // Remove phone numbers
  text = text.replace(
    /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
    ''
  );

  // Remove excessive whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Limit length
  if (text.length > 1000) {
    text = text.substring(0, 1000) + '...';
  }

  return text;
}

// Normalize date formats
function normalizeDate(date) {
  if (!date) return new Date().toISOString();

  try {
    // Handle various date formats
    if (typeof date === 'string') {
      // Try parsing common formats
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }

      // Handle relative dates like "2 days ago"
      if (date.includes('ago')) {
        const now = new Date();
        if (date.includes('day')) {
          const days = parseInt(date.match(/\d+/)?.[0] || '0');
          now.setDate(now.getDate() - days);
        } else if (date.includes('week')) {
          const weeks = parseInt(date.match(/\d+/)?.[0] || '0');
          now.setDate(now.getDate() - weeks * 7);
        } else if (date.includes('month')) {
          const months = parseInt(date.match(/\d+/)?.[0] || '0');
          now.setMonth(now.getMonth() - months);
        }
        return now.toISOString();
      }
    }

    return new Date(date).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

// Determine verification status
function determineVerificationStatus(review, source) {
  switch (source.toLowerCase()) {
    case 'amazon':
      return review.verified_purchase || review.verified || false;
    case 'aliexpress':
      return true; // AliExpress reviews are typically from buyers
    case 'ebay':
      return review.verified_buyer || true; // eBay feedback is from transactions
    case 'walmart':
      return review.verified_buyer || false;
    default:
      return false;
  }
}

// Normalize helpful count
function normalizeHelpfulCount(helpful) {
  if (typeof helpful === 'object' && helpful.helpful) {
    return parseInt(helpful.helpful) || 0;
  }
  return parseInt(helpful) || 0;
}

// Process review images
function processReviewImages(images) {
  if (!Array.isArray(images)) return [];

  return images
    .filter((img) => img && (typeof img === 'string' || img.src || img.url))
    .map((img) => {
      const src = typeof img === 'string' ? img : img.src || img.url;
      return {
        src: src.startsWith('http') ? src : `https:${src}`,
        alt: img.alt || 'Customer review photo',
        width: img.width || 200,
        height: img.height || 200,
      };
    })
    .slice(0, 5); // Limit to 5 images per review
}

// Extract variant information
function extractVariantInfo(review) {
  const variant = [];

  if (review.color || review.product_color) {
    variant.push(`Color: ${review.color || review.product_color}`);
  }

  if (review.size || review.product_size) {
    variant.push(`Size: ${review.size || review.product_size}`);
  }

  if (review.variant || review.variation) {
    variant.push(review.variant || review.variation);
  }

  return variant.length > 0 ? variant.join(', ') : '';
}

// Store imported reviews in database
async function storeImportedReviews(productHandle, source, reviews) {
  // This would connect to your actual database
  // For now, we'll use a simple in-memory store or file system

  const reviewData = {
    productHandle,
    source,
    importDate: new Date().toISOString(),
    reviews,
    totalReviews: reviews.length,
    averageRating:
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
    ratingBreakdown: calculateRatingBreakdown(reviews),
  };

  // In a real implementation, save to your database
  console.log(
    `Storing ${reviews.length} reviews for ${productHandle} from ${source}`
  );

  // Example: Save to JSON file for testing
  if (process.env.NODE_ENV === 'development') {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const filePath = path.join(
        process.cwd(),
        'data',
        'imported-reviews',
        `${productHandle}-${source}.json`
      );
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(reviewData, null, 2));
    } catch (error) {
      console.error('Error saving reviews to file:', error);
    }
  }

  return reviewData;
}

// Calculate rating breakdown
function calculateRatingBreakdown(reviews) {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      breakdown[rating]++;
    }
  });

  return breakdown;
}

// GET endpoint to retrieve imported reviews
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productHandle = searchParams.get('product');
  const source = searchParams.get('source');

  if (!productHandle) {
    return NextResponse.json(
      { error: 'Product handle required' },
      { status: 400 }
    );
  }

  try {
    const reviews = await getStoredReviews(productHandle, source);
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error retrieving reviews:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve reviews' },
      { status: 500 }
    );
  }
}

// Retrieve stored reviews
async function getStoredReviews(productHandle, source = null) {
  // In a real implementation, query your database
  // For now, return mock data or read from files

  if (process.env.NODE_ENV === 'development') {
    const fs = require('fs').promises;
    const path = require('path');

    try {
      const dataDir = path.join(process.cwd(), 'data', 'imported-reviews');
      const files = await fs.readdir(dataDir);

      const matchingFiles = files.filter(
        (file) =>
          file.startsWith(productHandle) &&
          (!source || file.includes(source)) &&
          file.endsWith('.json')
      );

      const allReviews = [];

      for (const file of matchingFiles) {
        const filePath = path.join(dataDir, file);
        const data = JSON.parse(await fs.readFile(filePath, 'utf8'));
        allReviews.push(...data.reviews);
      }

      return {
        productHandle,
        totalReviews: allReviews.length,
        averageRating:
          allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) /
              allReviews.length
            : 0,
        ratingBreakdown: calculateRatingBreakdown(allReviews),
        reviews: allReviews.sort((a, b) => new Date(b.date) - new Date(a.date)),
      };
    } catch (error) {
      console.log('No stored reviews found, returning empty data');
    }
  }

  // Return empty data if no reviews found
  return {
    productHandle,
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: [],
  };
}
