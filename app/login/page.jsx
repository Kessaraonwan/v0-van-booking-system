'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push('/')
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
            <label className="block text-sm font-medium mb-2">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-background"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-background"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            เข้าสู่ระบบ
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
