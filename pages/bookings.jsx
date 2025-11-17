import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled

  // TODO: เชื่อมฐานข้อมูลจริงที่นี่
  useEffect(() => {
    // Fetch user bookings from database
    // const data = await fetchUserBookings()
    // setBookings(data)
    setLoading(false)
  }, [])

  const getStatusBadge = (status) => {
    switch(status) {
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            จองแล้ว
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            เสร็จสิ้น
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            <span className="w-2 h-2 rounded-full bg-gray-600"></span>
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showAuth={false} showBookings={false} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">การจองของฉัน</h1>
            <p className="text-gray-600">รายการจองทั้งหมดของคุณ</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
              className="whitespace-nowrap"
            >
              ทั้งหมด
            </Button>
            <Button 
              variant={filter === 'upcoming' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('upcoming')}
              className="whitespace-nowrap"
            >
              กำลังจะมาถึง
            </Button>
            <Button 
              variant={filter === 'completed' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('completed')}
              className="whitespace-nowrap"
            >
              เสร็จสิ้น
            </Button>
            <Button 
              variant={filter === 'cancelled' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('cancelled')}
              className="whitespace-nowrap"
            >
              ยกเลิกแล้ว
            </Button>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Booking Info */}
                    <div className="flex-1">
                      {/* Status Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm font-mono text-gray-600">#{booking.bookingNumber}</span>
                        {getStatusBadge(booking.status)}
                      </div>

                      {/* Route */}
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        {booking.origin} → {booking.destination}
                      </h3>
                      
                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{booking.departureTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>ที่นั่ง: {booking.seats}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-bold text-blue-600">฿{booking.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Action Buttons */}
                    <div className="flex sm:flex-row lg:flex-col gap-3 lg:min-w-[160px]">
                      <Link href={`/booking-detail/${booking.id}`} className="flex-1">
                        <Button variant="outline" className="w-full border-gray-300">
                          ดูรายละเอียด
                        </Button>
                      </Link>
                      {booking.status === 'BOOKED' && (
                        <Button 
                          variant="outline" 
                          className="flex-1 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300"
                        >
                          ยกเลิก
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-2">📋</div>
                <h2 className="text-xl font-semibold text-gray-900">ยังไม่มีการจอง</h2>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'คุณยังไม่มีการจองรถตู้'
                    : filter === 'upcoming'
                    ? 'คุณไม่มีการจองที่กำลังจะมาถึง'
                    : filter === 'completed'
                    ? 'คุณไม่มีการจองที่เสร็จสิ้น'
                    : 'คุณไม่มีการจองที่ยกเลิก'
                  }
                </p>
                <Link href="/">
                  <Button className="mt-4">
                    ค้นหาเที่ยวรถ
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
