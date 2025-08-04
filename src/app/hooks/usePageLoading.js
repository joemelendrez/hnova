// src/app/hooks/usePageLoading.js
'use client';
import { useEffect } from 'react';
import { useLoading } from './useLoading';

// Custom hook for pages with API calls
export const usePageLoading = (isDataLoading = false, dependencies = []) => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isDataLoading) {
      showLoading();
    } else {
      // Add a small delay to prevent flash
      const timer = setTimeout(() => {
        hideLoading();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isDataLoading, showLoading, hideLoading]);

  // Also show loading when dependencies change (for refetching)
  useEffect(() => {
    if (dependencies.some(dep => dep)) {
      showLoading();
    }
  }, dependencies);

  return { showLoading, hideLoading };
};

// Hook specifically for API calls
export const useApiLoading = () => {
  const { showLoading, hideLoading } = useLoading();

  const withLoading = async (apiCall) => {
    try {
      showLoading();
      const result = await apiCall();
      
      // Minimum loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return result;
    } finally {
      hideLoading();
    }
  };

  return { withLoading, showLoading, hideLoading };
};