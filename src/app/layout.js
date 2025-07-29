import { Roboto } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Load Roboto for body text
const roboto = Roboto({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

// Load Anton for headings
const anton = localFont({
  src: [
    {
      path: './fonts/Anton-Regular.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: '--font-anton',
})

// Alternative: Use Google Fonts for Anton too
// import { Anton } from 'next/font/google'
// const anton = Anton({ 
//   subsets: ['latin'],
//   weight: ['400'],
//   variable: '--font-anton',
// })

export const metadata = {
  title: 'Habit Nova - Transform Your Habits',
  description: 'Evidence-based strategies to break bad habits and build life-changing routines',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${anton.variable} ${roboto.className}`}>
        <Header />
        <main className="relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}