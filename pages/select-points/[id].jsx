import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { routeAPI, scheduleAPI } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

export default function SelectPointsPage() {
  const router = useRouter()
  const { id } = router.query
  const { toast } = useToast()
  
  const [scheduleData, setScheduleData] = useState(null)
  const [pickupPoints, setPickupPoints] = useState([])
  const [dropoffPoints, setDropoffPoints] = useState([])
  const [selectedPickup, setSelectedPickup] = useState(null)
  const [selectedDropoff, setSelectedDropoff] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
    }
  }, [])

  // Fetch schedule and pickup/dropoff points
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        setLoading(true)
        
        // Fetch schedule details
        const scheduleResponse = await scheduleAPI.getById(id)
        if (scheduleResponse.success) {
          setScheduleData(scheduleResponse.data)
          
          // Fetch pickup points for this route
          const pickupResponse = await routeAPI.getPickupPoints(scheduleResponse.data.route_id)
          if (pickupResponse.success) {
            setPickupPoints(pickupResponse.data || [])
          }
          
          // Fetch dropoff points for this route
          const dropoffResponse = await routeAPI.getDropoffPoints(scheduleResponse.data.route_id)
          if (dropoffResponse.success) {
            setDropoffPoints(dropoffResponse.data || [])
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleConfirm = () => {
    if (!selectedPickup || !selectedDropoff) {
      toast({
        title: 'กรุณาเลือกจุดขึ้น-ลงรถ',
        description: 'คุณต้องเลือกทั้งจุดขึ้นรถและจุดลงรถ',
        variant: 'destructive',
      })
      return
    }

    // Navigate to seat selection with pickup/dropoff points
    router.push({
      pathname: `/seats/${id}`,
      query: {
        pickupPointId: selectedPickup,
        dropoffPointId: selectedDropoff,
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-red-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-700 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const getPickupPoint = (id) => pickupPoints.find(p => p.id === id)
  const getDropoffPoint = (id) => dropoffPoints.find(p => p.id === id)

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>เลือกจุดขึ้น-ลงรถ - VanGo</title>
      </Head>
      
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/search" className="hover:text-white transition-colors">ค้นหา</Link>
            <span>›</span>
            <span className="text-white font-medium">เลือกจุดขึ้น-ลงรถ</span>
          </div>

          {/* Trip Info */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">เลือกจุดขึ้นและจุดลงรถ</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-semibold">{scheduleData?.origin} → {scheduleData?.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{scheduleData?.departure_date}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{scheduleData?.departure_time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left: Point Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pickup Points */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-6">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                  </svg>
                  <div>
                    <h2 className="text-2xl font-bold">จุดขึ้นรถ</h2>
                    <p className="text-white/80 mt-1">เลือกจุดที่คุณต้องการขึ้นรถ</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {pickupPoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>ไม่มีจุดขึ้นรถให้เลือก</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {pickupPoints.map((point) => (
                      <button
                        key={point.id}
                        onClick={() => setSelectedPickup(point.id)}
                        className={`
                          text-left p-5 rounded-2xl border-2 transition-all duration-200
                          ${selectedPickup === point.id
                            ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg shadow-green-100'
                            : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                            ${selectedPickup === point.id
                              ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{point.name}</h3>
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                                {point.pickup_time}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{point.address}</p>
                            {point.landmark && (
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {point.landmark}
                              </p>
                            )}
                          </div>
                          {selectedPickup === point.id && (
                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dropoff Points */}
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-6">
                <div className="flex items-center gap-3">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                  </svg>
                  <div>
                    <h2 className="text-2xl font-bold">จุดลงรถ</h2>
                    <p className="text-white/80 mt-1">เลือกจุดที่คุณต้องการลงรถ</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {dropoffPoints.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>ไม่มีจุดลงรถให้เลือก</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {dropoffPoints.map((point) => (
                      <button
                        key={point.id}
                        onClick={() => setSelectedDropoff(point.id)}
                        className={`
                          text-left p-5 rounded-2xl border-2 transition-all duration-200
                          ${selectedDropoff === point.id
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-pink-50 shadow-lg shadow-red-100'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-50/50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all
                            ${selectedDropoff === point.id
                              ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-md'
                              : 'bg-gray-100 text-gray-600'
                            }
                          `}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-gray-900 text-lg">{point.name}</h3>
                              <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">
                                {point.estimated_arrival}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{point.address}</p>
                            {point.landmark && (
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {point.landmark}
                              </p>
                            )}
                          </div>
                          {selectedDropoff === point.id && (
                            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 sticky top-24">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-5">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h2 className="text-xl font-bold">สรุปการเลือก</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Route */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">เส้นทาง</div>
                      <div className="font-bold text-gray-900 text-lg">
                        {scheduleData?.origin} → {scheduleData?.destination}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Pickup */}
                <div className={`rounded-xl p-4 border-2 ${selectedPickup ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 ${selectedPickup ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">จุดขึ้นรถ</div>
                      {selectedPickup ? (
                        <>
                          <div className="font-bold text-gray-900">{getPickupPoint(selectedPickup)?.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{getPickupPoint(selectedPickup)?.pickup_time}</div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm italic">ยังไม่ได้เลือก</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Dropoff */}
                <div className={`rounded-xl p-4 border-2 ${selectedDropoff ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-start gap-3">
                    <svg className={`w-5 h-5 mt-0.5 ${selectedDropoff ? 'text-red-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
                    </svg>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 mb-1">จุดลงรถ</div>
                      {selectedDropoff ? (
                        <>
                          <div className="font-bold text-gray-900">{getDropoffPoint(selectedDropoff)?.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{getDropoffPoint(selectedDropoff)?.estimated_arrival}</div>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm italic">ยังไม่ได้เลือก</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    size="lg" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200"
                    disabled={!selectedPickup || !selectedDropoff}
                    onClick={handleConfirm}
                  >
                    {(!selectedPickup || !selectedDropoff) ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        กรุณาเลือกจุดขึ้น-ลงรถ
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        ไปเลือกที่นั่ง
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
