import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'
import { adminAPI, routeAPI } from '@/lib/api-client'
import { formatTime, formatIsoTime, formatThaiDate } from '@/lib/locations'

export default function SchedulesManagement() {
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' | 'edit' | 'view'
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [formVanId, setFormVanId] = useState('')
  const [formRouteId, setFormRouteId] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formTotalSeats, setFormTotalSeats] = useState(13)
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
      setLoading(true)
      const response = await adminAPI.getAllSchedules({ date: selectedDate })
      if (response.success) {
        setSchedules(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRoutes = async () => {
    try {
      const response = await routeAPI.getAll()
      if (response.success) {
        setRoutes(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching routes:', error)
    }
  }

  const fetchVans = async () => {
    try {
      const response = await adminAPI.getAllVans()
      if (response.success) {
        setVans(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching vans:', error)
    }
  }

  const handleAddSchedule = async (formData) => {
    try {
      const response = await adminAPI.createSchedule(formData)
      if (response.success) {
        await fetchSchedules()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error adding schedule:', error)
    }
  }

  const openViewModal = (schedule) => {
    setModalMode('view')
    setEditingSchedule(schedule)
    setShowModal(true)
  }

  const openEditModal = (schedule) => {
    setModalMode('edit')
    setEditingSchedule(schedule)
    setFormVanId(schedule.van_id || schedule.van?.id || '')
    setFormRouteId(schedule.route_id || schedule.route?.id || '')
    // If departure_time is ISO, extract date and time
    if (schedule.departure_time && schedule.departure_time.includes('T')) {
      const [d, t] = schedule.departure_time.split('T')
      setFormDate(d)
      setFormTime(t.slice(0,5))
    } else {
      setFormDate(schedule.departure_date || selectedDate)
      setFormTime(schedule.departure_time || '')
    }
    setFormTotalSeats(schedule.total_seats || 13)
    setShowModal(true)
  }

  const clearScheduleForm = () => {
    setEditingSchedule(null)
    setFormVanId('')
    setFormRouteId('')
    setFormDate(selectedDate)
    setFormTime('')
    setFormTotalSeats(13)
    setModalMode('add')
  }

  const handleSaveSchedule = async () => {
    const payload = {
      van_id: formVanId,
      route_id: formRouteId,
      departure_date: formDate,
      departure_time: formTime,
      total_seats: Number(formTotalSeats) || 13,
    }

    try {
      let res
      if (modalMode === 'edit' && editingSchedule && editingSchedule.id) {
        res = await adminAPI.updateSchedule(editingSchedule.id, payload)
      } else {
        res = await adminAPI.createSchedule(payload)
      }

      if (res && res.success) {
        await fetchSchedules()
        setShowModal(false)
        clearScheduleForm()
      }
    } catch (err) {
      console.error('Error saving schedule:', err)
    }
  }

  const handleDeleteSchedule = async (id) => {
    if (!confirm('ต้องการลบรอบรถนี้ใช่หรือไม่?')) return
    try {
      const res = await adminAPI.deleteSchedule(id)
      if (res && res.success) {
        await fetchSchedules()
      }
    } catch (err) {
      console.error('Error deleting schedule:', err)
    }
  }

  // Group schedules by HH:MM (use ISO-safe helper to avoid timezone shifts)
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    const timeKey = formatIsoTime(schedule.departure_time) || schedule.departure_time || '00:00'
    if (!acc[timeKey]) acc[timeKey] = []
    acc[timeKey].push(schedule)
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
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    ตารางรถวิ่ง
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    ดูและจัดการรอบรถแต่ละวัน
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
                  onClick={() => { setModalMode('add'); clearScheduleForm(); setShowModal(true); }}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold transition-all"
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
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
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
                <div key={time} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  {/* Time Header */}
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{time} น.</div>
                      <div className="text-sm text-gray-600">{groupedSchedules[time].length} เที่ยว • {formatThaiDate(selectedDate)}</div>
                    </div>
                  </div>

                  {/* Schedules Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {groupedSchedules[time].map((schedule) => {
                      // Resolve related route and van data (backend may return only IDs)
                      const matchedRoute = schedule.route || routes.find(r => r.id === schedule.route_id) || {}
                      const matchedVan = schedule.van || vans.find(v => v.id === schedule.van_id) || {}
                      const totalSeats = Number(schedule.total_seats ?? matchedVan.total_seats ?? 13) || 13
                      const safeTotalSeats = Math.max(Number(totalSeats) || 13, 1)
                      let bookedSeats = (() => {
                        // multiple possible shapes from backend
                        if (typeof schedule.booked_seats === 'number') return schedule.booked_seats
                        if (typeof schedule.booked_seats === 'string' && schedule.booked_seats.trim() !== '') {
                          const n = parseInt(schedule.booked_seats, 10)
                          if (!Number.isNaN(n)) return n
                        }
                        if (typeof schedule.bookings_count === 'number') return schedule.bookings_count
                        if (typeof schedule.bookings_count === 'string' && schedule.bookings_count.trim() !== '') {
                          const n = parseInt(schedule.bookings_count, 10)
                          if (!Number.isNaN(n)) return n
                        }
                        if (Array.isArray(schedule.bookings)) return schedule.bookings.length
                        if (typeof schedule.bookings === 'number') return schedule.bookings
                        if (typeof schedule.booked_count === 'number') return schedule.booked_count
                        if (typeof schedule.booked_count === 'string' && schedule.booked_count.trim() !== '') {
                          const n = parseInt(schedule.booked_count, 10)
                          if (!Number.isNaN(n)) return n
                        }
                        return 0
                      })()

                      // If backend exposes available seats, compute booked = total - available
                      if ((schedule.available_seats !== undefined && schedule.available_seats !== null) || (schedule.availableSeats !== undefined && schedule.availableSeats !== null)) {
                        const avail = schedule.available_seats ?? schedule.availableSeats
                        let av = 0
                        if (typeof avail === 'number') av = Number(avail)
                        else if (typeof avail === 'string' && avail.trim() !== '' && !isNaN(Number(avail))) av = Number(avail)
                        bookedSeats = Math.max(safeTotalSeats - av, 0)
                      }

                      const safeBookedSeats = Math.max(Number(bookedSeats) || 0, 0)
                      const occupancy = safeTotalSeats > 0 ? (safeBookedSeats / safeTotalSeats) * 100 : 0
                      return (
                        <div key={schedule.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-red-300">
                          {/* Van Image Corner */}
                          <div className="absolute top-0 right-0 w-32 h-32 opacity-5 overflow-hidden">
                            <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>

                          <div className="relative p-5">
                            {/* Route Info */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                  <span className="font-bold text-gray-900 text-lg">{matchedRoute.origin || schedule.origin || '-'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                  </svg>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                  <span className="font-bold text-gray-900 text-lg">{matchedRoute.destination || schedule.destination || '-'}</span>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div>
                                {occupancy === 100 ? (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white">
                                    เต็ม
                                  </span>
                                ) : occupancy >= 80 ? (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-500 text-white">
                                    ใกล้เต็ม
                                  </span>
                                ) : (
                                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white">
                                    ว่าง {safeTotalSeats - Math.max(Number(bookedSeats) || 0, 0)} ที่
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                <div className="text-xs text-gray-600 font-medium mb-1">รถ</div>
                                <div className="font-mono font-bold text-gray-900">{matchedVan.license_plate || schedule.license_plate || '-'}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                <div className="text-xs text-gray-600 font-medium mb-1">ราคา</div>
                                <div className="font-bold text-gray-900">฿{matchedRoute.base_price || schedule.price || 0}</div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                                <div className="text-xs text-gray-600 font-medium mb-1">ที่นั่ง</div>
                                <div className="font-bold text-gray-900">{Math.max(Number(bookedSeats) || 0, 0)}/{safeTotalSeats}</div>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>จองแล้ว {occupancy.toFixed(0)}%</span>
                                <span>{safeTotalSeats - Math.max(Number(bookedSeats) || 0, 0)} ที่ว่าง</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all ${
                                    occupancy === 100 ? 'bg-red-500' :
                                    occupancy >= 80 ? 'bg-yellow-500' :
                                    'bg-green-500'
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
                                className="flex-1 border border-blue-300 text-blue-600 hover:bg-blue-50"
                                onClick={() => openViewModal(schedule)}
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
                                className="flex-1 border border-green-300 text-green-600 hover:bg-green-50"
                                onClick={() => openEditModal(schedule)}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                แก้ไข
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border border-red-300 text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteSchedule(schedule.id)}
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
            <div className="bg-white rounded-xl shadow-lg p-16 text-center border border-dashed border-gray-300">
              <svg className="w-24 h-24 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">วันนี้ยังไม่มีรถวิ่ง</h3>
              <p className="text-gray-600 mb-6">คลิกปุ่มด้านล่างเพื่อเพิ่มรอบรถ</p>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                เพิ่มรอบรถ
              </Button>
            </div>
          )}

          {/* Add/Edit/View Schedule Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                <div className="bg-red-500 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{modalMode === 'add' ? 'สร้างรอบรถใหม่' : modalMode === 'edit' ? 'แก้ไขรอบรถ' : 'รายละเอียดรอบรถ'}</h2>
                    <button 
                      onClick={() => { setShowModal(false); clearScheduleForm(); }}
                      className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {modalMode === 'view' && editingSchedule ? (
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-sm text-gray-600">เส้นทาง</div>
                      <div className="font-bold">{editingSchedule.route?.origin || editingSchedule.origin} → {editingSchedule.route?.destination || editingSchedule.destination}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">รถตู้</div>
                      <div className="font-mono font-bold">{editingSchedule.van?.license_plate || editingSchedule.license_plate || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">วันที่</div>
                      <div className="font-bold">{formatThaiDate(editingSchedule.departure_date || (editingSchedule.departure_time && editingSchedule.departure_time.split('T')[0]))}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">เวลา</div>
                      <div className="font-bold">{formatTime(formatIsoTime(editingSchedule.departure_time) || editingSchedule.departure_time || editingSchedule.departure_time)}</div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowModal(false); clearScheduleForm(); }}>ปิด</Button>
                      <Button type="button" className="flex-1 bg-green-600 text-white" onClick={() => { setShowModal(false); openEditModal(editingSchedule); }}>แก้ไข</Button>
                    </div>
                  </div>
                ) : (
                  <form className="p-6 space-y-5" onSubmit={(e) => { e.preventDefault(); handleSaveSchedule(); }}>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">รถตู้</label>
                      <select value={formVanId} onChange={(e) => setFormVanId(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium">
                        <option value="">เลือกรถตู้</option>
                        {vans.map(van => (
                          <option key={van.id} value={van.id}>{van.license_plate}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">เส้นทาง</label>
                      <select value={formRouteId} onChange={(e) => setFormRouteId(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium">
                        <option value="">เลือกเส้นทาง</option>
                        {routes.map(route => (
                          <option key={route.id} value={route.id}>{route.origin} → {route.destination}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">วันที่</label>
                        <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">เวลาออกเดินทาง</label>
                        <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900 font-bold text-lg" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">จำนวนที่นั่ง</label>
                      <input type="number" value={formTotalSeats} onChange={(e) => setFormTotalSeats(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900" />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button type="button" variant="outline" className="flex-1 border-2 hover:bg-gray-50" onClick={() => { setShowModal(false); clearScheduleForm(); }} size="lg">ยกเลิก</Button>
                      <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 text-white transition-all" size="lg">บันทึก</Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </>
  )
}
