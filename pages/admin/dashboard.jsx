import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'
import Head from 'next/head'
import { adminAPI } from '@/lib/api-client'

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
      
      // Fetch all dashboard data in parallel
      const [statsResponse, schedulesResponse, bookingsResponse, vansResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getTodaySchedules(),
        adminAPI.getRecentBookings(10),
        adminAPI.getAllVans()
      ])

      if (statsResponse.success) {
        const { today, total } = statsResponse.data
        
        // Count pending bookings from recent bookings
        const pendingCount = bookingsResponse.success 
          ? bookingsResponse.data.filter(b => b.status === 'pending').length 
          : 0
        
        // Count active vans
        const activeVansCount = vansResponse.success 
          ? vansResponse.data.filter(v => v.status === 'active').length 
          : 0

        setStats({
          todayBookings: today.bookings || 0,
          todayPassengers: today.passengers || 0,
          todayTrips: today.trips || 0,
          revenue: today.revenue || 0,
          activeVans: activeVansCount,
          pendingBookings: pendingCount
        })
      }

      if (schedulesResponse.success) {
        setTodaySchedules(schedulesResponse.data || [])
      }

      if (bookingsResponse.success) {
        setRecentBookings(bookingsResponse.data || [])
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
                const totalPassengers = schedule.total_passengers || 0
                const totalSeats = schedule.van?.total_seats || 13
                const occupancy = (totalPassengers / totalSeats) * 100
                const defaultImage = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'
                return (
                  <div key={schedule.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-red-300">
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={schedule.van?.image || defaultImage} 
                        alt={`${schedule.route?.origin} to ${schedule.route?.destination}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      {/* Status Badge on Image */}
                      <div className="absolute top-3 right-3">
                        {occupancy === 100 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                            เต็ม
                          </span>
                        ) : occupancy >= 80 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white shadow-lg">
                            ใกล้เต็ม
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg">
                            ว่าง {schedule.total_seats - schedule.booked_seats} ที่
                          </span>
                        )}
                      </div>

                      {/* Time Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/90 backdrop-blur-sm text-gray-900 shadow-lg">
                          <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {schedule.departure_time}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-bold text-gray-900">{schedule.route?.origin}</span>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <span className="font-bold text-gray-900">{schedule.route?.destination}</span>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          {schedule.van?.license_plate}
                        </span>
                        <span className="font-bold text-gray-900">
                          {totalPassengers}/{totalSeats} ที่นั่ง
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            occupancy === 100 ? 'bg-red-500' :
                            occupancy >= 80 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${occupancy}%` }}
                        ></div>
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
                const userName = booking.user?.full_name || 'ไม่ระบุชื่อ'
                const userInitial = userName.substring(0, 2).toUpperCase()
                const routeText = booking.schedule?.route 
                  ? `${booking.schedule.route.origin} → ${booking.schedule.route.destination}`
                  : 'ไม่ระบุเส้นทาง'
                
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
                      <div className="text-2xl font-bold text-gray-900">{booking.total_seats}</div>
                      <div className="text-xs text-gray-600">ที่นั่ง</div>
                    </div>

                    {/* Price */}
                    <div className="text-right px-4">
                      <div className="text-xl font-bold text-red-600">฿{booking.payment?.amount || booking.total_price || 0}</div>
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {getStatusBadge(booking.status.toUpperCase())}
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
