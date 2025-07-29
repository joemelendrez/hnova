'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle } from 'lucide-react'
import Button from './Button'

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup here
    console.log('Newsletter signup:', email)
    setIsSubscribed(true)
    setEmail('')
  }

  return (
    <section className="py-20 bg-[#DBDBDB] bg-opacity-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {!isSubscribed ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1a1a1a] rounded-full mb-6">
                <Mail className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
                Join 50,000+ Habit Builders
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Get weekly insights, practical tips, and evidence-based strategies delivered to your inbox. 
                No spam, just actionable content to help you build better habits.
              </p>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1a1a] focus:border-transparent bg-white text-gray-700"
                  />
                  <Button type="submit" variant="primary">
                    Subscribe
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Free forever. Unsubscribe anytime.
                </p>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                Welcome to the Community!
              </h2>
              
              <p className="text-xl text-gray-600">
                Check your email for a welcome message and your first habit-building tip.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Newsletter