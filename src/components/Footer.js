import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Youtube, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    explore: [
      { name: 'Blog', href: '/blog' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Newsletter', href: '/newsletter' }
    ],
    resources: [
      { name: 'Habit Tracker', href: '/habit-tracker' },
      { name: 'Start Here', href: '/start-here' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Write for Us', href: '/write-for-us' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' }
    ]
  }
  
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          
          {/* Brand & Newsletter */}
          <div>
            <div className="mb-6">
              <h2 className="font-anton text-3xl text-[#DBDBDB] mb-4 uppercase">
                Habit Nova
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                Evidence-based strategies to break bad habits and build life-changing routines. 
                Join 50,000+ readers transforming their lives.
              </p>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Weekly Habit Insights
              </h3>
              <form className="flex gap-3 max-w-sm">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-white border border-gray-700 rounded-lg text-[#1a1a1a] placeholder-gray-400 focus:ring-2 focus:ring-[#DBDBDB] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#DBDBDB] text-[#1a1a1a] px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-sm text-gray-400 mt-2">
                Free • No spam • Unsubscribe anytime
              </p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Explore */}
            <div>
              <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4">
                Explore
              </h3>
              <ul className="space-y-2">
                {footerLinks.explore.map((item) => (
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

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {footerLinks.resources.map((item) => (
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

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-[#DBDBDB] mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((item) => (
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
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-gray-400">
              © {currentYear} Habit Nova. All rights reserved.
            </div>
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Follow us</span>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/habitnova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#DBDBDB] transition-colors duration-200"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="https://linkedin.com/company/habitnova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#DBDBDB] transition-colors duration-200"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="https://instagram.com/habitnova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#DBDBDB] transition-colors duration-200"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://youtube.com/habitnova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#DBDBDB] transition-colors duration-200"
                  aria-label="Subscribe to our YouTube channel"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer