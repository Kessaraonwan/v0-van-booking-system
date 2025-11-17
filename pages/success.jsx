import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="p-8 lg:p-12 text-center border-2">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping"></div>
              <svg className="w-12 h-12 text-success relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">จองสำเร็จ!</h1>
            <p className="text-lg text-muted-foreground mb-12">
              การจองของคุณเสร็จสมบูรณ์แล้ว<br/>กรุณาแสดง QR Code นี้เมื่อขึ้นรถ
            </p>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-8 border-2 border-dashed border-primary/20">
              <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">รหัสการจอง</div>
              <div className="text-4xl font-bold mb-8 font-mono">BK-2024-001</div>

              <div className="w-64 h-64 bg-card border-4 border-border rounded-2xl mx-auto flex items-center justify-center shadow-xl">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <div className="text-sm text-muted-foreground">QR Code<br/>สำหรับขึ้นรถ</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/bookings">
                <Button size="lg" className="w-full h-14 text-base shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  ดูการจองของฉัน
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="w-full h-14 text-base">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  กลับหน้าแรก
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
