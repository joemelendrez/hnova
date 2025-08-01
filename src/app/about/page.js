'use client';
import { motion } from 'framer-motion';
import { BookOpen, Wrench, ShoppingBag } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About.
            </h1>
            <p className="text-xl text-[#dbdbdb] leading-relaxed">
              We&apos;re on a mission to help people understand the science
              behind habit formation and provide practical tools, resources, and
              products for lasting behavior change.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-[#DBDBDB] bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At Habit Nova, we believe that understanding the science behind
                habits is the key to lasting change. We translate complex
                research into actionable insights that anyone can apply to their
                daily life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you&apos;re trying to break a bad habit, build a new
                routine, or understand the psychology of behavior change, we
                provide evidence-based strategies, curated tools, and practical
                resources that actually work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6 text-center">
                Why We Started Habit Nova
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Most habit advice is based on outdated myths and
                  willpower-focused approaches that set people up for failure.
                </p>
                <p>
                  We created Habit Nova to bridge the gap between cutting-edge
                  behavioral science and practical, everyday application.
                </p>
                <p className="text-[#1a1a1a] font-semibold">
                  Our goal: Make lasting change accessible to everyone.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
              Our Complete Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need for successful habit transformation
              through three key pillars.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8" />,
                title: 'Educational Content',
                description:
                  'Science-backed articles, guides, and research-based strategies that actually work for lasting habit change.',
              },
              {
                icon: <Wrench className="h-8 w-8" />,
                title: 'Practical Tools',
                description:
                  'Free templates, habit trackers, worksheets, and resources you can download and use immediately.',
              },
              {
                icon: <ShoppingBag className="h-8 w-8" />,
                title: 'Curated Products',
                description:
                  'Hand-picked tools, journals, and accessories that support your habit-building journey, tested and recommended by our team.',
              },
            ].map((pillar, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1a1a] rounded-full mb-6">
                  <div className="text-white">{pillar.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">
                  {pillar.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#DBDBDB] bg-opacity-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do and every piece of content
              we create.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Evidence-Based',
                description:
                  'Every strategy we share is backed by scientific research and proven results.',
              },
              {
                title: 'Practical',
                description:
                  'We focus on actionable advice that you can implement immediately in your daily life.',
              },
              {
                title: 'Accessible',
                description:
                  'Complex psychology made simple. No jargon, just clear, helpful guidance.',
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center bg-white rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
