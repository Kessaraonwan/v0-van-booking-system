import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SearchResultsPage() {
  const router = useRouter()
  const { from, to, date } = router.query
  
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)

  // TODO: เชื่อมฐานข้อมูลจริงที่นี่
  useEffect(() => {
    // Fetch schedules from database based on query params
    // const data = await fetchSchedules(from, to, date)
    // setSchedules(data)
    setLoading(false)
  }, [from, to, date])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">ผลการค้นหา</h1>
              <p className="text-gray-600">
                {from && to ? (
                  <>
                    <span className="font-semibold text-gray-900">{from} → {to}</span>
                    {date && <> | วันที่: <span className="font-semibold text-gray-900">{date}</span></>}
                  </>
                ) : (
                  <span className="text-gray-400">กรุณาระบุเส้นทางและวันที่</span>
                )}
              </p>
            </div>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="border-gray-300">
                แก้ไขการค้นหา
              </Button>
            </Link>
          </div>
        </div>

        {/* Trip Listings */}
        <div className="space-y-4 max-w-5xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">กำลังค้นหาเที่ยวรถ...</p>
            </div>
          ) : schedules.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-600">
                  พบ <span className="text-gray-900 font-bold">{schedules.length}</span> เที่ยวรถ
                </h2>
              </div>

              {schedules.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Left: Trip Info */}
                    <div className="flex-1 space-y-4">
                      {/* Route */}
                      <h3 className="text-xl font-bold text-gray-900">
                        {schedule.origin || from} → {schedule.destination || to}
                      </h3>

                      {/* Time */}
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{schedule.departureTime}</div>
                          <div className="text-sm text-gray-600">ออกเดินทาง</div>
                        </div>
                        
                        <div className="flex-1 max-w-[120px] relative">
                          <div className="border-t-2 border-dashed border-gray-300"></div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{schedule.arrivalTime}</div>
                          <div className="text-sm text-gray-600">ถึงปลายทาง</div>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span>{schedule.vanType || 'รถตู้ VIP'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>เหลือที่นั่ง: <span className="font-semibold text-gray-900">{schedule.availableSeats}</span> ที่</span>
                        </div>
                        {schedule.duration && (
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{schedule.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Price & Button */}
                    <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:min-w-[180px]">
                      <div className="text-center lg:text-right flex-1 lg:flex-none">
                        <p className="text-sm text-gray-600 mb-1">ราคา</p>
                        <p className="text-3xl font-bold text-blue-600">฿{schedule.price}</p>
                      </div>
                      
                      <Link href={`/seats/${schedule.id}`} className="w-full lg:w-auto">
                        <Button 
                          size="lg" 
                          disabled={schedule.availableSeats === 0}
                          className="w-full lg:min-w-[140px]"
                        >
                          {schedule.availableSeats === 0 ? 'เต็มแล้ว' : 'เลือกที่นั่ง'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="text-center space-y-4">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">ไม่พบเที่ยวรถ</h2>
                <p className="text-gray-600">
                  ขออภัย ไม่พบเที่ยวรถที่ตรงกับการค้นหาของคุณ<br />
                  กรุณาลองเปลี่ยนวันที่หรือเส้นทาง
                </p>
                <Link href="/">
                  <Button variant="outline" className="border-gray-300 mt-4">
                    กลับหน้าแรก
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
