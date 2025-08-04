// src/app/layout.js - Completely SSR-safe version
import { Roboto, Anton } from 'next/font/google'
import './globals.css'
import ClientWrapper from '@/components/ClientWrapper'

// Load Roboto for body text
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

// Load Anton for headings
const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap',
})

export const metadata = {
  title: 'Habit Nova - Transform Your Habits',
  description: 'Evidence-based strategies to break bad habits and build life-changing routines',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${anton.variable} antialiased`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}