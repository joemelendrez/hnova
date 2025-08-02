'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import MobileMenu from './MobileMenu';
import AnimatedLogo from './AnimatedLogo';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Navigation items
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Shop', href:'/shop'}
  ];

  // Detect mobile/desktop
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1280); // xl breakpoint
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Handle scroll effect and header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for background color
      setScrolled(currentScrollY > 50);

      // Header visibility logic
      if (currentScrollY < 10) {
        // Always show header at top of page
        setHeaderVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide header
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Reading progress tracking - ONLY for mobile
  useEffect(() => {
    const updateReadingProgress = () => {
      // Only show progress on individual blog post pages AND only on mobile
      if (!pathname.startsWith('/blog/') || pathname === '/blog' || !isMobile) {
        setReadingProgress(0);
        return;
      }

      const article = document.querySelector('article');
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const articleBottom = articleTop + articleHeight;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // Start tracking when article comes into view
      const startReading = articleTop - windowHeight * 0.3;
      const finishReading = articleBottom - windowHeight * 0.7;

      if (scrollTop < startReading) {
        setReadingProgress(0);
      } else if (scrollTop > finishReading) {
        setReadingProgress(100);
      } else {
        const progress =
          ((scrollTop - startReading) / (finishReading - startReading)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', updateReadingProgress, { passive: true });
    updateReadingProgress();

    return () => window.removeEventListener('scroll', updateReadingProgress);
  }, [pathname, isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Show reading progress only on mobile blog posts
  const showReadingProgress =
    pathname.startsWith('/blog/') && pathname !== '/blog' && isMobile;

  return (
    <>
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
      >
        <AnimatedLogo
          isMenuOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </motion.div>

      <header
        className={`fixed left-0 right-0 top-0 transition-all duration-300 ease-in-out ${
          scrolled ? 'bg-[#1a1a1a]/70 shadow-lg backdrop-blur-sm' : 'bg-[#1a1a1a]'
        } ${headerVisible ? 'translate-y-0' : '-translate-y-full'} ${
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
                    width={100}
                    height={100}
                    className="mr-3 transition-all duration-200 group-hover:opacity-80"
                    priority
                  />
                </motion.div>
               
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-8 ">
              {navigation.map((item) => (
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
                        ? 'text-white hover:text-[#fe0000]'
                        : 'text-white hover:text-[#dbdbdb]'
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
                        className="absolute bottom-0 left-0 right-0 h-0.5 origin-left rounded-full bg-white"
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

              {/* Desktop Contact Info */}
              <a
                href="mailto:contact@habitnova.com"
                className="flex items-center space-x-2 text-sm text-white transition-colors hover:text-[#fe0000]"
              >
                <Mail className="h-4 w-4" />
                <span className="font-medium">contact@habitnova.com</span>
              </a>
            </nav>

            {/* Mobile - Email icon and space for external animated logo */}
            <div className="flex items-center space-x-3 lg:hidden">
              {/* Mobile Email Button */}
              <motion.a
                href="mailto:contact@habitnova.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DBDBDB] text-[#1a1a1a] shadow-sm transition-colors hover:bg-gray-300"
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

        {/* Reading Progress Bar - Bottom of Header - MOBILE ONLY */}
        {showReadingProgress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-transparent">
            <motion.div
              className="h-full origin-left bg-[#fe0000]"
              style={{ scaleX: readingProgress / 100 }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: readingProgress / 100 }}
              transition={{ duration: 0.1, ease: 'easeOut' }}
            />
          </div>
        )}
      </header>

      {/* Fixed Reading Progress Bar - When header is hidden - MOBILE ONLY */}
      {showReadingProgress && !headerVisible && (
        <motion.div
          className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-1 bg-transparent"
          initial={{ opacity: 0, y: -4 }}
          animate={{
            opacity: readingProgress >= 100 ? 0 : 1,
            y: readingProgress >= 100 ? -4 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full origin-left bg-[#fe0000]"
            style={{ scaleX: readingProgress / 100 }}
            animate={{ scaleX: readingProgress / 100 }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />
        </motion.div>
      )}

      {/* Mobile Menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPath={pathname}
        navigation={navigation}
      />
    </>
  );
};

export default Header;
