import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'

export default function RoutesManagement() {
  const [showModal, setShowModal] = useState(false)
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoutes()
  }, [])

  const fetchRoutes = async () => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch('http://localhost:8000/api/admin/routes', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setRoutes(data.data)
      // }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching routes:', error)
      setLoading(false)
    }
  }

  const handleAddRoute = async (formData) => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch('http://localhost:8000/api/admin/routes', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()
      // if (data.success) {
      //   fetchRoutes()
      //   setShowModal(false)
      // }
    } catch (error) {
      console.error('Error adding route:', error)
    }
  }

  return (
    <>
      <Head>
        <title>จัดการเส้นทาง - Admin Panel</title>
      </Head>
      <AdminLayout>
        <div className="space-y-8">
          {/* Hero Header */}
          <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 via-pink-600/90 to-red-600/85"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    🗺️ จัดการเส้นทาง
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    กำหนดจุดเริ่มต้น ปลายทาง และราคาค่าโดยสาร
                  </p>
                  <div className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <span className="font-medium">เส้นทางทั้งหมด {routes.length} เส้นทาง</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-purple-600 hover:bg-purple-50 font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  เพิ่มเส้นทาง
                </Button>
              </div>
            </div>
          </div>

          {/* Routes Grid - Travel Destination Style */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : routes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route) => (
                <div key={route.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white border-2 border-gray-100 hover:border-purple-200">
                  {/* Destination Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={route.image_url || 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600'} 
                      alt={`${route.origin} to ${route.destination}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Popular Badge */}
                    {route.is_popular && (
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white shadow-lg flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          ยอดนิยม
                        </span>
                      </div>
                    )}

                    {/* Route Path */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="font-bold text-gray-900">{route.origin}</span>
                          </div>
                          <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{route.destination}</span>
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-purple-700 font-medium">ราคา</span>
                        </div>
                        <div className="text-2xl font-bold text-purple-900">฿{route.base_price}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-blue-700 font-medium">ระยะเวลา</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-900">{Math.round(route.duration_minutes / 60)} ชม.</div>
                      </div>
                    </div>

                    {/* Distance */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-700">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm font-medium">ระยะทาง</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{route.distance_km} กม.</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        แก้ไข
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-all"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
              <div className="text-8xl mb-4">🗺️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่มีเส้นทางในระบบ</h3>
              <p className="text-gray-600 mb-6">เริ่มต้นเพิ่มเส้นทางแรกของคุณ</p>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                เพิ่มเส้นทาง
              </Button>
            </div>
          )}

          {/* Add Route Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">เพิ่มเส้นทางใหม่</h2>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          ต้นทาง
                        </span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                        placeholder="กรุงเทพฯ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          ปลายทาง
                        </span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                        placeholder="พัทยา"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ราคา (บาท)
                        </span>
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                        placeholder="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ระยะเวลา (นาที)
                        </span>
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                        placeholder="120"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        ระยะทาง (กม.)
                      </span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                      placeholder="147"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        รูปภาพ (URL)
                      </span>
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                      placeholder="https://example.com/destination.jpg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="flex-1 border-2 hover:bg-gray-50" 
                      onClick={() => setShowModal(false)}
                      size="lg"
                    >
                      ยกเลิก
                    </Button>
                    <Button 
                      type="button"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all" 
                      onClick={() => setShowModal(false)}
                      size="lg"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      บันทึก
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
