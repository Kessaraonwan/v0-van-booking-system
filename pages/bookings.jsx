import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useToast } from '@/hooks/use-toast'
import apiClient, { bookingAPI, paymentsAPI, removeTokens } from '@/lib/api-client'
import { formatThaiDate, formatTime, formatIsoTime } from '@/lib/locations'

export default function MyBookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, upcoming, completed, cancelled
  
  // Payment Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('qr') // 'qr' or 'offline'
  const [paying, setPaying] = useState(false)

  // ดึงข้อมูล bookings จาก API
  const fetchBookings = async () => {
    try {
      const data = await bookingAPI.getMyBookings('all')
      if (data && data.success) {
        setBookings(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการจองได้",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // ตรวจสอบ authentication และโหลดข้อมูล
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userRaw = localStorage.getItem('user')

    if (!token || !userRaw) {
      router.push('/login?redirect=/bookings')
      return
    }

    let user = null
    try {
      user = JSON.parse(userRaw)
    } catch (e) {
      user = null
    }

    // If an admin session accidentally exists in the browser, clear it
    // when visiting public pages so we don't silently auto-login as admin.
    if (user && user.role && typeof user.role === 'string' && user.role.toLowerCase() === 'admin') {
      removeTokens()
      router.push('/login?redirect=/bookings')
      return
    }

    fetchBookings()
  }, [router])

  // เปิด Payment Modal
  const openPaymentModal = (booking) => {
    setSelectedBooking(booking)
    setPaymentMethod('qr')
    setShowPaymentModal(true)
  }

  // ปิด Payment Modal
  const closePaymentModal = () => {
    setShowPaymentModal(false)
    setSelectedBooking(null)
    setPaymentMethod('qr')
  }

  // ประมวลผลการชำระเงิน
  const handlePayment = async () => {
    if (!selectedBooking) return

    setPaying(true)
    try {
      const payload = {
        booking_id: selectedBooking.id,
        payment_method: paymentMethod,
        amount: selectedBooking.total_price,
      }

      const data = await paymentsAPI.create(payload)

      if (!data || !data.success) {
        throw new Error(data?.message || 'Payment failed')
      }

      // ปิด Modal
      closePaymentModal()

      // แสดงข้อความสำเร็จ
      if (paymentMethod === 'qr') {
        toast({
          title: "✅ ชำระเงินสำเร็จ!",
          description: "การจองของคุณได้รับการยืนยันแล้ว",
        })
      } else {
        toast({
          title: "📝 บันทึกข้อมูลสำเร็จ",
          description: "กรุณาชำระเงินที่ศูนย์ก่อนเดินทาง",
        })
      }

      // รีเฟรชข้อมูล bookings
      fetchBookings()
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถประมวลผลการชำระเงินได้",
        variant: "destructive",
      })
    } finally {
      setPaying(false)
    }
  }

  // ยกเลิกการจอง (ผู้ใช้)
  const handleCancelBooking = async (bookingId) => {
    if (!confirm('คุณแน่ใจหรือว่าต้องการยกเลิกการจองนี้?')) return
    try {
      const data = await bookingAPI.cancel(bookingId)
      if (!data || !data.success) throw new Error(data?.message || 'Cancel failed')
      toast({
        title: 'ยกเลิกสำเร็จ',
        description: 'การจองของคุณยกเลิกเรียบร้อยแล้ว',
      })
      // รีเฟรชรายการ
      fetchBookings()
    } catch (error) {
      console.error('Cancel error:', error)
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถยกเลิกได้',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            จองแล้ว
          </span>
        )
      case 'confirmed':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            เสร็จสิ้น
          </span>
        )
      case 'cancelled':
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-200">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            ยกเลิกแล้ว
          </span>
        )
      default:
        return null
    }
  }

  // Use shared helpers from lib/locations: formatThaiDate, formatTime, formatIsoTime

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    const status = booking.booking_status || booking.status || ''
    if (filter === 'upcoming') return status === 'pending' || status === 'confirmed' || status === 'BOOKED'
    if (filter === 'completed') return status === 'completed' || status === 'COMPLETED'
    if (filter === 'cancelled') return status === 'cancelled' || status === 'CANCELLED'
    return true
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>การจองของฉัน - VanGo</title>
      </Head>

      <Navbar showAuth={false} showBookings={false} />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">รายการจองของคุณ</h1>
              <p className="text-white/90 text-lg">ตรวจสอบและจัดการการจองของคุณได้ที่นี่</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 inline-flex gap-2 border border-gray-100">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                ทั้งหมด
              </span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'upcoming'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                กำลังมาถึง
              </span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                เดินทางแล้ว
              </span>
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'cancelled'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                ยกเลิกแล้ว
              </span>
            </button>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 font-medium text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredBookings.length > 0 ? (
            <div className="space-y-6">
              {filteredBookings.map((booking) => {
                const bookingStatus = booking.booking_status || booking.status || ''
                const paymentStatus = booking.payment_status || booking.paymentStatus || ''
                return (
                <div 
                  key={booking.id} 
                  className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-200 hover:scale-[1.01]"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Booking Info */}
                    <div className="flex-1 p-8">
                      {/* Header with Status */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-mono text-gray-500">รหัสการจอง</span>
                            <div className="text-lg font-bold text-gray-900">#{booking.id}</div>
                          </div>
                        </div>
                        {getStatusBadge(booking.booking_status || booking.status)}
                      </div>

                      {/* Route */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-100">
                        <div className="flex items-center gap-3">
                          <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">เส้นทาง</div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {booking.pickup_location || booking.origin} → {booking.dropoff_location || booking.destination}
                            </h3>
                          </div>
                        </div>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">วันที่</div>
                              <div className="font-semibold text-gray-900">{formatThaiDate( booking.travel_date || booking.date || (booking.departure_time && booking.departure_time.includes('T') ? booking.departure_time.split('T')[0] : booking.departure_time) )}</div>
                              { (booking.created_at || booking.createdAt) && (
                                <div className="text-xs text-gray-500 mt-2">จองเมื่อ {formatThaiDate( (booking.created_at || booking.createdAt) )} • {formatTime(formatIsoTime(booking.created_at || booking.createdAt) || (booking.created_at || booking.createdAt))}</div>
                              ) }
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">เวลา</div>
                              <div className="font-semibold text-gray-900">{formatTime(booking.departure_time || booking.departureTime || booking.arrival_time)}</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">ที่นั่ง</div>
                              <div className="font-semibold text-gray-900">{
                                booking.seat_numbers?.join(', ') || booking.seats || booking.seat_number || booking.seatNumber || '-'
                              }</div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-md">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs text-gray-600">ราคารวม</div>
                              <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">฿{booking.total_price || booking.totalPrice}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Action Buttons */}
                    <div className="lg:w-64 bg-gradient-to-br from-gray-50 to-gray-100 border-t lg:border-t-0 lg:border-l border-gray-200 p-8 flex flex-col justify-center gap-4">
                      {/* Show Payment Button if pending */}
                      {(['pending','PENDING'].includes(paymentStatus) && !['cancelled','CANCELLED'].includes(bookingStatus)) && (
                        <Button 
                          onClick={() => openPaymentModal(booking)}
                          className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-lg shadow-green-200 animate-pulse"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            💳 ชำระเงิน
                          </span>
                        </Button>
                      )}
                      
                      {/* Show Paid Badge if completed */}
                      {['completed','COMPLETED'].includes(paymentStatus) && (
                        <div className="w-full h-12 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                          <span className="flex items-center gap-2 text-green-700 font-bold">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            ชำระแล้ว
                          </span>
                        </div>
                      )}

                      <Link href={`/booking-detail/${booking.id}`} className="w-full">
                        <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg shadow-orange-200">
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            ดูรายละเอียด
                          </span>
                        </Button>
                      </Link>
                      {( ['pending','PENDING','BOOKED','booked'].includes(bookingStatus) && !['completed','COMPLETED'].includes(String(paymentStatus)) ) && (
                        <Button 
                          onClick={() => handleCancelBooking(booking.id)}
                          variant="outline" 
                          className="w-full h-12 text-red-600 hover:bg-red-50 hover:text-red-700 border-2 border-red-300 font-semibold"
                        >
                          <span className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            ยกเลิกการจอง
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-16 border border-gray-100">
              <div className="text-center space-y-6">
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-20 h-20 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filter === 'all' 
                    ? 'ยังไม่มีการจอง'
                    : filter === 'upcoming'
                    ? 'ไม่มีการจองที่กำลังจะมาถึง'
                    : filter === 'completed'
                    ? 'ไม่มีการจองที่เสร็จสิ้น'
                    : 'ไม่มีการจองที่ยกเลิก'
                  }
                </h2>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  {filter === 'all' 
                    ? 'เริ่มต้นการเดินทางของคุณด้วยการจองรถตู้กับเรา'
                    : 'ลองเปลี่ยนตัวกรองเพื่อดูการจองอื่นๆ หรือค้นหาเที่ยวรถใหม่'
                  }
                </p>
                <Link href="/search">
                  <Button size="lg" className="mt-4 h-14 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200">
                    <span className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      ค้นหาเที่ยวรถ
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  ชำระเงิน
                </h2>
                <button
                  onClick={closePaymentModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Booking Summary */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-5 border border-orange-200">
                <div className="text-sm text-gray-600 mb-2">รายละเอียดการจอง</div>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  {selectedBooking.pickup_location} → {selectedBooking.dropoff_location}
                </div>
                <div className="text-sm text-gray-600">
                  {formatThaiDate(selectedBooking.travel_date || (selectedBooking.departure_time && selectedBooking.departure_time.includes('T') ? selectedBooking.departure_time.split('T')[0] : selectedBooking.departure_time))} • {formatTime(formatIsoTime(selectedBooking.departure_time) || selectedBooking.departure_time)}
                </div>
                <div className="mt-3 pt-3 border-t border-orange-200 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">ยอดชำระ</span>
                  <span className="text-2xl font-bold text-orange-600">฿{selectedBooking.total_price}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  เลือกวิธีชำระเงิน
                </label>
                <div className="space-y-3">
                  {/* QR Code Payment */}
                  <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'qr'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr"
                      checked={paymentMethod === 'qr'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-5 h-5 text-green-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">💳 QR Code</span>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          แนะนำ
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        สแกน QR ชำระเงินทันที (Mock Payment)
                      </p>
                    </div>
                  </label>

                  {/* Offline Payment */}
                  <label className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'offline'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="offline"
                      checked={paymentMethod === 'offline'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mt-1 w-5 h-5 text-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-bold text-gray-900">🏢 ชำระที่ศูนย์</div>
                      <p className="text-sm text-gray-600 mt-1">
                        ชำระเงินสดก่อนขึ้นรถ
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className={`rounded-xl p-4 flex items-start gap-3 ${
                paymentMethod === 'qr' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  paymentMethod === 'qr' ? 'text-green-600' : 'text-blue-600'
                }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className={`text-sm ${
                  paymentMethod === 'qr' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {paymentMethod === 'qr' 
                    ? 'การจองจะได้รับการยืนยันทันทีหลังชำระเงิน' 
                    : 'กรุณาชำระเงินก่อนเดินทางอย่างน้อย 15 นาที'
                  }
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <Button
                onClick={closePaymentModal}
                variant="outline"
                className="flex-1 h-12 font-semibold"
                disabled={paying}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handlePayment}
                disabled={paying}
                className={`flex-1 h-12 font-bold shadow-lg ${
                  paymentMethod === 'qr'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-200'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-blue-200'
                }`}
              >
                {paying ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    กำลังประมวลผล...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {paymentMethod === 'qr' ? '✓' : '📝'} ยืนยันการชำระเงิน
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
