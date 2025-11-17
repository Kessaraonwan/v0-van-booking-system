import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-[0.03] bg-repeat"></div>
          
          <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 relative">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                แพลตฟอร์มจองรถตู้อันดับ 1 ในประเทศไทย
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
                จองรถตู้ออนไลน์
                <br />
                <span className="text-primary">ง่าย รวดเร็ว ปลอดภัย</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto leading-relaxed">
                ค้นหาและจองรถตู้เดินทางระหว่างเมืองได้ทันที พร้อมเลือกที่นั่งตามความต้องการของคุณ
              </p>

              <div className="bg-card rounded-2xl shadow-2xl shadow-primary/10 p-6 lg:p-8 border border-border/50">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-foreground">ต้นทาง</label>
                    <select className="w-full px-4 py-3.5 rounded-xl border-2 border-input bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base">
                      <option>กรุงเทพฯ</option>
                      <option>เชียงใหม่</option>
                      <option>ภูเก็ต</option>
                      <option>ขอนแก่น</option>
                    </select>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-foreground">ปลายทาง</label>
                    <select className="w-full px-4 py-3.5 rounded-xl border-2 border-input bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base">
                      <option>เชียงใหม่</option>
                      <option>กรุงเทพฯ</option>
                      <option>พัทยา</option>
                      <option>หัวหิน</option>
                    </select>
                  </div>
                  
                  <div className="text-left">
                    <label className="block text-sm font-semibold mb-2 text-foreground">วันเดินทาง</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-input bg-background hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-base"
                    />
                  </div>
                </div>
                
                <Link href="/search">
                  <Button size="lg" className="w-full h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ค้นหาเที่ยวรถ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">เส้นทางยอดนิยม</h2>
              <p className="text-muted-foreground text-lg">เส้นทางที่ได้รับความนิยมสูงสุด</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="text-lg font-semibold">{}</div>
                    </div>
                    
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold">{}</div>
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">เริ่มต้น</div>
                      <div className="text-3xl font-bold text-primary">฿{}</div>
                    </div>
                    
                    <Link href="/search">
                      <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                        เลือกเส้นทาง
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">ทำไมต้อง VanGo</h2>
              <p className="text-muted-foreground text-lg">ประสบการณ์การจองที่ดีที่สุด</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">จองง่าย รวดเร็ว</h3>
                <p className="text-muted-foreground leading-relaxed">
                  จองได้ในไม่กี่คลิก พร้อมยืนยันทันที
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">ปลอดภัย มั่นใจ</h3>
                <p className="text-muted-foreground leading-relaxed">
                  รถตู้และคนขับผ่านการตรวจสอบ
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">ราคาคุ้มค่า</h3>
                <p className="text-muted-foreground leading-relaxed">
                  ราคาโปร่งใส ไม่มีค่าธรรมเนียมแอบแฝง
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
