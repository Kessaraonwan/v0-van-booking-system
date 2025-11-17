import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function MyBookingsPage() {
  const bookings = []

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={false} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold mb-2">การจองของฉัน</h1>
            <p className="text-muted-foreground text-lg">รายการจองทั้งหมดของคุณ</p>
          </div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            <Button variant="default" size="sm" className="whitespace-nowrap">ทั้งหมด</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">กำลังจะมาถึง</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">เสร็จสิ้น</Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">ยกเลิกแล้ว</Button>
          </div>

          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-xl hover:border-primary/50 transition-all group border-2">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-sm font-mono bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold">
                        {booking.id}
                      </div>
                      <div className="text-sm bg-success/10 text-success px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        ยืนยันแล้ว
                      </div>
                    </div>

                    <div className="text-2xl font-bold mb-4 text-foreground">{booking.route}</div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-muted-foreground">วันที่:</span>
                        <span className="font-semibold">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-muted-foreground">เวลา:</span>
                        <span className="font-semibold">{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted-foreground">ที่นั่ง:</span>
                        <span className="font-semibold">{booking.seats}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-muted-foreground">ราคา:</span>
                        <span className="font-bold text-primary text-base">฿{booking.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-row lg:flex-col gap-3 lg:min-w-[180px]">
                    <Link href={`/booking-detail/${booking.id}`} className="flex-1">
                      <Button variant="outline" size="lg" className="w-full group-hover:border-primary transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        ดูรายละเอียด
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30">
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
