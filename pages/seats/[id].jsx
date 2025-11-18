import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SeatSelectionPage() {
  const router = useRouter()
  const { id } = router.query
  
  const [selectedSeats, setSelectedSeats] = useState([])
  const [scheduleData, setScheduleData] = useState(null)
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)

  // TODO: เชื่อมฐานข้อมูลจริงที่นี่
  useEffect(() => {
    if (id) {
      // Fetch schedule and seat data
      // const schedule = await fetchScheduleById(id)
      // const seatData = await fetchSeats(id)
      // setScheduleData(schedule)
      // setSeats(seatData)
      setLoading(false)
    }
  }, [id])

  const toggleSeat = (seatNumber) => {
    setSelectedSeats(prev => 
      prev.includes(seatNumber) 
        ? prev.filter(num => num !== seatNumber)
        : [...prev, seatNumber]
    )
  }

  const getSeatStatus = (seatNumber) => {
    if (seats.find(s => s.number === seatNumber)?.status === 'booked') return 'booked'
    if (selectedSeats.includes(seatNumber)) return 'selected'
    return 'available'
  }

  const getSeatColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 hover:bg-green-200 text-green-800 border-2 border-green-300 cursor-pointer'
      case 'booked': return 'bg-gray-200 text-gray-500 cursor-not-allowed border-2 border-gray-300'
      case 'selected': return 'bg-blue-600 text-white border-2 border-blue-700 shadow-md'
      default: return 'bg-green-100 border-2 border-green-300'
    }
  }

  const pricePerSeat = scheduleData?.price || 0
  const totalPrice = selectedSeats.length * pricePerSeat

  const handleConfirm = () => {
    if (selectedSeats.length > 0) {
      router.push({
        pathname: '/confirm',
        query: { 
          scheduleId: id, 
          seats: selectedSeats.join(','),
          total: totalPrice
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar showAuth={false} showBookings={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 font-medium">กำลังโหลดข้อมูลที่นั่ง...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>เลือกที่นั่ง - VanGo</title>
      </Head>
      
      <Navbar showAuth={false} showBookings={true} />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/search" className="hover:text-white transition-colors">ค้นหา</Link>
            <span>›</span>
            <span className="text-white font-medium">เลือกที่นั่ง</span>
          </div>

          {/* Trip Info */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">เลือกที่นั่งของคุณ</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{scheduleData?.origin || 'กรุงเทพ'} → {scheduleData?.destination || 'พัทยา'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{scheduleData?.date || '18 พ.ย. 2025'}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{scheduleData?.departureTime || '09:00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left: Seat Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              {/* Card Header with Gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-6">
                <h2 className="text-2xl font-bold">แผนผังที่นั่ง</h2>
                <p className="text-white/80 mt-1">เลือกที่นั่งที่คุณต้องการ</p>
              </div>

              <div className="p-8">
                {/* Driver Section */}
                <div className="relative bg-gradient-to-br from-orange-100 via-orange-50 to-red-50 rounded-2xl p-6 text-center mb-12 border-2 border-orange-200">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full border-2 border-orange-300">
                    <span className="text-sm font-semibold text-orange-600">หน้ารถ</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-gray-700 font-medium mt-2">
                    <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    <span>คนขับ</span>
                  </div>
                </div>

                {/* Seat Grid - 4 columns x 3 rows = 12 seats */}
                <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-10">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(seatNumber => {
                    const status = getSeatStatus(seatNumber)
                    const isSelected = status === 'selected'
                    const isBooked = status === 'booked'
                    
                    return (
                      <button
                        key={seatNumber}
                        onClick={() => status !== 'booked' && toggleSeat(seatNumber)}
                        disabled={isBooked}
                        className={`
                          aspect-square rounded-2xl font-bold text-lg transition-all duration-200
                          ${isSelected 
                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200 scale-105 border-2 border-orange-400' 
                            : isBooked 
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-300'
                              : 'bg-gradient-to-br from-green-50 to-emerald-50 text-gray-700 hover:from-green-100 hover:to-emerald-100 hover:scale-105 hover:shadow-md border-2 border-green-300'
                          }
                          relative group
                        `}
                      >
                        <span className="relative z-10">{seatNumber}</span>
                        {isSelected && (
                          <svg className="absolute top-1 right-1 w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Legend with Icons */}
                <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">ว่าง</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 border-2 border-orange-400 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">เลือกแล้ว</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">จองแล้ว</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 sticky top-24">
              {/* Summary Header with Gradient */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-5">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-xl font-bold">สรุปการจอง</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Trip Details */}
                <div className="space-y-4">
                  {/* Route */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">เส้นทาง</div>
                        <div className="font-bold text-gray-900 text-lg">
                          {scheduleData?.origin || 'กรุงเทพ'} → {scheduleData?.destination || 'พัทยา'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">วันที่</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {scheduleData?.date || 'วันนี้'}
                      </div>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs">เวลา</span>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {scheduleData?.departureTime || '09:00'}
                      </div>
                    </div>
                  </div>

                  {/* Selected Seats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">ที่นั่งที่เลือก</div>
                        {selectedSeats.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedSeats.sort((a, b) => a - b).map(seat => (
                              <span key={seat} className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm shadow-sm">
                                {seat}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic">ยังไม่ได้เลือกที่นั่ง</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      ราคาต่อที่นั่ง
                    </span>
                    <span className="font-semibold">฿{pricePerSeat || 150}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      จำนวนที่นั่ง
                    </span>
                    <span className="font-semibold">× {selectedSeats.length}</span>
                  </div>
                  <div className="h-px bg-gray-300"></div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-bold text-lg">ราคารวม</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      ฿{totalPrice}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200 transition-all duration-200"
                    disabled={selectedSeats.length === 0}
                    onClick={handleConfirm}
                  >
                    {selectedSeats.length === 0 ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        กรุณาเลือกที่นั่ง
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ยืนยันการจอง ({selectedSeats.length} ที่นั่ง)
                      </span>
                    )}
                  </Button>

                  <Link href="/search">
                    <Button variant="outline" size="lg" className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        กลับไปค้นหา
                      </span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
