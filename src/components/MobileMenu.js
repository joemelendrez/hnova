'use client'
import { Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Target, BookOpen, TrendingUp } from 'lucide-react'

const MobileMenu = ({ open, onClose, currentPath, navigation }) => {
  const isActiveLink = (href) => {
    if (href === '/') {
      return currentPath === '/'
    }
    return currentPath.startsWith(href)
  }

  const quickLinks = [
    { name: 'Popular Articles', href: '/blog?filter=popular', icon: <TrendingUp className="h-4 w-4" /> },
    { name: 'Start Here Guide', href: '/start-here', icon: <BookOpen className="h-4 w-4" /> },
  ]

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      // Prevent scrolling
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)' // Prevent layout shift
    } else {
      // Restore scrolling
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Calculate scrollbar width for layout shift prevention
  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
  }, [])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Menu Panel Container */}
          <div className="fixed inset-0 overflow-hidden z-40 lg:hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                <motion.div
                  className="pointer-events-auto relative flex h-full"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.25, 0.46, 0.45, 0.94] 
                  }}
                >
                  {/* Logo Box - square box just for logo - Now clickable to close */}
                  <button
                    onClick={onClose}
                    className="flex h-20 w-20 items-center justify-center bg-[#1a1a1a] shadow-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset"
                    aria-label="Close menu"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.4,
                        duration: 0.4,
                        ease: 'easeOut',
                      }}
                      className="flex h-16 w-16 items-center justify-center"
                    >
                      <Image
                        src="/logos/HabitHead.svg"
                        alt="Habit Nova Logo - Click to close menu"
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain"
                      />
                    </motion.div>
                  </button>

                  {/* Main menu panel */}
                  <div className="w-80 max-w-[85vw] bg-white shadow-2xl">
                    <div className="flex h-full flex-col">
                      
                      {/* Header */}
                      <div className="flex h-20 items-center justify-between border-b border-gray-100 px-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
                        >
                          <h2 className="text-2xl font-anton text-[#1a1a1a]">Habit Nova</h2>
                          <p className="text-sm text-gray-600 font-medium">Transform Your Habits</p>
                        </motion.div>
                        <button
                          onClick={onClose}
                          className="p-2 text-gray-500 transition-colors hover:text-[#1a1a1a] rounded-lg"
                          aria-label="Close menu"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {/* Navigation */}
                      <nav className="flex-1 overflow-y-auto px-6 py-8">
                        <ul className="space-y-2">
                          {navigation.map((item, index) => (
                            <motion.li
                              key={item.name}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                            >
                              <Link
                                href={item.href}
                                className={`block rounded-lg px-4 py-3 text-lg font-medium transition-all duration-200 hover:bg-gray-50 ${
                                  isActiveLink(item.href)
                                    ? 'border-l-4 border-[#1a1a1a] bg-[#DBDBDB] bg-opacity-20 text-[#1a1a1a]'
                                    : 'text-gray-700 hover:text-[#1a1a1a]'
                                }`}
                                onClick={onClose}
                              >
                                {item.name}
                              </Link>
                            </motion.li>
                          ))}
                        </ul>

                        {/* Quick Links */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.8 }}
                          className="mt-8 border-t border-gray-500 pt-8"
                        >
                          <h3 className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]">
                            Quick Links
                          </h3>
                          <ul className="space-y-1">
                            {quickLinks.map((item, index) => (
                              <motion.li
                                key={item.name}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 + 0.9 }}
                              >
                                <Link
                                  href={item.href}
                                  className="flex items-center space-x-3 rounded-lg px-4 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-[#1a1a1a]"
                                  onClick={onClose}
                                >
                                  {item.icon}
                                  <span>{item.name}</span>
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </nav>

                      {/* Contact Information */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="border-t border-gray-200 bg-gray-50 p-6"
                      >
                        <div className="space-y-4">
                          <a
                            href="mailto:contact@habitnova.com"
                            className="group flex items-center space-x-3 text-gray-700 transition-colors hover:text-[#1a1a1a]"
                          >
                            <div className="flex-shrink-0 rounded-lg bg-white p-2 transition-colors group-hover:bg-[#DBDBDB] group-hover:bg-opacity-20">
                              <Mail className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Email Us</p>
                              <p className="text-sm">contact@habitnova.com</p>
                            </div>
                          </a>

                          <div className="pt-4">
                            <Link
                              href="/contact"
                              className="flex w-full items-center justify-center rounded-lg bg-[#fe0000] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
                              onClick={onClose}
                            >
                              Get In Touch
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu