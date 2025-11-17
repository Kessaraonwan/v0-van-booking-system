import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function App({ Component, pageProps }) {
  return (
    <div className={`${geist.className} font-sans antialiased`}>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </div>
  )
}
