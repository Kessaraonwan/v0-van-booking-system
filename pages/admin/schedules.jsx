import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'

export default function SchedulesManagement() {
  const [showModal, setShowModal] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [routes, setRoutes] = useState([])
  const [vans, setVans] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchSchedules()
    fetchRoutes()
    fetchVans()
  }, [selectedDate])

  const fetchSchedules = async () => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch(`http://localhost:8000/api/admin/schedules?date=${selectedDate}`, {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setSchedules(data.data)
      // }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching schedules:', error)
      setLoading(false)
    }
  }

  const fetchRoutes = async () => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch('http://localhost:8000/api/routes')
      // const data = await response.json()
      // if (data.success) {
      //   setRoutes(data.data)
      // }
    } catch (error) {
      console.error('Error fetching routes:', error)
    }
  }

  const fetchVans = async () => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch('http://localhost:8000/api/admin/vans', {
      //   headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      // })
      // const data = await response.json()
      // if (data.success) {
      //   setVans(data.data)
      // }
    } catch (error) {
      console.error('Error fetching vans:', error)
    }
  }

  const handleAddSchedule = async (formData) => {
    try {
      // TODO: เชื่อม API จริง
      // const response = await fetch('http://localhost:8000/api/admin/schedules', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      //   },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()
      // if (data.success) {
      //   fetchSchedules()
      //   setShowModal(false)
      // }
    } catch (error) {
      console.error('Error adding schedule:', error)
    }
  }

  // Group schedules by time
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const time = schedule.departure_time
    if (!acc[time]) {
      acc[time] = []
    }
    acc[time].push(schedule)
    return acc
  }, {})

  const sortedTimes = Object.keys(groupedSchedules).sort()

  return (
    <>
      <Head>
        <title>จัดการรอบรถ - Admin Panel</title>
      </Head>
      <AdminLayout>
        <div className="space-y-8">
          {/* Hero Header */}
          <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 via-emerald-600/90 to-teal-600/85"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    🗓️ จัดการรอบรถ
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    กำหนดตารางเดินรถและจัดการรอบเดินทาง
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent text-white font-medium border-none outline-none"
                      />
                    </div>
                    <span className="text-white/90 font-medium">รอบรถทั้งหมด {schedules.length} รอบ</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-2xl hover:shadow-3xl transition-all hover:scale-105"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  เพิ่มรอบรถ
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline View */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                    <div className="h-32 bg-gray-300 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : schedules.length > 0 ? (
            <div className="space-y-6">
              {sortedTimes.map((time) => (
                <div key={time} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                  {/* Time Header */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-gray-100">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{time} น.</div>
                      <div className="text-sm text-gray-600">{groupedSchedules[time].length} เที่ยว</div>
                    </div>
                  </div>

                  {/* Schedules Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {groupedSchedules[time].map((schedule) => {
                      const occupancy = (schedule.booked_seats / schedule.total_seats) * 100
                      return (
                        <div key={schedule.id} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-green-200">
                          {/* Van Image Corner */}
                          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden">
                            <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>

                          <div className="relative p-5">
                            {/* Route Info */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <span className="font-bold text-gray-900 text-lg">{schedule.route?.origin}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="font-bold text-gray-900 text-lg">{schedule.route?.destination}</span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {occupancy === 100 ? (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                                    เต็ม
                                  </span>
                                ) : occupancy >= 80 ? (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500 text-white shadow-lg">
                                    ใกล้เต็ม
                                  </span>
                                ) : (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                                    ว่าง
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200">
                                <div className="text-xs text-blue-700 font-medium mb-1">รถ</div>
                                <div className="font-mono font-bold text-blue-900">{schedule.van?.license_plate}</div>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200">
                                <div className="text-xs text-purple-700 font-medium mb-1">ราคา</div>
                                <div className="font-bold text-purple-900">฿{schedule.route?.base_price}</div>
                              </div>
                              <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
                                <div className="text-xs text-green-700 font-medium mb-1">ที่นั่ง</div>
                                <div className="font-bold text-green-900">{schedule.booked_seats}/{schedule.total_seats}</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>จองแล้ว {occupancy.toFixed(0)}%</span>
                                <span>{schedule.total_seats - schedule.booked_seats} ที่ว่าง</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    occupancy === 100 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                    occupancy >= 80 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-green-500 to-emerald-500'
                                  }`}
                                  style={{ width: `${occupancy}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                ดูรายละเอียด
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-2 border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                แก้ไข
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
              <div className="text-8xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ยังไม่มีรอบรถในวันนี้</h3>
              <p className="text-gray-600 mb-6">เริ่มต้นเพิ่มรอบรถสำหรับวันที่เลือก</p>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                เพิ่มรอบรถ
              </Button>
            </div>
          )}

          {/* Add Schedule Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">เพิ่มรอบรถใหม่</h2>
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
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        รถตู้
                      </span>
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium">
                      <option value="">เลือกรถตู้</option>
                      {vans.map(van => (
                        <option key={van.id} value={van.id}>{van.license_plate}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        เส้นทาง
                      </span>
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium">
                      <option value="">เลือกเส้นทาง</option>
                      {routes.map(route => (
                        <option key={route.id} value={route.id}>
                          {route.origin} → {route.destination}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          วันที่
                        </span>
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          เวลาออกเดินทาง
                        </span>
                      </label>
                      <input
                        type="time"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-bold text-lg"
                      />
                    </div>
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
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all" 
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
