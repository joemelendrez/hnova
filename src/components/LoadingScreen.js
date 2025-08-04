// src/components/LoadingScreen.js - React 19 + Framer Motion 12 compatible
'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingScreen = ({ isVisible = true }) => {
  const [mounted, setMounted] = useState(false);
  
  // Prevent hydration mismatch with React 19
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Don't render until mounted to prevent hydration issues
  if (!mounted || !isVisible) {
    return null;
  }
  
  return (
    <motion.div
      className="fixed inset-0 bg-[#DBDBDB] flex items-center justify-center z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Animated Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`loading-dot-${index}`}
            className="w-4 h-4 bg-[#f10000] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default LoadingScreen;