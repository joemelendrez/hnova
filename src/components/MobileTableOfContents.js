// src/components/MobileTableOfContents.js
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

const MobileTableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  
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
  
  // Scroll to heading
  const scrollToHeading = (id) => {
    console.log('Mobile TOC - Clicking heading:', id); // Debug log
    
    const element = document.getElementById(id);
    if (element) {
      console.log('Mobile TOC - Found element:', element); // Debug log
      
      // Highlight the target heading briefly
      element.style.backgroundColor = '#f3f4f6';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 1000);
      
      // Calculate scroll position with offset
      const yOffset = -100; // Offset for fixed header
      const elementTop = element.getBoundingClientRect().top;
      const absoluteElementTop = elementTop + window.pageYOffset;
      const middle = absoluteElementTop + yOffset;
      
      // Scroll to the element
      window.scrollTo({
        top: middle,
        behavior: 'smooth'
      });
      
      setIsCollapsed(true); // Collapse after clicking
    } else {
      console.log('Mobile TOC - Element not found:', id); // Debug log
      
      // Fallback: try to find heading by text content
      const allHeadings = document.querySelectorAll('#article-content h2, #article-content h3, #article-content h4');
      const targetHeading = headings.find(h => h.id === id);
      
      if (targetHeading) {
        const matchingElement = Array.from(allHeadings).find(h =>
          h.textContent.trim() === targetHeading.text
        );
        
        if (matchingElement) {
          console.log('Mobile TOC - Found by text match:', matchingElement);
          matchingElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          setIsCollapsed(true); // Collapse after clicking
        }
      }
    }
  };
  
  // Don't render if no headings
  if (headings.length === 0) return null;
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 xl:hidden">
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
                      className={`text-left w-full py-2 px-3 rounded-lg transition-all duration-200 hover:bg-gray-200 text-gray-700 hover:text-[#1a1a1a] ${
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

export default MobileTableOfContents;