import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useToast } from '@/hooks/use-toast'
import { getPickupLocation, getDropoffLocation, formatThaiDate, formatTime } from '@/lib/locations'

export default function PaymentPage() {
  const router = useRouter()
  const { bookingId } = router.query
  const { toast } = useToast()
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('PromptPay')
  const [slipFile, setSlipFile] = useState(null)
  const [slipPreview, setSlipPreview] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
      return
    }

    if (bookingId) {
      fetchBookingDetails()
    }
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setBooking(data.data)
        
        // Check if already paid
        if (data.data.payment_status === 'PAID') {
          toast({
            title: "การจองนี้ชำระเงินแล้ว",
            description: "กำลังนำคุณกลับไปหน้ารายการจอง",
          })
          setTimeout(() => router.push('/bookings'), 2000)
        }
      } else {
        toast({
          title: "ไม่พบข้อมูลการจอง",
          description: data.message,
          variant: "destructive"
        })
        router.push('/bookings')
      }
    } catch (error) {
      console.error('Error fetching booking:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลการจองได้",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSlipChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSlipFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSlipPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePayment = async () => {
    // Validation: PromptPay/Bank Transfer ต้องมีสลิป
    if ((paymentMethod === 'PromptPay' || paymentMethod === 'Bank Transfer') && !slipPreview) {
      toast({
        title: "กรุณาแนบสลิปการโอนเงิน",
        description: "การชำระเงินออนไลน์ต้องแนบสลิปเพื่อยืนยัน",
        variant: "destructive"
      })
      return
    }

    setPaying(true)
    
    try {
      const token = localStorage.getItem('accessToken')
      
      const response = await fetch(`http://localhost:8000/api/bookings/${bookingId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          payment_slip_url: slipPreview || null
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Different messages based on payment method
        if (paymentMethod === 'Offline') {
          toast({
            title: "✅ ยืนยันการจองสำเร็จ",
            description: "กรุณาชำระเงินที่ศูนย์บริการภายใน 2 ชั่วโมง",
            duration: 5000
          })
        } else {
          toast({
            title: "✅ ส่งสลิปสำเร็จ",
            description: "รอเจ้าหน้าที่ตรวจสอบสลิปภายใน 15 นาที",
            duration: 5000
          })
        }
        
        setTimeout(() => {
          router.push('/bookings')
        }, 2000)
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      })
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl animate-pulse"></div>
            </div>
            <p className="text-gray-700 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return null
  }

  const pickupLocation = getPickupLocation(booking.schedule?.route?.origin)
  const dropoffLocation = getDropoffLocation(booking.schedule?.route?.destination)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>ชำระเงิน - VanGo</title>
      </Head>
      
      <Navbar />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ชำระเงิน</h1>
            <p className="text-gray-600">เลขที่การจอง: {booking.booking_number}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Booking Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trip Details */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">รายละเอียดการเดินทาง</h2>
                
                <div className="space-y-4">
                  {/* Route */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div className="w-0.5 h-12 bg-gray-300"></div>
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">ต้นทาง</p>
                        <p className="font-semibold text-gray-900">{pickupLocation?.full || booking.schedule?.route?.origin}</p>
                        <p className="text-sm text-gray-600">{pickupLocation?.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ปลายทาง</p>
                        <p className="font-semibold text-gray-900">{dropoffLocation?.full || booking.schedule?.route?.destination}</p>
                        <p className="text-sm text-gray-600">{dropoffLocation?.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">วันที่เดินทาง</p>
                      <p className="font-semibold text-gray-900">
                        {formatThaiDate(booking.schedule?.departure_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">เวลาออกเดินทาง</p>
                      <p className="font-semibold text-gray-900">
                        {formatTime(booking.schedule?.departure_time)}
                      </p>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">ที่นั่ง</p>
                    <p className="font-semibold text-gray-900">
                      {booking.seat_numbers?.join(', ')} ({booking.total_seats} ที่นั่ง)
                    </p>
                  </div>

                  {/* Passenger */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-500">ผู้โดยสาร</p>
                    <p className="font-semibold text-gray-900">{booking.passenger_name}</p>
                    <p className="text-sm text-gray-600">{booking.passenger_phone}</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">เลือกวิธีชำระเงิน</h2>
                
                <div className="space-y-3">
                  {['PromptPay', 'Bank Transfer', 'Offline'].map((method) => (
                    <label
                      key={method}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-4 h-4 text-orange-500"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {method === 'PromptPay' && '💳 PromptPay'}
                          {method === 'Bank Transfer' && '🏦 โอนผ่านธนาคาร'}
                          {method === 'Offline' && '🏢 ชำระที่ศูนย์บริการ'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {method === 'PromptPay' && 'สแกน QR Code แล้วแนบสลิป'}
                          {method === 'Bank Transfer' && 'โอนเงินแล้วแนบสลิป'}
                          {method === 'Offline' && 'ชำระเงินสดที่ศูนย์บริการ'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Upload Slip (Mock) */}
              {(paymentMethod === 'PromptPay' || paymentMethod === 'Bank Transfer') && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">แนบสลิปการโอนเงิน</h2>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipChange}
                        className="hidden"
                        id="slip-upload"
                      />
                      <label htmlFor="slip-upload" className="cursor-pointer">
                        {slipPreview ? (
                          <div>
                            <img src={slipPreview} alt="Slip Preview" className="max-w-full max-h-64 mx-auto rounded-lg" />
                            <p className="mt-2 text-sm text-gray-600">คลิกเพื่อเปลี่ยนรูปภาพ</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-gray-600 font-medium">คลิกเพื่ออัปโหลดสลิป</p>
                            <p className="text-sm text-gray-500">PNG, JPG (สูงสุด 10MB)</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white sticky top-24">
                <h2 className="text-xl font-bold mb-6">สรุปการชำระเงิน</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-orange-100">ราคาต่อที่นั่ง</span>
                    <span className="font-semibold">
                      ฿{(booking.total_price / booking.total_seats).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-100">จำนวนที่นั่ง</span>
                    <span className="font-semibold">{booking.total_seats} ที่นั่ง</span>
                  </div>
                  <div className="border-t border-orange-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">ยอดชำระทั้งหมด</span>
                      <span className="text-2xl font-bold">฿{parseFloat(booking.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Mock QR Code */}
                {paymentMethod === 'PromptPay' && (
                  <div className="bg-white rounded-xl p-4 mb-6">
                    <p className="text-sm text-gray-600 text-center mb-3">สแกน QR Code เพื่อชำระเงิน</p>
                    <div className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-32 h-32 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                        </svg>
                        <p className="text-xs text-gray-500 mt-2">QR Code</p>
                      </div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold py-6 text-lg rounded-xl shadow-lg"
                >
                  {paying ? '⏳ กำลังดำเนินการ...' : '✅ ฉันชำระเงินแล้ว'}
                </Button>

                <p className="text-xs text-orange-100 text-center mt-4">
                  กดปุ่มนี้เพื่อยืนยันการชำระเงิน
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
