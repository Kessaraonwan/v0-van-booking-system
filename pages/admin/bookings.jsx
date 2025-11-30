import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'
import { adminAPI } from '@/lib/api-client'
import { formatTime, formatIsoTime, formatThaiDate } from '@/lib/locations'
import { useToast } from '@/hooks/use-toast'

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllBookings()
      if (response && response.success) {
        setFetchError(null)
        const list = response.data || []
        // Sort bookings by booking code/number (BK...), fallback to created_at or id
        const extractNumber = (b) => {
          const code = b.booking_code || b.booking_number || b.bookingNumber || b.BookingNumber || ''
          if (!code) return 0
          const digits = ('' + code).replace(/\D/g, '')
          if (digits) return Number(digits)
          // fallback: try created_at timestamp
          if (b.created_at) return new Date(b.created_at).getTime()
          if (b.createdAt) return new Date(b.createdAt).getTime()
          return b.id || 0
        }

        list.sort((a, b) => extractNumber(b) - extractNumber(a))
        setBookings(list)
      } else {
        // show an informative message (e.g., authorization required)
        const msg = (response && response.message) ? response.message : 'ไม่สามารถโหลดข้อมูลการจองได้'
        setFetchError(msg)
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setFetchError(error.message || 'Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const openBookingDetails = async (booking) => {
    try {
      setDetailsLoading(true)
      setBookingDetails(null)
      setSelectedBooking(booking)
      const res = await adminAPI.getBookingDetails(booking.id)
      if (res && res.success) {
        setBookingDetails(res.data)
      } else {
        setBookingDetails(booking)
      }
    } catch (err) {
      console.error('Failed to load booking details', err)
      setBookingDetails(booking)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleUpdateStatus = async (bookingId, newStatus) => {
    // Normalize status to allowed DB values (lowercase)
    const normalize = (s) => {
      if (!s) return s
      const up = String(s).toUpperCase()
      if (up === 'CONFIRMED') return 'confirmed'
      if (up === 'PENDING') return 'pending'
      if (up === 'CANCELLED' || up === 'CANCELED') return 'cancelled'
      if (up === 'COMPLETED') return 'completed'
      // fallback to lowercase string
      return String(s).toLowerCase()
    }

    const payloadStatus = normalize(newStatus)

    try {
      const response = await adminAPI.updateBookingStatus(bookingId, payloadStatus)
      if (response && response.success) {
        toast({ title: 'อัพเดทสถานะเรียบร้อย', description: `สถานะถูกเปลี่ยนเป็น ${payloadStatus}`, })
        await fetchBookings()
      } else {
        const msg = response && response.message ? response.message : 'ไม่สามารถอัพเดทสถานะได้'
        toast({ title: 'เกิดข้อผิดพลาด', description: msg, variant: 'destructive' })
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      toast({ title: 'Error updating booking', description: error.message || String(error), variant: 'destructive' })
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-700 border border-green-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ยืนยันแล้ว
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-yellow-100 text-yellow-700 border border-yellow-300">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            รอดำเนินการ
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-700 border border-red-300">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิกแล้ว
          </span>
        )
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-700 border border-blue-300">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            เสร็จสิ้น
          </span>
        )
      default:
        return null
    }
  }

  const getBookingStatus = (b) => (b.status || b.booking_status || b.bookingStatus || '').toUpperCase()

  const matchesSearch = (b) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    const names = [b.user?.first_name, b.user?.last_name, b.user?.name, b.user?.full_name].filter(Boolean).join(' ').toLowerCase()
    const code = (b.booking_code || b.booking_number || b.bookingNumber || '').toLowerCase()
    return names.includes(term) || code.includes(term)
  }

  const filteredBookings = bookings.filter(b => {
    if (filterStatus !== 'all' && getBookingStatus(b) !== filterStatus) return false
    if (!matchesSearch(b)) return false
    return true
  })

  const statsCount = {
    all: bookings.length,
    PENDING: bookings.filter(b => getBookingStatus(b) === 'PENDING').length,
    CONFIRMED: bookings.filter(b => getBookingStatus(b) === 'CONFIRMED').length,
    COMPLETED: bookings.filter(b => getBookingStatus(b) === 'COMPLETED').length,
    CANCELLED: bookings.filter(b => getBookingStatus(b) === 'CANCELLED').length,
  }

  return (
    <>
      <Head>
        <title>จัดการการจอง - Admin Panel</title>
      </Head>
      <AdminLayout>
        <div className="space-y-8">
          {/* Hero Header */}
          <div 
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    การจองทั้งหมด
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    ดูและจัดการออเดอร์ลูกค้า
                  </p>
                  <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
                      <span className="font-medium">{statsCount.PENDING} รอยืนยัน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      <span className="font-medium">{statsCount.CONFIRMED} ยืนยันแล้ว</span>
                    </div>
                  </div>
                </div>
                {/* Search Box */}
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3 min-w-[300px]">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาชื่อลูกค้า หรือเลขที่จอง..."
                    className="bg-transparent text-white placeholder-white/70 border-none outline-none flex-1 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              ทั้งหมด ({statsCount.all})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'PENDING'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-300'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-2 animate-pulse"></span>
              รอยืนยัน ({statsCount.PENDING})
            </button>
            <button
              onClick={() => setFilterStatus('CONFIRMED')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'CONFIRMED'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              ยืนยันแล้ว ({statsCount.CONFIRMED})
            </button>
            <button
              onClick={() => setFilterStatus('COMPLETED')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'COMPLETED'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              เสร็จสิ้น ({statsCount.COMPLETED})
            </button>
            <button
              onClick={() => setFilterStatus('CANCELLED')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'CANCELLED'
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              ยกเลิก ({statsCount.CANCELLED})
            </button>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    </div>
                    <div className="h-10 w-32 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : fetchError ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-yellow-800">ไม่สามารถโหลดข้อมูลการจอง</div>
                  <div className="text-sm text-yellow-700 mt-1">{fetchError}</div>
                </div>
                <div>
                  <a href="/admin/login" className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg">ไปหน้าเข้าสู่ระบบ</a>
                </div>
              </div>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-orange-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Customer Avatar */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                          {(() => {
                            const name = booking.user?.first_name && booking.user?.last_name ? `${booking.user.first_name} ${booking.user.last_name}` : (booking.passenger_name || booking.passengerName || booking.PassengerName || booking.user?.name || booking.user?.full_name || '')
                            const initials = (name || '').trim().split(' ').map(s => s[0] || '').slice(0,2).join('')
                            return initials || '–'
                          })()}
                        </div>

                      {/* Booking Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">รหัสการจอง</div>
                            <div className="font-mono font-bold text-lg text-gray-900 mb-2">{booking.booking_code || booking.booking_number || booking.bookingNumber || booking.BookingNumber || booking.booking_number}</div>
                            <div className="text-xl font-bold text-gray-900">
                              {(() => {
                                if (booking.user?.first_name || booking.user?.last_name) return `${booking.user?.first_name || ''} ${booking.user?.last_name || ''}`.trim()
                                return booking.passenger_name || booking.passengerName || booking.PassengerName || booking.user?.name || booking.user?.full_name || '-' 
                              })()}
                            </div>
                          </div>
                          {getStatusBadge(getBookingStatus(booking))}
                        </div>

                        {/* Route & Schedule Info */}
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="text-sm font-medium text-blue-700">เส้นทาง</span>
                            </div>
                            <div className="font-bold text-blue-900">
                              {booking.origin || booking.route_origin || booking.route?.origin || '-'} → {booking.destination || booking.route_destination || booking.route?.destination || '-'}
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm font-medium text-green-700">วันที่</span>
                            </div>
                            <div className="font-bold text-green-900">
                              {(() => {
                                const iso = booking.departure_time || booking.DepartureTime || booking.schedule?.departure_time || booking.schedule?.departureDate || ''
                                if (!iso) return '-'
                                const datePart = iso.includes('T') ? iso.split('T')[0] : iso
                                const dt = new Date(datePart)
                                if (isNaN(dt.getTime())) return '-'
                                return dt.toLocaleDateString('th-TH')
                              })()}
                            </div>
                          </div>

                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm font-medium text-purple-700">เวลา</span>
                            </div>
                            <div className="font-bold text-purple-900">
                              {(() => {
                                const t = booking.departure_time || booking.DepartureTime || booking.schedule?.departure_time || ''
                                if (!t) return '-'
                                if (t.includes('T')) return formatIsoTime(t) + ' น.'
                                return t + ' น.'
                              })()}
                            </div>
                          </div>
                        </div>

                        {/* Seats & Price */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              {(() => {
                                if (Array.isArray(booking.seats)) {
                                  return (
                                    <>
                                      <span className="font-bold text-gray-900">{booking.seats.length} ที่นั่ง</span>
                                      <span className="text-gray-600">({booking.seats.map(s => s.seat_number).join(', ')})</span>
                                    </>
                                  )
                                }
                                const seatNum = booking.seat_number ?? booking.SeatNumber ?? booking.seatNumber
                                return (
                                  <>
                                    <span className="font-bold text-gray-900">{seatNum ? 1 : 0} ที่นั่ง</span>
                                    <span className="text-gray-600">({seatNum || '-'})</span>
                                  </>
                                )
                              })()}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="text-gray-900">{booking.user?.phone || booking.user?.phone_number || booking.user?.phoneNumber || booking.passenger_phone || booking.passengerPhone || booking.PassengerPhone || '-'}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">ยอดเงิน</div>
                            <div className="text-3xl font-bold text-orange-600">฿{booking.total_price}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => openBookingDetails(booking)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ดูรายละเอียด
                          </Button>
                          {getBookingStatus(booking) === 'PENDING' && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                              className="border-2 border-green-300 text-green-600 hover:bg-green-50"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              ยืนยัน
                            </Button>
                          )}
                          {(getBookingStatus(booking) === 'PENDING' || getBookingStatus(booking) === 'CONFIRMED') && (
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (!confirm('คุณแน่ใจหรือว่าต้องการยกเลิกการจองนี้?')) return
                                handleUpdateStatus(booking.id, 'cancelled')
                              }}
                              className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              ยกเลิก
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
              <div className="text-8xl mb-4">🎫</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีออเดอร์ในหมวดนี้</h3>
              <p className="text-gray-600">ลองเลือกหมวดอื่นหรือค้นหาใหม่</p>
            </div>
          )}
        </div>
      </AdminLayout>
      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setSelectedBooking(null); setBookingDetails(null) }} />
          <div className="relative z-10 w-[min(900px,95%)] bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">รายละเอียดการจอง #{selectedBooking.booking_number || selectedBooking.booking_code || selectedBooking.id}</h3>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => { setSelectedBooking(null); setBookingDetails(null) }}>ปิด</Button>
              </div>
            </div>
            {detailsLoading ? (
              <div className="py-8 text-center">กำลังโหลด...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">ผู้โดยสาร</div>
                  <div className="font-bold text-lg">{bookingDetails?.passenger_name || bookingDetails?.PassengerName || bookingDetails?.user?.name || bookingDetails?.user?.full_name || '-'}</div>
                  <div className="text-sm text-gray-600 mt-2">เบอร์โทร: <span className="font-medium">{bookingDetails?.passenger_phone || bookingDetails?.PassengerPhone || bookingDetails?.user?.phone || '-'}</span></div>
                  <div className="text-sm text-gray-600 mt-2">ที่นั่ง: <span className="font-medium">{bookingDetails?.seat_number ?? bookingDetails?.SeatNumber ?? '-'}</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">เส้นทาง</div>
                  <div className="font-bold text-lg">{bookingDetails?.origin || bookingDetails?.route?.origin || '-'} → {bookingDetails?.destination || bookingDetails?.route?.destination || '-'}</div>
                  <div className="text-sm text-gray-600 mt-2">วันที่: <span className="font-medium">{bookingDetails ? (bookingDetails.departure_time ? new Date(bookingDetails.departure_time).toLocaleDateString('th-TH') : '-') : '-'}</span></div>
                  <div className="text-sm text-gray-600 mt-2">เวลา: <span className="font-medium">{bookingDetails ? (bookingDetails.departure_time ? (bookingDetails.departure_time.includes('T') ? bookingDetails.departure_time.split('T')[1].slice(0,5) : bookingDetails.departure_time) : '-') : '-'}</span></div>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              {(getBookingStatus(selectedBooking) === 'PENDING' || getBookingStatus(selectedBooking) === 'CONFIRMED') && (
                <Button size="sm" variant="outline" className="border-red-300 text-red-600" onClick={() => { if (confirm('ยกเลิกการจองนี้หรือไม่?')) { handleUpdateStatus(selectedBooking.id, 'cancelled'); setSelectedBooking(null); setBookingDetails(null) } }}>ยกเลิก</Button>
              )}
              {getBookingStatus(selectedBooking) === 'PENDING' && (
                <Button size="sm" className="bg-green-500 text-white" onClick={() => { handleUpdateStatus(selectedBooking.id, 'CONFIRMED'); setSelectedBooking(null); setBookingDetails(null) }}>ยืนยัน</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
