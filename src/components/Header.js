'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import Button from './Button'
import MobileMenu from './MobileMenu'
import AnimatedLogo from './AnimatedLogo'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  
  // Navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  
  // Handle scroll effect and header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Set scrolled state for background color
      setScrolled(currentScrollY > 50)
      
      // Header visibility logic
      if (currentScrollY < 10) {
        // Always show header at top of page
        setHeaderVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setHeaderVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setHeaderVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Handle mobile menu scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      
      // Prevent scrolling on body
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.classList.add('menu-open')
      
      // Clean up function
      return () => {
        // Restore scrolling
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.classList.remove('menu-open')
        
        // Restore scroll position
        window.scrollTo(0, scrollY)
      }
    }
  }, [mobileMenuOpen])

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [mobileMenuOpen])

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen) {
        // Check if click is outside the menu area
        const menuPanel = document.querySelector('[data-mobile-menu]')
        const animatedLogo = document.querySelector('[data-animated-logo]')
        
        if (menuPanel && !menuPanel.contains(e.target) && 
            animatedLogo && !animatedLogo.contains(e.target)) {
          setMobileMenuOpen(false)
        }
      }
    }

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('touchstart', handleClickOutside)
      }
    }
  }, [mobileMenuOpen])
  
  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }
  
  return (
    <>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        />
      )}

      {/* Animated Logo for Mobile - Positioned outside header */}
      <motion.div
        className="fixed z-50 lg:hidden"
        style={{
          top: '20px',
          right: '16px',
        }}
        animate={{
          y: headerVisible ? 0 : -100, // Follow header visibility
          x: mobileMenuOpen ? -340 : 0, // Slide left when menu opens
        }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        data-animated-logo // Add data attribute for click detection
      >
        <AnimatedLogo
          isMenuOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </motion.div>

      <header
        className={`fixed left-0 right-0 top-0 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'bg-white shadow-sm backdrop-blur-sm'
            : 'bg-white'
        } ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
          mobileMenuOpen ? 'z-10' : 'z-40'
        }`}
      >
        {/* Blur overlay when menu is open */}
        {mobileMenuOpen && (
          <div className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-sm" />
        )}

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between lg:h-24">
            
            {/* Logo - Desktop always, Mobile when menu closed */}
            <div className="flex-shrink-0">
              <Link
                href="/"
                className={`group flex items-center ${
                  mobileMenuOpen ? 'hidden lg:flex' : 'flex'
                }`}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/logos/Habitlogo.svg"
                    alt="HabitNova Logo"
                    width={50}
                    height={50}
                    className="h-12 w-12 mr-3 transition-all duration-200 group-hover:opacity-80"
                    priority
                  />
                </motion.div>
                <span className="font-anton text-2xl text-[#1a1a1a] hover:text-gray-700 transition-colors duration-200 uppercase">
                  Habit Nova
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8">
              {navigation.map(item => (
                <motion.div
                  key={item.name}
                  className="relative"
                  whileHover="hover"
                  initial="initial"
                >
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActiveLink(item.href)
                        ? 'text-[#fe0000]'
                        : 'text-[#1a1a1a] hover:text-[#fe0000]'
                    }`}
                  >
                    {item.name}

                    {/* Active Link Underline */}
                    {isActiveLink(item.href) && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full bg-[#fe0000]"
                        layoutId="activeLink"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                          duration: 0.3,
                          ease: 'easeOut',
                          type: 'tween',
                        }}
                      />
                    )}

                    {/* Hover Underline */}
                    {!isActiveLink(item.href) && (
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full bg-[#fe0000]"
                        initial={{ scaleX: 0 }}
                        variants={{
                          hover: {
                            scaleX: 1,
                            transition: {
                              duration: 0.25,
                              ease: 'easeOut',
                            },
                          },
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
              
              {/* Desktop CTA Button */}
              <Button href="/contact" size="small" variant="accent">
                Get Started
              </Button>
            </nav>

            {/* Mobile - Email icon and space for external animated logo */}
            <div className="flex items-center space-x-3 lg:hidden">
              {/* Mobile Email Button */}
              <motion.a
                href="mailto:contact@habitnova.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fe0000] text-white shadow-sm transition-colors hover:bg-[#cd1718]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email us</span>
              </motion.a>

              {/* Space reserved for animated logo */}
              <div className="w-16"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        currentPath={pathname}
        navigation={navigation}
      />
    </>
  )
}

export default Header