import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">ไม่พบหน้าที่คุณต้องการ</h2>
        <p className="text-muted-foreground mb-8 max-w-md">
          ขออภัย หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่มีอยู่จริง
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">กลับหน้าแรก</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            ย้อนกลับ
          </Button>
        </div>
      </div>
    </div>
  )
}
