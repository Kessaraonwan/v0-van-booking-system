'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'

export default function BookingConfirmPage() {
  const router = useRouter()

  const handleConfirm = () => {
    router.push('/success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-success text-success-foreground flex items-center justify-center font-bold mb-2 shadow-lg shadow-success/30">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm font-medium text-success">เลือกที่นั่ง</div>
            </div>
            <div className="h-0.5 bg-primary flex-1 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2 shadow-lg shadow-primary/30">2</div>
              <div className="text-sm font-medium text-primary">ยืนยัน</div>
            </div>
            <div className="h-0.5 bg-border flex-1 mx-2"></div>
            <div className="flex flex-col items-center flex-1">
              <div className="w-10 h-10 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mb-2">3</div>
              <div className="text-sm text-muted-foreground">เสร็จสิ้น</div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-8">ยืนยันการจอง</h1>

          <Card className="p-8 mb-6 border-2">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              รายละเอียดการเดินทาง
            </h2>

            <div className="space-y-1">
              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  เส้นทาง
                </span>
                <span className="font-semibold text-lg">{}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  วันที่เดินทาง
                </span>
                <span className="font-semibold">{}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  เวลาออก - ถึง
                </span>
                <span className="font-semibold">{} - {}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ทะเบียนรถ
                </span>
                <span className="font-semibold font-mono">{}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  คนขับ
                </span>
                <span className="font-semibold">{}</span>
              </div>

              <div className="flex justify-between items-center py-4 border-b hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ที่นั่ง
                </span>
                <span className="font-semibold">{}</span>
              </div>

              <div className="flex justify-between items-center py-4 hover:bg-secondary/30 px-4 rounded-lg transition-colors">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  จำนวนผู้โดยสาร
                </span>
                <span className="font-semibold">{}</span>
              </div>

              <div className="flex justify-between items-center py-6 px-4 mt-4 bg-primary/5 rounded-xl">
                <span className="text-lg font-semibold">ราคารวมทั้งหมด</span>
                <span className="text-3xl font-bold text-primary">฿{}</span>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Link href="/seats/1" className="flex-1">
              <Button variant="outline" size="lg" className="w-full h-14">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                กลับ
              </Button>
            </Link>
            <Button size="lg" className="flex-1 h-14 text-base shadow-lg" onClick={handleConfirm}>
              ยืนยันและสร้างตั๋ว
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
