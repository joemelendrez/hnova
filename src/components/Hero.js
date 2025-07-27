'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Button from './Button';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[#1a1a1a] via-gray-800 to-gray-900 text-white overflow-hidden min-h-screen flex items-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Optional Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(/images/hero-bg.jpg)', // Add your image to public/images/
        }}
      ></div>

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
              Transform Your{' '}
              <span className="text-[#DBDBDB]">Digital Presence</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              We help businesses grow with cutting-edge web development,
              innovative design, and strategic digital solutions that drive real
              results.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                href="/contact"
                size="large"
                variant="cta"
                className="group"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>

              <Button
                variant="secondary"
                size="large"
                className="border-white text-white hover:bg-white hover:text-[#1a1a1a]"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
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
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">
                  500+
                </div>
                <div className="text-gray-300 text-sm">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">
                  98%
                </div>
                <div className="text-gray-300 text-sm">Client Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-1">
                  24/7
                </div>
                <div className="text-gray-300 text-sm">Support Available</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image/Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Hero Image */}
              <img
                src="/images/hero-illustration.png" // Add your image to public/images/
                alt="Digital transformation illustration"
                className="w-full h-auto max-w-lg mx-auto"
              />

              {/* Floating Animation Elements */}
              <motion.div
                className="absolute top-10 right-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-2xl">🚀</div>
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-10 bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <div className="text-2xl">💡</div>
              </motion.div>
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
  );
};

export default Hero;
