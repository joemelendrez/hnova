// src/app/admin/layout.js - Admin layout without loading provider
import { Roboto, Anton } from 'next/font/google'

// Load fonts
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-anton',
  display: 'swap',
})

export default function AdminLayout({ children }) {
  return (
    <div className={`${roboto.variable} ${anton.variable} antialiased`}>
      {children}
    </div>
  )
}