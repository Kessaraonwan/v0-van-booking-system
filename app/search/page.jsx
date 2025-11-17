import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function SearchResultsPage({ schedules, route, date }) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Navbar showAuth={false} showBookings={true} />

      <main className="flex-1 container mx-auto px-4 lg:px-8 py-8">
        <Card className="p-6 mb-8 border-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{route}</h1>
                  <p className="text-muted-foreground text-sm mt-1">{date}</p>
                </div>
              </div>
            </div>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                แก้ไขการค้นหา
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-4 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-muted-foreground">
              พบ <span className="text-foreground font-bold">{schedules?.length || 0}</span> เที่ยวรถ
            </h2>
          </div>
          
          {schedules?.map((schedule) => (
            <Card key={schedule.id} className="p-6 hover:shadow-xl hover:border-primary/50 transition-all group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">{schedule.departureTime}</div>
                      <div className="text-sm text-muted-foreground font-medium">ออกเดินทาง</div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="border-t-2 border-dashed border-border"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="bg-background px-3 py-1 rounded-full border text-sm font-medium text-muted-foreground whitespace-nowrap">
                          {schedule.arrivalTime?.split(':')[0] - schedule.departureTime?.split(':')[0]} ชม.
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground mb-1">{schedule.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground font-medium">ถึงปลายทาง</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="font-medium text-foreground">{schedule.licensePlate}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-foreground">{schedule.driver}</span>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:min-w-[200px]">
                  <div className="text-center lg:text-right flex-1 lg:flex-none">
                    <div className="text-4xl font-bold text-primary mb-2">฿{schedule.price}</div>
                    <div className="text-sm text-muted-foreground">
                      ที่นั่งว่าง: <span className="font-semibold text-foreground">{schedule.availableSeats}/{schedule.totalSeats}</span>
                    </div>
                  </div>
                  
                  <Link href={`/seats/${schedule.id}`} className="w-full lg:w-auto">
                    <Button 
                      size="lg" 
                      disabled={schedule.availableSeats === 0}
                      className="w-full lg:w-auto lg:min-w-[160px] shadow-md group-hover:shadow-lg transition-all"
                    >
                      {schedule.availableSeats === 0 ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          เต็มแล้ว
                        </>
                      ) : (
                        <>
                          เลือกที่นั่ง
                          <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
