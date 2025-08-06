'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Book, ShoppingBag } from 'lucide-react';
import Button from './Button';
import { useRouteLoading } from './RouteLoadingProvider';

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const parallaxRef = useRef(null);
  const rafRef = useRef(null);
  const scrollYRef = useRef(0);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const { setIsLoading } = useRouteLoading();

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if device is mobile (guarded for SSR)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, [mounted]);

  // Preload critical resources with fetch priority
  useEffect(() => {
    if (!mounted) return;

    // Create high-priority preload links for critical hero assets
    const preloadCriticalAssets = () => {
      // Remove existing preload links to avoid duplicates
      const existingPreloads = document.querySelectorAll('link[data-hero-preload]');
      existingPreloads.forEach(link => link.remove());

      if (isMobile) {
        // Mobile: Preload WebP image with high priority
        const webpLink = document.createElement('link');
        webpLink.rel = 'preload';
        webpLink.as = 'image';
        webpLink.href = '/HabitBackground.webp';
        webpLink.fetchPriority = 'high';
        webpLink.setAttribute('data-hero-preload', 'true');
        document.head.appendChild(webpLink);

        // Also preload a smaller version for faster initial render
        const smallWebpLink = document.createElement('link');
        smallWebpLink.rel = 'preload';
        smallWebpLink.as = 'image';
        smallWebpLink.href = '/HabitBackground-small.webp'; // Create this optimized version
        smallWebpLink.fetchPriority = 'high';
        smallWebpLink.setAttribute('data-hero-preload', 'true');
        document.head.appendChild(smallWebpLink);
      } else {
        // Desktop: Preload video with high priority
        const videoLink = document.createElement('link');
        videoLink.rel = 'preload';
        videoLink.as = 'video';
        videoLink.href = '/HabitBackground.webm';
        videoLink.fetchPriority = 'high';
        videoLink.setAttribute('data-hero-preload', 'true');
        document.head.appendChild(videoLink);

        // Preload fallback image with lower priority
        const imageLink = document.createElement('link');
        imageLink.rel = 'preload';
        imageLink.as = 'image';
        imageLink.href = '/HabitBackground.webp';
        imageLink.fetchPriority = 'low'; // Lower priority as it's fallback
        imageLink.setAttribute('data-hero-preload', 'true');
        document.head.appendChild(imageLink);
      }
    };

    preloadCriticalAssets();

    // Cleanup on unmount
    return () => {
      const preloadLinks = document.querySelectorAll('link[data-hero-preload]');
      preloadLinks.forEach(link => link.remove());
    };
  }, [mounted, isMobile]);

  // Handle background image loading with priority
  useEffect(() => {
    if (!mounted) return;

    const preloadBackgroundImage = () => {
      const img = new Image();
      img.fetchPriority = 'high'; // Set high priority for LCP image
      
      img.onload = () => {
        setImageLoaded(true);
        if (isMobile) {
          // For mobile, this is the primary content - hide loading
          setTimeout(() => setIsLoading(false), 300);
        }
      };

      img.onerror = () => {
        console.warn('Hero background image failed to load');
        setImageLoaded(false);
        if (isMobile) {
          setTimeout(() => setIsLoading(false), 300);
        }
      };

      // Load optimized image based on device
      if (isMobile) {
        // Load mobile-optimized version first, then full size
        const smallImg = new Image();
        smallImg.fetchPriority = 'high';
        smallImg.onload = () => {
          // Small image loaded, now load full size
          img.src = '/HabitBackground.webp';
        };
        smallImg.src = '/HabitBackground-small.webp';
      } else {
        img.src = '/HabitBackground.webp';
      }

      imageRef.current = img;
    };

    preloadBackgroundImage();

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [mounted, isMobile, setIsLoading]);

  // Handle video loading for desktop only
  useEffect(() => {
    if (!mounted || isMobile || !videoRef.current) {
      if (mounted && !isMobile) {
        // Desktop without video - show based on image load
        if (imageLoaded) {
          setTimeout(() => setIsLoading(false), 400);
        }
      }
      return;
    }

    const video = videoRef.current;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      setTimeout(() => setIsLoading(false), 500);
    };

    const handleError = () => {
      console.warn('Video failed to load, using fallback image');
      setVideoLoaded(false);
      // Use image load state for fallback
      if (imageLoaded) {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    // Set video preload to metadata for faster initial response
    video.preload = 'metadata';
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, [mounted, isMobile, imageLoaded, setIsLoading]);

  // Optimized parallax with intersection observer
  const updateParallax = useCallback(() => {
    if (parallaxRef.current) {
      const offset = scrollYRef.current * 0.5;
      parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !isMobile) return;

    let ticking = false;
    let isInView = true;

    // Use Intersection Observer to pause parallax when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (parallaxRef.current) {
      observer.observe(parallaxRef.current);
    }

    const handleScroll = () => {
      if (!isInView) return; // Skip if not visible

      scrollYRef.current = window.scrollY;

      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mounted, isMobile, updateParallax]);

  // Generate responsive background image sources
  const getResponsiveBackgroundImage = () => {
    if (typeof window === 'undefined') return 'url(/HabitBackground.webp)';
    
    const width = window.innerWidth;
    
    if (width <= 480) {
      return 'url(/HabitBackground-480.webp)'; // Create this smaller version
    } else if (width <= 768) {
      return 'url(/HabitBackground-768.webp)'; // Create this medium version
    } else if (width <= 1200) {
      return 'url(/HabitBackground-1200.webp)'; // Create this large version
    } else {
      return 'url(/HabitBackground.webp)'; // Full size for very large screens
    }
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Minimal loading state */}
          <div className="h-16 bg-gray-800 rounded animate-pulse mb-6"></div>
          <div className="h-8 bg-gray-800 rounded animate-pulse mb-12 max-w-3xl mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
      {/* Desktop: Video Background */}
      {!isMobile && (
        <>
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            fetchpriority="high" // Add fetch priority hint
          >
            <source src="/HabitBackground.webm" type="video/webm" />
            <source src="/HabitBackground.mp4" type="video/mp4" />
          </video>

          {/* Desktop: Fallback Background Image */}
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500 ${
              videoLoaded ? 'opacity-0' : imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: getResponsiveBackgroundImage(),
            }}
          />
        </>
      )}

      {/* Mobile: Optimized Background Image with Responsive Loading */}
      {isMobile && (
        <div
          ref={parallaxRef}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: getResponsiveBackgroundImage(),
            height: '120%',
            top: '-10%',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        />
      )}

      {/* Loading placeholder while images load */}
      {!imageLoaded && !videoLoaded && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle Background Pattern (only show when background is loaded) */}
      <div className={`absolute inset-0 opacity-5 transition-opacity duration-500 ${
        (imageLoaded || videoLoaded) ? 'opacity-5' : 'opacity-0'
      }`}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, #DBDBDB 1px, transparent 1px),
                              radial-gradient(circle at 80% 20%, #DBDBDB 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Main Headline */}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-anton uppercase leading-tight mb-6 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Stop Failing at{' '}
          <span className="text-[#DBDBDB] font-anton relative inline-block">
            Habits.
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-1 bg-[#DBDBDB]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The science-backed system that makes change{' '}
          <span className="text-[#DBDBDB] font-semibold">automatic</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Button
            href="/blog"
            size="large"
            variant="cta"
            className="group shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
          >
            <Book className="mr-2 h-5 w-5" />
            Read Blog
          </Button>

          <Button
            href="/shop"
            size="large"
            variant="outline"
            className="group relative border-2 border-white/40 text-white hover:border-white transition-all duration-300 min-w-[200px] hover:shadow-lg backdrop-blur-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0" />
            <div className="relative z-10 flex items-center justify-center group-hover:text-[#1a1a1a] transition-colors duration-300">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Tools
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Button>
        </motion.div>

        {/* Simple Trust Indicator */}
        <motion.div
          className="text-center border-t border-white/20 pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="text-lg text-gray-300 mb-2">
            Join readers who are building better habits
          </div>
          <div className="text-[#DBDBDB] font-semibold">
            Start your transformation today
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;