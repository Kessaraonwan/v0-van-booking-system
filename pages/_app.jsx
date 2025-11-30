import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { getUser } from '@/lib/api-client'

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const user = getUser()
    if (user && user.role && typeof user.role === 'string') {
      const role = user.role.toLowerCase()
      const path = window.location.pathname || '/'
      // Only redirect admins when they explicitly visit the admin root
      // (e.g. /admin or /admin/login). Do not force-redirect from site root '/'.
      if (role === 'admin' && (path === '/admin' || path === '/admin/login')) {
        router.replace('/admin/dashboard')
      }
    }
  }, [router])

  return (
    <div className={`${geist.className} font-sans antialiased`}>
      <Component {...pageProps} />
      <Toaster />
      <Analytics />
    </div>
  )
}
