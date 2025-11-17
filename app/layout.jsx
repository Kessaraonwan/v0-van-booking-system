import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata = {
  title: 'Van Booking System - จองรถตู้ออนไลน์',
  description: 'ระบบจองรถตู้ออนไลน์ ค้นหาและจองที่นั่งได้ง่าย รวดเร็ว ปลอดภัย',
  generator: 'v0.app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
