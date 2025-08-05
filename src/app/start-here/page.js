'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  Mail,
  FileText,
  Calendar,
  BarChart3,
} from 'lucide-react';
import Button from '@/components/Button';

export default function StartHerePage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call ConvertKit API integration
      const response = await fetch('/api/subscribe-convertkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Success! Show email confirmation message
      setIsSubmitted(true);
      // Keep email in state to show in confirmation
    } catch (error) {
      console.error('Error subscribing:', error);
      setError(error.message || 'Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const guideContents = [
    {
      icon: <Target className="h-6 w-6" />,
      title: 'The Science of Habit Formation',
      description:
        'Understand the neurological basis of habits and why willpower fails',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'The 4-Step Habit Loop',
      description:
        'Master the cue-routine-reward-tracking system that creates lasting change',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: '21-Day Quick Start Plan',
      description:
        'A proven roadmap to build your first keystone habit in 3 weeks',
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Habit Stacking Templates',
      description:
        'Ready-to-use frameworks to link new habits to existing routines',
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Progress Tracking Sheets',
      description:
        'Printable trackers and worksheets to monitor your transformation',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Troubleshooting Guide',
      description: 'Solutions for the 7 most common habit-building obstacles',
    },
  ];

  // Success state - Email sent confirmation
  if (isSubmitted) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-[#1a1a1a] text-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-8">
              <Mail className="h-10 w-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-anton uppercase mb-6">
              Check Your Email!
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
              We've sent your <strong>Complete Habit Formation Guide</strong>{' '}
              directly to your inbox. Your welcome email with the PDF download
              link should arrive within the next few minutes.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-md mx-auto">
              <h3 className="font-semibold mb-3">What to do next:</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm">
                    Check your email (including spam/promotions)
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm">
                    Click the download link in the email
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm">
                    Start with the 21-day plan today
                  </span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm">
                    Watch for follow-up tips over the next few weeks
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-400 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Mail className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-300 font-semibold">
                  Email sent to:
                </span>
              </div>
              <p className="text-white text-lg font-medium">{email}</p>
            </div>

            <Button href="/blog" variant="cta" size="large" className="mb-6">
              Explore Our Blog
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail(''); // Clear email for retry
                }}
                className="text-[#DBDBDB] hover:underline"
              >
                try again
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-[#1a1a1a] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#DBDBDB] rounded-full mb-6">
              <Download className="h-8 w-8 text-[#1a1a1a]" />
            </div>

            <h1 className="text-4xl md:text-6xl font-anton uppercase mb-6 leading-tight">
              The Complete
              <span className="block text-[#DBDBDB] font-anton">
                Habit Formation Guide
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              The science-backed system that <strong>67,000+ people</strong>{' '}
              have used to build lasting habits and transform their lives.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-[#DBDBDB]">
                    FREE
                  </span>
                  <span className="text-lg text-gray-300 ml-2 line-through">
                    $47
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300">
                Limited time: Get instant access to our 25-page guide
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Email Capture Form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
              Get Your Free Guide Now
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Enter your email and we'll send the PDF download link directly to
              your inbox
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              {error && (
                <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-[#1a1a1a] placeholder-gray-500 focus:ring-2 focus:ring-[#DBDBDB] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-[#DBDBDB] hover:bg-gray-300 text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a1a1a]"></div>
                    </div>
                  ) : (
                    <>
                      <Mail className="inline h-4 w-4 mr-2" />
                      Send Guide
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Instant delivery
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  No spam ever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  Unsubscribe anytime
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-4">
              What's Inside Your Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              25 pages of actionable strategies, proven frameworks, and
              practical tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guideContents.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1a1a1a] rounded-lg mb-4">
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-[#1a1a1a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-8">
              Join 67,000+ People Who've Transformed Their Habits
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-2">
                  67,000+
                </div>
                <div className="text-gray-300">Guides Downloaded</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-2">
                  89%
                </div>
                <div className="text-gray-300">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#DBDBDB] mb-2">
                  4.9/5
                </div>
                <div className="text-gray-300">Average Rating</div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <blockquote className="text-lg italic text-gray-300 mb-4">
                "This guide completely changed how I approach habits. I've
                successfully built 5 new habits in the last 3 months using the
                techniques inside. The habit stacking method alone is worth the
                download!"
              </blockquote>
              <cite className="text-[#DBDBDB] font-semibold">
                — Sarah M., Digital Marketing Manager
              </cite>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[#1a1a1a] mb-6">
              Ready to Build Habits That Actually Stick?
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Get your free guide delivered straight to your email and start
              your transformation today.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              {error && (
                <div className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-[#1a1a1a] placeholder-gray-500 focus:ring-2 focus:ring-[#DBDBDB] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-[#DBDBDB] hover:bg-gray-300 text-[#1a1a1a] px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#1a1a1a]"></div>
                    </div>
                  ) : (
                    'Get Free Guide'
                  )}
                </button>
              </div>
            </form>

            <p className="text-sm text-gray-500">
              No spam. We respect your privacy and you can unsubscribe at any
              time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
