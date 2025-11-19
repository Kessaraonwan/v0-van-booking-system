import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useToast } from '@/hooks/use-toast'
import { getPickupLocation, getDropoffLocation, formatThaiDate, formatTime } from '@/lib/locations'

export default function BookingConfirmPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { scheduleId, seats, total } = router.query
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  })
  const [schedule, setSchedule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Check auth and load user data
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const userStr = localStorage.getItem('user')
    
    if (!token) {
      router.push('/login')
      return
    }

    if (userStr) {
      const user = JSON.parse(userStr)
      setFormData({
        fullName: user.full_name || '',
        phone: user.phone || '',
        email: user.email || ''
      })
    }
  }, [])

  // Fetch schedule details
  useEffect(() => {
    if (scheduleId) {
      fetchScheduleDetails()
    }
  }, [scheduleId])

  const fetchScheduleDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/schedules/${scheduleId}`)
      const data = await response.json()
      
      if (data.success) {
        setSchedule(data.data)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleConfirm = async () => {
    // Validation
    if (!formData.fullName || !formData.phone) {
      toast({
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        description: "ชื่อ-นามสกุล และเบอร์โทรศัพท์เป็นข้อมูลที่จำเป็น",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)

    try {
      const token = localStorage.getItem('accessToken')
      const seatArray = seats.split(',').map(Number)
      
      const response = await fetch('http://localhost:8000/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          schedule_id: scheduleId,
          seat_numbers: seatArray,
          passenger_name: formData.fullName,
          passenger_phone: formData.phone,
          passenger_email: formData.email || null
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "✅ สร้างการจองสำเร็จ",
          description: `เลขที่การจอง: ${data.data.booking_number}`,
        })

        // Redirect to payment page
        setTimeout(() => {
          router.push(`/payments/${data.data.id}`)
        }, 1000)
      } else {
        throw new Error(data.message || 'การจองล้มเหลว')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถสร้างการจองได้ กรุณาลองใหม่",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>ยืนยันการจอง - VanGo</title>
      </Head>

      <Navbar />

      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Steps */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center font-bold mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-sm font-medium text-white/90">เลือกที่นั่ง</div>
              </div>
              <div className="h-0.5 bg-white/40 flex-1 mx-4"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-white text-orange-600 flex items-center justify-center font-bold mb-2 shadow-lg">2</div>
                <div className="text-sm font-bold text-white">ยืนยัน</div>
              </div>
              <div className="h-0.5 bg-white/40 flex-1 mx-4"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white flex items-center justify-center font-bold mb-2">3</div>
                <div className="text-sm text-white/70">เสร็จสิ้น</div>
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">ยืนยันการจอง</h1>
            <p className="text-white/90 text-lg">กรุณากรอกข้อมูลผู้โดยสารให้ครบถ้วน</p>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-orange-50 via-white to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Passenger Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    ข้อมูลผู้โดยสาร
                  </h2>
                  <p className="text-white/80 mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
                </div>

                {/* Form Content */}
                <div className="p-8">
                  <form className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อ-นามสกุล"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        เบอร์โทรศัพท์
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="กรอกเบอร์โทรศัพท์"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        อีเมล (ไม่บังคับ)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="กรอกอีเมล"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                      />
                    </div>

                    {/* Info Note */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                      <div className="flex gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">ข้อมูลสำคัญ</p>
                          <p className="text-sm text-blue-700">กรุณาตรวจสอบข้อมูลให้ถูกต้อง ข้อมูลจะถูกใช้ในการออกตั๋วและติดต่อกลับ</p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 sticky top-24">
                {/* Summary Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-5">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h2 className="text-xl font-bold">สรุปการจอง</h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
                    </div>
                  ) : schedule ? (
                    <>
                      {/* Route */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-orange-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">เส้นทาง</div>
                            <div className="font-bold text-gray-900">
                              {getPickupLocation(schedule.route?.origin)?.name} → {getDropoffLocation(schedule.route?.destination)?.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex gap-3">
                        <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-xs">วันที่</span>
                          </div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {formatThaiDate(schedule.departure_date)}
                          </div>
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs">เวลา</span>
                          </div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {formatTime(schedule.departure_time)}
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="space-y-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            ทะเบียนรถ
                          </span>
                          <span className="font-semibold text-gray-900 font-mono">
                            {schedule.van?.license_plate || '-'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            ที่นั่ง
                          </span>
                          <div className="flex gap-1">
                            {seats && seats.split(',').map((seat) => (
                              <span key={seat} className="px-2 py-1 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded text-xs">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            จำนวน
                          </span>
                          <span className="font-semibold text-gray-900">
                            {seats ? seats.split(',').length : 0} ที่นั่ง
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">ราคาต่อที่นั่ง</span>
                          <span className="font-semibold text-gray-900">
                            ฿{parseFloat(schedule.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pb-3 mb-3 border-b border-gray-300">
                          <span className="text-sm text-gray-600">จำนวนที่นั่ง</span>
                          <span className="font-semibold text-gray-900">
                            × {seats ? seats.split(',').length : 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">ราคารวม</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ฿{total || (seats ? parseFloat(schedule.price) * seats.split(',').length : 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    <Button 
                      size="lg" 
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200 transition-all duration-200"
                      onClick={handleConfirm}
                      disabled={submitting || loading}
                    >
                      <span className="flex items-center gap-2">
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            กำลังสร้างการจอง...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            ยืนยันและไปชำระเงิน
                          </>
                        )}
                      </span>
                    </Button>

                    <Link href={`/seats/${scheduleId}`}>
                      <Button variant="outline" size="lg" className="w-full h-12 border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          กลับไปเลือกที่นั่ง
                        </span>
                      </Button>
                    </Link>
                  </div>
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
