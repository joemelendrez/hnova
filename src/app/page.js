import Hero from '@/components/Hero'
import FeaturedArticles from '@/components/FeaturedArticles'
import Newsletter from '@/components/Newsletter'

export default function HomePage() {
  return (
    <div className="pt-8 lg:pt-20">
      <Hero />
      <FeaturedArticles />
      <Newsletter />
    </div>
  )
}