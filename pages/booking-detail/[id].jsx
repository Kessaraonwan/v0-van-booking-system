import { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { bookingAPI } from '@/lib/api-client'
import { formatThaiDate, formatTime, formatIsoTime, isZeroOrInvalidTimestamp } from '@/lib/locations'

export default function BookingDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetchBooking = async () => {
      try {
        const data = await bookingAPI.getById(id)
        if (data && data.success) {
          setBooking(data.data)
        }
      } catch (e) {
        console.error('Failed to load booking', e)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [id])
  // derive safe display values to avoid reading properties from null
  const perSeatPrice = booking ? (booking.total_price ?? booking.TotalPrice ?? booking.price ?? 0) : 0
  const totalPrice = booking ? (booking.total_price ?? booking.TotalPrice ?? 0) : 0
  const seatCount = booking ? (booking.seat_number ? 1 : (booking.seat_numbers ? booking.seat_numbers.length : 1)) : 0
  // derive departure iso value and format using shared helpers to avoid timezone conversion
  const departureIso = booking ? (booking.departure_time ?? booking.departureTime ?? null) : null
  const departureDateDisplay = departureIso ? formatThaiDate(departureIso) : '-'
  const departureTimeDisplay = departureIso ? formatTime(formatIsoTime(departureIso) || departureIso) : '-'

  // booking created timestamp (display as Bangkok time using created_at if present)
  const bookingCreatedIso = booking ? (booking.created_at ?? booking.createdAt ?? booking.createdAtIso ?? null) : null
  const bookingCreatedUseIso = !isZeroOrInvalidTimestamp(bookingCreatedIso) ? bookingCreatedIso : new Date().toISOString()
  const bookingCreatedDate = bookingCreatedUseIso ? new Date(bookingCreatedUseIso).toLocaleDateString('en-GB', { timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: '2-digit' }) : '-'
  const bookingCreatedTime = bookingCreatedUseIso ? new Date(bookingCreatedUseIso).toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' }) : '-'
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>รายละเอียดการจอง - VanGo</title>
      </Head>

      <Navbar showAuth={false} showBookings={true} />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-white/80 mb-6">
            <Link href="/bookings" className="hover:text-white transition-colors">การจองของฉัน</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">รายละเอียด</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">ตั๋วอิเล็กทรอนิกส์</h1>
              <p className="text-white/90 text-lg">E-Ticket รายละเอียดการจองของคุณ</p>
            </div>
            <div className="hidden md:block">
              <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* E-Ticket Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white/80 mb-1">รหัสการจอง</div>
                    <div className="text-3xl font-bold font-mono">{booking?.booking_number || `#${booking?.id || id || ''}`}</div>
                    <div className="text-xs text-white/80 mt-1">เวลาจอง: {booking ? `${bookingCreatedDate} ${bookingCreatedTime}` : '-'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white font-bold shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    ยืนยันแล้ว
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Content */}
            <div className="p-8">
              {/* QR Code Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 mb-8 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">QR Code สำหรับขึ้นรถ</h2>
                  <p className="text-gray-600">แสดง QR Code นี้เมื่อขึ้นรถ</p>
                </div>

                <div className="w-80 h-80 bg-white border-4 border-gray-300 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <div className="text-center p-8">
                    <svg className="w-48 h-48 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">หมายเหตุ:</p>
                      <p className="text-gray-600">กรุณามาถึงจุดนัดพบก่อนเวลาออกเดินทาง 15 นาที และเตรียม QR Code นี้ให้พร้อม</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip Information */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  ข้อมูลการเดินทาง
                </h2>

                {/* Route */}
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">เส้นทาง</div>
                      <div className="text-2xl font-bold text-gray-900">{booking?.origin || booking?.Origin || booking?.pickup_point_name || 'กรุงเทพ'} → {booking?.destination || booking?.Destination || booking?.dropoff_point_name || 'พัทยา'}</div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">วันที่เดินทาง</div>
                        <div className="font-bold text-gray-900 text-lg">{booking ? departureDateDisplay : '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">เวลาออกเดินทาง</div>
                        <div className="font-bold text-gray-900 text-lg">{booking ? departureTimeDisplay : '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">ทะเบียนรถ</div>
                        <div className="font-bold text-gray-900 text-lg font-mono">{booking?.license_plate || booking?.LicensePlate || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">ที่นั่ง</div>
                          <div className="flex gap-2 mt-1">
                            {booking?.seat_number ? (
                              <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm shadow-sm">{booking.seat_number}</span>
                            ) : booking?.seat_numbers ? (
                              booking.seat_numbers.map(s => (
                                <span key={s} className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm shadow-sm">{s}</span>
                              ))
                            ) : ('-')}
                          </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700">ราคาต่อที่นั่ง</span>
                    <span className="font-semibold text-gray-900">฿{perSeatPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
                    <span className="text-gray-700">จำนวนที่นั่ง</span>
                    <span className="font-semibold text-gray-900">× {seatCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">ราคารวม</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">฿{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ข้อมูลผู้โดยสาร
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ชื่อ-นามสกุล:</span>
                    <span className="font-semibold text-gray-900">{booking?.passenger_name || booking?.passengerName || booking?.passenger_name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">เบอร์โทร:</span>
                    <span className="font-semibold text-gray-900">{booking?.passenger_phone || booking?.passengerPhone || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">อีเมล:</span>
                    <span className="font-semibold text-gray-900">{booking?.passenger_email || booking?.passengerEmail || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" className="h-14 border-2 border-gray-300 hover:bg-gray-50 font-semibold">
              <span className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                ดาวน์โหลด / พิมพ์
              </span>
            </Button>
            <Link href="/bookings">
              <Button size="lg" className="w-full h-14 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold shadow-lg shadow-blue-200">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  กลับไปรายการจอง
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
