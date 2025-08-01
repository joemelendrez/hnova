// src/components/TableOfContents.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'lucide-react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showTOC, setShowTOC] = useState(false);

  // Extract headings from HTML content
  useEffect(() => {
    if (!content) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const headingElements = tempDiv.querySelectorAll('h2, h3, h4');
    const headingsData = Array.from(headingElements).map((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));
      const id = `heading-${index}`;

      return {
        id,
        text: text.trim(),
        level,
      };
    });

    setHeadings(headingsData);
  }, [content]);

  // Add IDs to actual headings and set up observers
  useEffect(() => {
    if (headings.length === 0) return;

    const timeoutId = setTimeout(() => {
      const actualHeadings = document.querySelectorAll(
        '#article-content h2, #article-content h3, #article-content h4'
      );

      // Add IDs to headings
      actualHeadings.forEach((heading, index) => {
        if (headings[index]) {
          heading.id = headings[index].id;
          heading.style.scrollMarginTop = '120px';
        }
      });

      // Active heading observer
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        {
          rootMargin: '-120px 0px -60% 0px',
          threshold: 0.1,
        }
      );

      actualHeadings.forEach((heading) => {
        headingObserver.observe(heading);
      });

      // Article visibility observer - show icon when article is in view
      const articleContent = document.getElementById('article-content');
      let articleObserver;

      if (articleContent) {
        articleObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setIsVisible(entry.intersectionRatio > 0);
            });
          },
          {
            rootMargin: '0px 0px -200px 0px',
            threshold: [0, 0.1],
          }
        );
        articleObserver.observe(articleContent);

        // Check initial visibility
        const rect = articleContent.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight && rect.bottom > 0) {
          setIsVisible(true);
        }
      }

      // Reading progress tracking
      const updateProgress = () => {
        if (!articleContent) return;

        const articleTop = articleContent.offsetTop;
        const articleHeight = articleContent.offsetHeight;
        const articleBottom = articleTop + articleHeight;
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        const startReading = articleTop - windowHeight * 0.3;
        const finishReading = articleBottom - windowHeight * 0.7;

        if (scrollTop < startReading) {
          setReadingProgress(0);
        } else if (scrollTop > finishReading) {
          setReadingProgress(100);
        } else {
          const progress =
            ((scrollTop - startReading) / (finishReading - startReading)) * 100;
          setReadingProgress(Math.min(100, Math.max(0, progress)));
        }
      };

      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();

      return () => {
        actualHeadings.forEach((heading) => {
          headingObserver.unobserve(heading);
        });
        if (articleObserver && articleContent) {
          articleObserver.unobserve(articleContent);
        }
        window.removeEventListener('scroll', updateProgress);
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [headings]);

  // Smooth scroll to heading
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.backgroundColor = '#f3f4f6';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 1000);

      const yOffset = -100;
      const elementTop = element.getBoundingClientRect().top;
      const absoluteElementTop = elementTop + window.pageYOffset;
      const scrollToPosition = absoluteElementTop + yOffset;

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth',
      });

      // Hide TOC after clicking
      setShowTOC(false);
    }
  };

  if (headings.length === 0 || !isVisible) return null;

  return (
    <div className="fixed right-6 top-1/3 transform -translate-y-1/2 z-30 hidden xl:block">
      {/* Floating Icon */}
      <motion.div
        className="relative"
        onMouseEnter={() => setShowTOC(true)}
        onMouseLeave={() => setShowTOC(false)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Icon Button */}
        <div className="bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <List className="h-5 w-5 text-[#1a1a1a] group-hover:text-blue-600" />

          {/* Progress Ring */}
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 50 50"
          >
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="2"
            />
            <motion.circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${
                2 * Math.PI * 20 * (1 - readingProgress / 100)
              }`}
              transition={{ duration: 0.1 }}
            />
          </svg>

          {/* Tooltip */}
          <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-3 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Table of Contents ({Math.round(readingProgress)}%)
          </div>
        </div>

        {/* Hover Panel */}
        <AnimatePresence>
          {showTOC && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full top-0 mr-4 w-80 max-h-[60vh] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4 text-[#1a1a1a]" />
                  <h3 className="font-semibold text-[#1a1a1a]">Contents</h3>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(readingProgress)}% complete • {headings.length}{' '}
                  sections
                </div>
              </div>

              {/* Content List */}
              <nav className="max-h-[50vh] overflow-y-auto p-2">
                <ul className="space-y-1">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`text-left w-full py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-100 ${
                          activeId === heading.id
                            ? 'bg-[#1a1a1a] text-white font-medium'
                            : 'text-gray-700 hover:text-[#1a1a1a]'
                        } ${
                          heading.level === 2
                            ? 'text-sm font-medium'
                            : heading.level === 3
                            ? 'text-xs ml-4'
                            : 'text-xs ml-8'
                        }`}
                      >
                        {heading.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TableOfContents;
