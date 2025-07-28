'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const AnimatedLogo = ({ isMenuOpen, className = '', onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative block border-none p-0 m-0 focus:outline-none bg-transparent rounded-lg ${className}`}
      style={{ width: '48px', height: '48px' }}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      animate={{
        scale: 1,
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Menu Icon (Hamburger) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isMenuOpen ? 0 : 1,
          rotate: isMenuOpen ? 90 : 0,
          scale: isMenuOpen ? 0.8 : 1,
        }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeInOut',
          delay: isMenuOpen ? 0 : 0.4,
        }}
      >
        {/* Custom hamburger lines */}
        <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
          <motion.div 
            className="w-6 h-0.5 bg-white"
            animate={{
              rotate: isMenuOpen ? 45 : 0,
              y: isMenuOpen ? 6 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="w-6 h-0.5 bg-[#1a1a1a]"
            animate={{
              opacity: isMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="w-6 h-0.5 bg-[#1a1a1a]"
            animate={{
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -6 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Logo when menu is open */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          rotate: isMenuOpen ? 0 : -90,
          scale: isMenuOpen ? 1 : 0.6,
        }}
        transition={{
          duration: 0.4,
          ease: 'easeInOut',
          delay: isMenuOpen ? 0.4 : 0,
        }}
      >
      </motion.div>
    </motion.button>
  )
}

export default AnimatedLogo