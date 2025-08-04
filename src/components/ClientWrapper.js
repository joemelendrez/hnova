// src/components/ClientWrapper.js - Client-only wrapper
'use client';
import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import LoadingScreen from './LoadingScreen';
import { CartProvider } from '../app/hooks/useShopifyCart';
import { LoadingProvider, useLoading } from '../app/hooks/useLoading';

// Loading wrapper component
function LoadingWrapper({ children }) {
  const { isLoading } = useLoading();

  return (
    <>
      <LoadingScreen isVisible={isLoading} />
      <Header />
      <main className="relative">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

// Main client wrapper
export default function ClientWrapper({ children }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return minimal content during SSR
  if (!mounted) {
    return (
      <>
        <Header />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  // Full client-side experience after hydration
  return (
    <CartProvider>
      <LoadingProvider>
        <LoadingWrapper>
          {children}
        </LoadingWrapper>
      </LoadingProvider>
    </CartProvider>
  );
}