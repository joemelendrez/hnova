// app/admin/import-reviews/page.js
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Download,
  FileText,
  Star,
  Check,
  X,
  AlertTriangle,
  ExternalLink,
  Copy,
  Trash2,
  Eye,
  Filter,
} from 'lucide-react';

export default function ReviewImportAdmin() {
  const [activeTab, setActiveTab] = useState('import');
  const [importData, setImportData] = useState({
    productHandle: '',
    source: 'amazon',
    sourceUrl: '',
    reviews: [],
  });
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [existingReviews, setExistingReviews] = useState([]);

  // Import methods for different sources
  const importMethods = {
    amazon: {
      name: 'Amazon',
      description: 'Import reviews from Amazon product pages',
      fields: ['ASIN', 'Product URL'],
      color: 'bg-orange-500',
    },
    aliexpress: {
      name: 'AliExpress',
      description: 'Import reviews from AliExpress listings',
      fields: ['Product ID', 'Store URL'],
      color: 'bg-red-500',
    },
    ebay: {
      name: 'eBay',
      description: 'Import feedback from eBay listings',
      fields: ['Item ID', 'Seller ID'],
      color: 'bg-blue-500',
    },
    walmart: {
      name: 'Walmart',
      description: 'Import reviews from Walmart.com',
      fields: ['Product ID', 'WMT URL'],
      color: 'bg-blue-600',
    },
    manual: {
      name: 'Manual Entry',
      description: 'Manually enter reviews',
      fields: ['Review Data'],
      color: 'bg-gray-600',
    },
  };

  // Sample review templates for different sources
  const sampleData = {
    amazon: [
      {
        author: 'John D.',
        rating: 5,
        title: 'Excellent product!',
        content:
          'This product exceeded my expectations. Great quality and fast shipping. Highly recommend!',
        date: '2024-01-15',
        verified: true,
        helpful: 12,
        images: [],
      },
      {
        author: 'Sarah M.',
        rating: 4,
        title: 'Good value for money',
        content:
          'Product works as described. Only minor issue was packaging could be better.',
        date: '2024-01-10',
        verified: true,
        helpful: 8,
        images: [],
      },
    ],
    aliexpress: [
      {
        author: 'Mike R.',
        rating: 5,
        title: 'Fast delivery, great product',
        content:
          'Arrived quickly, exactly as described. Seller communication was excellent.',
        date: '2024-01-12',
        verified: true,
        helpful: 15,
        country: 'US',
        color: 'Black',
        size: 'Large',
      },
    ],
  };

  // Handle file upload for bulk import
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data;
        if (file.name.endsWith('.json')) {
          data = JSON.parse(e.target.result);
        } else if (file.name.endsWith('.csv')) {
          data = parseCSV(e.target.result);
        } else {
          alert('Please upload a JSON or CSV file');
          return;
        }

        setImportData((prev) => ({
          ...prev,
          reviews: Array.isArray(data) ? data : data.reviews || [],
        }));
      } catch (error) {
        alert('Error parsing file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  // Parse CSV data
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim());
    const reviews = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= headers.length) {
        const review = {};
        headers.forEach((header, index) => {
          review[header.toLowerCase()] = values[index]?.trim();
        });

        // Convert rating to number
        if (review.rating) {
          review.rating = parseFloat(review.rating);
        }

        reviews.push(review);
      }
    }

    return reviews;
  };

  // Load sample data
  const loadSampleData = () => {
    const sample = sampleData[importData.source] || sampleData.amazon;
    setImportData((prev) => ({
      ...prev,
      reviews: sample,
    }));
  };

  // Import reviews
  const handleImport = async () => {
    if (!importData.productHandle || !importData.reviews.length) {
      alert('Please provide product handle and reviews data');
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/api/import-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData),
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult({
          success: true,
          message: `Successfully imported ${result.imported} reviews`,
          data: result,
        });

        // Clear form
        setImportData((prev) => ({
          ...prev,
          reviews: [],
        }));

        // Refresh existing reviews
        fetchExistingReviews();
      } else {
        setImportResult({
          success: false,
          message: result.error || 'Import failed',
        });
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Network error: ' + error.message,
      });
    } finally {
      setImporting(false);
    }
  };

  // Fetch existing reviews
  const fetchExistingReviews = async () => {
    if (!importData.productHandle) return;

    try {
      const response = await fetch(
        `/api/import-reviews?product=${importData.productHandle}`
      );
      const data = await response.json();

      if (response.ok) {
        setExistingReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Generate sample CSV template
  const generateCSVTemplate = () => {
    const headers = [
      'author',
      'rating',
      'title',
      'content',
      'date',
      'verified',
      'helpful',
    ];
    const sampleRow = [
      'John Doe',
      '5',
      'Great product!',
      'This product is amazing...',
      '2024-01-15',
      'true',
      '10',
    ];

    const csv = [headers.join(','), sampleRow.join(',')].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'review-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">
            Review Import Manager
          </h1>
          <p className="text-gray-600">
            Import customer reviews from external sources (Amazon, AliExpress,
            etc.)
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'import', label: 'Import Reviews', icon: Upload },
              { id: 'manage', label: 'Manage Reviews', icon: FileText },
              { id: 'tools', label: 'Import Tools', icon: Download },
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

        {/* Import Tab */}
        {activeTab === 'import' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Import Source Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Select Import Source
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(importMethods).map(([key, method]) => (
                  <button
                    key={key}
                    onClick={() =>
                      setImportData((prev) => ({ ...prev, source: key }))
                    }
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      importData.source === key
                        ? 'border-[#1a1a1a] bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded ${method.color} mb-3`}
                    ></div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {method.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Configuration */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Product Configuration
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Handle (Shopify)
                  </label>
                  <input
                    type="text"
                    value={importData.productHandle}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        productHandle: e.target.value,
                      }))
                    }
                    placeholder="habit-tracking-journal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={importData.sourceUrl}
                    onChange={(e) =>
                      setImportData((prev) => ({
                        ...prev,
                        sourceUrl: e.target.value,
                      }))
                    }
                    placeholder="https://amazon.com/dp/ASIN123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Review Data Input */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#1a1a1a]">
                  Review Data
                </h2>

                <div className="flex gap-2">
                  <button
                    onClick={loadSampleData}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Load Sample Data
                  </button>

                  <label className="px-4 py-2 text-sm bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    <Upload className="h-4 w-4 inline mr-2" />
                    Upload File
                    <input
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Review Count */}
              <div className="mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Reviews loaded: {importData.reviews.length}</span>
                  {importData.reviews.length > 0 && (
                    <span>
                      Average rating:{' '}
                      {(
                        importData.reviews.reduce(
                          (sum, r) => sum + (r.rating || 0),
                          0
                        ) / importData.reviews.length
                      ).toFixed(1)}{' '}
                      ⭐
                    </span>
                  )}
                </div>
              </div>

              {/* Review Preview */}
              {importData.reviews.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-medium text-[#1a1a1a] mb-3">
                    Review Preview
                  </h3>

                  <div className="space-y-4">
                    {importData.reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-gray-200 pl-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {review.author || 'Anonymous'}
                          </span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < (review.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          {review.verified && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Verified
                            </span>
                          )}
                        </div>

                        {review.title && (
                          <h4 className="font-medium text-sm mb-1">
                            {review.title}
                          </h4>
                        )}

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {review.content || review.text || 'No content'}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {new Date(
                              review.date || Date.now()
                            ).toLocaleDateString()}
                          </span>
                          {review.helpful && (
                            <span>{review.helpful} helpful votes</span>
                          )}
                          {review.country && <span>📍 {review.country}</span>}
                        </div>
                      </div>
                    ))}

                    {importData.reviews.length > 3 && (
                      <div className="text-center text-sm text-gray-500">
                        ... and {importData.reviews.length - 3} more reviews
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Manual Entry Form */}
              {importData.source === 'manual' && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-[#1a1a1a] mb-3">
                    Add Review Manually
                  </h3>
                  <ManualReviewForm
                    onAdd={(review) => {
                      setImportData((prev) => ({
                        ...prev,
                        reviews: [...prev.reviews, review],
                      }));
                    }}
                  />
                </div>
              )}
            </div>

            {/* Import Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-2">
                    Import Reviews
                  </h2>
                  <p className="text-gray-600">
                    This will import {importData.reviews.length} reviews for
                    product "{importData.productHandle}"
                  </p>
                </div>

                <button
                  onClick={handleImport}
                  disabled={
                    importing ||
                    !importData.productHandle ||
                    !importData.reviews.length
                  }
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    importing ||
                    !importData.productHandle ||
                    !importData.reviews.length
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                  }`}
                >
                  {importing ? 'Importing...' : 'Import Reviews'}
                </button>
              </div>

              {/* Import Result */}
              {importResult && (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    importResult.success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {importResult.success ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`font-medium ${
                        importResult.success ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {importResult.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Product Search */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Manage Imported Reviews
              </h2>

              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter product handle to view reviews"
                  value={importData.productHandle}
                  onChange={(e) =>
                    setImportData((prev) => ({
                      ...prev,
                      productHandle: e.target.value,
                    }))
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
                />
                <button
                  onClick={fetchExistingReviews}
                  className="px-6 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Load Reviews
                </button>
              </div>
            </div>

            {/* Existing Reviews List */}
            {existingReviews.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">
                    Imported Reviews ({existingReviews.length})
                  </h3>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="h-4 w-4 inline mr-2" />
                      Filter
                    </button>
                    <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="h-4 w-4 inline mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {existingReviews.map((review, index) => (
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
                                review.source === 'amazon'
                                  ? 'bg-orange-100 text-orange-800'
                                  : review.source === 'aliexpress'
                                  ? 'bg-red-100 text-red-800'
                                  : review.source === 'ebay'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {review.source}
                            </span>

                            {review.verified && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
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
                            {review.variant && <span>{review.variant}</span>}
                            {review.country && <span>📍 {review.country}</span>}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
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
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Import Tools */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Import Tools & Templates
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CSV Template */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        CSV Template
                      </h3>
                      <p className="text-sm text-gray-600">
                        Download CSV template for bulk import
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={generateCSVTemplate}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Download CSV Template
                  </button>
                </div>

                {/* JSON Template */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        JSON Template
                      </h3>
                      <p className="text-sm text-gray-600">
                        Download JSON template for API import
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const template = {
                        productHandle: 'your-product-handle',
                        source: 'amazon',
                        sourceUrl: 'https://amazon.com/dp/ASIN123',
                        reviews: [
                          {
                            author: 'John Doe',
                            rating: 5,
                            title: 'Great product!',
                            content: 'This product is amazing...',
                            date: '2024-01-15',
                            verified: true,
                            helpful: 10,
                            images: [],
                          },
                        ],
                      };

                      const blob = new Blob(
                        [JSON.stringify(template, null, 2)],
                        { type: 'application/json' }
                      );
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'review-template.json';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="h-4 w-4 inline mr-2" />
                    Download JSON Template
                  </button>
                </div>
              </div>
            </div>

            {/* Browser Extensions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                Browser Extensions & Scrapers
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Amazon Review Scraper',
                    description: 'Extract reviews from Amazon product pages',
                    status: 'Available',
                    color: 'bg-orange-500',
                  },
                  {
                    name: 'AliExpress Extractor',
                    description: 'Get reviews from AliExpress listings',
                    status: 'Available',
                    color: 'bg-red-500',
                  },
                  {
                    name: 'Multi-Platform Tool',
                    description: 'Universal review extractor',
                    status: 'Coming Soon',
                    color: 'bg-gray-500',
                  },
                ].map((tool, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className={`w-8 h-8 rounded ${tool.color} mb-3`}></div>
                    <h3 className="font-semibold text-[#1a1a1a] mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {tool.description}
                    </p>

                    <button
                      disabled={tool.status === 'Coming Soon'}
                      className={`w-full px-4 py-2 rounded-lg text-sm transition-colors ${
                        tool.status === 'Available'
                          ? 'bg-[#1a1a1a] text-white hover:bg-gray-800'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {tool.status === 'Available'
                        ? 'Install Extension'
                        : 'Coming Soon'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* API Documentation */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
                API Documentation
              </h2>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    Import Reviews Endpoint
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-mono">
                        POST
                      </span>
                      <span className="font-mono">/api/import-reviews</span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText('/api/import-reviews')
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {`{
  "productHandle": "habit-tracking-journal",
  "source": "amazon",
  "sourceUrl": "https://amazon.com/dp/ASIN123",
  "reviews": [
    {
      "author": "John Doe",
      "rating": 5,
      "title": "Great product!",
      "content": "Amazing quality...",
      "date": "2024-01-15",
      "verified": true,
      "helpful": 10
    }
  ]
}`}
                    </pre>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">
                    Get Reviews Endpoint
                  </h3>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                        GET
                      </span>
                      <span className="font-mono">
                        /api/import-reviews?product=HANDLE
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(
                            '/api/import-reviews?product=HANDLE'
                          )
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Manual Review Form Component
function ManualReviewForm({ onAdd }) {
  const [review, setReview] = useState({
    author: '',
    rating: 5,
    title: '',
    content: '',
    verified: false,
    helpful: 0,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (review.author && review.content) {
      onAdd({
        ...review,
        date: new Date().toISOString(),
        id: Date.now().toString(),
      });

      // Reset form
      setReview({
        author: '',
        rating: 5,
        title: '',
        content: '',
        verified: false,
        helpful: 0,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author Name
          </label>
          <input
            type="text"
            value={review.author}
            onChange={(e) =>
              setReview((prev) => ({ ...prev, author: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating
          </label>
          <select
            value={review.rating}
            onChange={(e) =>
              setReview((prev) => ({
                ...prev,
                rating: parseInt(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
          >
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Title (Optional)
        </label>
        <input
          type="text"
          value={review.title}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, title: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Review Content
        </label>
        <textarea
          value={review.content}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, content: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent"
          required
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={review.verified}
            onChange={(e) =>
              setReview((prev) => ({ ...prev, verified: e.target.checked }))
            }
            className="rounded border-gray-300 text-[#1a1a1a] focus:ring-[#1a1a1a]"
          />
          <span className="text-sm text-gray-700">Verified Purchase</span>
        </label>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">Helpful votes:</label>
          <input
            type="number"
            value={review.helpful}
            onChange={(e) =>
              setReview((prev) => ({
                ...prev,
                helpful: parseInt(e.target.value) || 0,
              }))
            }
            min="0"
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        Add Review
      </button>
    </form>
  );
}
