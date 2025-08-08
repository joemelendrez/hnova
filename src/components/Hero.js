'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Book, ShoppingBag } from 'lucide-react';
import Button from './Button';
import { useRouteLoading } from './RouteLoadingProvider';

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const { setIsLoading } = useRouteLoading();
  
  // Parallax scroll effects - ALL text moves together as one group
  const { scrollY } = useScroll();
  
  // Single parallax transform for entire content group - moves down into Featured Articles
  const contentY = useTransform(scrollY, [0, 600], [0, 200]); // Moves DOWN as you scroll
  
  // Optional: Slight fade as it moves down (remove if you don't want fading)
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  
  // Prevent hydration issues
  useEffect(() => {
    setMounted(true);
    // Hide loading immediately since we removed video
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
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
      {/* Keep solid background color only */}

      {/* Main Content - ALL text moves together as one group */}
      <motion.div 
        className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 pb-20"
        style={{ y: contentY, opacity }} // Single transform for entire content group
      >
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

        {/* Trust Indicator */}
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
      </motion.div>

      {/* Fade out gradient at bottom to blend with next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent z-9" />
    </section>
  );
};

export default Hero;