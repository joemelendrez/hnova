'use client'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Target } from 'lucide-react'
import Button from './Button'

const Hero = () => {
  return (
    <section className="relative bg-[#1a1a1a] text-white overflow-hidden min-h-screen flex items-center">
      
    { /* Background Image */ }
<div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/HabitBackground.webp)',
        }}
      />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Headline */}
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover the{' '}
              <span className="font-anton text-[#DBDBDB]">Science</span> Behind{' '}
              <span className=" font-anton text-[#fe0000
]">Breaking Bad Habits</span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p 
              className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of readers who are transforming their lives with evidence-based strategies, 
              practical tools, and actionable insights for lasting habit change.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button 
                href="/blog" 
                size="large"
                variant="cta"
                className="group"
              >
                Start Reading
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              
              <Button 
                href="/habit-tracker"
                variant="secondary" 
                size="large"
                className="border-white text-white hover:bg-white hover:text-[#1a1a1a]"
              >
                <Target className="mr-2 h-5 w-5" />
                Free Habit Tracker
              </Button>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">50K+</div>
                <div className="text-gray-300 text-sm">Monthly Readers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">200+</div>
                <div className="text-gray-300 text-sm">Articles Published</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">95%</div>
                <div className="text-gray-300 text-sm">Success Rate</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Habit Loop Visualization */}
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#DBDBDB] mb-6">The Habit Loop</h3>
                  
                  {/* Circular habit loop */}
                  <div className="relative w-64 h-64 mx-auto">
                    <motion.div 
                      className="absolute inset-0 border-4 border-[#DBDBDB] rounded-full"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                    
                    {/* Cue */}
                    <motion.div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 bg-[#DBDBDB] text-[#1a1a1a] px-4 py-2 rounded-lg font-semibold"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.2 }}
                    >
                      Cue
                    </motion.div>
                    
                    {/* Routine */}
                    <motion.div 
                      className="absolute right-0 top-1/2 transform translate-x-4 -translate-y-1/2 bg-[#DBDBDB] text-[#1a1a1a] px-4 py-2 rounded-lg font-semibold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.4 }}
                    >
                      Routine
                    </motion.div>
                    
                    {/* Reward */}
                    <motion.div 
                      className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-4 bg-[#DBDBDB] text-[#1a1a1a] px-4 py-2 rounded-lg font-semibold"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 1.6 }}
                    >
                      Reward
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center opacity-60">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero