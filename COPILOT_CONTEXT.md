# 🚐 VanGo - ระบบจองรถตู้ออนไลน์

## 📊 ข้อมูลโปรเจคสำหรับ GitHub Copilot

### **Tech Stack**
- **Frontend**: Next.js 16 (Pages Router) + React 19 + Tailwind CSS v4 + Shadcn/ui
- **Backend**: Node.js + Express.js + Sequelize ORM
- **Database**: PostgreSQL 15 (Docker)
- **Authentication**: JWT (Access Token + Refresh Token)
- **Port**: Frontend: 3000 | Backend: 8000

---

### **โครงสร้างโปรเจค**

```
/workspaces/v0-van-booking-system/
├── pages/                    # Next.js Pages
│   ├── index.jsx            # หน้าแรก (ค้นหารถ)
│   ├── search.jsx           # หน้าผลการค้นหา
│   ├── seats/[id].jsx       # หน้าเลือกที่นั่ง
│   ├── confirm.jsx          # หน้ายืนยันการจอง
│   ├── success.jsx          # หน้าจองสำเร็จ
│   ├── bookings.jsx         # หน้ารายการจอง
│   ├── booking-detail/[id].jsx  # รายละเอียดการจอง
│   ├── login.jsx            # หน้า Login User
│   ├── register.jsx         # หน้าสมัครสมาชิก
│   └── admin/               # Admin Panel
│       ├── login.jsx
│       ├── dashboard.jsx
│       ├── routes.jsx
│       ├── vans.jsx
│       ├── schedules.jsx
│       └── bookings.jsx
├── components/              # React Components
│   ├── navbar.jsx          # Navbar (แสดง user เมื่อล็อกอิน)
│   ├── footer.jsx
│   ├── admin-layout.jsx
│   └── ui/                  # Shadcn components
├── lib/
│   ├── api-client.js       # API Client (fetch wrapper + JWT)
│   └── utils.ts            # Helper functions
└── backend/nodejs/
    └── src/
        ├── server.js
        ├── controllers/     # API Controllers
        ├── models/          # Sequelize Models (8 tables)
        ├── routes/          # Express Routes
        ├── middleware/      # JWT auth middleware
        └── database/        # Seed scripts
```

---

### **Database Schema (8 ตาราง)**

1. **users** - ผู้ใช้งาน (email, password, full_name, phone, role: admin/customer)
2. **routes** - เส้นทาง (origin, destination, base_price, duration_minutes, distance_km)
3. **vans** - รถตู้ (van_number, license_plate, total_seats, status)
4. **schedules** - ตารางรถ (route_id, van_id, departure_date, departure_time, available_seats, status)
5. **seats** - ที่นั่ง (schedule_id, seat_number, status: available/booked/reserved, booking_id)
6. **bookings** - การจอง (booking_number, user_id, schedule_id, passenger_name, passenger_phone, total_seats, seat_numbers[], total_price, status)
7. **payments** - การชำระเงิน (booking_id, amount, payment_method, payment_status, transaction_id)
8. **reviews** - รีวิว (user_id, route_id, rating, comment, user_name, route_name)

---

### **Seed Data ที่มีอยู่**

- ✅ **4 users** (1 admin, 3 customers)
- ✅ **10 routes** (กรุงเทพฯ ↔ 5 เมือง: พัทยา, หัวหิน, ขอนแก่น, เชียงใหม่, ภูเก็ต)
- ✅ **8 vans** (V001-V008, capacity 9-12 ที่นั่ง)
- ✅ **210 schedules** (30 วันข้างหน้า, 8 รอบ/วัน: 06:00-20:00)
- ✅ **2,391 seats** (ทั้งหมดว่าง available 100%)
- ✅ **6 reviews** (คะแนน 4-5 ดาว)
- ❌ **0 bookings** (ยังไม่มีการจอง)
- ❌ **0 payments** (ยังไม่มีการชำระเงิน)

---

### **บัญชีที่ใช้ได้**

#### User (Customer) - ใช้ทดสอบ
- Email: `Kessaraonwan1@gmail.com`
- Password: `password123`
- ชื่อ: เกษรา อ่อนหวาน

#### Admin
- Email: `admin@vanbooking.com`
- Password: `password123`
- ชื่อ: ผู้ดูแลระบบ

#### Test Customer (สำรอง)
- Email: `customer@vanbooking.com` / Password: `password123`
- Email: `user@test.com` / Password: `password123`

---

### **API Endpoints (Backend)**

Base URL: `http://localhost:8000/api`

#### Authentication (ไม่ต้อง token)
- `POST /api/auth/register` - สมัครสมาชิก
- `POST /api/auth/login` - เข้าสู่ระบบ (ได้ accessToken + refreshToken)
- `POST /api/auth/refresh` - Refresh access token

#### Routes (Public)
- `GET /api/routes` - ดึงเส้นทางทั้งหมด
- `GET /api/routes/:id` - ดึงเส้นทางเดียว

#### Schedules (Public)
- `GET /api/schedules` - ดึงตารางรถทั้งหมด
- `GET /api/schedules/search?from=X&to=Y&date=Z` - ค้นหารถ (สำคัญ!)
- `GET /api/schedules/:id` - ดึงตารางรถเดียว

#### Seats (Public)
- `GET /api/schedules/:scheduleId/seats` - ดึงที่นั่งของรอบรถ
- `PUT /api/seats/:seatId` - อัปเดตสถานะที่นั่ง (ต้อง token)

#### Bookings (ต้อง token)
- `GET /api/bookings` - ดึงการจองของ user ที่ล็อกอิน
- `GET /api/bookings/:id` - ดึงการจองเดียว
- `POST /api/bookings` - สร้างการจอง
- `PUT /api/bookings/:id/cancel` - ยกเลิกการจอง

#### Payments (ต้อง token) - **Mock Payment**
- `POST /api/payments` - สร้างการชำระเงิน (Mock)
- `GET /api/payments/:bookingId` - ดูข้อมูลการชำระเงิน

#### Reviews (Public)
- `GET /api/reviews` - ดึงรีวิวทั้งหมด
- `GET /api/reviews?limit=10` - ดึงรีวิว 10 รายการ

#### Admin (ต้อง token + role: admin)
- `GET /api/admin/dashboard` - สถิติ Dashboard
- `GET /api/admin/routes` - CRUD เส้นทาง
- `GET /api/admin/vans` - CRUD รถตู้
- `GET /api/admin/schedules` - CRUD ตารางรถ
- `GET /api/admin/bookings` - ดูการจองทั้งหมด

---

### **สถานะปัจจุบัน**

#### ✅ เสร็จแล้ว (100%)
- **Backend API**: 40+ endpoints ทำงานได้หมด
- **Admin Panel**: 
  - Dashboard แสดงสถิติ real-time
  - จัดการรถตู้ (CRUD เชื่อม API แล้ว)
  - จัดการเส้นทาง (CRUD เชื่อม API แล้ว)
  - จัดการตารางรถ (CRUD เชื่อม API แล้ว)
  - ดูรายการจอง (เชื่อม API แล้ว)
- **User UI Design**: ทุกหน้าสวยงามครบ
- **Authentication**: 
  - JWT Token (Access + Refresh)
  - Password Hashing (bcrypt)
  - Role-based Access Control
  - Navbar แสดง user เมื่อล็อกอิน + ปุ่มออกจากระบบ
- **Database + Seed Data**: ข้อมูลครบพร้อมใช้

#### ⏳ กำลังทำ (30%) - **สำคัญที่สุด!**
- **เชื่อม Frontend User API**:
  - ✅ หน้าแรก (index.jsx) - เชื่อม API routes + reviews แล้ว
  - ⏳ หน้าค้นหา (search.jsx) - **ยังไม่เชื่อม** → ต้องเชื่อม `GET /api/schedules/search`
  - ⏳ หน้าเลือกที่นั่ง (seats/[id].jsx) - **ยังไม่เชื่อม** → ต้องเชื่อม `GET /api/schedules/:id/seats`
  - ⏳ หน้ายืนยันการจอง (confirm.jsx) - **ยังไม่เชื่อม** → ต้องเชื่อม `POST /api/bookings`
  - ⏳ หน้ารายการจอง (bookings.jsx) - **ยังไม่เชื่อม** → ต้องเชื่อม `GET /api/bookings`

#### 📋 ต้องทำต่อ
- Mock Payment System:
  - สร้างหน้า `/payments/[bookingId]`
  - API `POST /api/payments`
  - แสดงปุ่ม "ชำระเงิน" ในหน้า bookings
- Email Confirmation (Optional)
- Forgot Password (Optional)

---

### **User Flow (การใช้งานจริง)**

```
ผู้ใช้งานทั่วไป:
1. เปิดหน้าแรก (/) → เลือกต้นทาง, ปลายทาง, วันที่
2. กดค้นหา → ไปหน้า /search (แสดงรอบรถที่พบ)
3. เลือกรอบรถ → กด "เลือกที่นั่ง" → ไปหน้า /seats/[scheduleId]
4. เลือกที่นั่ง (คลิกเลือกหลายที่) → กด "ยืนยัน"
5. ไปหน้า /confirm → กรอกข้อมูลผู้โดยสาร (ชื่อ, เบอร์, อีเมล)
6. กด "ยืนยันการจอง" → สร้าง booking
7. ไปหน้า /success → แสดงรหัสการจอง (Booking Number)
8. ไปหน้า /bookings → ดูรายการจอง
9. กด "ชำระเงิน" → ไปหน้า /payments/[bookingId] (Mock Payment)
10. กด "ฉันชำระเงินแล้ว" → สถานะเปลี่ยนเป็น PAID
11. กลับหน้า /bookings → เห็นสถานะ "ชำระแล้ว"

Admin:
1. Login ที่ /admin/login
2. Dashboard → /admin/dashboard (สถิติวันนี้)
3. จัดการรถ → /admin/vans (CRUD)
4. จัดการเส้นทาง → /admin/routes (CRUD)
5. จัดการตารางรถ → /admin/schedules (CRUD)
6. ดูการจอง → /admin/bookings (ทุกการจอง)
```

---

### **API Client (lib/api-client.js)**

ใช้ wrapper function สำหรับเรียก API:

```javascript
import { authAPI, adminAPI } from '@/lib/api-client'

// Authentication
const response = await authAPI.login({ email, password })
const response = await authAPI.register({ email, password, full_name, phone })

// User APIs
const routes = await fetch('http://localhost:8000/api/routes')
const schedules = await fetch(`http://localhost:8000/api/schedules/search?from=X&to=Y&date=Z`)
const seats = await fetch(`http://localhost:8000/api/schedules/${scheduleId}/seats`)

