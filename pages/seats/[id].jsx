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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar showAuth={false} showBookings={true} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-gray-600">กำลังโหลดข้อมูลที่นั่ง...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Link href="/search" className="hover:text-blue-600 transition-colors">ผลการค้นหา</Link>
            <span>›</span>
            <span className="text-gray-900 font-medium">เลือกที่นั่ง</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">เลือกที่นั่งของคุณ</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left: Seat Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {/* Driver Section */}
              <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-xl p-4 text-center mb-12">
                <div className="flex items-center justify-center gap-2 text-gray-600 font-medium">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>หน้ารถ (คนขับ)</span>
                </div>
              </div>

              {/* Seat Grid - 4 columns x 3 rows = 12 seats */}
              <div className="grid grid-cols-4 gap-4 max-w-md mx-auto mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(seatNumber => {
                  const status = getSeatStatus(seatNumber)
                  return (
                    <button
                      key={seatNumber}
                      onClick={() => status !== 'booked' && toggleSeat(seatNumber)}
                      disabled={status === 'booked'}
                      className={`aspect-square rounded-xl font-bold text-lg transition-all ${getSeatColor(status)}`}
                    >
                      {seatNumber}
                    </button>
                  )
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 border-2 border-green-300"></div>
                  <span className="text-sm text-gray-600">ว่าง</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 border-2 border-blue-700"></div>
                  <span className="text-sm text-gray-600">เลือกแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 border-2 border-gray-300"></div>
                  <span className="text-sm text-gray-600">จองแล้ว</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">สรุปการจอง</h2>
              
              <div className="space-y-4 mb-6">
                {/* Route */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">เส้นทาง</div>
                  <div className="font-semibold text-gray-900">
                    {scheduleData?.origin || 'กรุงเทพ'} → {scheduleData?.destination || 'พัทยา'}
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">วันที่ - เวลา</div>
                  <div className="font-semibold text-gray-900">
                    {scheduleData?.date || 'วันนี้'} • {scheduleData?.departureTime || '09:00'}
                  </div>
                </div>

                {/* Selected Seats */}
                <div>
                  <div className="text-sm text-gray-600 mb-1">ที่นั่งที่เลือก</div>
                  <div className="font-semibold text-gray-900">
                    {selectedSeats.length > 0 
                      ? selectedSeats.sort((a, b) => a - b).join(', ')
                      : 'ยังไม่ได้เลือก'}
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>ราคาต่อที่นั่ง</span>
                  <span className="font-medium">฿{pricePerSeat || 150}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-4">
                  <span>จำนวนที่นั่ง</span>
                  <span className="font-medium">× {selectedSeats.length}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-bold pt-4 border-t border-gray-200">
                  <span className="text-gray-900">ราคารวม</span>
                  <span className="text-blue-600">฿{totalPrice}</span>
                </div>
              </div>

              {/* Confirm Button */}
              <Button 
                size="lg" 
                className="w-full mb-3 h-12"
                disabled={selectedSeats.length === 0}
                onClick={handleConfirm}
              >
                {selectedSeats.length === 0 
                  ? 'กรุณาเลือกที่นั่ง' 
                  : `ยืนยันการจอง (${selectedSeats.length} ที่นั่ง)`
                }
              </Button>

              {/* Back Button */}
              <Link href="/search">
                <Button variant="outline" size="lg" className="w-full border-gray-300">
                  กลับ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
