import Link from 'next/link'
import {
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Target,
  TrendingUp,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerSections = {
    explore: [
      { name: 'Latest Articles', href: '/blog' },
      { name: 'Popular Posts', href: '/blog?filter=popular' },
      { name: 'Free Habit Tracker', href: '/habit-tracker' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Start Here', href: '/start-here' }
    ],
    topics: [
      { name: 'Breaking Bad Habits', href: '/blog?category=breaking-habits' },
      { name: 'Building Good Habits', href: '/blog?category=habit-formation' },
      { name: 'Digital Wellness', href: '/blog?category=digital-wellness' },
      { name: 'Productivity Tips', href: '/blog?category=productivity' },
      { name: 'Habit Psychology', href: '/blog?category=psychology' }
    ],
    tools: [
      { name: '21-Day Challenge', href: '/challenges/21-day' },
      { name: 'Habit Tracker App', href: '/habit-tracker' },
      { name: 'Morning Routine Guide', href: '/guides/morning-routine' },
      { name: 'Evening Routine Guide', href: '/guides/evening-routine' },
      { name: 'Habit Journal Template', href: '/templates/habit-journal' }
    ],
    company: [
      { name: 'About HabitNova', href: '/about' },
      { name: 'Our Mission', href: '/about#mission' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Write for Us', href: '/write-for-us' },
      { name: 'Newsletter Archive', href: '/newsletter' }
    ]
  }
  
  const quickStats = [
    { icon: <BookOpen className="h-5 w-5" />, label: '200+ Articles', value: 'Published' },
    { icon: <Target className="h-5 w-5" />, label: '50K+ Readers', value: 'Monthly' },
    { icon: <TrendingUp className="h-5 w-5" />, label: '95% Success', value: 'Rate' }
  ]
  
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section - Brand & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="text-3xl font-bold text-[#DBDBDB] mr-3">
                HabitNova
              </div>
              <div className="bg-[#DBDBDB] bg-opacity-20 px-3 py-1 rounded-full">
                <span className="text-[#DBDBDB] text-sm font-medium">Blog</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Discover the science behind habits. Learn evidence-based strategies 
              to break bad patterns and build life-changing routines.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-[#DBDBDB] mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-sm font-semibold text-white">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-[#DBDBDB] mr-3 flex-shrink-0" />
                <span className="text-gray-300">hello@habitnova.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-[#DBDBDB] mr-3 flex-shrink-0" />
                <span className="text-gray-300">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-2">
            <div className="bg-[#DBDBDB] rounded-2xl p-8 h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Join 50,000+ Habit Builders
              </h3>
              <p className="text-gray-300 mb-6 text-lg">
                Get weekly insights, practical tips, and the latest research delivered to your inbox. 
                No spam, just actionable habit-building content.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-white text-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#DBDBDB] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#DBDBDB] text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe Free
                </button>
              </form>
              
              <p className="text-sm text-gray-400 mt-3">
                ✓ Free forever  ✓ Unsubscribe anytime  ✓ No spam, ever
              </p>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Explore
            </h3>
            <ul className="space-y-3">
              {footerSections.explore.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Topics */}
          <div>
            <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Popular Topics
            </h3>
            <ul className="space-y-3">
              {footerSections.topics.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Tools */}
          <div>
            <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Free Tools
            </h3>
            <ul className="space-y-3">
              {footerSections.tools.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerSections.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-[#DBDBDB] transition-colors duration-200 text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright & Legal */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <div>
                © {currentYear} HabitNova. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-[#DBDBDB] transition-colors">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-[#DBDBDB] transition-colors">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/cookies" className="hover:text-[#DBDBDB] transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 mr-2">Follow us:</span>
              <a
                href="https://twitter.com/habitnova"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg text-gray-300 hover:text-[#DBDBDB] hover:bg-gray-700 transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com/company/habitnova"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg text-gray-300 hover:text-[#DBDBDB] hover:bg-gray-700 transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/habitnova"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg text-gray-300 hover:text-[#DBDBDB] hover:bg-gray-700 transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/habitnova"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg text-gray-300 hover:text-[#DBDBDB] hover:bg-gray-700 transition-colors duration-200"
                aria-label="Subscribe to our YouTube channel"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer