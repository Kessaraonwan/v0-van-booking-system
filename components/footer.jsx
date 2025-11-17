import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="font-bold text-lg">VanGo</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              แพลตฟอร์มจองรถตู้ออนไลน์ที่ง่าย รวดเร็ว และปลอดภัย
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">บริการ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground transition-colors">ค้นหาเที่ยวรถ</Link></li>
              <li><Link href="/bookings" className="hover:text-foreground transition-colors">การจองของฉัน</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">เกี่ยวกับเรา</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">เกี่ยวกับ VanGo</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">ติดต่อเรา</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">ช่วยเหลือ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">คำถามที่พบบ่อย</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">นโยบายการยกเลิก</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 VanGo. สงวนลิขสิทธิ์</p>
        </div>
      </div>
    </footer>
  )
}
