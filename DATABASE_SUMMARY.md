# 📊 PostgreSQL Database - Summary

## 🗂️ โครงสร้างฐานข้อมูลสำหรับระบบจองรถตู้

> **Backend:** Node.js + Express + Sequelize ORM  
> **Database:** PostgreSQL (via Docker)

### 📋 ตารางทั้งหมด (7 ตาราง)

```
1. users          - ข้อมูลผู้ใช้ (ลูกค้า/แอดมิน)
2. routes         - เส้นทาง (กรุงเทพ → พัทยา)
3. vans           - รถตู้ (V001, V002, ...)
4. schedules      - รอบรถ/เที่ยวรถ (วันที่ + เวลา)
5. seats          - ที่นั่ง (1-12 ต่อเที่ยว)
6. bookings       - การจอง (เลขที่จอง + ข้อมูลผู้โดยสาร)
7. payments       - การชำระเงิน
```

---

## 🎯 Features หลัก

### ✅ Authentication & Authorization
- JWT (JSON Web Token) authentication
- Role-based access (customer/admin)
- Password hashing with bcrypt
- Protected API routes with auth middleware

### ✅ Booking System
- ค้นหาเที่ยวรถตามเส้นทาง + วันที่
- แสดงที่นั่งว่าง (real-time)
- จองที่นั่ง (รองรับหลายที่นั่ง)
- ยกเลิกการจอง
- สร้างเลขที่จองอัตโนมัติ (BK20241117xxxx)

### ✅ Admin Dashboard
- สถิติวันนี้ (จำนวนจอง/ผู้โดยสาร/เที่ยวรถ)
- จัดการเที่ยวรถ
- จัดการการจอง
- ดูรายงานต่างๆ

### ✅ Seat Management
- 12 ที่นั่งต่อรถตู้
- 3 สถานะ: AVAILABLE, BOOKED, RESERVED
- Update status real-time เมื่อมีการจอง/ยกเลิก

### ✅ Backend API Features
- 40+ REST API endpoints
- Automatic relationships with Sequelize
- Transaction support for bookings
- Auto-generated booking codes (BK20241117xxxx)
- Seat availability checking
- Real-time seat status updates

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### 1. `backend/nodejs/src/models/` (Database Models)
Sequelize models สำหรับทั้ง 7 ตาราง:
- `User.js` - ผู้ใช้งาน
- `Route.js` - เส้นทาง
- `Van.js` - รถตู้
- `Schedule.js` - ตารางเวลา
- `Seat.js` - ที่นั่ง
- `Booking.js` - การจอง
- `Payment.js` - การชำระเงิน
- `index.js` - รวม relationships

### 2. `backend/nodejs/src/controllers/` (Business Logic)
- `authController.js` - Login, Register, JWT
- `scheduleController.js` - ค้นหา + จัดการตารางเวลา
- `bookingController.js` - จอง + ยกเลิก + ประวัติ
- `adminController.js` - Dashboard stats

### 3. `docker-compose.yml` (Infrastructure)
- PostgreSQL container
- Backend API container
- Frontend container
- Network configuration

### 4. เอกสารอื่นๆ
- **[BACKEND_README.md](./BACKEND_README.md)** - API Documentation ทั้งหมด
- **[QUICKSTART.md](./QUICKSTART.md)** - วิธีรัน Docker
- **[TODO_FRONTEND.md](./TODO_FRONTEND.md)** - Frontend tasks

---

## 🚀 Quick Start

### 1. รัน Backend + Database
```bash
docker-compose up -d postgres backend
```

### 2. ตรวจสอบ Database
```bash
docker exec -it postgres psql -U vanbooking -d vanbooking_db -c '\dt'
```

### 3. ทดสอบ Backend API
```bash
curl http://localhost:5000/health
# Response: {"status":"ok"}
```

### 4. ดู Database Schema
Sequelize จะสร้างตารางอัตโนมัติเมื่อ Backend start
```bash
docker logs backend
# จะเห็น "Database synced successfully"
```

✅ **เสร็จแล้ว!** พร้อมใช้งาน Backend API

---

## 💡 ตัวอย่างการใช้ API

