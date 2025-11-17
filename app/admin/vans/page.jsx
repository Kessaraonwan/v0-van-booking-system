'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdminLayout from '@/components/admin-layout'

export default function VansManagement() {
  const [showModal, setShowModal] = useState(false)
  const vans = []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">จัดการรถตู้</h1>
            <p className="text-muted-foreground">จัดการข้อมูลรถตู้ทั้งหมด</p>
          </div>
          <Button onClick={() => setShowModal(true)}>เพิ่มรถตู้</Button>
        </div>

        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ทะเบียนรถ</th>
                  <th className="text-left py-3 px-4">จำนวนที่นั่ง</th>
                  <th className="text-left py-3 px-4">คนขับ</th>
                  <th className="text-right py-3 px-4">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {vans.map((van) => (
                  <tr key={van.id} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-mono font-medium">{van.plate}</td>
                    <td className="py-4 px-4">{van.seats} ที่นั่ง</td>
                    <td className="py-4 px-4">{van.driver}</td>
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
              <h2 className="text-2xl font-bold mb-6">เพิ่มรถตู้</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ทะเบียนรถ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                    placeholder="กข-1234"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">จำนวนที่นั่ง</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                    placeholder="13"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อคนขับ</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border bg-background"
                    placeholder="สมชาย ใจดี"
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
