'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('[v0] Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-3xl font-bold mb-4">เกิดข้อผิดพลาด</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          ขออภัย เกิดข้อผิดพลาดในการโหลดหน้านี้ กรุณาลองใหม่อีกครั้ง
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()}>
            ลองอีกครั้ง
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            กลับหน้าแรก
          </Button>
        </div>
      </div>
    </div>
  )
}
