import Hero from '@/components/Hero'
import FeaturedArticles from '@/components/FeaturedArticles'
import Newsletter from '@/components/Newsletter'

export default function HomePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-[#1a1a1a] text-white">
      <Hero />
      <FeaturedArticles />
      <Newsletter />
    </div>
  )
}