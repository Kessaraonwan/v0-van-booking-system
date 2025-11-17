import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar({ showAuth = true, showBookings = false }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">VanGo</div>
              <div className="text-xs text-gray-500 -mt-1">จองรถตู้ออนไลน์</div>
            </div>
          </Link>
          
          <nav className="flex items-center gap-4">
            {showBookings && (
              <Link href="/bookings">
                <Button variant="ghost" className="gap-2 text-gray-700">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  การจองของฉัน
                </Button>
              </Link>
            )}
            {showAuth && (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700">เข้าสู่ระบบ</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">สมัครสมาชิก</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
