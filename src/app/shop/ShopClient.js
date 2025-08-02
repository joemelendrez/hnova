// app/shop/ShopClient.js
'use client';

import { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';

export default function ShopClient() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we have the required environment variables
        if (!process.env.NEXT_PUBLIC_WORDPRESS_URL) {
          throw new Error('WordPress URL not configured');
        }

        // For now, let's use fallback data since WooCommerce isn't set up yet
        const fallbackProducts = [
          {
            id: 1,
            name: "Habit Tracking Journal",
            slug: "habit-tracking-journal",
            price: "24.99",
            regular_price: "29.99",
            sale_price: "24.99",
            on_sale: true,
            stock_status: "instock",
            images: [{
              src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop",
              alt: "Habit Tracking Journal"
            }],
            categories: [{ id: 1, name: "Journals" }]
          },
          {
            id: 2,
            name: "Productivity Planner",
            slug: "productivity-planner",
            price: "19.99",
            regular_price: "19.99",
            on_sale: false,
            stock_status: "instock",
            images: [{
              src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
              alt: "Productivity Planner"
            }],
            categories: [{ id: 2, name: "Planners" }]
          },
          {
            id: 3,
            name: "Meditation Timer",
            slug: "meditation-timer",
            price: "34.99",
            regular_price: "34.99",
            on_sale: false,
            stock_status: "instock",
            images: [{
              src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
              alt: "Meditation Timer"
            }],
            categories: [{ id: 3, name: "Wellness" }]
          },
          {
            id: 4,
            name: "Focus Blocks Set",
            slug: "focus-blocks-set",
            price: "15.99",
            regular_price: "15.99",
            on_sale: false,
            stock_status: "instock",
            images: [{
              src: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?w=400&h=400&fit=crop",
              alt: "Focus Blocks Set"
            }],
            categories: [{ id: 2, name: "Planners" }]
          }
        ];

        const fallbackCategories = [
          { id: 1, name: "Journals" },
          { id: 2, name: "Planners" },
          { id: 3, name: "Wellness" }
        ];

        // Filter products if category is selected
        const filteredProducts = selectedCategory 
          ? fallbackProducts.filter(product => 
              product.categories.some(cat => cat.id === selectedCategory)
            )
          : fallbackProducts;

        setProducts(filteredProducts);
        setCategories(fallbackCategories);
        
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setError(error.message);
        
        // Even on error, show some products
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return <ShopPageSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-16 lg:pt-20">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4">
            Shop Temporarily Unavailable
          </h2>
          <p className="text-gray-600 mb-6">
            We're setting up our product catalog. Please check back soon!
          </p>
          <p className="text-sm text-gray-500">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4 font-anton uppercase">
            HABIT FORMATION TOOLS
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-roboto">
            Discover scientifically-backed tools and products to help you build better habits 
            and transform your daily routine.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full transition-colors font-roboto ${
              !selectedCategory 
                ? 'bg-[#1a1a1a] text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors font-roboto ${
                selectedCategory === category.id
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-roboto">
              {selectedCategory ? 'No products found in this category.' : 'No products available.'}
            </p>
          </div>
        )}

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center bg-[#DBDBDB] bg-opacity-20 rounded-xl p-8">
          <h3 className="text-xl font-bold text-[#1a1a1a] mb-2 font-anton uppercase">
            More Products Coming Soon
          </h3>
          <p className="text-gray-600 font-roboto">
            We're carefully curating the best habit formation tools and will be adding more products regularly.
          </p>
        </div>
      </div>
    </div>
  );
}

function ShopPageSkeleton() {
  return (
    <div className="pt-16 lg:pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-[500px] mx-auto animate-pulse"></div>
        </div>
        
        <div className="flex gap-4 mb-8 justify-center">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}