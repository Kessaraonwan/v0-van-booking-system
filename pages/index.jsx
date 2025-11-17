import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function HomePage() {
  const popularRoutes = [
    { from: 'กรุงเทพฯ', to: 'พัทยา', price: 150, duration: '2 ชม.' },
    { from: 'กรุงเทพฯ', to: 'หัวหิน', price: 200, duration: '3 ชม.' },
    { from: 'กรุงเทพฯ', to: 'เชียงใหม่', price: 650, duration: '10 ชม.' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - เรียบ สะอาด ชัดเจน */}
        <section className="bg-gradient-to-br from-blue-50 to-white py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                จองตั๋วรถตู้
                <br />
                <span className="text-blue-600">ได้ในไม่กี่คลิก</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                เลือกเส้นทาง เวลา และที่นั่งได้ด้วยตัวเอง
              </p>

              {/* กล่องค้นหา - Card ขาวใหญ่ */}
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      ต้นทาง
                    </label>
                    <select className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-base">
                      <option>กรุงเทพฯ</option>
                      <option>เชียงใหม่</option>
                      <option>ภูเก็ต</option>
                      <option>ขอนแก่น</option>
                    </select>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      ปลายทาง
                    </label>
                    <select className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-base">
                      <option>พัทยา</option>
                      <option>หัวหิน</option>
                      <option>เชียงใหม่</option>
                      <option>กรุงเทพฯ</option>
                    </select>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      วันเดินทาง
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-base"
                    />
                  </div>
                </div>
                
                <Link href="/search">
                  <Button className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ค้นหาเที่ยวรถ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* เส้นทางยอดนิยม - Card สวยๆ */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                เส้นทางยอดนิยม
              </h2>
              <p className="text-gray-600 text-lg">
                เส้นทางที่ได้รับความนิยมสูงสุด
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {popularRoutes.map((route, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-lg font-bold text-gray-900">{route.from}</div>
                    </div>
                    
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    
                    <div className="text-lg font-bold text-gray-900">{route.to}</div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500">ราคาเริ่มต้น</div>
                      <div className="text-2xl font-bold text-blue-600">
                        ฿{route.price}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">ระยะเวลา</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {route.duration}
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/search">
                    <Button variant="outline" className="w-full mt-4 border-blue-600 text-blue-600 hover:bg-blue-50">
                      ดูเที่ยวรถ
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features - สีเรียบๆ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">จองง่าย รวดเร็ว</h3>
                <p className="text-gray-600">จองและชำระเงินได้ภายในไม่กี่นาที</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">เลือกที่นั่งเอง</h3>
                <p className="text-gray-600">เลือกที่นั่งที่คุณต้องการได้ตามใจชอบ</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ปลอดภัย มั่นใจ</h3>
                <p className="text-gray-600">ระบบชำระเงินที่ปลอดภัย เชื่อถือได้</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
