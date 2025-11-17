import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    todayPassengers: 0,
    todayTrips: 0
  })
  const [todaySchedules, setTodaySchedules] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  // TODO: เชื่อมฐานข้อมูลจริงที่นี่
  useEffect(() => {
    // Fetch dashboard data
    // const statsData = await fetchTodayStats()
    // const schedulesData = await fetchTodaySchedules()
    // const bookingsData = await fetchRecentBookings()
    // setStats(statsData)
    // setTodaySchedules(schedulesData)
    // setRecentBookings(bookingsData)
    setLoading(false)
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">ภาพรวมระบบจองรถตู้วันนี้</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Today's Bookings */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">การจองวันนี้</div>
            <div className="text-3xl font-bold text-gray-900">{stats.todayBookings}</div>
          </div>

          {/* Today's Passengers */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">ผู้โดยสารวันนี้</div>
            <div className="text-3xl font-bold text-gray-900">{stats.todayPassengers}</div>
          </div>

          {/* Today's Trips */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1">เที่ยวรถวันนี้</div>
            <div className="text-3xl font-bold text-gray-900">{stats.todayTrips}</div>
          </div>
        </div>

        {/* Today's Schedules Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">เที่ยวรถวันนี้</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : todaySchedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">เวลา</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">เส้นทาง</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">รถตู้</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ผู้โดยสาร</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {todaySchedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-gray-900">{schedule.departureTime}</td>
                      <td className="py-3 px-4 text-gray-900">{schedule.origin} → {schedule.destination}</td>
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">{schedule.vanNumber}</td>
                      <td className="py-3 px-4 text-gray-900">{schedule.bookedSeats}/12</td>
                      <td className="py-3 px-4">
                        {schedule.status === 'FULL' ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">เต็ม</span>
                        ) : schedule.status === 'DEPARTING' ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">กำลังเดินทาง</span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">พร้อม</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📅</div>
              <p className="text-gray-600">ไม่มีเที่ยวรถวันนี้</p>
            </div>
          )}
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">การจองล่าสุด</h2>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm" className="border-gray-300">
                ดูทั้งหมด
              </Button>
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">⏳</div>
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : recentBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">เลขที่</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ลูกค้า</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">เส้นทาง</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">วันที่</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ที่นั่ง</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">ราคา</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-sm text-gray-600">#{booking.bookingNumber}</td>
                      <td className="py-3 px-4 text-gray-900">{booking.customerName}</td>
                      <td className="py-3 px-4 text-gray-900">{booking.origin} → {booking.destination}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{booking.date}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">{booking.seats}</td>
                      <td className="py-3 px-4 font-semibold text-blue-600">฿{booking.totalPrice}</td>
                      <td className="py-3 px-4">
                        {booking.status === 'BOOKED' ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">จองแล้ว</span>
                        ) : booking.status === 'COMPLETED' ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">เสร็จสิ้น</span>
                        ) : (
                          <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">ยกเลิก</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-600">ยังไม่มีการจอง</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
