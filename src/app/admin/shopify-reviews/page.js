// src/app/admin/shopify-reviews/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  RefreshCw,
  Star,
  Eye,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Zap,
  Database,
  Globe,
  Search,
  Filter,
  Copy,
} from 'lucide-react';

export default function ShopifyReviewManager() {
  const [activeTab, setActiveTab] = useState('sync');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [reviewApp, setReviewApp] = useState('detect');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [syncResult, setSyncResult] = useState(null);
  const [shopifyProducts, setShopifyProducts] = useState([]);
  const [detectedApp, setDetectedApp] = useState(null);

  // Popular Shopify review apps
  const reviewApps = {
    detect: {
      name: 'Auto-Detect',
      description: 'Automatically detect which review app you\'re using',
      color: 'bg-blue-500',
      features: ['Smart Detection', 'Multi-App Support'],
    },
    judgeme: {
      name: 'Judge.me',
      description: 'Product Reviews for Shopify',
      color: 'bg-green-500',
      features: ['Product Reviews', 'Photo Reviews', 'Q&A'],
    },
    loox: {
      name: 'Loox',
      description: 'Photo Reviews for Shopify',
      color: 'bg-purple-500',
      features: ['Photo Reviews', 'Video Reviews', 'Instagram Integration'],
    },
    yotpo: {
      name: 'Yotpo',
      description: 'Reviews & Ratings',
      color: 'bg-orange-500',
      features: ['Reviews', 'Ratings', 'Q&A', 'Visual UGC'],
    },
    stamped: {
      name: 'Stamped.io',
      description: 'Product Reviews & Ratings',
      color: 'bg-red-500',
      features: ['Reviews', 'Photo Reviews', 'Video Reviews'],
    },
    rivyo: {
      name: 'Rivyo',
      description: 'Product Reviews App',
      color: 'bg-indigo-500',
      features: ['Product Reviews', 'Store Reviews', 'Q&A'],
    },
  };

  // Fetch reviews from Shopify
  const fetchShopifyReviews = async () => {
    if (!selectedProduct) {
      alert('Please select a product first');
      return;
    }

    setLoading(true);
    setSyncResult(null);

    try {
      const response = await fetch(
        `/api/shopify-reviews?product=${selectedProduct}&app=${reviewApp}`
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setReviews(result.reviews);
        setDetectedApp(result.reviewApp);
        setSyncResult({
          success: true,
          message: `Found ${result.reviews.length} reviews using ${reviewApps[result.reviewApp]?.name || result.reviewApp}`,
          data: result.summary,
        });
      } else {
        setSyncResult({
          success: false,
          message: result.error || 'Failed to fetch reviews',
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: 'Network error: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Sync reviews to your system
  const syncReviewsToSystem = async () => {
    if (!reviews.length) {
      alert('No reviews to sync. Fetch reviews first.');
      return;
    }

    setSyncing(true);

    try {
      const response = await fetch('/api/import-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productHandle: selectedProduct,
          source: `shopify-${detectedApp}`,
          sourceUrl: `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/products/${selectedProduct}`,
          reviews: reviews,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSyncResult({
          success: true,
          message: `Successfully synced ${result.imported} reviews to your system`,
          synced: true,
        });
      } else {
        setSyncResult({
          success: false,
          message: result.error || 'Sync failed',
        });
      }
    } catch (error) {
      setSyncResult({
        success: false,
        message: 'Sync error: ' + error.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  // Load sample products for demo
  const loadSampleProducts = () => {
    setShopifyProducts([
      { handle: 'habit-tracking-journal', title: 'Habit Tracking Journal' },
      { handle: 'mindfulness-planner', title: 'Daily Mindfulness Planner' },
      { handle: 'goal-setting-workbook', title: 'Goal Setting Workbook' },
      { handle: 'productivity-bundle', title: 'Productivity Bundle' },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            Shopify Review Manager
          </h1>
          <p className="text-gray-600">
            Sync reviews directly from your Shopify store review apps
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'sync', label: 'Sync Reviews', icon: RefreshCw },
              { id: 'apps', label: 'Review Apps', icon: Zap },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-[#1a1a1a] text-[#1a1a1a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Sync Reviews Tab */}
        {activeTab === 'sync' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Product Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Select Product
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Handle
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      placeholder="habit-tracking-journal"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                    />
                    <button
                      onClick={loadSampleProducts}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Load Sample
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review App
                  </label>
                  <select
                    value={reviewApp}
                    onChange={(e) => setReviewApp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  >
                    {Object.entries(reviewApps).map(([key, app]) => (
                      <option key={key} value={key}>
                        {app.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sample Products Dropdown */}
              {shopifyProducts.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or select from your products:
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  >
                    <option value="">Select a product...</option>
                    {shopifyProducts.map((product) => (
                      <option key={product.handle} value={product.handle}>
                        {product.title} ({product.handle})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Fetch & Sync Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Fetch Reviews from Shopify
              </h2>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600">
                    This will fetch reviews from your Shopify store using{' '}
                    <span className="font-medium">
                      {reviewApps[reviewApp].name}
                    </span>
                  </p>
                  {detectedApp && detectedApp !== reviewApp && (
                    <p className="text-sm text-blue-600 mt-1">
                      Detected app: {reviewApps[detectedApp]?.name || detectedApp}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={fetchShopifyReviews}
                    disabled={loading || !selectedProduct}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                      loading || !selectedProduct
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                    }`}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
                        Fetching...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 inline mr-2" />
                        Fetch Reviews
                      </>
                    )}
                  </button>

                  {reviews.length > 0 && (
                    <button
                      onClick={syncReviewsToSystem}
                      disabled={syncing}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        syncing
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {syncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 inline mr-2 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <Database className="h-4 w-4 inline mr-2" />
                          Sync to System
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Sync Result */}
              {syncResult && (
                <div
                  className={`p-4 rounded-lg ${
                    syncResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {syncResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-medium ${
                        syncResult.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {syncResult.message}
                    </span>
                  </div>

                  {syncResult.data && (
                    <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg text-green-700">
                          {syncResult.data.totalReviews}
                        </div>
                        <div className="text-gray-600">Total Reviews</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-green-700 flex items-center justify-center gap-1">
                          {syncResult.data.averageRating}
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                        <div className="text-gray-600">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg text-green-700">
                          {detectedApp ? reviewApps[detectedApp]?.name : 'Unknown'}
                        </div>
                        <div className="text-gray-600">Review App</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Reviews Preview */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#1a1a1a]">
                    Fetched Reviews ({reviews.length})
                  </h2>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4 inline mr-2" />
                      Filter
                    </button>
                    <button
                      onClick={() => {
                        const csv = convertReviewsToCSV(reviews);
                        downloadCSV(csv, `${selectedProduct}-reviews.csv`);
                      }}
                      className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4 inline mr-2" />
                      Export CSV
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.slice(0, 5).map((review, index) => (
                    <div
                      key={review.id || index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{review.author}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>

                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                review.source === 'judgeme'
                                  ? 'bg-green-100 text-green-800'
                                  : review.source === 'loox'
                                  ? 'bg-purple-100 text-purple-800'
                                  : review.source === 'yotpo'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {reviewApps[review.source]?.name || review.source}
                            </span>

                            {review.verified && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Verified
                              </span>
                            )}
                          </div>

                          {review.title && (
                            <h4 className="font-medium text-sm mb-1">
                              {review.title}
                            </h4>
                          )}

                          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                            {review.content}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(review.date).toLocaleDateString()}
                            </span>
                            {review.helpful > 0 && (
                              <span>{review.helpful} helpful</span>
                            )}
                            {review.images && review.images.length > 0 && (
                              <span>📷 {review.images.length} photos</span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {review.images && review.images.length > 0 && (
                        <div className="mt-3 flex gap-2">
                          {review.images.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={img.src}
                              alt={img.alt}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          ))}
                          {review.images.length > 3 && (
                            <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                              +{review.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {reviews.length > 5 && (
                    <div className="text-center text-sm text-gray-500">
                      ... and {reviews.length - 5} more reviews
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Review Apps Tab */}
        {activeTab === 'apps' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Supported Review Apps
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(reviewApps)
                  .filter(([key]) => key !== 'detect')
                  .map(([key, app]) => (
                    <div
                      key={key}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 rounded ${app.color}`}></div>
                        <div>
                          <h3 className="font-semibold text-[#1a1a1a]">
                            {app.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {app.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {app.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-gray-600"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            Integration Status
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Supported
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Integration Instructions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                How It Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Search className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    1. Auto-Detect
                  </h3>
                  <p className="text-sm text-gray-600">
                    We automatically detect which review app you're using by
                    analyzing your Shopify store's metafields and widgets.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    2. Fetch Reviews
                  </h3>
                  <p className="text-sm text-gray-600">
                    We connect to your review app's API or extract data from
                    your Shopify metafields to get all your product reviews.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    3. Sync Data
                  </h3>
                  <p className="text-sm text-gray-600">
                    Reviews are formatted and synced to your system, ready to
                    display on your product pages with all metadata intact.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Shopify Configuration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Shopify Configuration
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shopify Store Domain
                    </label>
                    <input
                      type="text"
                      placeholder="your-store.myshopify.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Access Token
                    </label>
                    <input
                      type="password"
                      placeholder="shpat_..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">
                        How to get your Admin Access Token
                      </h4>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. Go to your Shopify Admin → Apps → Develop apps</li>
                        <li>2. Create a private app with Admin API access</li>
                        <li>3. Enable "Products" and "Metafields" permissions</li>
                        <li>4. Copy the Admin API access token</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review App API Keys */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Review App API Keys (Optional)
              </h2>

              <p className="text-gray-600 mb-6">
                Provide API keys for better integration with your review apps.
                Without these, we'll try to extract data from metafields.
              </p>

              <div className="space-y-6">
                {/* Judge.me */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-green-500"></div>
                    <h3 className="font-semibold text-[#1a1a1a]">Judge.me</h3>
                  </div>
                  <input
                    type="password"
                    placeholder="Judge.me API Token"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  />
                </div>

                {/* Yotpo */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-orange-500"></div>
                    <h3 className="font-semibold text-[#1a1a1a]">Yotpo</h3>
                  </div>
                  <input
                    type="password"
                    placeholder="Yotpo App Key"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  />
                </div>

                {/* Stamped.io */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-6 h-6 rounded bg-red-500"></div>
                    <h3 className="font-semibold text-[#1a1a1a]">Stamped.io</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="password"
                      placeholder="API Key"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                    />
                    <input
                      type="password"
                      placeholder="Store Hash"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition-colors">
                  Save Configuration
                </button>
              </div>
            </div>

            {/* Environment Variables Helper */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Environment Variables
              </h2>

              <p className="text-gray-600 mb-4">
                Add these to your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file:
              </p>

              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div className="space-y-1">
                  <div># Shopify Configuration</div>
                  <div>SHOPIFY_STORE_DOMAIN=your-store.myshopify.com</div>
                  <div>SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...</div>
                  <div></div>
                  <div># Review App API Keys (Optional)</div>
                  <div>JUDGEME_API_TOKEN=your_judgeme_token</div>
                  <div>YOTPO_APP_KEY=your_yotpo_app_key</div>
                  <div>STAMPED_API_KEY=your_stamped_api_key</div>
                  <div>STAMPED_STORE_HASH=your_stamped_store_hash</div>
                </div>
              </div>

              <button
                onClick={() => {
                  const envText = `# Shopify Configuration
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...

# Review App API Keys (Optional)
JUDGEME_API_TOKEN=your_judgeme_token
YOTPO_APP_KEY=your_yotpo_app_key
STAMPED_API_KEY=your_stamped_api_key
STAMPED_STORE_HASH=your_stamped_store_hash`;
                  navigator.clipboard.writeText(envText);
                  alert('Environment variables copied to clipboard!');
                }}
                className="mt-4 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Copy className="h-4 w-4 inline mr-2" />
                Copy Environment Variables
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Helper function to convert reviews to CSV
function convertReviewsToCSV(reviews) {
  const headers = [
    'author',
    'rating',
    'title',
    'content',
    'date',
    'verified',
    'helpful',
    'source',
    'images_count'
  ];

  const csvRows = [
    headers.join(','),
    ...reviews.map(review => [
      `"${review.author.replace(/"/g, '""')}"`,
      review.rating,
      `"${(review.title || '').replace(/"/g, '""')}"`,
      `"${review.content.replace(/"/g, '""')}"`,
      review.date,
      review.verified,
      review.helpful,
      review.source,
      review.images?.length || 0
    ].join(','))
  ];

  return csvRows.join('\n');
}

// Helper function to download CSV
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}