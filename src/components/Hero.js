'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Download, ShoppingBag } from 'lucide-react'
import Button from './Button'

const Hero = () => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const parallaxRef = useRef(null)
  const rafRef = useRef(null)
  const scrollYRef = useRef(0)
  
  // Check if device is mobile (guarded for SSR)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Smooth parallax animation with RAF
  const updateParallax = useCallback(() => {
    if (parallaxRef.current) {
      const offset = scrollYRef.current * 0.5
      parallaxRef.current.style.transform = `translate3d(0, ${offset}px, 0)`
    }
  }, [])
  
  // Optimized scroll handler with RAF
  useEffect(() => {
    if (typeof window === 'undefined' || !isMobile) return
    
    let ticking = false
    
    const handleScroll = () => {
      scrollYRef.current = window.scrollY
      
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          updateParallax()
          ticking = false
        })
        ticking = true
      }
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isMobile, updateParallax])
  
  return (
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
      {/* Desktop: Video Background */}
      {!isMobile && (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          style={{ display: videoLoaded ? 'block' : 'none' }}
        >
          <source src="/HabitBackground.webm" type="video/webm" />
          <source src="/HabitBackground.mp4" type="video/mp4" />
        </video>
      )}

      {/* Mobile: Smooth Parallax Image Background */}
      {isMobile && (
        <div
          ref={parallaxRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
          style={{
            backgroundImage: 'url(/HabitBackground3.webp)',
            height: '120%',
            top: '-10%',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
          }}
        />
      )}

      {/* Desktop Fallback Background Image */}
      {!isMobile && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/HabitBackground.webp)',
            display: videoLoaded ? 'none' : 'block',
          }}
        />
      )}

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
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
            href="/start-here"
            size="large"
            variant="cta"
            className="group shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[200px]"
          >
            <Download className="mr-2 h-5 w-5" />
            Get Free Guide
          </Button>

          <Button
            href="/shop"
            size="large"
            variant="outline"
            className="group border-2 border-white/30 text-white hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 min-w-[200px]"
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Shop Tools
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
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
  )
}

export default Hero