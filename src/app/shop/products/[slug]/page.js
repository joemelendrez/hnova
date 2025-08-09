// app/shop/products/[slug]/page.js
'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  User,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  FileText,
  Eye,
  Calendar,
  ChevronUp,
  ShoppingBag,
  Zap,
  Gift,
  Clock,
} from 'lucide-react';
import { useCart } from '../../../hooks/useShopifyCart';
import RecommendedBlogPosts from '@/components/RecommendedBlogPosts';

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

export default function ProductPage({ params }) {
  // Use React.use() to unwrap params promise (Next.js 15+)
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [error, setError] = useState(null);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewsData, setReviewsData] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStickyCart, setShowStickyCart] = useState(false);

  const { addToCart, cartLoading } = useCart();

  // Fetch reviews from our import API
  const fetchImportedReviews = async (productHandle) => {
    setReviewsLoading(true);
    try {
      const response = await fetch(
        `/api/import-reviews?product=${productHandle}`
      );

      if (response.ok) {
        const data = await response.json();
        return formatImportedReviews(data);
      }

      // Fallback to sample reviews
      return getFallbackReviews(productHandle);
    } catch (error) {
      console.error('Error fetching imported reviews:', error);
      return getFallbackReviews(productHandle);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Format imported reviews data
  const formatImportedReviews = (data) => {
    return {
      averageRating: data.averageRating || 4.5,
      totalReviews: data.totalReviews || 0,
      ratingBreakdown: data.ratingBreakdown || {
        5: Math.floor(data.totalReviews * 0.6),
        4: Math.floor(data.totalReviews * 0.25),
        3: Math.floor(data.totalReviews * 0.1),
        2: Math.floor(data.totalReviews * 0.03),
        1: Math.floor(data.totalReviews * 0.02),
      },
      reviews: (data.reviews || []).map((review) => ({
        id: review.id || Math.random().toString(36),
        author: review.author || 'Anonymous',
        rating: review.rating || 5,
        title: review.title || '',
        content: review.content || '',
        date: review.date || review.reviewDate || new Date().toISOString(),
        verified: review.verified || review.verifiedPurchase || false,
        helpful: review.helpful || review.helpfulVotes || 0,
        images: review.images || [],
        variant: review.variant || review.variantInfo || '',
        source: review.source || review.sourcePlatform || 'imported',
        country: review.country || '',
        imported: true,
      })),
    };
  };

  // Fallback reviews for demo/testing
  const getFallbackReviews = (productHandle) => {
    const mockReviews = {
      'habit-formation-toolkit': {
        averageRating: 4.8,
        totalReviews: 247,
        ratingBreakdown: { 5: 180, 4: 45, 3: 15, 2: 5, 1: 2 },
        reviews: [
          {
            id: '1',
            author: 'Sarah M.',
            rating: 5,
            title: 'Life-changing toolkit!',
            content:
              'This toolkit completely transformed my daily routine. The habit tracker is well-designed and the materials are incredibly helpful. Successfully built 5 new habits in 2 months!',
            date: '2024-01-15T10:30:00Z',
            verified: true,
            helpful: 23,
            images: [],
            variant: 'Digital Download',
            source: 'amazon',
            country: 'US',
            imported: true,
          },
          {
            id: '2',
            author: 'Mike R.',
            rating: 4,
            title: 'Great value for money',
            content:
              'Really comprehensive toolkit. Only wish it had more examples for different habit types, but overall very satisfied with the purchase.',
            date: '2024-01-10T14:20:00Z',
            verified: true,
            helpful: 15,
            images: [],
            variant: 'Physical Edition',
            source: 'amazon',
            country: 'CA',
            imported: true,
          },
          {
            id: '3',
            author: 'Jennifer L.',
            rating: 5,
            title: 'Perfect for beginners',
            content:
              'As someone who struggled with consistency, this toolkit made habit building much easier. The step-by-step approach really works!',
            date: '2024-01-08T09:15:00Z',
            verified: true,
            helpful: 19,
            images: [
              {
                src: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=200&h=200&fit=crop',
                alt: 'Customer photo showing habit tracker in use',
                width: 200,
                height: 200,
              },
            ],
            variant: 'Digital Download',
            source: 'aliexpress',
            country: 'UK',
            imported: true,
          },
        ],
      },
    };

    return (
      mockReviews[productHandle] || {
        averageRating: 4.5,
        totalReviews: 125,
        ratingBreakdown: { 5: 75, 4: 30, 3: 15, 2: 3, 1: 2 },
        reviews: [
          {
            id: 'default-1',
            author: 'Verified Customer',
            rating: 5,
            title: 'Great product!',
            content:
              'This product exceeded my expectations. Quality is excellent and really helps with building better habits.',
            date: new Date().toISOString(),
            verified: true,
            helpful: 8,
            images: [],
            variant: 'Standard',
            source: 'imported',
            country: 'US',
            imported: true,
          },
        ],
      }
    );
  };

  // Enhanced product formatting with rich description parsing
  function formatShopifyProduct(shopifyProduct) {
    const images = shopifyProduct.images || [];

    return {
      id: shopifyProduct.id,
      title: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      descriptionHtml: shopifyProduct.descriptionHtml,
      vendor: shopifyProduct.vendor,
      productType: shopifyProduct.productType,
      tags: shopifyProduct.tags || [],
      images: images.map((img) => ({
        src: img.src || img.transformedSrc,
        alt: img.altText || shopifyProduct.title,
        id: img.id,
      })),
      variants: shopifyProduct.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        price:
          typeof variant.price === 'object'
            ? variant.price.amount
            : variant.price,
        compareAtPrice: variant.compareAtPrice
          ? typeof variant.compareAtPrice === 'object'
            ? variant.compareAtPrice.amount
            : variant.compareAtPrice
          : null,
        available: variant.available,
        selectedOptions: variant.selectedOptions || [],
        image: variant.image
          ? {
              src: variant.image.src || variant.image.transformedSrc,
              alt: variant.image.altText || variant.title,
              id: variant.image.id,
            }
          : null,
      })),
    };
  }

  // Enhanced rich text renderer for Shopify HTML descriptions
  const RichTextRenderer = ({ htmlContent }) => {
    const [processedHtml, setProcessedHtml] = useState('');

    useEffect(() => {
      if (!htmlContent) return;

      // Process the HTML to make images responsive and secure
      const processHtml = (html) => {
        // Create a temporary div to parse HTML safely
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Process images
        const images = tempDiv.querySelectorAll('img');
        images.forEach((img) => {
          // Add responsive classes using regular CSS classes instead of @apply
          img.className =
            'w-full h-auto rounded-lg my-4 max-w-full shadow-md transition-transform duration-300 hover:scale-105';

          // Ensure images are secure (https)
          if (img.src && img.src.startsWith('http:')) {
            img.src = img.src.replace('http:', 'https:');
          }

          // Add loading="lazy" for performance
          img.setAttribute('loading', 'lazy');

          // Add alt text if missing
          if (!img.alt) {
            img.alt = product?.title || 'Product image';
          }

          // Wrap images in figure with caption if needed
          const figcaption = img.getAttribute('data-caption');
          if (figcaption) {
            const figure = document.createElement('figure');
            figure.className = 'my-6 text-center';
            img.parentNode.insertBefore(figure, img);
            figure.appendChild(img);

            const caption = document.createElement('figcaption');
            caption.className = 'text-sm text-gray-600 text-center mt-2 italic';
            caption.textContent = figcaption;
            figure.appendChild(caption);
          }
        });

        // Process other elements with regular CSS classes
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading) => {
          const size =
            heading.tagName === 'H1'
              ? 'text-3xl'
              : heading.tagName === 'H2'
              ? 'text-2xl'
              : heading.tagName === 'H3'
              ? 'text-xl'
              : 'text-lg';
          heading.className = `font-bold text-gray-900 mb-4 mt-6 ${size}`;
        });

        const paragraphs = tempDiv.querySelectorAll('p');
        paragraphs.forEach((p) => {
          p.className = 'mb-4 leading-relaxed text-gray-700';
        });

        const lists = tempDiv.querySelectorAll('ul, ol');
        lists.forEach((list) => {
          const listType = list.tagName === 'UL' ? 'list-disc' : 'list-decimal';
          list.className = `mb-4 pl-6 space-y-2 ${listType}`;
        });

        const listItems = tempDiv.querySelectorAll('li');
        listItems.forEach((li) => {
          li.className = 'text-gray-700 leading-relaxed';
        });

        const links = tempDiv.querySelectorAll('a');
        links.forEach((link) => {
          link.className =
            'text-blue-600 hover:text-blue-800 underline transition-colors';
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        });

        const tables = tempDiv.querySelectorAll('table');
        tables.forEach((table) => {
          table.className =
            'w-full border-collapse border border-gray-300 my-4 rounded-lg overflow-hidden';

          const ths = table.querySelectorAll('th');
          ths.forEach((th) => {
            th.className =
              'border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left';
          });

          const tds = table.querySelectorAll('td');
          tds.forEach((td) => {
            td.className = 'border border-gray-300 px-4 py-2';
          });
        });

        return tempDiv.innerHTML;
      };

      setProcessedHtml(processHtml(htmlContent));
    }, [htmlContent]);

    return (
      <div
        className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processedHtml }}
      />
    );
  };

  // Star rating component
  const StarRating = ({ rating, size = 'sm', showRating = false }) => {
    const starSize =
      size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`${starSize} ${
              i < Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : i < rating
                ? 'text-yellow-400 fill-current opacity-50'
                : 'text-gray-300'
            }`}
          />
        ))}
        {showRating && (
          <span className="ml-2 text-sm text-gray-600">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    );
  };

  // Review component
  const ReviewItem = ({ review }) => {
    const [showFullContent, setShowFullContent] = useState(false);
    const contentPreview =
      review.content.length > 200
        ? review.content.substring(0, 200) + '...'
        : review.content;

    // Source badge colors
    const getSourceBadge = (source) => {
      const badges = {
        amazon: 'bg-orange-100 text-orange-800',
        aliexpress: 'bg-red-100 text-red-800',
        ebay: 'bg-blue-100 text-blue-800',
        walmart: 'bg-blue-100 text-blue-800',
        imported: 'bg-gray-100 text-gray-800',
      };
      return badges[source] || badges.imported;
    };

    return (
      <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
            {review.author.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-semibold text-gray-900">
                {review.author}
              </span>
              {review.verified && (
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Verified Purchase
                </span>
              )}
              {review.source && (
                <span
                  className={`text-xs px-2 py-1 rounded ${getSourceBadge(
                    review.source
                  )}`}
                >
                  {review.source}
                </span>
              )}
              {review.country && (
                <span className="text-gray-500 text-sm">
                  📍 {review.country}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={review.rating} />
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>

            {review.title && (
              <h4 className="font-semibold text-gray-900 mb-2">
                {review.title}
              </h4>
            )}

            <p className="text-gray-700 leading-relaxed mb-3">
              {showFullContent || review.content.length <= 200
                ? review.content
                : contentPreview}
              {review.content.length > 200 && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-blue-600 hover:text-blue-800 ml-2 underline"
                >
                  {showFullContent ? 'Show less' : 'Read more'}
                </button>
              )}
            </p>

            {review.variant && (
              <div className="text-sm text-gray-500 mb-2">
                <strong>Variant:</strong> {review.variant}
              </div>
            )}

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((img, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                <ThumbsUp className="h-4 w-4" />
                Helpful ({review.helpful})
              </button>

              {review.imported && (
                <span className="text-xs italic">
                  Review imported from external source
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rating breakdown component
  const RatingBreakdown = ({ breakdown, totalReviews }) => {
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = breakdown[rating] || 0;
          const percentage =
            totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-8">{rating}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-12">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // Get variant-specific images
  const getVariantImages = (variant) => {
    if (!variant || !product) return product?.images || [];

    if (variant.image) {
      return [
        variant.image,
        ...product.images.filter((img) => img.id !== variant.image.id),
      ];
    }

    if (variant.selectedOptions && product.images.length > 1) {
      const matchedImages = [];
      const remainingImages = [...product.images];

      for (const option of variant.selectedOptions) {
        const optionValue = option.value.toLowerCase();

        const altMatch = remainingImages.find((img) => {
          const altText = (img.alt || '').toLowerCase();
          return (
            altText.includes(optionValue) ||
            altText.includes(option.name.toLowerCase())
          );
        });

        if (altMatch) {
          matchedImages.push(altMatch);
          const index = remainingImages.indexOf(altMatch);
          remainingImages.splice(index, 1);
        }
      }

      if (matchedImages.length > 0) {
        return [...matchedImages, ...remainingImages];
      }
    }

    return product.images;
  };

  // Update images when variant changes
  useEffect(() => {
    if (selectedVariant && product) {
      const variantImages = getVariantImages(selectedVariant);
      setCurrentImages(variantImages);
      setSelectedImage(0);
    } else if (product) {
      setCurrentImages(product.images);
    }
  }, [selectedVariant, product]);

  // Load reviews when product loads
  useEffect(() => {
    if (product) {
      fetchImportedReviews(product.handle).then(setReviewsData);
    }
  }, [product]);

  // Scroll detection for scroll-to-top and sticky cart
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show scroll to top after scrolling 500px
      setShowScrollTop(scrollY > 500);

      // Show sticky cart when scrolled past the main product section
      setShowStickyCart(scrollY > windowHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch product data
  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        if (!shopifyClient) {
          if (process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN) {
            const ShopifyBuy = await import('shopify-buy');
            shopifyClient = ShopifyBuy.default.buildClient({
              domain: process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN,
              storefrontAccessToken:
                process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
            });
          } else {
            throw new Error('Shopify not configured');
          }
        }

        const shopifyProduct = await shopifyClient.product.fetchByHandle(slug);

        if (!shopifyProduct) {
          setError('Product not found');
          return;
        }

        const formattedProduct = formatShopifyProduct(shopifyProduct);
        setProduct(formattedProduct);
        setSelectedVariant(formattedProduct.variants[0]);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);

        // Enhanced fallback product for testing
        setProduct({
          id: 'fallback-1',
          title: 'Habit Tracking Journal - Premium Edition',
          handle: slug,
          description:
            'Transform your daily routine with this scientifically-designed habit tracking journal.',
          descriptionHtml: `
            <h2>What's Included</h2>
            <img src="https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=400&fit=crop" alt="Journal interior layout" data-caption="Beautiful interior design with guided prompts" />
            <ul>
              <li>90 days of guided tracking pages</li>
              <li>Habit stacking worksheets</li>
              <li>Progress visualization charts</li>
              <li>Monthly reflection prompts</li>
            </ul>
            <h3>Why It Works</h3>
            <p>Our journal is based on the latest research in behavioral psychology. Each page is designed to reinforce positive habits through visual progress tracking and reflection.</p>
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" alt="Progress tracking charts" />
            <h3>Premium Features</h3>
            <p>Made with high-quality materials designed to last your entire habit journey.</p>
          `,
          vendor: 'Habit Nova',
          productType: 'Journals',
          tags: ['habit-tracking', 'productivity', 'journal'],
          images: [
            {
              src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
              alt: 'Habit Tracking Journal - Black',
              id: 'img-1',
            },
            {
              src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop',
              alt: 'Habit Tracking Journal - Blue',
              id: 'img-2',
            },
            {
              src: 'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=600&h=600&fit=crop',
              alt: 'Journal interior pages',
              id: 'img-3',
            },
          ],
          variants: [
            {
              id: 'variant-1',
              title: 'Standard Edition - Black',
              price: '24.99',
              compareAtPrice: '29.99',
              available: true,
              selectedOptions: [{ name: 'Color', value: 'Black' }],
            },
            {
              id: 'variant-2',
              title: 'Standard Edition - Blue',
              price: '24.99',
              compareAtPrice: '29.99',
              available: true,
              selectedOptions: [{ name: 'Color', value: 'Blue' }],
            },
          ],
        });
        setSelectedVariant({
          id: 'variant-1',
          title: 'Standard Edition - Black',
          price: '24.99',
          compareAtPrice: '29.99',
          available: true,
          selectedOptions: [{ name: 'Color', value: 'Black' }],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  // Handle variant selection
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setShowVariantDropdown(false);
  };

  // Handle image navigation
  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant || !selectedVariant.available) return;

    setAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, quantity);
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Scroll to reviews function
  const scrollToReviews = () => {
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to Top Button Component
  const ScrollToTopButton = () => (
    <AnimatePresence>
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-[88px] right-6 z-50 p-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 hover:scale-110 group"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <ChevronUp className="h-5 w-5 group-hover:translate-y-[-2px] transition-transform" />
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );

  // Sticky Cart Component
  const StickyCartSection = () => (
    <AnimatePresence>
      {showStickyCart && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg h-[88px]"
          style={{ backdropFilter: 'blur(10px)' }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 h-full">
            <div className="flex items-center justify-between gap-2 sm:gap-4 h-full">
              {/* Product Info */}
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={currentImages[0]?.src || '/placeholder-product.webp'}
                    alt={product?.title}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                    {product?.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
                    </span>
                    {isOnSale && (
                      <span className="hidden xs:inline text-xs sm:text-sm text-gray-500 line-through">
                        $
                        {parseFloat(
                          selectedVariant?.compareAtPrice || 0
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                {/* Quantity Selector - Only on larger screens */}
                <div className="hidden md:flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Mobile Quantity Selector - Compact */}
                <div className="flex md:hidden items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="px-2 py-1.5 font-medium text-sm min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant?.available || addingToCart || cartLoading
                  }
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    selectedVariant?.available
                      ? 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="whitespace-nowrap">
                    {addingToCart || cartLoading
                      ? 'Adding...'
                      : selectedVariant?.available
                      ? 'Add to Cart'
                      : 'Out of Stock'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Product Benefits Section (to fill white space after description)
  const ProductBenefitsSection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Why Choose This Product?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join thousands of satisfied customers who have transformed their daily
          routines with our evidence-based approach to habit formation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            icon: Zap,
            title: 'Quick Results',
            description:
              'See improvements in just 21 days with our scientifically-proven methods.',
            color: 'text-yellow-600',
          },
          {
            icon: Gift,
            title: 'Bonus Materials',
            description:
              'Includes exclusive templates, guides, and tracking tools worth $50.',
            color: 'text-green-600',
          },
          {
            icon: Clock,
            title: 'Lifetime Access',
            description:
              'Download once and use forever. No subscriptions or recurring fees.',
            color: 'text-blue-600',
          },
        ].map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 mx-auto mb-4 ${benefit.color} bg-gray-100 rounded-full flex items-center justify-center`}
            >
              <benefit.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {benefit.title}
            </h3>
            <p className="text-sm text-gray-600">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-900 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">
          Ready to Start Your Transformation?
        </h3>
        <p className="text-gray-300 mb-4">
          Join over 10,000+ people who have built lasting habits
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleAddToCart}
            disabled={
              !selectedVariant?.available || addingToCart || cartLoading
            }
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              selectedVariant?.available
                ? 'bg-white text-gray-900 hover:bg-gray-100 hover:scale-105'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            {addingToCart || cartLoading
              ? 'Adding to Cart...'
              : `Get Started - ${parseFloat(
                  selectedVariant?.price || 0
                ).toFixed(2)}`}
          </button>

          <button
            onClick={scrollToReviews}
            className="px-6 py-3 border border-gray-400 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Read Reviews
          </button>
        </div>

        {/* Trust Signals */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            <span>30-day guarantee</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-4 w-4" />
            <span>Free shipping</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span>
              {reviewsData?.averageRating?.toFixed(1) || '4.8'} rating
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Similar Products Section
  const SimilarProductsSection = () => {
    const [similarProducts, setSimilarProducts] = useState([]);

    useEffect(() => {
      const fetchSimilarProducts = async () => {
        try {
          if (!shopifyClient || !product) return;

          // Method 1: Fetch by same product type/category
          const allProducts = await shopifyClient.product.fetchAll();

          // Filter products by same category/type, exclude current product
          const similar = allProducts
            .filter(
              (p) =>
                p.id !== product.id && // Exclude current product
                (p.productType === product.productType || // Same product type
                  p.vendor === product.vendor || // Same vendor
                  p.tags?.some((tag) => product.tags?.includes(tag))) // Shared tags
            )
            .slice(0, 3) // Limit to 3 products
            .map((shopifyProduct) => {
              const variant = shopifyProduct.variants[0];
              const images = shopifyProduct.images || [];

              return {
                id: shopifyProduct.id,
                name: shopifyProduct.title,
                handle: shopifyProduct.handle,
                price:
                  typeof variant?.price === 'object'
                    ? variant.price.amount
                    : variant?.price || '0',
                originalPrice: variant?.compareAtPrice
                  ? typeof variant.compareAtPrice === 'object'
                    ? variant.compareAtPrice.amount
                    : variant.compareAtPrice
                  : null,
                image:
                  images[0]?.src ||
                  images[0]?.transformedSrc ||
                  '/placeholder-product.webp',
                rating: 4.5 + Math.random() * 0.5, // Random rating 4.5-5.0
                reviews: Math.floor(Math.random() * 200) + 50, // Random review count 50-250
              };
            });

          setSimilarProducts(similar);
        } catch (error) {
          console.error('Error fetching similar products:', error);
          // Fallback to mock data if API fails
          setMockSimilarProducts();
        }
      };

      const setMockSimilarProducts = () => {
        // Mock data for testing (only show if not the same as current product)
        const mockSimilarProducts = [
          {
            id: '1',
            name: 'Digital Detox Journal',
            handle: 'digital-detox-journal',
            price: '19.99',
            originalPrice: '24.99',
            image:
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
            rating: 4.6,
            reviews: 189,
          },
          {
            id: '2',
            name: 'Productivity Power Pack',
            handle: 'productivity-power-pack',
            price: '34.99',
            originalPrice: null,
            image:
              'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=300&fit=crop',
            rating: 4.9,
            reviews: 156,
          },
          {
            id: '3',
            name: 'Mindfulness Habit Kit',
            handle: 'mindfulness-habit-kit',
            price: '29.99',
            originalPrice: '39.99',
            image:
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=300&fit=crop',
            rating: 4.7,
            reviews: 203,
          },
        ];

        // Filter out current product and limit to 3
        const filtered = mockSimilarProducts
          .filter(
            (p) => p.name !== product?.title && p.handle !== product?.handle
          )
          .slice(0, 3);
        setSimilarProducts(filtered);
      };

      // Try to fetch real products first, fallback to mock
      if (shopifyClient && product) {
        fetchSimilarProducts();
      } else {
        setMockSimilarProducts();
      }
    }, [product]);

    if (similarProducts.length === 0) {
      return null; // Don't show section if no similar products
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            You Might Also Like
          </h2>
          <p className="text-gray-600">
            Customers who viewed this item also looked at these products
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarProducts.map((similarProduct, index) => (
            <motion.div
              key={similarProduct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-gray-200 group"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={similarProduct.image}
                  alt={similarProduct.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {similarProduct.originalPrice && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Sale
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {similarProduct.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(similarProduct.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-600">
                    ({similarProduct.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">
                      ${parseFloat(similarProduct.price).toFixed(2)}
                    </span>
                    {similarProduct.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${parseFloat(similarProduct.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/shop/products/${similarProduct.handle}`}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error && !product) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mt-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOnSale =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice) >
      parseFloat(selectedVariant.price);

  const hasMultipleVariants = product?.variants?.length > 1;

  return (
    <div className="pt-16 lg:pt-20">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gray-100 hover:bg-gray-200 transition-colors duration-200 py-6 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/shop"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 group cursor-zoom-in"
              onClick={() => setImageZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImages[selectedImage]?.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <Image
                    src={
                      currentImages[selectedImage]?.src ||
                      '/placeholder-product.webp'
                    }
                    alt={currentImages[selectedImage]?.alt || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Sale
                </div>
              )}

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 p-2 bg-white bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="h-4 w-4" />
              </div>

              {/* Navigation arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full shadow-md hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              {currentImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {currentImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImage
                          ? 'bg-white'
                          : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Thumbnail Images */}
            {currentImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {currentImages.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-gray-900'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Vendor */}
              <p className="text-sm text-gray-500 uppercase tracking-wide">
                {product.vendor}
              </p>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2">
                {reviewsData ? (
                  <>
                    <StarRating
                      rating={reviewsData.averageRating}
                      size="md"
                      showRating
                    />
                    <span className="text-sm text-gray-600">
                      ({reviewsData.totalReviews} reviews)
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      (Loading reviews...)
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
                </span>
                {isOnSale && (
                  <span className="text-xl text-gray-500 line-through">
                    $
                    {parseFloat(selectedVariant?.compareAtPrice || 0).toFixed(
                      2
                    )}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Variant Selection */}
            {hasMultipleVariants && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Select Variant:
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                    className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">
                        {selectedVariant?.title}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${parseFloat(selectedVariant?.price || 0).toFixed(2)}
                        {!selectedVariant?.available && (
                          <span className="text-red-500 ml-2">
                            Out of Stock
                          </span>
                        )}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transform transition-transform ${
                        showVariantDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showVariantDropdown && (
                    <div className="absolute top-full left-0 right-0 z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleVariantChange(variant)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            selectedVariant?.id === variant.id
                              ? 'bg-gray-50'
                              : ''
                          } ${
                            !variant.available
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          disabled={!variant.available}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-medium">{variant.title}</div>
                              <div className="text-sm text-gray-600">
                                ${parseFloat(variant.price).toFixed(2)}
                                {variant.compareAtPrice && (
                                  <span className="ml-2 line-through text-gray-400">
                                    $
                                    {parseFloat(variant.compareAtPrice).toFixed(
                                      2
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                            {!variant.available && (
                              <span className="text-sm text-red-500 font-medium">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Quantity & Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedVariant?.available || addingToCart || cartLoading
                  }
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-medium transition-colors ${
                    selectedVariant?.available
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {addingToCart || cartLoading
                    ? 'Adding...'
                    : selectedVariant?.available
                    ? 'Add to Cart'
                    : 'Out of Stock'}
                </button>

                {/* Wishlist Button */}
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>

                {/* Share Button */}
                <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="border-t pt-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="h-5 w-5" />
                <span>Secure payment processing</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="h-5 w-5" />
                <span>30-day return policy</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description', icon: FileText },
                {
                  id: 'reviews',
                  label: `Reviews ${
                    reviewsData ? `(${reviewsData.totalReviews})` : ''
                  }`,
                  icon: MessageCircle,
                },
                { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="py-8">
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {product.descriptionHtml ? (
                  <RichTextRenderer htmlContent={product.descriptionHtml} />
                ) : (
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                id="reviews-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                  </div>
                ) : reviewsData ? (
                  <>
                    {/* Reviews Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {reviewsData.averageRating.toFixed(1)}
                        </div>
                        <StarRating
                          rating={reviewsData.averageRating}
                          size="lg"
                        />
                        <p className="text-gray-600 mt-2">
                          Based on {reviewsData.totalReviews} reviews
                        </p>

                        {/* Import Disclaimer */}
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            Reviews may include summaries from external sources
                            for identical products
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4">
                          Rating Breakdown
                        </h3>
                        <RatingBreakdown
                          breakdown={reviewsData.ratingBreakdown}
                          totalReviews={reviewsData.totalReviews}
                        />
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-6">
                        Customer Reviews
                      </h3>

                      {reviewsData.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {reviewsData.reviews.slice(0, 10).map((review) => (
                            <ReviewItem key={review.id} review={review} />
                          ))}

                          {reviewsData.reviews.length > 10 && (
                            <div className="text-center pt-4">
                              <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                Load More Reviews
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">
                            No reviews yet. Be the first to review this product!
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Unable to load reviews at this time.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Shipping Information
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Free shipping on orders over $50</li>
                    <li>• Standard shipping: 5-7 business days</li>
                    <li>• Express shipping: 2-3 business days</li>
                    <li>• International shipping available</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Returns & Exchanges
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 30-day return policy</li>
                    <li>• Items must be in original condition</li>
                    <li>• Free return shipping for defective items</li>
                    <li>• Exchanges available for different sizes/colors</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Similar Products Section */}
        <SimilarProductsSection />
      </div>

      {/* Trust & Guarantee Section - Full Width Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full bg-gray-50 border-t border-gray-200 mt-16 py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Shop with Confidence
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Secure Shopping',
                description:
                  'Your payment information is protected with industry-standard encryption.',
              },
              {
                icon: RotateCcw,
                title: 'Easy Returns',
                description:
                  'Not satisfied? Return your purchase within 30 days for a full refund.',
              },
              {
                icon: Truck,
                title: 'Fast Delivery',
                description:
                  'Quick processing and reliable shipping to get your order to you fast.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 text-gray-700 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <RecommendedBlogPosts
        product={product}
        maxPosts={3}
        title="Learn More About Habit Building"
        subtitle="Discover evidence-based strategies to maximize your success"
      />

      {/* Sticky Cart Section */}
      <StickyCartSection />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {imageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setImageZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={
                  currentImages[selectedImage]?.src ||
                  '/placeholder-product.webp'
                }
                alt={currentImages[selectedImage]?.alt || product.title}
                width={800}
                height={800}
                className="object-contain max-w-full max-h-full"
              />

              {/* Close button */}
              <button
                onClick={() => setImageZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Navigation for zoomed view */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-20 rounded-full px-4 py-2">
                <span className="text-white text-sm">
                  {selectedImage + 1} / {currentImages.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductPageSkeleton() {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
            </div>

            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Tab skeleton */}
        <div className="mt-16">
          <div className="flex gap-8 border-b border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="mt-8 space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