### ค้นหาเที่ยวรถ
```javascript
import api from '@/lib/api-client'

const schedules = await api.searchSchedules(
  'กรุงเทพ',
  'พัทยา',
  '2024-11-17'
)
// GET /api/schedules/search?origin=...&destination=...&date=...
```

### จองที่นั่ง
```javascript
const booking = await api.createBooking({
  scheduleId: 1,
  seatNumbers: [1, 2, 3],
  passengerName: 'สมชาย ใจดี',
  passengerPhone: '081-234-5678',
  passengerEmail: 'somchai@example.com'
})
// POST /api/bookings
```

### ดูการจองของฉัน
```javascript
const bookings = await api.getMyBookings()
// GET /api/bookings/my
```

### Dashboard Stats (Admin)
```javascript
const stats = await api.getAdminStats()
// GET /api/admin/dashboard/stats
```

---

## 🔒 Security

### JWT Authentication ✅
- Login ได้รับ JWT token
- Token เก็บใน localStorage
- ส่ง token ใน Authorization header
- Token มีอายุ 24 ชั่วโมง
- Middleware ตรวจสอบ token ทุก request

### Authorization ✅
- **Public routes**: ค้นหาเที่ยวรถ, ดูที่นั่ง
- **User routes**: จอง, ดูประวัติ, ยกเลิก
- **Admin routes**: Dashboard, CRUD ทั้งหมด
- Role-based access control (customer/admin)

### Password Security ✅
- bcrypt hashing (10 rounds)
- Never store plain text passwords
- Secure password validation

---

## 📊 Sample Data

หลังรัน seed.sql จะได้:

### เส้นทาง
- กรุงเทพ → พัทยา (150 บาท, 2 ชม.)
- กรุงเทพ → หัวหิน (200 บาท, 2.5 ชม.)
- กรุงเทพ → เชียงใหม่ (650 บาท, 11 ชม.)
- กรุงเทพ → ภูเก็ต (800 บาท, 13 ชม.)
- กรุงเทพ → อยุธยา (100 บาท, 1.5 ชม.)

### รถตู้
- V001, V002, V003, V004, V005
- VIP และ Standard
- พร้อมชื่อคนขับและเบอร์โทร

### เที่ยวรถ
- กรุงเทพ → พัทยา: 12 เที่ยว (วันนี้ + พรุ่งนี้)
- กรุงเทพ → หัวหิน: 8 เที่ยว
- กรุงเทพ → เชียงใหม่: 6 เที่ยว

---

## 🎯 Next Steps

1. ✅ Backend API พร้อมใช้ (40+ endpoints)
2. ⏳ เชื่อมต่อ Frontend กับ Backend (ดู TODO_FRONTEND.md)
3. ⏳ สร้างข้อมูลตัวอย่าง (seed data)
4. ⏳ ทดสอบ user flow
5. ⏳ Deploy production

---

## 📚 เอกสารเพิ่มเติม

- **[BACKEND_README.md](./BACKEND_README.md)** - API Documentation ครบทั้ง 40+ endpoints
- **[QUICKSTART.md](./QUICKSTART.md)** - วิธีรัน Docker + Development
- **[TODO_FRONTEND.md](./TODO_FRONTEND.md)** - สิ่งที่ต้องทำต่อ Frontend
- **[README.md](./README.md)** - ภาพรวมโปรเจค

---

## ⚡ Performance

- Sequelize ORM handles queries efficiently
- Indexes on foreign keys (auto-created)
- Connection pooling
- Transaction support for atomic operations
- Eager loading for related data

---

## 🛡️ Best Practices

1. ✅ ใช้ JWT authentication ทุก protected route
2. ✅ Validate input ก่อนบันทึก database
3. ✅ ตรวจสอบ available_seats ก่อนจอง
4. ✅ ใช้ Transactions สำหรับ bookings
5. ✅ Handle errors properly
6. ✅ Log important operations

---

**สร้างโดย:** Van Booking System Team  
**วันที่:** November 2024  
**เวอร์ชัน:** 1.0  
**Backend:** Node.js + Express + Sequelize  
**Database:** PostgreSQL
