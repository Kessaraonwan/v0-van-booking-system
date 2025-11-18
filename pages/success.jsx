import Link from 'next/link'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>จองสำเร็จ - VanGo</title>
      </Head>

      <Navbar showAuth={false} showBookings={true} />

      {/* Success Hero Section */}
      <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Animated Success Icon */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
            <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">จองสำเร็จ! 🎉</h1>
          <p className="text-xl text-white/90 mb-2">ขอบคุณที่ใช้บริการ VanGo</p>
          <p className="text-white/80">การจองของคุณเสร็จสมบูรณ์แล้ว</p>
        </div>
      </div>

      <main className="flex-1 bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Booking Details Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 mb-8">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h2 className="text-2xl font-bold">รายละเอียดการจอง</h2>
                    <p className="text-white/80 text-sm">โปรดเก็บข้อมูลนี้ไว้สำหรับการเดินทาง</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/70 mb-1">สถานะ</div>
                  <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    <span className="text-sm font-semibold">ชำระเงินแล้ว</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Booking Reference */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border-2 border-dashed border-orange-200">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">รหัสการจอง</div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 font-mono mb-1">BK-2025-001</div>
                  <div className="text-sm text-gray-500">กรุณาจดหรือถ่ายภาพเก็บไว้</div>
                </div>
              </div>

              {/* Trip Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Route */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">เส้นทาง</div>
                      <div className="font-bold text-gray-900 text-lg">กรุงเทพ → พัทยา</div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">วันที่เดินทาง</div>
                      <div className="font-bold text-gray-900 text-lg">18 พ.ย. 2025</div>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">เวลาออกเดินทาง</div>
                      <div className="font-bold text-gray-900 text-lg">09:00 น.</div>
                    </div>
                  </div>
                </div>

                {/* Seats */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-600 mb-1">ที่นั่ง</div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm shadow-sm">1</span>
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 text-white font-bold rounded-lg text-sm shadow-sm">2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">QR Code สำหรับขึ้นรถ</h3>
                  <p className="text-gray-600">แสดง QR Code นี้เมื่อขึ้นรถ</p>
                </div>

                <div className="w-72 h-72 bg-white border-4 border-gray-300 rounded-3xl mx-auto flex items-center justify-center shadow-2xl">
                  <div className="text-center p-8">
                    <svg className="w-32 h-32 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                    <div className="text-sm text-gray-500 font-medium">QR Code</div>
                  </div>
                </div>

                <div className="mt-6 bg-white rounded-xl p-4 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">หมายเหตุ:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• กรุณามาถึงจุดนัดพบก่อนเวลาออกเดินทาง 15 นาที</li>
                        <li>• เตรียม QR Code นี้ให้พร้อมสำหรับสแกน</li>
                        <li>• หากมีปัญหาติดต่อ 02-123-4567</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-700">ราคาต่อที่นั่ง</span>
                  <span className="font-semibold text-gray-900">฿150</span>
                </div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-300">
                  <span className="text-gray-700">จำนวนที่นั่ง</span>
                  <span className="font-semibold text-gray-900">× 2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">ยอดชำระทั้งหมด</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">฿300</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/bookings">
              <Button size="lg" className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-200">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  ดูการจองทั้งหมด
                </span>
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg" className="w-full h-14 border-2 border-gray-300 hover:bg-gray-50 font-semibold">
                <span className="flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  กลับหน้าแรก
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