// ต้อง token
const bookings = await fetch('http://localhost:8000/api/bookings', {
  headers: { 
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})

// Admin APIs (ใช้ adminAPI)
const stats = await adminAPI.getDashboardStats()
const allVans = await adminAPI.getAllVans()
```

---

### **Docker Commands ที่ใช้บ่อย**

```bash
# ดูว่า container รันอยู่ไหม
docker ps

# เข้า Database
docker exec -it vanbooking_postgres psql -U vanbooking -d vanbooking_db

# Query ข้อมูล
docker exec vanbooking_postgres psql -U vanbooking -d vanbooking_db -c "SELECT * FROM routes;"
docker exec vanbooking_postgres psql -U vanbooking -d vanbooking_db -c "SELECT COUNT(*) FROM schedules;"

# ดูข้อมูล Users
docker exec vanbooking_postgres psql -U vanbooking -d vanbooking_db -c "SELECT email, full_name, role FROM users;"

# Restart containers
docker-compose restart

# Stop all
docker-compose down

# ลบทั้งหมด (ข้อมูลหาย!)
docker-compose down -v
```

---

### **วิธีรันโปรเจค**

```bash
# 1. Start Database + Backend (Docker)
cd /workspaces/v0-van-booking-system
docker-compose up -d

# ตรวจสอบว่ารันแล้ว
docker ps
# ควรเห็น: vanbooking_postgres (port 5432) และ backend (port 8000)

# 2. Start Frontend
cd /workspaces/v0-van-booking-system
pnpm install  # ครั้งแรก
pnpm run dev  # port 3000

# เปิดเบราว์เซอร์
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000/api
# - Admin: http://localhost:3000/admin/login
```

---

## 🎯 สิ่งที่ต้องทำต่อ (Priority)

### **Phase 1: เชื่อม Core API** ← **เริ่มที่นี่!**

#### 1. หน้าค้นหา (search.jsx)
- ⏳ เชื่อม `GET /api/schedules/search?from=X&to=Y&date=Z`
- แสดงรายการรอบรถที่พบ
- กรองราคา + เรียงลำดับ
- ปุ่ม "เลือกที่นั่ง" → ไปหน้า `/seats/[id]`

#### 2. หน้าเลือกที่นั่ง (seats/[id].jsx)
- ⏳ เชื่อม `GET /api/schedules/:id/seats`
- แสดงผังที่นั่ง (12 ที่)
- เลือกได้หลายที่
- แสดงราคารวม real-time
- บันทึกที่นั่งที่เลือกลง localStorage
- กดยืนยัน → ไปหน้า `/confirm`

#### 3. หน้ายืนยันการจอง (confirm.jsx)
- ⏳ เชื่อม `POST /api/bookings`
- กรอกข้อมูล: ชื่อ, เบอร์โทร, อีเมล
- แสดงสรุป: เส้นทาง, วัน, เวลา, ที่นั่ง, ราคา
- กดจอง → สร้าง booking
- redirect ไปหน้า `/success`

#### 4. หน้ารายการจอง (bookings.jsx)
- ⏳ เชื่อม `GET /api/bookings`
- แสดงรายการจองของ user
- กรองตาม: ทั้งหมด, กำลังมาถึง, เดินทางแล้ว, ยกเลิกแล้ว
- ปุ่ม "ชำระเงิน" (ถ้ายัง UNPAID)
- ปุ่ม "ยกเลิกการจอง" (ถ้าสถานะ = BOOKED)

### **Phase 2: Mock Payment System**

#### 5. หน้าชำระเงิน (/payments/[bookingId])
- แสดงสรุปการจอง
- แสดง QR Code ปลอม (placeholder image)
- ปุ่ม "ฉันชำระเงินแล้ว"
- เรียก `POST /api/payments`
- แสดง Toast "ชำระเงินสำเร็จ"
- redirect กลับหน้า `/bookings`

---

## 📝 วิธีใช้ไฟล์นี้กับ Copilot

### เมื่อเริ่มแชทใหม่:

```
สวัสดีครับ ผมกำลังทำโปรเจค VanGo (ระบบจองรถตู้ออนไลน์)

@COPILOT_CONTEXT.md อ่านไฟล์นี้แล้วบอกให้หน่อยว่า:
1. ตอนนี้ระบบทำอะไรไปแล้วบ้าง?
2. เหลืออะไรต้องทำต่อ?

จากนั้นช่วยเชื่อม API ในหน้า @pages/search.jsx ให้หน่อยครับ
```

### หรือถามแบบเฉพาะเจาะจง:

```
@COPILOT_CONTEXT.md ช่วยเชื่อม API หน้าเลือกที่นั่ง (@pages/seats/[id].jsx)
ต้องดึงที่นั่งจาก GET /api/schedules/:id/seats
```

### หรือขอสรุป:

```
@COPILOT_CONTEXT.md สรุปโปรเจคให้หน่อย พร้อมบอกว่าเหลืออะไรต้องทำ
```

---

## 🔥 ปัญหาที่พบบ่อย

### 1. Frontend ไม่เชื่อมต่อ Backend
- เช็คว่า Backend รันที่ port 8000: `curl http://localhost:8000/health`
- เช็ค CORS settings ใน backend

### 2. Token หมดอายุ
- Frontend มี auto-refresh ใน `lib/api-client.js`
- หรือล็อกอินใหม่

### 3. ที่นั่งถูกจองซ้ำ
- Backend มี transaction lock แล้ว
- ตรวจสอบ seat status ก่อนสร้าง booking

### 4. Database ไม่มีข้อมูล
- รัน seed script:
  ```bash
  cd backend/nodejs/src/database
  node seedRoutes.js
  node seedVans.js
  node seedSchedules.js
  node seedReviews.js
  ```

---

## 📞 สรุปสำหรับ Copilot

**โปรเจค:** VanGo - จองรถตู้ออนไลน์  
**Stack:** Next.js + Node.js + PostgreSQL  
**สถานะ:** Backend 100%, Admin 100%, User UI 100%, **User API Integration 30%**  
**ต้องทำ:** เชื่อม 4 หน้าหลัก (search, seats, confirm, bookings) + Mock Payment  
**Priority:** เริ่มจากหน้า search.jsx ก่อน  

---

**สร้างเมื่อ:** 19 พฤศจิกายน 2568  
**อัปเดตล่าสุด:** 19 พฤศจิกายน 2568  
**เวอร์ชัน:** 1.0.0  
**Developer:** Kessaraonwan (เกษรา อ่อนหวาน)
