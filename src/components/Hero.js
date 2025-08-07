'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Book, ShoppingBag } from 'lucide-react';
import Button from './Button';
import { useRouteLoading } from './RouteLoadingProvider';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const { setIsLoading } = useRouteLoading();

  // Parallax scroll effects for text elements - they move DOWN into next section
  const { scrollY } = useScroll();
  
  // Text moves DOWN (positive values) as user scrolls down
  const titleY = useTransform(scrollY, [0, 800], [0, 200]); // Title moves down fastest
  const subtitleY = useTransform(scrollY, [0, 800], [0, 150]); // Subtitle medium speed
  const buttonsY = useTransform(scrollY, [0, 800], [0, 100]); // Buttons slower
  const trustY = useTransform(scrollY, [0, 800], [0, 50]); // Trust indicator slowest
  
  // Keep text visible as it moves down (don't fade out)
  const opacity = useTransform(scrollY, [0, 600, 800], [1, 1, 0.8]);

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
    // Hide loading immediately since we removed complex backgrounds
    setTimeout(() => setIsLoading(false), 200);
  }, [setIsLoading]);

  if (!mounted) {
    return (
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
        {/* Simple loading state */}
      </section>
    );
  }

  return (
    <>
      {/* Hero Section - Fixed Dark Background */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
        {/* Simple solid background - no images or videos */}
        <div className="absolute inset-0 bg-[#1a1a1a]" />

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

        {/* Main Content with Parallax Motion - Moves DOWN */}
        <motion.div 
          className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
          style={{ opacity }} // Slight fade as it moves down
        >
          {/* Main Headline with Parallax - Moves DOWN fastest */}
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-anton uppercase leading-tight mb-6 tracking-tight"
            style={{ y: titleY }} // Moves DOWN into next section
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

          {/* Subtitle with Different Parallax Speed - Moves DOWN */}
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
            style={{ y: subtitleY }} // Moves DOWN slower than title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            The science-backed system that makes change{' '}
            <span className="text-[#DBDBDB] font-semibold">automatic</span>
          </motion.p>

          {/* CTA Buttons with Another Parallax Speed - Moves DOWN */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            style={{ y: buttonsY }} // Moves DOWN even slower
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

          {/* Trust Indicator with Slowest Parallax - Moves DOWN slowest */}
          <motion.div
            className="text-center border-t border-white/20 pt-8"
            style={{ y: trustY }} // Moves DOWN very slowly
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
        </motion.div>
      </section>

      
    </>
  );
};

export default Hero;