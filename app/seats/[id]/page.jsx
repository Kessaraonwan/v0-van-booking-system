'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'

export default function SeatSelectionPage() {
  const router = useRouter()
  const [selectedSeats, setSelectedSeats] = useState([])

  const seats = []

  const toggleSeat = (seatId) => {
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(id => id !== seatId)
        : [...prev, seatId]
    )
  }

  const getSeatStatus = (seat) => {
    if (seat.status === 'booked') return 'booked'
    if (selectedSeats.includes(seat.id)) return 'selected'
    return 'available'
  }

  const getSeatColor = (status) => {
    switch(status) {
      case 'available': return 'bg-secondary hover:bg-primary/10 hover:border-primary/50 border-2 border-border'
      case 'booked': return 'bg-muted/50 cursor-not-allowed opacity-50 border-2 border-border'
      case 'selected': return 'bg-primary text-primary-foreground border-2 border-primary shadow-lg shadow-primary/30'
      default: return 'bg-secondary border-2 border-border'
    }
  }

  const totalPrice = selectedSeats.length * 850

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/search" className="hover:text-foreground transition-colors">ผลการค้นหา</Link>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground font-medium">เลือกที่นั่ง</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold">เลือกที่นั่งของคุณ</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="p-8 border-2">
              <div className="mb-8">
                <div className="bg-gradient-to-b from-muted to-secondary rounded-xl p-6 text-center font-semibold mb-12 relative">
                  <svg className="w-6 h-6 mx-auto mb-2 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <div className="text-muted-foreground">หน้ารถ (คนขับ)</div>
                </div>

                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  {seats.map(seat => {
                    const status = getSeatStatus(seat)
                    return (
                      <button
                        key={seat.id}
                        onClick={() => seat.status !== 'booked' && toggleSeat(seat.id)}
                        disabled={seat.status === 'booked'}
                        className={`aspect-square rounded-xl font-bold text-lg transition-all ${getSeatColor(status)}`}
                      >
                        {seat.number}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 pt-8 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary border-2 border-border"></div>
                  <span className="text-sm font-medium">ว่าง</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary border-2 border-primary"></div>
                  <span className="text-sm font-medium">เลือกแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 border-2 border-border opacity-50"></div>
                  <span className="text-sm font-medium">จองแล้ว</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 border-2">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                สรุปการจอง
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">เส้นทาง</div>
                  <div className="font-semibold text-lg">{}</div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">วันที่ - เวลา</div>
                  <div className="font-semibold">{}</div>
                </div>

                <div className="p-4 rounded-xl bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">ที่นั่งที่เลือก</div>
                  <div className="font-semibold">
                    {selectedSeats.length > 0 
                      ? selectedSeats.map(id => seats.find(s => s.id === id)?.number).join(', ')
                      : 'ยังไม่ได้เลือก'}
                  </div>
                </div>

                <div className="pt-6 border-t-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">ราคาต่อที่นั่ง</span>
                    <span className="font-semibold">฿850</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">จำนวนที่นั่ง</span>
                    <span className="font-semibold">× {selectedSeats.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold pt-4 border-t">
                    <span>ราคารวม</span>
                    <span className="text-primary">฿{totalPrice}</span>
                  </div>
                </div>
              </div>

              <Button 
                size="lg" 
                className="w-full mb-3 h-14 text-base shadow-lg"
                disabled={selectedSeats.length === 0}
                onClick={() => router.push('/confirm')}
              >
                {selectedSeats.length === 0 ? 'กรุณาเลือกที่นั่ง' : `ยืนยันการจอง (${selectedSeats.length} ที่นั่ง)`}
              </Button>

              <Link href="/search">
                <Button variant="outline" size="lg" className="w-full">
                  กลับ
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
