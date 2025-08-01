// src/components/MobileTableOfContents.js - Alternative Anchor Version
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const MobileTableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Extract headings and create proper anchor IDs
  useEffect(() => {
    if (!content) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    const headingElements = tempDiv.querySelectorAll('h2, h3, h4');
    const headingsData = Array.from(headingElements).map((heading, index) => {
      const text = heading.textContent || '';
      const level = parseInt(heading.tagName.charAt(1));

      // Create a clean anchor ID from the heading text
      const anchorId = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

      return {
        id: anchorId || `heading-${index}`,
        text: text.trim(),
        level,
      };
    });

    setHeadings(headingsData);

    // Add proper IDs to the actual headings in the DOM
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll(
        '#article-content h2, #article-content h3, #article-content h4'
      );
      actualHeadings.forEach((heading, index) => {
        if (headingsData[index]) {
          heading.id = headingsData[index].id;
          // Add smooth scroll offset with CSS
          heading.style.scrollMarginTop = '120px';
        }
      });
    }, 500); // Longer delay to ensure content is fully rendered
  }, [content]);

  // Don't render if no headings
  if (headings.length === 0) return null;

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden mb-8 xl:hidden">
      {/* Header */}
      <div
        className="px-6 py-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-white font-anton text-xl uppercase">
          Table of Contents
        </h3>
        <button className="text-white p-1">
          {isCollapsed ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronUp className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white"
          >
            <nav className="px-6 py-6">
              <ul className="space-y-4">
                {headings.map((heading, index) => (
                  <li key={heading.id}>
                    {/* Use anchor links instead of JavaScript */}
                    <a
                      href={`#${heading.id}`}
                      onClick={() => {
                        // Close TOC when link is clicked
                        setTimeout(() => setIsCollapsed(true), 100);
                      }}
                      className={`block py-2 transition-colors duration-200 hover:text-[#1a1a1a] ${
                        heading.level === 2
                          ? 'text-lg font-semibold text-gray-800 font-roboto'
                          : heading.level === 3
                          ? 'text-base text-red-600 ml-4 font-roboto'
                          : 'text-base text-gray-700 ml-8 font-roboto'
                      }`}
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Troubleshooting note */}
              <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
                💡 Using native anchor links for reliable navigation
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTableOfContents;
