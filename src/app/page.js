// src/app/page.js - Updated Homepage with Product Featured Section
import Hero from '@/components/Hero';
import FeaturedArticles from '@/components/FeaturedArticles';
import ProductFeatured from '@/components/ProductFeatured';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-[#1a1a1a] text-white">
      <Hero />
      <FeaturedArticles />
      <ProductFeatured />
      <Newsletter />
    </div>
  );
}
