import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import AdminLayout from '@/components/admin-layout'

export default function AdminDashboard() {
  const todayStats = []
  const todaySchedules = []

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">ภาพรวมระบบจองรถตู้วันนี้</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {todayStats.map((stat, index) => (
            <Card key={index} className="p-6 border-2 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  index === 0 ? 'bg-primary/10 text-primary' :
                  index === 1 ? 'bg-success/10 text-success' :
                  'bg-accent/10 text-accent'
                }`}>
                  {index === 0 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wide">{stat.label}</div>
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
            </Card>
          ))}
        </div>

        <Card className="p-6 border-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            เที่ยวรถวันนี้
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">เวลา</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">เส้นทาง</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">รถตู้</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">ผู้โดยสาร</th>
                  <th className="text-left py-4 px-4 font-semibold text-sm text-muted-foreground">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {todaySchedules.map((schedule, index) => (
                  <tr key={index} className="border-b hover:bg-secondary/50 transition-colors">
                    <td className="py-4 px-4 font-bold text-base">{schedule.time}</td>
                    <td className="py-4 px-4 font-medium">{schedule.route}</td>
                    <td className="py-4 px-4 font-mono text-sm">{schedule.van}</td>
                    <td className="py-4 px-4">{schedule.passengers}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                        schedule.status === 'เต็ม' ? 'bg-destructive/10 text-destructive' :
                        schedule.status === 'กำลังเดินทาง' ? 'bg-accent/10 text-accent' :
                        'bg-success/10 text-success'
                      }`}>
                        {schedule.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  )
}
