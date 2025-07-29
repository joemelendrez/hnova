import Link from 'next/link'
import { Twitter, Linkedin, Instagram, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const mainLinks = [
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Free Tracker', href: '/habit-tracker' },
  ]

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Brand & Description */}
          <div>
            <div className="font-anton text-3xl text-[#DBDBDB] mb-4 uppercase">
              Habit Nova
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
              Evidence-based strategies to break bad habits and build life-changing routines. 
              Join 50,000+ readers transforming their lives.
            </p>
            
            {/* Quick Links */}
            <div className="flex flex-wrap gap-6">
              {mainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-300 hover:text-[#DBDBDB] font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Newsletter */}
          <div className="bg-[#DBDBDB] rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-[#1a1a1a] mr-3" />
              <h3 className="text-xl font-bold text-[#1a1a1a]">
                Weekly Habit Insights
              </h3>
            </div>
            
            <p className="text-[#1a1a1a] mb-6">
              Get practical tips delivered every Tuesday. No spam, just actionable advice.
            </p>
            
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 bg-white text-[#1a1a1a] rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#1a1a1a] text-[#DBDBDB] px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Habit Nova. Made with ❤️ for habit builders worldwide.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
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
                href="mailto:contact@habitnova.com"
                className="text-gray-400 hover:text-[#DBDBDB] transition-colors duration-200"
                aria-label="Email us"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer