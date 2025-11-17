'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { createBrowserClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล'
    } else if (!validateEmail(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง'
    }

    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน'
    } else if (password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
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
      const supabase = createBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          description: error.message === 'Invalid login credentials'
            ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            : error.message,
        })
        return
      }

      toast({
        title: 'เข้าสู่ระบบสำเร็จ',
        description: 'ยินดีต้อนรับกลับมา',
      })

      router.push('/')
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-secondary/20">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-primary rounded-xl items-center justify-center text-primary-foreground font-bold text-2xl mb-4">
            V
          </div>
          <h1 className="text-3xl font-bold mb-2">เข้าสู่ระบบ</h1>
          <p className="text-muted-foreground">ยินดีต้อนรับกลับมา</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              อีเมล <span className="text-destructive">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
              className={`w-full px-4 py-3 rounded-lg border bg-background ${
                errors.email ? 'border-destructive' : ''
              }`}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              รหัสผ่าน <span className="text-destructive">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
              className={`w-full px-4 py-3 rounded-lg border bg-background ${
                errors.password ? 'border-destructive' : ''
              }`}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ยังไม่มีบัญชี?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/admin/login" className="text-sm text-muted-foreground hover:text-foreground">
            เข้าสู่ระบบสำหรับผู้ดูแลระบบ
          </Link>
        </div>
      </Card>
    </div>
  )
}
