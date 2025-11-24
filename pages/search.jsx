import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getPickupLocation, getDropoffLocation, formatThaiDate, formatTime } from '@/lib/locations'

export default function SearchResultsPage() {
  const router = useRouter()
  const { from: queryFrom, to: queryTo, date: queryDate } = router.query
  
  const [schedules, setSchedules] = useState([])
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceFilter, setPriceFilter] = useState('all')
  const [sortBy, setSortBy] = useState('time')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Search form state
  const [searchFrom, setSearchFrom] = useState(queryFrom || '')
  const [searchTo, setSearchTo] = useState(queryTo || '')
  const [searchDate, setSearchDate] = useState(queryDate || new Date().toISOString().split('T')[0])

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    setIsAuthenticated(!!token)
  }, [])

  // Fetch routes for dropdowns
  useEffect(() => {
    fetch('http://localhost:8080/api/routes')
      .then(res => res.json())
      .then(data => {
        setRoutes(data.data || [])
      })
      .catch(err => console.error('Error fetching routes:', err))
  }, [])

  // Fetch schedules - show all if no search params, otherwise filter
  useEffect(() => {
    setLoading(true)
    
    // If user has search criteria, use filtered API
    const url = (queryFrom && queryTo && queryDate)
      ? `http://localhost:8080/api/schedules?from=${queryFrom}&to=${queryTo}&date=${queryDate}`
      : 'http://localhost:8080/api/schedules'
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setSchedules(data.data || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching schedules:', err)
        setLoading(false)
      })
  }, [queryFrom, queryTo, queryDate])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchFrom && searchTo && searchDate) {
      router.push(`/search?from=${encodeURIComponent(searchFrom)}&to=${encodeURIComponent(searchTo)}&date=${searchDate}`)
    }
  }

  const handleSelectSeats = (scheduleId) => {
    if (!isAuthenticated) {
      // Save intended destination
      localStorage.setItem('redirectAfterLogin', `/select-points/${scheduleId}`)
      router.push('/login')
    } else {
      router.push(`/select-points/${scheduleId}`)
    }
  }

  // Get unique origins and destinations
  const origins = [...new Set(routes.map(r => r.origin))]
  const destinations = [...new Set(routes.map(r => r.destination))]

  const filteredSchedules = schedules.filter(schedule => {
    const price = schedule.price || schedule.route?.base_price || 0
    if (priceFilter === 'all') return true
    if (priceFilter === 'low') return price <= 150
    if (priceFilter === 'mid') return price > 150 && price <= 200
    if (priceFilter === 'high') return price > 200
    return true
  }).sort((a, b) => {
    const priceA = a.price || a.route?.base_price || 0
    const priceB = b.price || b.route?.base_price || 0
    if (sortBy === 'time') return new Date(a.departure_time) - new Date(b.departure_time)
    if (sortBy === 'price-low') return priceA - priceB
    if (sortBy === 'price-high') return priceB - priceA
    return 0
  })

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        {/* Search Form */}
        <div className="relative overflow-hidden rounded-3xl mb-8 bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">ค้นหาเที่ยวรถตู้</h1>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* From */}
              <div>
                <label className="block text-sm font-medium mb-2">จาก</label>
                <select
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-transparent focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
                  required
                >
                  <option value="">เลือกจุดขึ้นรถ</option>
                  {origins.map(origin => (
                    <option key={origin} value={origin}>{origin}</option>
                  ))}
                </select>
              </div>

              {/* To */}
              <div>
                <label className="block text-sm font-medium mb-2">ไป</label>
                <select
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-transparent focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
                  required
                >
                  <option value="">เลือกจุดลงรถ</option>
                  {destinations.map(dest => (
                    <option key={dest} value={dest}>{dest}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">วันที่เดินทาง</label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white border-2 border-transparent focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all"
                  required
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-white text-orange-600 hover:bg-gray-50 font-semibold py-3 shadow-md hover:shadow-lg transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  ค้นหา
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Compact Dropdowns */}
          <div className="flex flex-wrap gap-3 lg:hidden">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-600 mb-1 ml-1">เรียงตาม</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="time">เวลาออกเดินทาง</option>
                <option value="price-low">ราคาต่ำ - สูง</option>
                <option value="price-high">ราคาสูง - ต่ำ</option>
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-600 mb-1 ml-1">ช่วงราคา</label>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="all">ทั้งหมด</option>
                <option value="low">฿0 - ฿150</option>
                <option value="mid">฿150 - ฿200</option>
                <option value="high">฿200+</option>
              </select>
            </div>
          </div>

          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block lg:w-64 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">เรียงตาม</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="time">เวลาออกเดินทาง</option>
                <option value="price-low">ราคาต่ำ - สูง</option>
                <option value="price-high">ราคาสูง - ต่ำ</option>
              </select>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">ช่วงราคา</h3>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-900 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              >
                <option value="all">ทั้งหมด</option>
                <option value="low">฿0 - ฿150</option>
                <option value="mid">฿150 - ฿200</option>
                <option value="high">฿200+</option>
              </select>
            </div>
          </aside>

          {/* Trip Listings */}
          <div className="flex-1 space-y-5">
            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <p className="text-gray-600 text-lg">กำลังค้นหาเที่ยวรถ...</p>
              </div>
            ) : filteredSchedules.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-gray-700">
                    พบ <span className="text-gray-900 font-bold text-xl">{filteredSchedules.length}</span> เที่ยวรถ
                  </h2>
                </div>

                {filteredSchedules.map((schedule) => {
                  // หา route ที่ตรงกับ schedule
                  const matchedRoute = routes.find(r => 
                    r.origin === schedule.origin && r.destination === schedule.destination
                  ) || schedule.route || {}
                  
                  const van = schedule.van || {}
                  const availableSeats = schedule.available_seats || 0
                  const totalSeats = schedule.total_seats || van.total_seats || 13
                  const price = schedule.price || matchedRoute.base_price || 0
                  
                  // ใช้ origin/destination จาก schedule
                  const origin = schedule.origin || matchedRoute.origin || ''
                  const destination = schedule.destination || matchedRoute.destination || ''
                  
                  // เลือกรูปภาพตามปลายทาง
                  const getRouteImage = () => {
                    return matchedRoute.image_url || null
                  }
                  
                  return (
                    <div 
                      key={schedule.id} 
                      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Route Image */}
                        <div className="md:w-72 h-52 md:h-auto relative overflow-hidden">
                          {getRouteImage() ? (
                            <img 
                              src={getRouteImage()} 
                              alt={`${origin} ถึง ${destination}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                              <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-sm">ไม่มีรูปภาพ</p>
                              </div>
                            </div>
                          )}
                          {availableSeats <= 3 && availableSeats > 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              เหลือไม่กี่ที่!
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                            {/* Left: Route & Time */}
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {origin} → {destination}
                              </h3>
                              
                              {/* จุดขึ้น-ลงรถ */}
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2 text-sm">
                                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-gray-600">ขึ้นรถ:</span>
                                  <span className="font-semibold text-gray-900">{getPickupLocation(origin).name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm mt-1.5">
                                  <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-gray-600">ลงรถ:</span>
                                  <span className="font-semibold text-gray-900">{getDropoffLocation(destination).name}</span>
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-500 mb-5 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                {schedule.license_plate || van.license_plate || 'รถตู้ VIP'} • {van.type || 'ปรับอากาศ'}
                              </p>

                              <div className="grid grid-cols-2 gap-6 mb-5">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">เวลาออกเดินทาง</p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {formatTime(schedule.departure_time)}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatThaiDate(schedule.departure_date)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">ที่นั่งว่าง</p>
                                  <p className="text-xl font-bold text-gray-900">
                                    {availableSeats} ที่นั่ง
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    จาก {totalSeats} ที่นั่ง
                                  </p>
                                </div>
                              </div>

                              {(schedule.duration_minutes || matchedRoute.duration) && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>ระยะเวลาเดินทาง: <span className="font-medium text-gray-900">
                                    {schedule.duration_minutes ? `${Math.floor(schedule.duration_minutes / 60)} ชั่วโมง ${schedule.duration_minutes % 60} นาที` : matchedRoute.duration}
                                  </span></span>
                                </div>
                              )}
                            </div>

                            {/* Right: Price & Button */}
                            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-5 lg:pt-0 lg:pl-6 lg:min-w-[180px]">
                              <div className="lg:text-right">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">ราคา/ที่นั่ง</p>
                                <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                  {price}฿
                                </p>
                              </div>
                              <Button
                                onClick={() => handleSelectSeats(schedule.id)}
                                disabled={availableSeats === 0}
                                className="w-full lg:w-44 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:from-gray-300 disabled:to-gray-400"
                              >
                                {availableSeats === 0 ? 'เต็มแล้ว' : 'เลือกที่นั่ง'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">ไม่พบเที่ยวรถที่ตรงกับเงื่อนไข</h2>
              <p className="text-gray-500 text-lg mb-6">
                ลองปรับเปลี่ยนตัวกรองหรือค้นหาด้วยเส้นทางอื่น
              </p>
              <Link href="/">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  กลับหน้าแรก
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>

    <Footer />
  </div>
  )
}
