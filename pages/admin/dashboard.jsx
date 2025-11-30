import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'
import Head from 'next/head'
import { adminAPI, scheduleAPI } from '@/lib/api-client'
import { formatTime, formatThaiDate, getRouteShortText } from '@/lib/locations'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    todayPassengers: 0,
    todayTrips: 0,
    revenue: 0,
    activeVans: 0,
    pendingBookings: 0
  })
  const [todaySchedules, setTodaySchedules] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats, today's schedules, and vans in parallel
      const todayStr = new Date().toISOString().split('T')[0]
      const [statsResponse, schedulesResponse, vansResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        // Use admin API to list schedules (backend requires from/to for public search)
        adminAPI.getTodaySchedules(),
        adminAPI.getAllVans()
      ])

      if (statsResponse.success) {
        const data = statsResponse.data || {}

        // recent bookings are returned inside dashboard response
        const recent = data.recent_bookings || []

        const pendingCount = recent.filter(b => (b.booking_status || b.status || '').toLowerCase() === 'pending').length

        const activeVansCount = vansResponse && vansResponse.success
          ? (vansResponse.data || []).filter(v => (v.status || '').toLowerCase() === 'active').length
          : 0

        setStats({
          todayBookings: data.bookings_today || data.total_bookings || 0,
          todayPassengers: data.passengers_today || 0,
          todayTrips: data.trips_today || data.total_routes || 0,
          revenue: data.total_revenue || 0,
          activeVans: activeVansCount,
          pendingBookings: (data.pending_today !== undefined) ? data.pending_today : pendingCount
        })

        // Set recent bookings, then enrich those missing route/schedule details
        setRecentBookings(recent)

        // Enrich recent bookings with schedule data when route info is missing
        try {
          const toEnrich = recent.filter(b => {
            return !(b.schedule && ((b.schedule.route && (b.schedule.route.origin || b.schedule.route.destination)) || (b.schedule.origin && b.schedule.destination)))
          })

          if (toEnrich.length > 0) {
            const fetched = await Promise.all(recent.map(async (b) => {
              try {
                const scheduleId = b.schedule?.id || b.schedule_id || b.schedule?.schedule_id || b.schedule_id
                if (!scheduleId) return b
                const schedResp = await scheduleAPI.getById(scheduleId)
                if (schedResp && schedResp.success && schedResp.data) {
                  return { ...b, schedule: schedResp.data }
                }
                return b
              } catch (e) {
                return b
              }
            }))
            setRecentBookings(fetched)
          }
        } catch (e) {
          // ignore enrichment errors
          console.warn('Failed to enrich recent bookings with schedules', e)
        }
      }

      if (schedulesResponse && schedulesResponse.success) {
        // admin schedules endpoint may return paginated or direct list
        const schedulesList = schedulesResponse.data || schedulesResponse.schedules || []

        // Filter to only today's schedules (based on departure_date or departure_time)
        const todayOnly = schedulesList.filter(s => {
          const dateSource = s.departure_date || s.date || (s.departure_time ? s.departure_time.split('T')[0] : null)
          return dateSource && dateSource.startsWith(todayStr)
        })

        setTodaySchedules(todayOnly)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ยืนยันแล้ว
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            รอดำเนินการ
          </span>
        )
      default:
        return null
    }
  }

  return (
    <>
      <Head>
        <title>Dashboard - Admin Panel</title>
      </Head>
      <AdminLayout>
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        ) : (
        <div className="space-y-8">
          {/* Hero Header with Image Background */}
          <div 
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    ภาพรวมระบบจองรถตู้วันนี้
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    สรุปยอดวันนี้
                  </p>
                  <div className="flex items-center gap-3 text-white/90">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('th-TH', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid - Consistent Red Theme */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Bookings Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.todayBookings}</div>
                <div className="text-sm text-gray-600 font-medium">จองวันนี้</div>
              </div>
            </div>

            {/* Passengers Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.todayPassengers}</div>
                <div className="text-sm text-gray-600 font-medium">คนขึ้นรถ</div>
              </div>
            </div>

            {/* Trips Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.todayTrips}</div>
                <div className="text-sm text-gray-600 font-medium">วิ่งวันนี้</div>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">฿{(stats.revenue / 1000).toFixed(0)}K</div>
                <div className="text-sm text-gray-600 font-medium">ยอดวันนี้</div>
              </div>
            </div>

            {/* Active Vans Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.activeVans}</div>
                <div className="text-sm text-gray-600 font-medium">รถวิ่ง</div>
              </div>
            </div>

            {/* Pending Card */}
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-red-300 group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pendingBookings}</div>
                <div className="text-sm text-gray-600 font-medium">รอยืนยัน</div>
              </div>
            </div>
          </div>

          {/* Today's Schedules - Travel Cards Style */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">เที่ยววันนี้</h2>
                <p className="text-gray-600">รถที่กำลังวิ่ง</p>
              </div>
              <Link href="/admin/schedules">
                <Button className="bg-red-500 hover:bg-red-600 text-white">
                  ดูทั้งหมด
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {todaySchedules.length === 0 && !loading ? (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium">ไม่มีรอบรถวันนี้</p>
                </div>
              ) : null}
              {todaySchedules.map((schedule) => {
                // Determine total seats (try schedule, then van, fallback 13)
                const totalSeats = Number(schedule.total_seats ?? schedule.van?.total_seats) || 13

                // Safety: ensure we have a sane total seats value before using it
                const safeTotalSeats = Math.max(Number(totalSeats) || 13, 1)

                // Determine booked/occupied seats from multiple possible backend shapes
                let bookedSeats = 0
                if (typeof schedule.booked_seats === 'number') {
                  bookedSeats = schedule.booked_seats
                } else if (typeof schedule.booked_seats === 'string' && !isNaN(Number(schedule.booked_seats))) {
                  bookedSeats = Number(schedule.booked_seats)
                } else if (typeof schedule.total_passengers === 'number') {
                  bookedSeats = schedule.total_passengers
                } else if (typeof schedule.total_passengers === 'string' && !isNaN(Number(schedule.total_passengers))) {
                  bookedSeats = Number(schedule.total_passengers)
                } else if (Array.isArray(schedule.bookings)) {
                  bookedSeats = schedule.bookings.length
                } else if (typeof schedule.bookings_count === 'number') {
                  bookedSeats = schedule.bookings_count
                } else if (typeof schedule.bookings_count === 'string' && !isNaN(Number(schedule.bookings_count))) {
                  bookedSeats = Number(schedule.bookings_count)
                } else if (typeof schedule.booked_count === 'number') {
                  bookedSeats = schedule.booked_count
                } else if (typeof schedule.booked_count === 'string' && !isNaN(Number(schedule.booked_count))) {
                  bookedSeats = Number(schedule.booked_count)
                }

                // If backend provides available seats, compute booked = total - available
                if ((schedule.available_seats !== undefined && schedule.available_seats !== null) || (schedule.availableSeats !== undefined && schedule.availableSeats !== null)) {
                  const avail = schedule.available_seats ?? schedule.availableSeats
                  if (typeof avail === 'number') {
                    const av = Number(avail)
                    // avoid negative
                    if (!isNaN(av)) {
                      bookedSeats = Math.max(safeTotalSeats - av, 0)
                    }
                  } else if (typeof avail === 'string' && !isNaN(Number(avail))) {
                    const av = Number(avail)
                    bookedSeats = Math.max(safeTotalSeats - av, 0)
                  }
                }

                // Safety: clamp values
                const safeBookedSeats = Math.max(Number(bookedSeats) || 0, 0)

                // Expose a clear name used in the template
                const totalPassengers = safeBookedSeats

                let occupancy = (safeBookedSeats / safeTotalSeats) * 100
                if (!isFinite(occupancy) || isNaN(occupancy)) occupancy = 0
                occupancy = Math.min(Math.max(occupancy, 0), 100)
                const defaultImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
                return (
                  <div key={schedule.id} className="group relative rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-red-300">
                    <div className="p-4 md:p-5 flex items-center gap-4">
                      {/* Time */}
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-gray-900 font-bold shadow">
                          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm">{formatTime(schedule.departure_time)}</span>
                        </span>
                      </div>

                      {/* Route and meta */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-gray-900 text-sm md:text-base">{schedule.route?.origin} → {schedule.route?.destination}</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1">{schedule.van?.license_plate || '—'}</span>
                              <span>{totalPassengers}/{totalSeats} ที่นั่ง</span>
                              <span className="text-gray-400">{formatThaiDate(schedule.departure_date || schedule.date || schedule.departure_time)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Occupancy and progress */}
                      <div className="flex flex-col items-end gap-2 w-36">
                        <div>
                          {occupancy === 100 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow">
                              เต็ม
                            </span>
                          ) : occupancy >= 80 ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white shadow">
                              ใกล้เต็ม
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow">
                              ว่าง {Math.max(safeTotalSeats - safeBookedSeats, 0)} ที่
                            </span>
                          )}
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              occupancy === 100 ? 'bg-red-500' : occupancy >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`} style={{ width: `${occupancy}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">ออเดอร์ล่าสุด</h2>
                <p className="text-gray-600">รายการจองที่เข้ามาใหม่</p>
              </div>
              <Link href="/admin/bookings">
                <Button variant="outline" className="border border-gray-300 hover:border-red-500 hover:text-red-600">
                  ดูทั้งหมด
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentBookings.length === 0 && !loading ? (
                <div className="text-center py-12 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium">ยังไม่มีออเดอร์เข้ามา</p>
                </div>
              ) : null}
              {recentBookings.map((booking) => {
                // Derive a display name from multiple possible fields
                const possibleNames = [
                  booking.user?.full_name,
                  booking.user?.name,
                  booking.customer_name,
                  booking.passenger_name,
                  booking.name,
                  booking.email
                ]
                const userName = possibleNames.find(n => !!n) || 'ไม่ระบุชื่อ'
                const userInitial = (userName || 'น').substring(0, 2).toUpperCase()

                // Route text - support different shapes
                let routeText = 'ไม่ระบุเส้นทาง'
                if (booking.schedule?.route?.origin && booking.schedule?.route?.destination) {
                  routeText = `${booking.schedule.route.origin} → ${booking.schedule.route.destination}`
                } else if (booking.schedule?.origin && booking.schedule?.destination) {
                  routeText = `${booking.schedule.origin} → ${booking.schedule.destination}`
                } else if (booking.route_origin && booking.route_destination) {
                  routeText = `${booking.route_origin} → ${booking.route_destination}`
                }

                // Seats: compute a numeric count from multiple possible shapes
                const computeSeatsCount = (b) => {
                  // If seats is an array
                  if (Array.isArray(b.seats) && b.seats.length > 0) return b.seats.length
                  // Common single-seat field
                  if (b.seat_number || b.SeatNumber || b.seatNumber) return 1
                  // Count-like numeric fields
                  if (typeof b.seats_count === 'number') return b.seats_count
                  if (typeof b.number_of_seats === 'number') return b.number_of_seats
                  if (typeof b.total_seats === 'number') return b.total_seats
                  if (typeof b.quantity === 'number') return b.quantity
                  // String variants that contain numbers
                  const numericFields = ['seats_count','number_of_seats','total_seats','quantity','bookings_count','booked_count']
                  for (const key of numericFields) {
                    if (typeof b[key] === 'string' && b[key].trim() !== '' && !isNaN(Number(b[key]))) return Number(b[key])
                  }
                  // If booking has bookings array
                  if (Array.isArray(b.bookings) && b.bookings.length > 0) return b.bookings.length
                  // If schedule exposes available_seats and total seats, try to compute
                  if ((b.schedule && (b.schedule.total_seats || b.schedule.available_seats)) || (b.total_seats && b.available_seats !== undefined)) {
                    const total = Number(b.schedule?.total_seats ?? b.total_seats) || 0
                    const avail = Number(b.schedule?.available_seats ?? b.available_seats)
                    if (total > 0 && !isNaN(avail)) return Math.max(total - avail, 0)
                  }
                  return '--'
                }

                const seatsCount = computeSeatsCount(booking)

                // Price: fallback chain
                const price = booking.payment?.amount || booking.total_price || booking.price || booking.amount || 0

                const status = (booking.status || booking.booking_status || booking.payment?.status || '').toUpperCase()

                return (
                  <div key={booking.id} className="flex items-center gap-4 p-5 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-md transition-all duration-300 hover:bg-gray-50">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-red-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {userInitial}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 mb-1">
                        {userName}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {routeText}
                      </div>
                    </div>

                    {/* Seats */}
                    <div className="text-center px-4">
                      <div className="text-2xl font-bold text-gray-900">{seatsCount}</div>
                      <div className="text-xs text-gray-600">ที่นั่ง</div>
                    </div>

                    {/* Price */}
                    <div className="text-right px-4">
                      <div className="text-xl font-bold text-red-600">฿{price}</div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(status)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        )}
      </AdminLayout>
    </>
  )
}
