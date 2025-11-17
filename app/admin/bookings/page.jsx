'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdminLayout from '@/components/admin-layout'

export default function BookingsManagement() {
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const bookings = []

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">จัดการการจอง</h1>
          <p className="text-muted-foreground">ตรวจสอบและจัดการการจองทั้งหมด</p>
        </div>

        <Card className="p-6">
          <div className="flex gap-4 mb-6">
            <input 
              type="date" 
              className="px-4 py-2 rounded-lg border bg-background"
              placeholder="กรองตามวันที่"
            />
            <select className="px-4 py-2 rounded-lg border bg-background">
              <option>เส้นทางทั้งหมด</option>
            </select>
            <select className="px-4 py-2 rounded-lg border bg-background">
              <option>สถานะทั้งหมด</option>
              <option>ยืนยัน</option>
              <option>รอชำระเงิน</option>
              <option>ยกเลิก</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">รหัสจอง</th>
                  <th className="text-left py-3 px-4">ผู้จอง</th>
                  <th className="text-left py-3 px-4">เส้นทาง</th>
                  <th className="text-left py-3 px-4">วันที่ - เวลา</th>
                  <th className="text-left py-3 px-4">ที่นั่ง</th>
                  <th className="text-left py-3 px-4">สถานะ</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-mono text-sm">{booking.id}</td>
                    <td className="py-4 px-4">{booking.user}</td>
                    <td className="py-4 px-4">{booking.route}</td>
                    <td className="py-4 px-4">{booking.date} {booking.time}</td>
                    <td className="py-4 px-4">{booking.seats}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === 'ยืนยัน' ? 'bg-accent/20 text-accent-foreground' :
                        booking.status === 'รอชำระเงิน' ? 'bg-primary/20 text-primary' :
                        'bg-destructive/20 text-destructive'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mr-2"
                        onClick={() => handleViewDetails(booking)}
                      >
                        รายละเอียด
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">ยกเลิก</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showModal && selectedBooking && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg p-6">
              <h2 className="text-2xl font-bold mb-6">รายละเอียดการจอง</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">รหัสจอง</span>
                  <span className="font-mono font-medium">{selectedBooking.id}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">ผู้จอง</span>
                  <span className="font-medium">{selectedBooking.user}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">เส้นทาง</span>
                  <span className="font-medium">{selectedBooking.route}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">วันที่ - เวลา</span>
                  <span className="font-medium">{selectedBooking.date} {selectedBooking.time}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">ที่นั่ง</span>
                  <span className="font-medium">{selectedBooking.seats}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">สถานะ</span>
                  <span className="font-medium text-accent">{selectedBooking.status}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  ปิด
                </Button>
                <Button variant="destructive" className="flex-1">
                  ยกเลิกการจอง
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
