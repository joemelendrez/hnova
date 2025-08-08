// src/components/MobileTableOfContents.js - Native Scroll Version
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const MobileTableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Extract headings from the actual DOM
  useEffect(() => {
    if (!content) return;

    // Wait for DOM to be fully ready
    const timer = setTimeout(() => {
      // Get the actual headings from the already-rendered content
      const actualHeadings = document.querySelectorAll(
        '#article-content h2, #article-content h3, #article-content h4'
      );

      if (actualHeadings.length === 0) {
        console.log('No headings found');
        return;
      }

      const headingsData = Array.from(actualHeadings).map((heading, index) => {
        const text = heading.textContent || '';
        const level = parseInt(heading.tagName.charAt(1));

        // Check if heading already has an ID
        let id = heading.id;

        // If no ID, create one using the same pattern as BlogPostClient
        if (!id) {
          id = `heading-${index}`;
          heading.id = id;
        }

        return {
          id,
          text: text.trim(),
          level,
        };
      });

      setHeadings(headingsData);
      console.log('Found headings:', headingsData);
    }, 1500);

    return () => clearTimeout(timer);
  }, [content]);

  // Set scroll margin on headings after they're identified
  useEffect(() => {
    if (headings.length === 0) return;

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) {
        // Set scroll margin for smooth scroll with fixed header
        element.style.scrollMarginTop = '-300px';
        element.style.paddingTop = '-201110px';
      }
    });
  }, [headings]);

  // Simple click handler that uses browser's native scroll
  const handleHeadingClick = (headingId, event) => {
    event.preventDefault();

    console.log(`Clicking heading: ${headingId}`);

    // Close TOC first
    setIsCollapsed(true);

    // Small delay to let TOC close, then scroll
    setTimeout(() => {
      const element = document.getElementById(headingId);
      if (element) {
        console.log('Found element, scrolling...');
        // Use browser's native smooth scroll
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
      } else {
        console.error(`Element ${headingId} not found`);
      }
    }, 100);
  };

  // Don't render if no headings
  if (headings.length === 0) {
    return null;
  }

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
        <button
          className="text-white p-1"
          aria-label="Toggle table of contents"
        >
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
                  <li key={`${heading.id}-${index}`}>
                    {/* Use regular anchor link with preventDefault and custom handler */}
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => handleHeadingClick(heading.id, e)}
                      className={`block w-full text-left py-2 px-2 rounded transition-colors duration-200 hover:bg-gray-100 hover:text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#1a1a1a] focus:ring-offset-2 no-underline ${
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTableOfContents;
