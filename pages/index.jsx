import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useState, useEffect } from 'react'
import apiClient, { routeAPI, reviewAPI, getToken } from '@/lib/api-client'

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [popularRoutes, setPopularRoutes] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // ดึงข้อมูลเส้นทางจาก API (รวมรูปภาพด้วย)
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const result = await routeAPI.getAll()

        if (result && result.success && result.data) {
          const formattedRoutes = result.data
            .slice(0, 3)
            .map(route => ({
              id: route.id,
              from: route.origin,
              to: route.destination,
              price: Math.round(route.base_price),
              duration: `${Math.round(route.duration_minutes / 60)} ชม.`,
              image: route.image_url || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
              rating: (4.5 + Math.random() * 0.5).toFixed(1),
              reviews: Math.floor(Math.random() * 400) + 100
            }))

          setPopularRoutes(formattedRoutes)
        }
      } catch (error) {
        console.error('Error fetching routes:', error)
        setPopularRoutes([])
      } finally {
        setLoading(false)
      }
    }

    fetchRoutes()
  }, [])

  // ฟังก์ชันสุ่มสี Avatar
  const getAvatarColor = (userId) => {
    const colors = [
      '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
      '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
    ]
    return colors[userId % colors.length]
  }

  // ดึงข้อมูลรีวิวจาก API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const result = await reviewAPI.getAll({ limit: 3 })
        if (result && result.success && result.data) {
          const reviewsWithColor = result.data.map(review => ({
            ...review,
            avatar_color: getAvatarColor(review.user_id)
          }))
          setReviews(reviewsWithColor)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
        setReviews([])
      }
    }

    fetchReviews()
  }, [])

  // ฟังก์ชันสำหรับสร้าง Avatar จากชื่อ
  const getInitials = (name) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      return words[0][0] + words[1][0] // เอาตัวแรกของชื่อและนามสกุล
    }
    return name[0] // เอาตัวแรกของชื่อ
  }

  // ฟังก์ชันซ่อนนามสกุล (เช่น "คุณนภัสสร วงศ์ไทย" -> "คุณนภัสสร ว.")
  const maskName = (name) => {
    const words = name.split(' ')
    if (words.length >= 2) {
      const lastName = words[words.length - 1]
      const maskedLastName = lastName[0] + '.'
      return [...words.slice(0, -1), maskedLastName].join(' ')
    }
    return name
  }

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - มี Background Image */}
        <section 
          className="relative min-h-[600px] lg:min-h-[700px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&h=1080&fit=crop)',
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <p className="text-red-400 font-semibold mb-4 text-lg">จองรถตู้ออนไลน์</p>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                เดินทางทั่วไทย
                <br />
                <span className="text-white">จองง่าย ได้ที่นั่ง</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-200 mb-12 max-w-2xl">
                จองล่วงหน้า เลือกที่นั่งเอง ชำระเงินออนไลน์
              </p>

              {/* กล่องค้นหา - Card ขาวโปร่งแสง */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8 max-w-3xl">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      ต้นทาง
                    </label>
                    <select className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-base bg-white">
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
                    <select className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-base bg-white">
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
                      className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 hover:border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all text-base bg-white"
                    />
                  </div>
                </div>
                
                <Link href="/search">
                  <Button className="w-full h-14 text-base font-semibold bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
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

        {/* Services Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-red-500 font-semibold mb-2">บริการของเรา</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                ทำไมต้องจองกับเรา
              </h2>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-all">
                  <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">จองง่ายรวดเร็ว</h3>
                <p className="text-gray-600 text-sm">จองได้ทันที ชำระเงินปลอดภัย ยืนยันทันใจ</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-all">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">เลือกที่นั่งได้</h3>
                <p className="text-gray-600 text-sm">เลือกที่นั่งที่ต้องการได้เลย</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-all">
                  <svg className="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">ราคาชัดเจน</h3>
                <p className="text-gray-600 text-sm">ราคาโปร่งใส เห็นราคาก่อนจอง</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">บริการดี ตลอด 24 ชม.</h3>
                <p className="text-gray-600 text-sm">สอบถามได้ทุกเวลา ทีมงานพร้อมช่วยเหลือ</p>
              </div>
            </div>
          </div>
        </section>

        {/* Package Cards - เส้นทางยอดนิยม พร้อมรูปภาพ */}
        <section className="py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-red-500 font-semibold mb-2">เส้นทางยอดนิยม</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                เส้นทางที่มีคนจองบ่อย
              </h2>
              <p className="text-gray-600 text-lg">
                เส้นทางหลักที่เปิดให้บริการ
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-300 rounded w-1/3 mb-3"></div>
                      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                ))
              ) : popularRoutes.length === 0 ? (
                // Empty state
                <div className="col-span-3 text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="text-gray-500 text-lg">ไม่พบข้อมูลเส้นทาง</p>
                </div>
              ) : (
                popularRoutes.map((route, idx) => (
                  <div key={route.id || idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
                  {/* รูปภาพ */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={route.image} 
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ยอดนิยม
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span className="font-semibold text-sm">{route.rating}</span>
                    </div>
                  </div>

                  {/* เนื้อหา */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{route.from}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {route.from} → {route.to}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      ใช้เวลาเดินทางประมาณ {route.duration}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-4">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {route.duration}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {route.reviews} รีวิว
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-500 text-sm">เริ่มต้น</span>
                        <div className="text-2xl font-bold text-red-500">
                          ฿{route.price}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => {
                          const token = getToken()
                          if (token) {
                            window.location.href = '/search'
                          } else {
                            window.location.href = '/login?redirect=/search'
                          }
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
                      >
                        จองเลย
                      </Button>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            <div className="text-center mt-10">
              <Link href="/search">
                <Button variant="outline" className="border-2 border-red-500 text-red-500 hover:bg-red-50 px-8 py-6 text-base rounded-xl">
                  ดูเส้นทางทั้งหมด
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section - เกี่ยวกับเรา */}
        <section id="about" className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-red-500 font-semibold mb-2">เกี่ยวกับเรา</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                ทำไมต้องเลือก VanGo
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                แพลตฟอร์มจองรถตู้ออนไลน์ที่เชื่อถือได้ พร้อมให้บริการคุณทุกเส้นทาง
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              {/* ด้านซ้าย - รูปภาพ */}
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop" 
                    alt="VanGo รถตู้" 
                    className="w-full h-[400px] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-red-500 text-white rounded-2xl p-6 shadow-xl">
                  <div className="text-4xl font-bold">5+</div>
                  <div className="text-sm">ปีของประสบการณ์</div>
                </div>
              </div>

              {/* ด้านขวา - เนื้อหา */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  จองรถตู้ออนไลน์ง่ายๆ ไว้วางใจได้
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  VanGo คือแพลตฟอร์มจองรถตู้ที่ทำให้การเดินทางของคุณสะดวกสบายขึ้น 
                  ด้วยระบบจองออนไลน์ที่ใช้งานง่าย รถคุณภาพดี และราคาที่เป็นธรรม 
                  เราพร้อมดูแลทุกการเดินทางของคุณอย่างใส่ใจ
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">รถสะอาด ปลอดภัย</h4>
                      <p className="text-gray-600 text-sm">ตรวจเช็คสภาพรถทุกเที่ยว พร้อมใบอนุญาตครบถ้วน</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">ขับขี่ปลอดภัย มีประกัน</h4>
                      <p className="text-gray-600 text-sm">คนขับมีใบอนุญาตถูกต้อง พร้อมประกันภัยทุกเที่ยว</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">ราคาชัดเจน จ่ายตามที่เห็น</h4>
                      <p className="text-gray-600 text-sm">ไม่มีค่าใช้จ่ายซ่อนเร้น ราคาที่แสดงคือราคาจริง</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">10K+</div>
                    <div className="text-gray-600 text-sm mt-1">ผู้ใช้งาน</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">20+</div>
                    <div className="text-gray-600 text-sm mt-1">เส้นทางบริการ</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">4.5★</div>
                    <div className="text-gray-600 text-sm mt-1">คะแนนรีวิว</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-red-500 font-semibold mb-2">รีวิวจากลูกค้า</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                ความคิดเห็นจากผู้ใช้บริการจริง
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reviews.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">
                  กำลังโหลดรีวิว...
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <div key={idx} className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-red-200 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      {/* Avatar - วงกลมสีพร้อมตัวอักษรตัวแรก */}
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: review.avatar_color }}
                      >
                        {getInitials(review.user_name)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{maskName(review.user_name)}</h4>
                        <div className="flex gap-0.5">
                          {[...Array(review.rating)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 leading-relaxed">
                      "{review.comment}"
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{formatDate(review.created_at)}</span>
                      <span className="text-red-500 font-medium">{review.route_name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
