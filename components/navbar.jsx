import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar({ showAuth = true, showBookings = false }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="VanGo Logo" 
              className="h-40 w-auto"
            />
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
              หน้าแรก
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
              ค้นหาเที่ยวรถ
            </Link>
            {showBookings && (
              <Link href="/bookings" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
                การจองของฉัน
              </Link>
            )}
            <Link href="/#about" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
              เกี่ยวกับเรา
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {showAuth && (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-red-500 font-medium">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 rounded-xl shadow-md">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
