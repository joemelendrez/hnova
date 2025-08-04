// src/app/layout.js - React 19 + Next.js 15 compatible
import { Roboto, Anton } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import LoadingScreen from '@/components/LoadingScreen'
import { CartProvider } from './hooks/useShopifyCart'
import { LoadingProvider, useLoading } from './hooks/useLoading'

// Load Roboto for body text
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap', // Better font loading performance
})

// Load Anton for headings
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap', // Better font loading performance
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${anton.variable} antialiased`}>
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