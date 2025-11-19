import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin-layout'
import { adminAPI } from '@/lib/api-client'

export default function VansManagement() {
  const [showModal, setShowModal] = useState(false)
  const [vans, setVans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchVans()
  }, [])

  const fetchVans = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllVans()
      if (response.success) {
        setVans(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching vans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddVan = async (formData) => {
    try {
      const response = await adminAPI.createVan(formData)
      if (response.success) {
        await fetchVans()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Error adding van:', error)
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            พร้อมใช้งาน
          </span>
        )
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            ซ่อมบำรุง
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
            <span className="w-2 h-2 rounded-full bg-gray-500"></span>
            ไม่ใช้งาน
          </span>
        )
      default:
        return null
    }
  }

  const filteredVans = vans.filter(van => {
    if (filterStatus === 'all') return true
    return van.status === filterStatus
  })

  const statsCount = {
    all: vans.length,
    active: vans.filter(v => v.status === 'active').length,
    maintenance: vans.filter(v => v.status === 'maintenance').length,
    inactive: vans.filter(v => v.status === 'inactive').length,
  }

  return (
    <>
      <Head>
        <title>จัดการรถตู้ - Admin Panel</title>
      </Head>
      <AdminLayout>
        <div className="space-y-8">
          {/* Hero Header with Image Background */}
          <div 
            className="relative overflow-hidden rounded-2xl shadow-xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=400&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/70 to-gray-900/60"></div>
            <div className="relative z-10 p-8 md:p-12">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                    จัดการรถตู้
                  </h1>
                  <p className="text-xl text-white/90 mb-6">
                    ดูรถทั้งหมด พร้อมข้อมูลคนขับ
                  </p>
                  <div className="flex items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                      <span className="font-medium">{statsCount.active} คันพร้อมวิ่ง</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <span className="font-medium">{statsCount.maintenance} คันซ่อม</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowModal(true)}
                  className="bg-white text-red-600 hover:bg-red-50 font-semibold transition-all"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  เพิ่มรถตู้
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
              }`}
            >
              ทั้งหมด ({statsCount.all})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'active'
                  ? 'bg-gray-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              พร้อมวิ่ง ({statsCount.active})
            </button>
            <button
              onClick={() => setFilterStatus('maintenance')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'maintenance'
                  ? 'bg-gray-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              ซ่อมบำรุง ({statsCount.maintenance})
            </button>
            <button
              onClick={() => setFilterStatus('inactive')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                filterStatus === 'inactive'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              ไม่ใช้งาน ({statsCount.inactive})
            </button>
          </div>

          {/* Vans Grid - Travel Card Style */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-5 space-y-4">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-16 bg-gray-300 rounded-xl"></div>
                      <div className="h-16 bg-gray-300 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVans.map((van) => (
              <div key={van.id} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 hover:border-red-300">
                {/* Van Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={van.image} 
                    alt={van.license_plate}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Status Badge on Image */}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(van.status)}
                  </div>

                  {/* License Plate Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                      <div className="font-mono font-bold text-lg text-gray-900">
                        {van.license_plate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Driver Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {van.driver_name.split(' ')[0][0]}{van.driver_name.split(' ')[1][0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 font-medium">คนขับ</div>
                      <div className="font-bold text-gray-900">{van.driver_name}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-xs text-gray-600 font-medium">ที่นั่ง</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{van.seats}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs text-blue-600 font-medium">วิ่งวันนี้</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{van.trips_today}</div>
                    </div>
                  </div>

                  {/* Next Trip */}
                  {van.next_trip && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-xs text-green-700 font-medium">รอบถัดไป</div>
                          <div className="text-lg font-bold text-green-900">{van.next_trip} น.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      แก้ไข
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 transition-all"
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
          )}

          {!loading && filteredVans.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center border-2 border-dashed border-gray-300">
              <div className="text-8xl mb-4">🚐</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">ไม่มีรถในหมวดนี้</h3>
              <p className="text-gray-600 mb-6">ลองเลือกหมวดอื่นหรือเพิ่มรถใหม่</p>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                เพิ่มรถตู้
              </Button>
            </div>
          )}

          {/* Add Van Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">ลงทะเบียนรถใหม่</h2>
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

                {/* Modal Body */}
                <form className="p-6 space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        ทะเบียนรถ
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-mono font-bold text-gray-900"
                      placeholder="กข-1234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        จำนวนที่นั่ง
                      </span>
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                      placeholder="13"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        ชื่อคนขับ
                      </span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                      placeholder="สมชาย ใจดี"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        รูปภาพรถ (URL)
                      </span>
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all text-gray-900"
                      placeholder="https://example.com/van.jpg"
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
                      className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all" 
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
