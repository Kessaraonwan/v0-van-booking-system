import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export default function Navbar({ showAuth = true, showBookings = false }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // เช็คว่ามี user ล็อกอินอยู่หรือไม่
    const checkUser = () => {
      try {
        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('accessToken')
        
        if (userData && token) {
          setUser(JSON.parse(userData))
        }
      } catch (error) {
        console.error('Error checking user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    // ฟังการเปลี่ยนแปลงของ localStorage
    window.addEventListener('storage', checkUser)
    return () => window.removeEventListener('storage', checkUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
    
    toast({
      title: 'ออกจากระบบสำเร็จ',
      description: 'แล้วพบกันใหม่ครับ',
    })

    router.push('/')
  }

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
            {(user || showBookings) && (
              <Link href="/bookings" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
                การจองของฉัน
              </Link>
            )}
            <Link href="/#about" className="text-gray-700 hover:text-red-500 font-medium transition-colors">
              เกี่ยวกับเรา
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white font-semibold">
                        {user.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{user.full_name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleLogout}
                      variant="ghost" 
                      className="text-gray-700 hover:text-red-500 font-medium"
                    >
                      ออกจากระบบ
                    </Button>
                  </>
                ) : showAuth && (
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
