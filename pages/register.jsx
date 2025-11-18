'use client'

import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api-client'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'ชื่อต้องมีอย่างน้อย 2 ตัวอักษร'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }

    if (!formData.password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน'
    } else if (formData.password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่าน'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await api.register(
        formData.email,
        formData.password,
        formData.name
      )

      if (response.success) {
        toast({
          title: 'สมัครสมาชิกสำเร็จ',
          description: 'คุณสามารถเข้าสู่ระบบได้แล้ว',
        })

        router.push('/login')
      } else {
        toast({
          variant: 'destructive',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          description: response.message || 'อีเมลนี้มีผู้ใช้งานแล้ว',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  return (
    <>
      <Head>
        <title>สมัครสมาชิก - ระบบจองตั๋วรถตู้</title>
      </Head>

      <div className="min-h-screen grid lg:grid-cols-2">
        {/* Left Panel - Form */}
        <div className="flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-10">
              <Link href="/">
                <div className="inline-flex w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  V
                </div>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">สมัครสมาชิก</h1>
              <p className="text-gray-600">สร้างบัญชีใหม่ของคุณ</p>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="สมชาย ใจดี"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  อีเมล <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                      errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-orange-500'
                    }`}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg shadow-lg shadow-orange-200 hover:shadow-xl transition-all mt-8" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    กำลังสมัครสมาชิก...
                  </span>
                ) : (
                  'สมัครสมาชิก'
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                มีบัญชีอยู่แล้ว?{' '}
                <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Gradient Background */}
        <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center text-white">
            <div className="mb-8">
              <svg className="w-32 h-32 mx-auto mb-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-5xl font-bold mb-6">เริ่มต้นใช้งานวันนี้</h2>
            <p className="text-xl text-white/90 mb-4 max-w-md mx-auto">สมัครสมาชิกฟรี และเริ่มจองตั๋วรถตู้ได้ทันที</p>
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">ใช้งานง่าย</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">ประหยัดเวลา</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-3 mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold">บริการคุณภาพ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
