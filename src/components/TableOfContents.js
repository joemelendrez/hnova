// src/components/TableOfContents.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Extract headings from HTML content
  useEffect(() => {
    if (!content) return;

    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Extract headings (h2, h3, h4)
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

  // Add IDs to actual headings in the DOM and set up intersection observer
  useEffect(() => {
    if (headings.length === 0) return;

    // Add IDs to actual headings in the rendered content
    const actualHeadings = document.querySelectorAll('#article-content h2, #article-content h3, #article-content h4');
    actualHeadings.forEach((heading, index) => {
      if (headings[index]) {
        heading.id = headings[index].id;
        heading.scrollMarginTop = '100px'; // Offset for fixed header
      }
    });

    // Set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0.1,
      }
    );

    actualHeadings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      actualHeadings.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, [headings]);

  // Scroll to heading
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Don't render if no headings
  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 sticky top-24 z-10">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <List className="h-5 w-5 text-[#1a1a1a]" />
          <h3 className="text-lg font-semibold text-[#1a1a1a]">Table of Contents</h3>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded transition-colors">
          {isCollapsed ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Table of Contents List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <nav>
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`text-left w-full py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-200 ${
                        activeId === heading.id
                          ? 'bg-[#1a1a1a] text-white font-medium'
                          : 'text-gray-700 hover:text-[#1a1a1a]'
                      } ${
                        heading.level === 2 ? 'text-base font-medium' :
                        heading.level === 3 ? 'text-sm ml-4' :
                        'text-sm ml-8'
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
    </div>
  );
};

export default TableOfContents;