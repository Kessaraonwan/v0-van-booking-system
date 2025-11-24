# 📚 วิวัฒนาการโปรเจค: จาก Bookstore สู่ Van Booking System

> **บทคัดย่อ**: เอกสารนี้อธิบายว่าโปรเจค **ระบบจองตั๋วรถตู้ออนไลน์** (Van Booking System) เป็นการนำเอาความรู้จากวิชา **Web Programming with Go** (Weeks 7-12) มาประยุกต์ใช้กับโดเมนธุรกิจ Transportation Booking โดยยังคงใช้หลักการเดียวกันจากโปรเจคต้นแบบ **Bookstore API** ที่เรียนในห้องเรียน

---

## 🎯 สารบัญ

1. [ภาพรวม: จาก Bookstore สู่ Van Booking](#-ภาพรวม-จาก-bookstore-สู-van-booking)
2. [การเปรียบเทียบฟีเจอร์](#-การเปรียบเทียบฟีเจอร์)
3. [การประยุกต์ใช้บทเรียนแต่ละสัปดาห์](#-การประยุกต์ใช้บทเรียนแต่ละสัปดาห์)
4. [ความแตกต่างที่สำคัญ](#-ความแตกต่างที่สำคัญ)
5. [ฟีเจอร์เสริมและเหตุผล](#-ฟีเจอร์เสริมและเหตุผล)

---

## 📖 ภาพรวม: จาก Bookstore สู่ Van Booking

### โปรเจค Bookstore (Course Project - Weeks 7-12)
**วัตถุประสงค์**: สร้าง REST API สำหรับร้านหนังสือออนไลน์

**ฟีเจอร์หลัก**:
- จัดการหนังสือ (Books CRUD)
- แสดงหนังสือตามหมวดหมู่ (Categories)
- ค้นหาหนังสือ (Search)
- แสดงหนังสือแนะนำ/ใหม่/ลดราคา (Featured/New/Discounted)
- ระบบ Authentication ด้วย JWT (Week 12)
- แยกสิทธิ์ User/Admin

### โปรเจค Van Booking System (Final Project)
**วัตถุประสงค์**: นำหลักการเดียวกันมาใช้กับระบบจองตั๋วรถตู้

**ฟีเจอร์หลัก** (ใช้หลักการเดียวกับ Bookstore):
- จัดการเที่ยวรถ (Schedules CRUD) ← แทนที่ Books CRUD
- แสดงเที่ยวรถตามเส้นทาง (Routes) ← แทนที่ Categories
- ค้นหาเที่ยวรถ (Search by Origin/Destination) ← แทนที่ Search Books
- แสดงเที่ยวรถที่มีที่นั่งว่าง ← แทนที่ Available Books
- ระบบ Authentication ด้วย JWT (ใช้เทคนิคเดียวกับ Week 12)
- แยกสิทธิ์ User/Admin (ใช้แนวคิดเดียวกัน)

---

## 🔄 การเปรียบเทียบฟีเจอร์

| ฟีเจอร์ | Bookstore (Course) | Van Booking (Final Project) | หมายเหตุ |
|---------|-------------------|----------------------------|----------|
| **หน่วยข้อมูลหลัก** | Books | Schedules (เที่ยวรถ) | แทนที่กัน 1:1 |
| **การจัดหมวดหมู่** | Categories | Routes (เส้นทาง) | แนวคิดเดียวกัน |
| **การค้นหา** | Search by title/author | Search by origin/destination/date | ขยายเงื่อนไขการค้นหา |
| **การกรอง** | Featured/New/Discounted | Available seats/Time slot | เปลี่ยนเกณฑ์การกรอง |
| **User Management** | Register/Login | Register/Login | ใช้เทคนิคเดียวกัน 100% |
| **Authentication** | JWT (Week 12) | JWT + Refresh Token | เพิ่ม Refresh Token |
| **Authorization** | User/Admin roles | User/Admin roles | ใช้หลักการเดียวกัน |
| **CRUD Operations** | Books, Categories | Vans, Routes, Schedules | ใช้รูปแบบเดียวกัน |

---

## 📅 การประยุกต์ใช้บทเรียนแต่ละสัปดาห์

### Week 7: HTTP & REST API Basics
**บทเรียนใน Course**:
- สร้าง HTTP Server ด้วย Gin Framework
- ออกแบบ RESTful Endpoints
- GET, POST, PUT, DELETE methods

**การประยุกต์ใน Van Booking**:
```
Course (Bookstore)          →   Final Project (Van Booking)
GET    /books              →   GET    /api/schedules
POST   /books              →   POST   /api/schedules
GET    /books/:id          →   GET    /api/schedules/:id
PUT    /books/:id          →   PUT    /api/schedules/:id
DELETE /books/:id          →   DELETE /api/schedules/:id
```

**ไฟล์ที่เกี่ยวข้อง**:
- `backend/golang/internal/handler/schedule_handler.go` - Handler สำหรับ Schedules (เทียบเท่า Books Handler)
- `backend/golang/cmd/main.go` - Route registration (ใช้ Gin Router เหมือนใน Course)

---

### Week 8: Database Integration with PostgreSQL
**บทเรียนใน Course**:
- เชื่อมต่อ PostgreSQL ด้วย `lib/pq` driver
- สร้างตาราง `books` และ `users`
- เขียน SQL queries แบบ raw

**การประยุกต์ใน Van Booking**:
```sql
-- Course: 2 tables
CREATE TABLE books (...)
CREATE TABLE users (...)

-- Final Project: 10 tables (ขยายจาก 2 → 10)
CREATE TABLE users (...)          -- เหมือนใน Course 100%
CREATE TABLE routes (...)         -- ใช้หลักการจาก books table
CREATE TABLE vans (...)           -- ใช้หลักการจาก books table
CREATE TABLE schedules (...)      -- รวม books + เวลา + ที่นั่ง
CREATE TABLE bookings (...)       -- เก็บประวัติการจอง
CREATE TABLE seats (...)          -- เก็บสถานะที่นั่ง
CREATE TABLE payments (...)       -- เก็บสถานะการชำระเงิน
CREATE TABLE reviews (...)        -- เก็บรีวิว
CREATE TABLE pickup_points (...)  -- จุดขึ้นรถ
CREATE TABLE dropoff_points (...) -- จุดลงรถ
```

**ไฟล์ที่เกี่ยวข้อง**:
- `database/schema.sql/` - Schema ทั้งหมด (ใช้ DDL เหมือนใน Course)
- `backend/golang/internal/repository/*.go` - SQL queries (ใช้ `database/sql` เหมือน Week 8)

**เทคนิคที่ใช้จาก Week 8**:
- ✅ `db.Query()` สำหรับ SELECT หลายแถว
- ✅ `db.QueryRow()` สำหรับ SELECT แถวเดียว
- ✅ `db.Exec()` สำหรับ INSERT/UPDATE/DELETE
- ✅ Foreign Key Constraints (เหมือนที่เรียน)
- ✅ `ON DELETE CASCADE` (เหมือนที่เรียน)

---

### Week 9: Repository Pattern
**บทเรียนใน Course**:
- แยก Database logic ออกจาก HTTP handler
- สร้าง Repository interface
- Implement Repository สำหรับแต่ละ Model

**การประยุกต์ใน Van Booking**:
```
Course (Bookstore)              →   Final Project (Van Booking)
BookRepository                  →   ScheduleRepository
- GetAll()                      →   - GetAll()
- GetByID(id)                   →   - GetByID(id)
- Create(book)                  →   - Create(schedule)
- Update(id, book)              →   - Update(id, schedule)
- Delete(id)                    →   - Delete(id)
- GetByCategory(catID)          →   - GetByRouteID(routeID)
```

**ไฟล์ที่เกี่ยวข้อง**:
- `backend/golang/internal/repository/schedule_repository.go` - Repository pattern เหมือนใน Course
- `backend/golang/internal/repository/route_repository.go` - ใช้หลักการเดียวกัน
- `backend/golang/internal/repository/van_repository.go` - ใช้หลักการเดียวกัน

**เทคนิคที่ใช้จาก Week 9**:
- ✅ Interface-based design
- ✅ Dependency Injection
- ✅ Separation of Concerns

---

### Week 10: Request Validation & Error Handling
**บทเรียนใน Course**:
- Validate request body
- Return error responses (400, 404, 500)
- Use struct tags for validation

**การประยุกต์ใน Van Booking**:
```go
// Course (Book validation)
type BookRequest struct {
    Title  string `json:"title" binding:"required"`
    Author string `json:"author" binding:"required"`
    Price  float64 `json:"price" binding:"required,gt=0"`
}

// Final Project (Schedule validation)
type ScheduleRequest struct {
    RouteID     int       `json:"route_id" binding:"required"`
    VanID       int       `json:"van_id" binding:"required"`
    DepartureTime string  `json:"departure_time" binding:"required"`
}
```

**ไฟล์ที่เกี่ยวข้อง**:
- `backend/golang/internal/model/schedule.go` - Request models with validation tags
- `backend/golang/internal/handler/schedule_handler.go` - Error handling เหมือนใน Course

---

### Week 11: Query Parameters & Filtering
**บทเรียนใน Course**:
- `/books?category=fiction` - Filter by category
- `/books?search=harry` - Search books
- `/books?featured=true` - Get featured books

**การประยุกต์ใน Van Booking**:
```
Course (Bookstore)                  →   Final Project (Van Booking)
GET /books?category=fiction        →   GET /api/schedules?route_id=1
GET /books?search=harry            →   GET /api/schedules?origin=bangkok&destination=pattaya
GET /books?featured=true           →   GET /api/schedules?date=2024-11-20&has_seats=true
```

**ไฟล์ที่เกี่ยวข้อง**:
- `backend/golang/internal/handler/schedule_handler.go` - Query parameter parsing (ใช้ `c.Query()` เหมือนใน Course)

**เทคนิคที่ใช้จาก Week 11**:
- ✅ `c.Query("param")` - Get query parameter
- ✅ Dynamic WHERE clauses
- ✅ Multiple filter conditions

---

### Week 12: Authentication & Authorization
**บทเรียนใน Course** (Lab 3-4):
- Password hashing ด้วย `bcrypt`
- Generate JWT token เมื่อ login
- Verify JWT token ใน middleware
- แยก User/Admin roles

**การประยุกต์ใน Van Booking**:
```
Course (Week 12 Lab 3-4)           Final Project (100% เหมือนกัน)
---------------------------------  ----------------------------------
POST /auth/register               POST /api/auth/register
POST /auth/login                  POST /api/auth/login
Middleware: verifyToken()         Middleware: AuthMiddleware()
Middleware: isAdmin()             Middleware: AdminMiddleware()
bcrypt.GenerateFromPassword()     bcrypt.GenerateFromPassword()
jwt.NewWithClaims()               jwt.NewWithClaims()
jwt.Parse()                       jwt.Parse()
```

**ไฟล์ที่เกี่ยวข้อง**:
- `backend/golang/internal/handler/auth_handler.go` - Register, Login (ใช้เทคนิคจาก Week 12 Lab 3)
- `backend/golang/internal/middleware/auth_middleware.go` - JWT Verification (ใช้เทคนิคจาก Week 12 Lab 4)
- `backend/golang/internal/utils/jwt.go` - JWT helper functions (ใช้ `github.com/golang-jwt/jwt/v5`)

**เทคนิคที่ใช้จาก Week 12**:
- ✅ `bcrypt.GenerateFromPassword()` - Hash password
- ✅ `bcrypt.CompareHashAndPassword()` - Verify password
- ✅ `jwt.NewWithClaims()` - Create JWT token
- ✅ `jwt.Parse()` - Verify JWT token
- ✅ `c.Set("user_id", userID)` - Store user info in context
- ✅ `c.Get("user_id")` - Retrieve user info from context

**ส่วนเสริม (ไม่ได้เรียนใน Course)**:
- 🆕 Refresh Token mechanism (ขยายจาก JWT ที่เรียน)
- 🆕 Token blacklist (ป้องกัน reuse)

---

## 🎯 ความแตกต่างที่สำคัญ

### 1. จำนวนตาราง: 2 → 10 tables
**เหตุผล**: 
- Bookstore มี 1 product type (หนังสือ)
- Van Booking มี 3 product types (รถตู้, เส้นทาง, เที่ยวรถ) + ที่นั่ง + การจอง + การชำระเงิน

**แนวคิด**: ใช้หลักการ **Normalization** ที่เรียนใน Week 8 (Third Normal Form)

### 2. API Endpoints: ~10 → 31 endpoints
**เหตุผล**:
- Bookstore: Books (5 endpoints) + Auth (2 endpoints) = ~7 endpoints
- Van Booking: Vans (5) + Routes (5) + Schedules (6) + Bookings (6) + Seats (2) + Payments (2) + Auth (5) = 31 endpoints

**แนวคิด**: ทุก endpoint ใช้หลักการ RESTful จาก Week 7

### 3. Seed Data: 15 rows → 300+ rows
**เหตุผล**:
- Bookstore: 10 หนังสือ + 5 categories = 15 rows
- Van Booking: 5 vans × 6 routes × 10 schedules/day = 300 schedules + 300 × 12 seats = 3,600+ rows

**แนวคิด**: ใช้หลักการ Seeding จาก Week 8 Lab

---

## ⭐ ฟีเจอร์เสริมและเหตุผล

### 1. Pickup/Dropoff Points System
**ไม่มีใน Course**: ใช่, Bookstore ไม่มีการเลือกจุดรับของ

**เหตุผลที่เพิ่ม**:
- ผู้โดยสารต้องรู้ว่า**ขึ้นรถตรงไหน**และ**ลงรถตรงไหน**
- ร้านหนังสือไม่ต้องเลือกจุดรับ แต่รถตู้ต้องมี

**เทคนิคที่ใช้**:
- ✅ One-to-Many Relationship (1 Route → Many Pickup Points)
- ✅ Foreign Key Constraints (เรียนใน Week 8)
- ✅ JOIN queries (เรียนใน Week 9)

**การประยุกต์จาก Course**:
- หลักการเหมือน `books.category_id → categories.id`
- แค่เปลี่ยนจาก 1 category → หลาย pickup points

**Code ที่เกี่ยวข้อง**:
```sql
-- เทียบกับ Course
CREATE TABLE books (
  category_id INT REFERENCES categories(id)
);

-- Final Project (ใช้หลักการเดียวกัน)
CREATE TABLE pickup_points (
  route_id INT REFERENCES routes(id) ON DELETE CASCADE
);
```

---

### 2. Seat Management System (221 Seat Records)
**ไม่มีใน Course**: ใช่, Bookstore ใช้ `stock` เป็น integer

**เหตุผลที่เพิ่ม**:
- UX: ผู้โดยสารต้อง**เลือกเลขที่นั่ง** (A1, A2, ..., D3)
- ร้านหนังสือแค่ระบุว่ามีเหลือ 5 เล่ม (ไม่ต้องเลือกเล่มไหน)
- รถตู้ต้องเลือกที่นั่งเพราะผู้โดยสารใน**คันเดียวกัน**ห้ามนั่งซ้อน

**เทคนิคที่ใช้**:
- ✅ One-to-Many Relationship (1 Schedule → 12 Seats)
- ✅ Foreign Key + Unique Constraint (เรียนใน Week 8)
- ✅ UPDATE queries (เรียนใน Week 8)

**การประยุกต์จาก Course**:
```sql
-- Course (Bookstore) - Simple stock
CREATE TABLE books (
  stock INT DEFAULT 0  -- แค่จำนวน
);

-- Final Project - Individual seat tracking
CREATE TABLE seats (
  schedule_id INT REFERENCES schedules(id),
  seat_number VARCHAR(10),
  is_available BOOLEAN DEFAULT TRUE,
  UNIQUE(schedule_id, seat_number)  -- ห้ามซ้ำใน schedule เดียวกัน
);
```

**ทำไมไม่ใช้ `available_seats INT` เหมือน Bookstore?**
- ถ้าใช้ `available_seats INT`:
  - User A เลือกที่ A1
  - User B เลือกที่ A1 ← **ชนกัน!**
- ใช้ `seats` table:
  - User A เลือกที่ A1 → `seats.is_available = FALSE WHERE seat_number = 'A1'`
  - User B เห็นว่า A1 ไม่ว่าง → เลือกที่อื่น ← **ไม่ชนกัน**

---

### 3. Payment System (Dedicated Table)
**ไม่มีใน Course**: ใช่, Bookstore ไม่มีตาราง `payments`

**เหตุผลที่เพิ่ม**:
- ต้องติดตาม**สถานะการชำระเงิน** (PENDING/PAID/REFUNDED)
- ร้านหนังสือใน Course ไม่มีระบบชำระเงิน

**เทคนิคที่ใช้**:
- ✅ One-to-One Relationship (1 Booking → 1 Payment)
- ✅ Foreign Key Constraints (เรียนใน Week 8)
- ✅ ENUM types (เรียนใน Week 8)

**การประยุกต์จาก Course**:
```sql
-- เทียบกับ Books (ไม่มี payment tracking)
CREATE TABLE books (
  price DECIMAL(10,2)  -- แค่ราคา
);

-- Final Project (ติดตามสถานะการชำระเงิน)
CREATE TABLE payments (
  booking_id INT REFERENCES bookings(id) ON DELETE CASCADE,
  payment_status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING/PAID/REFUNDED
  payment_method VARCHAR(50),
  paid_at TIMESTAMP
);
```

**ทำไมไม่เก็บ `payment_status` ใน `bookings` table?**
- Separation of Concerns (เรียนใน Week 9)
- Booking = ข้อมูลการจอง
- Payment = ข้อมูลการชำระเงิน
- ถ้ามี multiple payment methods ในอนาคต → แยก table ง่ายกว่า

---

### 4. Review System
**ไม่มีใน Course**: ใช่, Bookstore ไม่มี reviews

**เหตุผลที่เพิ่ม**:
- ผู้โดยสารสามารถ**รีวิว**ได้หลังเดินทางเสร็จ
- เป็นฟีเจอร์ที่ใช้ CRUD pattern ทั้งหมด (ฝึกทักษะจาก Week 7-9)

**เทคนิคที่ใช้**:
- ✅ Basic CRUD operations (เรียนใน Week 7)
- ✅ Foreign Key Constraints (เรียนใน Week 8)
- ✅ JOIN queries (เรียนใน Week 9)

---

### 5. Complex JOIN Queries (ScheduleWithDetails)
**มีใน Course แต่ไม่ซับซ้อนมาก**: 
- Course: `SELECT * FROM books JOIN categories ON books.category_id = categories.id`

**Final Project**:
```sql
SELECT 
  s.*,
  r.origin, r.destination, r.distance, r.base_price,
  v.license_plate, v.capacity,
  COUNT(seats.id) FILTER (WHERE seats.is_available = TRUE) as available_seats
FROM schedules s
JOIN routes r ON s.route_id = r.id
JOIN vans v ON s.van_id = v.id
LEFT JOIN seats ON s.id = seats.schedule_id
GROUP BY s.id, r.id, v.id;
```

**เทคนิคที่ใช้**:
- ✅ Multiple JOINs (เรียนใน Week 9)
- ✅ Aggregate functions (COUNT) (เรียนใน Week 9)
- ✅ GROUP BY (เรียนใน Week 9)
- ✅ LEFT JOIN (เรียนใน Week 9)
- ✅ FILTER clause (ขยายจากที่เรียน)

---

## 📝 สรุป

### ✅ สิ่งที่เหมือน 100% กับ Course
1. ✅ **Gin Framework** (Week 7) - ใช้เหมือนกัน 100%
2. ✅ **PostgreSQL + lib/pq** (Week 8) - ใช้เหมือนกัน 100%
3. ✅ **Repository Pattern** (Week 9) - ใช้เหมือนกัน 100%
4. ✅ **JWT Authentication** (Week 12) - ใช้เทคนิคจาก Lab 3-4 ทุกขั้นตอน
5. ✅ **RESTful API Design** (Week 7) - ใช้หลักการเดียวกัน 100%
6. ✅ **Error Handling** (Week 10) - ใช้เหมือนกัน 100%
7. ✅ **Query Parameters** (Week 11) - ใช้เหมือนกัน 100%

### 🆕 สิ่งที่ขยายจาก Course (แต่ใช้หลักการเดียวกัน)
1. 🆕 **10 Tables** (vs 2 tables) - ใช้หลักการ Normalization เหมือนกัน
2. 🆕 **31 Endpoints** (vs ~10 endpoints) - ใช้หลักการ RESTful เหมือนกัน
3. 🆕 **Pickup/Dropoff Points** - ใช้หลักการ One-to-Many Relationship เหมือนกัน
4. 🆕 **Seat Management** - ใช้หลักการ CRUD + Foreign Key เหมือนกัน
5. 🆕 **Payment System** - ใช้หลักการ One-to-One Relationship เหมือนกัน
6. 🆕 **Review System** - ใช้หลักการ CRUD เหมือนกัน
7. 🆕 **Complex JOINs** - ใช้หลักการ JOIN ที่เรียนใน Week 9 + ขยายเพิ่ม

### 🎯 ข้อสรุป
**โปรเจคนี้ไม่ได้ "แปลก" จากที่เรียน** - แค่เอาหลักการเดียวกัน (Weeks 7-12) มาใช้กับ **ธุรกิจรถตู้** แทน **ธุรกิจร้านหนังสือ**

**ทุกฟีเจอร์เสริม** (Pickup Points, Seat Management, Payment, Reviews) ล้วนใช้เทคนิคที่เรียนแล้วทั้งสิ้น:
- CRUD operations (Week 7-9)
- Foreign Key Relationships (Week 8)
- JOIN queries (Week 9)
- Authentication (Week 12)

**ไม่มีเทคนิคใหม่** ที่ไม่ได้เรียน - แค่**ใช้หลักการเดียวกันซ้ำ**หลายครั้ง (10 tables แทน 2 tables)

---

## 📚 เอกสารอ้างอิง

- **COURSE_SUMMARY.md** - สรุปบทเรียน Weeks 7-12 จากวิชา Web Programming with Go
- **README.md** - ภาพรวมโปรเจค Van Booking System
- **BACKEND_README.md** - สถาปัตยกรรม Backend แบบเต็ม
- **DATABASE_SUMMARY.md** - โครงสร้าง Database 10 tables

---

**เวอร์ชัน**: 1.0  
**วันที่**: November 2024  
**ผู้เขียน**: Van Booking System Development Team
