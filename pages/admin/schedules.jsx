'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdminLayout from '@/components/admin-layout'

export default function SchedulesManagement() {
  const [showModal, setShowModal] = useState(false)
  const schedules = []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">จัดการรอบรถ</h1>
            <p className="text-muted-foreground">จัดการตารางเดินรถและรอบเวลา</p>
          </div>
          <Button onClick={() => setShowModal(true)}>เพิ่มรอบรถ</Button>
        </div>

        <Card className="p-6">
          <div className="mb-4">
            <input 
              type="date" 
              className="px-4 py-2 rounded-lg border bg-background"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">รถตู้</th>
                  <th className="text-left py-3 px-4">เส้นทาง</th>
                  <th className="text-left py-3 px-4">เวลาออก</th>
                  <th className="text-left py-3 px-4">ราคา</th>
                  <th className="text-left py-3 px-4">ที่นั่งว่าง</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-mono font-medium">{schedule.van}</td>
                    <td className="py-4 px-4">{schedule.route}</td>
                    <td className="py-4 px-4 font-medium">{schedule.departure}</td>
                    <td className="py-4 px-4 text-primary font-bold">฿{schedule.price}</td>
                    <td className="py-4 px-4">{schedule.available}</td>
                    <td className="py-4 px-4 text-right">
                      <Button variant="ghost" size="sm" className="mr-2">แก้ไข</Button>
                      <Button variant="ghost" size="sm" className="text-destructive">ลบ</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {showModal && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-2xl font-bold mb-6">เพิ่มรอบรถ</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">รถตู้</label>
                  <select className="w-full px-4 py-3 rounded-lg border bg-background">
                    <option value="">เลือกรถตู้</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เส้นทาง</label>
                  <select className="w-full px-4 py-3 rounded-lg border bg-background">
                    <option value="">เลือกเส้นทาง</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">วันที่</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">เวลาออกเดินทาง</label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                    ยกเลิก
                  </Button>
                  <Button className="flex-1" onClick={() => setShowModal(false)}>
                    บันทึก
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
