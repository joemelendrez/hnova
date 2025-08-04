// src/app/layout.js - Updated with Loading System
import { Roboto, Anton } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import LoadingScreen from '@/components/LoadingScreen'
import { CartProvider } from './hooks/useShopifyCart'
import { LoadingProvider, useLoading } from './hooks/useLoading'
import { AnimatePresence } from 'framer-motion'

// Load Roboto for body text
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

// Load Anton for headings
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
})

export const metadata = {
  title: 'Habit Nova - Transform Your Habits',
  description: 'Evidence-based strategies to break bad habits and build life-changing routines',
}

// Main layout wrapper to access loading context
function LayoutContent({ children }) {
  const { isLoading } = useLoading();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <LoadingScreen isVisible={isLoading} />
      </AnimatePresence>
      
      <Header />
      <main className="relative">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${anton.variable}`}>
        <CartProvider>
          <LoadingProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </LoadingProvider>
        </CartProvider>
      </body>
    </html>
  )
}