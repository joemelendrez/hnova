// app/shop/page.js
'use client';

import { useState, useEffect } from 'react';
import { getProducts, getProductCategories } from '../../lib/woocommerce-api';
import ProductCard from '../../components/ProductCard';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts({ category: selectedCategory }),
          getProductCategories()
        ]);
        
        setProducts(productsData.products);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedCategory]);

  if (loading) {
    return <ShopPageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">
          HABIT FORMATION TOOLS
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover scientifically-backed tools and products to help you build better habits 
          and transform your daily routine.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-full transition-colors ${
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
            className={`px-4 py-2 rounded-full transition-colors ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}

function ShopPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="h-10 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-[500px] mx-auto animate-pulse"></div>
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
  );
}