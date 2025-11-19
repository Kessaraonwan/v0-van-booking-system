import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled

  // ตรวจสอบ authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      // ถ้าไม่มี token ให้ redirect ไปหน้า login
      router.push('/login?redirect=/bookings')
      return
    }
    
    // TODO: เชื่อมฐานข้อมูลจริงที่นี่
    // Fetch user bookings from database
    // const data = await fetchUserBookings()
    // setBookings(data)
    setLoading(false)
  }, [router])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            จองแล้ว
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            เสร็จสิ้น
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิกแล้ว
          </span>
        )
      default:
        return null
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return booking.status === 'BOOKED'
    if (filter === 'completed') return booking.status === 'COMPLETED'
    if (filter === 'cancelled') return booking.status === 'CANCELLED'
    return true
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>การจองของฉัน - VanGo</title>
      </Head>

      <Navbar showAuth={false} showBookings={false} />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">รายการจองของคุณ</h1>
              <p className="text-white/90 text-lg">ตรวจสอบและจัดการการจองของคุณได้ที่นี่</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex gap-2 border border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                ทั้งหมด
              </span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'upcoming'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                กำลังมาถึง
              </span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                เดินทางแล้ว
              </span>
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                ยกเลิกแล้ว
              </span>
            </button>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 font-medium text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Booking Info */}
                    <div className="flex-1 p-8">
                      {/* Header with Status */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-mono text-gray-500">รหัสการจอง</span>
                            <div className="text-lg font-bold text-gray-900">#{booking.bookingNumber}</div>
                          </div>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>

                      {/* Route */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-100">
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">เส้นทาง</div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {booking.origin} → {booking.destination}
                            </h3>
                          </div>
                        </div>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">วันที่</div>
                              <div className="font-semibold text-gray-900">{booking.date}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">เวลา</div>
                              <div className="font-semibold text-gray-900">{booking.departureTime}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">ที่นั่ง</div>
                              <div className="font-semibold text-gray-900">{booking.seats}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">ราคารวม</div>
                              <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">฿{booking.totalPrice}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="lg:w-64 bg-gradient-to-br from-gray-50 to-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200 p-8 flex flex-col justify-center gap-4">
                      {/* Show Payment Button if UNPAID */}
                      {booking.payment_status === 'UNPAID' && booking.status !== 'CANCELLED' && (
                        <Link href={`/payments/${booking.id}`} className="w-full">
                          <Button className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg shadow-green-200 animate-pulse">
                            <span className="flex items-center gap-2">
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              💳 ชำระเงิน
                            </span>
                          </Button>
                        </Link>
                      )}
                      
                      {/* Pending Verification */}
                      {booking.payment_status === 'PENDING_VERIFICATION' && (
                        <div className="w-full h-12 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-lg flex items-center justify-center">
                          <span className="flex items-center gap-2 text-yellow-800 font-bold text-sm">
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            รอตรวจสอบสลิป
                          </span>
                        </div>
                      )}

                      {/* Pending Offline Payment */}
                      {booking.payment_status === 'PENDING_OFFLINE' && (
                        <div className="w-full h-12 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-400 rounded-lg flex items-center justify-center">
                          <span className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            รอชำระที่ศูนย์
                          </span>
                        </div>
                      )}
                      
                      {/* Show Paid Badge if PAID */}
                      {booking.payment_status === 'PAID' && (
                        <div className="w-full h-12 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                          <span className="flex items-center gap-2 text-green-700 font-bold">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ชำระแล้ว
                          </span>
                        </div>
                      )}

                      {/* Rejected Badge */}
                      {booking.payment_status === 'REJECTED' && (
                        <div className="w-full h-12 bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 rounded-lg flex items-center justify-center">
                          <span className="flex items-center gap-2 text-red-700 font-bold text-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            สลิปไม่ถูกต้อง
                          </span>
                        </div>
                      )}

                      <Link href={`/booking-detail/${booking.id}`} className="w-full">
                        <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-orange-200">
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ดูรายละเอียด
                          </span>
                        </Button>
                      </Link>
                      {booking.status === 'BOOKED' && booking.payment_status === 'UNPAID' && (
                        <Button 
                          variant="outline" 
                          className="w-full h-12 text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-300 font-semibold"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            ยกเลิกการจอง
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100">
              <div className="text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filter === 'all' 
                    ? 'ยังไม่มีการจอง'
                    : filter === 'upcoming'
                    ? 'ไม่มีการจองที่กำลังจะมาถึง'
                    : filter === 'completed'
                    ? 'ไม่มีการจองที่เสร็จสิ้น'
                    : 'ไม่มีการจองที่ยกเลิก'
                  }
                </h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  {filter === 'all' 
                    ? 'เริ่มต้นการเดินทางของคุณด้วยการจองรถตู้กับเรา'
                    : 'ลองเปลี่ยนตัวกรองเพื่อดูการจองอื่นๆ หรือค้นหาเที่ยวรถใหม่'
                  }
                </p>
                <Link href="/search">
                  <Button size="lg" className="mt-4 h-14 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200">
                    <span className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      ค้นหาเที่ยวรถ
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
