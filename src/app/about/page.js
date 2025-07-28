'use client'
import { motion } from 'framer-motion'
import { Target, Users, BookOpen, Award } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: '50K+', label: 'Monthly Readers' },
    { icon: <BookOpen className="h-8 w-8" />, number: '200+', label: 'Articles Published' },
    { icon: <Target className="h-8 w-8" />, number: '95%', label: 'Success Rate' },
    { icon: <Award className="h-8 w-8" />, number: '5+', label: 'Years Experience' },
  ]

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              About HabitNova
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to help people understand the science behind habit formation 
              and provide practical tools for lasting behavior change.
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
                At HabitNova, we believe that understanding the science behind habits is the key to lasting change. 
                We translate complex research into actionable insights that anyone can apply to their daily life.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're trying to break a bad habit, build a new routine, or understand the psychology 
                of behavior change, we provide evidence-based strategies that actually work.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-lg"
                >
                  <div className="text-[#1a1a1a] mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-[#1a1a1a] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values guide everything we do and every piece of content we create.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Evidence-Based",
                description: "Every strategy we share is backed by scientific research and proven results."
              },
              {
                title: "Practical",
                description: "We focus on actionable advice that you can implement immediately in your daily life."
              },
              {
                title: "Accessible",
                description: "Complex psychology made simple. No jargon, just clear, helpful guidance."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
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
  )
}