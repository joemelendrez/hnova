// src/components/PerformanceMonitor.js - Optional performance tracking component
'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Database, Clock, TrendingUp, X, Activity } from 'lucide-react'
import { getCacheStats, clearCache } from '@/lib/wordpress'

const PerformanceMonitor = ({ enabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [stats, setStats] = useState({
    cache: { memory: { count: 0 }, browser: { count: 0, sizeKB: 0 } },
    performance: { loadTime: 0, apiCalls: 0, cacheHits: 0 },
    timing: { domLoading: 0, domComplete: 0, loadComplete: 0 }
  })
  const [realtimeStats, setRealtimeStats] = useState([])
  const intervalRef = useRef()
  const startTime = useRef(Date.now())

  // Performance metrics collection
  useEffect(() => {
    if (!enabled) return

    // Collect initial timing metrics
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0]
      if (navigation) {
        setStats(prev => ({
          ...prev,
          timing: {
            domLoading: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
            domComplete: Math.round(navigation.domComplete - navigation.domLoading),
            loadComplete: Math.round(navigation.loadEventEnd - navigation.loadEventStart)
          }
        }))
      }
    }

    // Update stats periodically
    intervalRef.current = setInterval(() => {
      const cacheStats = getCacheStats()
      const currentTime = Date.now()
      
      setStats(prev => {
        const newStats = {
          ...prev,
          cache: cacheStats,
          performance: {
            ...prev.performance,
            loadTime: currentTime - startTime.current
          }
        }
        
        // Add to realtime stats (keep last 20 entries)
        setRealtimeStats(prevRealtime => {
          const newEntry = {
            timestamp: currentTime,
            memoryCache: cacheStats.memory.count,
            browserCache: cacheStats.browser.count,
            browserSizeKB: cacheStats.browser.sizeKB
          }
          
          return [...prevRealtime.slice(-19), newEntry]
        })
        
        return newStats
      })
    }, 2000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled])

  // Track API calls and cache hits (this would need to be integrated with your WordPress lib)
  useEffect(() => {
    if (!enabled) return

    // Listen for custom events from the WordPress library
    const handleCacheHit = () => {
      setStats(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          cacheHits: prev.performance.cacheHits + 1
        }
      }))
    }

    const handleApiCall = () => {
      setStats(prev => ({
        ...prev,
        performance: {
          ...prev.performance,
          apiCalls: prev.performance.apiCalls + 1
        }
      }))
    }

    // You would emit these events from your WordPress library
    window.addEventListener('cache-hit', handleCacheHit)
    window.addEventListener('api-call', handleApiCall)

    return () => {
      window.removeEventListener('cache-hit', handleCacheHit)
      window.removeEventListener('api-call', handleApiCall)
    }
  }, [enabled])

  const handleClearCache = () => {
    clearCache()
    setStats(prev => ({
      ...prev,
      cache: { memory: { count: 0 }, browser: { count: 0, sizeKB: 0 } }
    }))
  }

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getCacheEfficiency = () => {
    const total = stats.performance.apiCalls + stats.performance.cacheHits
    if (total === 0) return 0
    return Math.round((stats.performance.cacheHits / total) * 100)
  }

  if (!enabled || process.env.NODE_ENV !== 'development') return null

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Performance Monitor"
      >
        <Activity className="h-6 w-6" />
      </motion.button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Performance Monitor
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Stats Content */}
            <div className="p-4 space-y-6">
              
              {/* Cache Statistics */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Cache Performance
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.cache.memory.count}
                    </div>
                    <div className="text-sm text-blue-700">Memory Cache</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.cache.browser.count}
                    </div>
                    <div className="text-sm text-blue-700">Browser Cache</div>
                  </div>
                </div>
                
                <div className="mt-3 text-center">
                  <div className="text-sm text-blue-600">
                    Cache Size: {stats.cache.browser.sizeKB}KB
                  </div>
                  <div className="text-sm text-blue-600">
                    Efficiency: {getCacheEfficiency()}%
                  </div>
                </div>

                <button
                  onClick={handleClearCache}
                  className="w-full mt-3 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Clear All Caches
                </button>
              </div>

              {/* API Performance */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  API Performance
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">API Calls:</span>
                    <span className="font-semibold text-green-900">{stats.performance.apiCalls}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700">Cache Hits:</span>
                    <span className="font-semibold text-green-900">{stats.performance.cacheHits}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-green-700">Session Time:</span>
                    <span className="font-semibold text-green-900">
                      {formatTime(stats.performance.loadTime)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Page Load Timing */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Page Load Timing
                </h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-700">DOM Loading:</span>
                    <span className="font-semibold text-purple-900">
                      {formatTime(stats.timing.domLoading)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-700">DOM Complete:</span>
                    <span className="font-semibold text-purple-900">
                      {formatTime(stats.timing.domComplete)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-purple-700">Load Complete:</span>
                    <span className="font-semibold text-purple-900">
                      {formatTime(stats.timing.loadComplete)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Realtime Cache Chart */}
              {realtimeStats.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Realtime Cache Usage
                  </h4>
                  
                  <div className="h-32 relative">
                    <svg className="w-full h-full" viewBox="0 0 300 120">
                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4].map(i => (
                        <line
                          key={i}
                          x1="0"
                          y1={i * 24}
                          x2="300"
                          y2={i * 24}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}
                      
                      {/* Memory cache line */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        points={realtimeStats.map((stat, i) => 
                          `${(i / (realtimeStats.length - 1)) * 300},${120 - (stat.memoryCache / Math.max(...realtimeStats.map(s => s.memoryCache), 1)) * 100}`
                        ).join(' ')}
                      />
                      
                      {/* Browser cache line */}
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        points={realtimeStats.map((stat, i) => 
                          `${(i / (realtimeStats.length - 1)) * 300},${120 - (stat.browserCache / Math.max(...realtimeStats.map(s => s.browserCache), 1)) * 100}`
                        ).join(' ')}
                      />
                    </svg>
                    
                    {/* Legend */}
                    <div className="absolute bottom-0 left-0 text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-blue-500"></div>
                          <span>Memory</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-0.5 bg-green-500"></div>
                          <span>Browser</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Performance Tips */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-900 mb-3">
                  Performance Tips
                </h4>
                
                <div className="space-y-2 text-sm text-yellow-800">
                  {getCacheEfficiency() < 50 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Low cache efficiency. Consider preloading critical data.</span>
                    </div>
                  )}
                  
                  {stats.cache.browser.sizeKB > 500 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Large browser cache. Consider clearing old entries.</span>
                    </div>
                  )}
                  
                  {stats.performance.apiCalls > 10 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>High API usage. Cache more aggressively.</span>
                    </div>
                  )}
                  
                  {getCacheEfficiency() >= 80 && (
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></div>
                      <span>Excellent cache performance! 🎉</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cache Details */}
              {stats.cache.memory.entries && stats.cache.memory.entries.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Cache Entries
                  </h4>
                  
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {stats.cache.memory.entries.slice(0, 10).map((entry, i) => (
                      <div key={i} className="text-xs font-mono text-gray-600 truncate">
                        {entry}
                      </div>
                    ))}
                    {stats.cache.memory.entries.length > 10 && (
                      <div className="text-xs text-gray-500">
                        +{stats.cache.memory.entries.length - 10} more entries...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default PerformanceMonitor