import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'

export default function BookingDetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link href="/bookings" className="hover:text-foreground transition-colors">การจองของฉัน</Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-foreground font-medium">รายละเอียด</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold">รายละเอียดการจอง</h1>
          </div>

          <Card className="p-8 lg:p-12 mb-6 border-2">
            <div className="text-center mb-12 pb-12 border-b-2 border-dashed">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-semibold mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ยืนยันแล้ว
              </div>
              
              <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">รหัสการจอง</div>
              <div className="text-4xl font-bold mb-8 font-mono">BK-2024-001</div>
              
              <div className="w-64 h-64 bg-gradient-to-br from-primary/5 to-accent/5 border-4 border-dashed border-primary/20 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                <div className="text-center p-6">
                  <svg className="w-16 h-16 mx-auto mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <div className="text-sm text-muted-foreground">QR Code</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ข้อมูลการเดินทาง
              </h2>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  เส้นทาง
                </span>
                <span className="font-semibold text-lg">กรุงเทพฯ → เชียงใหม่</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  วันที่เดินทาง
                </span>
                <span className="font-semibold">25 ธันวาคม 2024</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  เวลาออก - ถึง
                </span>
                <span className="font-semibold">08:00 - 14:00</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ทะเบียนรถ
                </span>
                <span className="font-semibold font-mono">กข-1234</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  คนขับ
                </span>
                <span className="font-semibold">สมชาย ใจดี</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ที่นั่ง
                </span>
                <span className="font-semibold">1, 2</span>
              </div>

              <div className="flex justify-between items-center py-6 px-4 mt-4 bg-primary/5 rounded-xl">
                <span className="text-lg font-semibold">ราคารวม</span>
                <span className="text-3xl font-bold text-primary">฿1,700</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button variant="outline" size="lg" className="flex-1 h-14 gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              ดาวน์โหลด / พิมพ์
            </Button>
            <Link href="/bookings" className="flex-1">
              <Button size="lg" className="w-full h-14 gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
