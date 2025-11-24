# 📋 TODO List - Go Backend Development

## ✅ Phase 0: Setup (เสร็จแล้ว!)
- [x] สร้างโครงสร้างโปรเจกต์
- [x] สร้าง go.mod และ dependencies
- [x] สร้าง models ทั้งหมด (8 models)
- [x] สร้าง utils (JWT, password, response)
- [x] สร้าง middleware (auth, admin)
- [x] สร้าง main.go พร้อม routing
- [x] สร้างไฟล์ว่างสำหรับ repositories
- [x] สร้างไฟล์ว่างสำหรับ handlers

---

## 🔥 Phase 1: Authentication (ทำก่อน - สำคัญที่สุด!)

### 1.1 User Repository
**ไฟล์**: `internal/repository/user_repo.go`

- [ ] `Create(user *model.User) error` - สร้าง user ใหม่
  ```sql
  INSERT INTO users (email, password, full_name, phone, role, created_at)
  VALUES ($1, $2, $3, $4, $5, NOW())
  RETURNING id
  ```

- [ ] `GetByEmail(email string) (*model.User, error)` - ดึง user จาก email
  ```sql
  SELECT id, email, password, full_name, phone, role, created_at
  FROM users WHERE email = $1
  ```

- [ ] `GetByID(id int) (*model.User, error)` - ดึง user จาก ID
  ```sql
  SELECT id, email, password, full_name, phone, role, created_at
  FROM users WHERE id = $1
  ```

### 1.2 Auth Handler
**ไฟล์**: `internal/handler/auth.go`

- [ ] `Register(c *gin.Context)` - สมัครสมาชิก
  - Bind `RegisterRequest`
  - Validate input
  - Check if email exists
  - Hash password ด้วย `utils.HashPassword()`
  - Create user ด้วย `userRepo.Create()`
  - Return success response

- [ ] `Login(c *gin.Context)` - เข้าสู่ระบบ
  - Bind `LoginRequest`
  - Get user by email
  - Check password ด้วย `utils.CheckPassword()`
  - Generate access token ด้วย `utils.GenerateAccessToken()`
  - Generate refresh token ด้วย `utils.GenerateRefreshToken()`
  - Return `LoginResponse` (accessToken, refreshToken, user)

- [ ] `RefreshToken(c *gin.Context)` - ขอ access token ใหม่
  - Bind `RefreshTokenRequest`
  - Validate refresh token ด้วย `utils.ValidateToken()`
  - Generate new access token
  - Return new access token

### 1.3 ทดสอบ Authentication
```bash
# Test Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "0812345678"
  }'

# Test Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## 📚 Phase 2: Routes & Reviews (Public APIs)

### 2.1 Route Repository
**ไฟล์**: `internal/repository/route_repo.go`

- [ ] `GetAll() ([]*model.Route, error)`
  ```sql
  SELECT id, origin, destination, base_price, duration_minutes, distance_km, created_at, updated_at
  FROM routes ORDER BY id
  ```

- [ ] `GetByID(id int) (*model.Route, error)`
  ```sql
  SELECT id, origin, destination, base_price, duration_minutes, distance_km, created_at, updated_at
  FROM routes WHERE id = $1
  ```

- [ ] `Create(route *model.Route) error` (Admin)
- [ ] `Update(id int, route *model.Route) error` (Admin)
- [ ] `Delete(id int) error` (Admin)

### 2.2 Route Handler
**ไฟล์**: `internal/handler/route.go`

- [ ] `GetAllRoutes(c *gin.Context)` - GET /api/routes
- [ ] `GetRouteByID(c *gin.Context)` - GET /api/routes/:id
- [ ] `CreateRoute(c *gin.Context)` - POST /api/admin/routes
- [ ] `UpdateRoute(c *gin.Context)` - PUT /api/admin/routes/:id
- [ ] `DeleteRoute(c *gin.Context)` - DELETE /api/admin/routes/:id

### 2.3 Review Repository & Handler
**ไฟล์**: `internal/repository/review_repo.go`, `internal/handler/review.go`

- [ ] `GetAll() ([]*model.Review, error)`
  ```sql
  SELECT r.id, r.user_id, r.route_id, r.rating, r.comment, 
         u.full_name as user_name,
         CONCAT(rt.origin, ' - ', rt.destination) as route_name,
         r.created_at
  FROM reviews r
  JOIN users u ON r.user_id = u.id
  JOIN routes rt ON r.route_id = rt.id
  ORDER BY r.created_at DESC
  ```

- [ ] `GetAllReviews(c *gin.Context)` - GET /api/reviews

---

## 🚐 Phase 3: Schedules (สำคัญมาก!)

### 3.1 Schedule Repository
**ไฟล์**: `internal/repository/schedule_repo.go`

- [ ] `GetAll() ([]*model.Schedule, error)`
- [ ] `GetByID(id int) (*model.Schedule, error)`
- [ ] `Search(from, to, date string) ([]*model.Schedule, error)` ⭐ สำคัญ!
  ```sql
  SELECT s.id, s.route_id, s.van_id, s.departure_date, s.departure_time,
         s.available_seats, s.status,
         r.origin, r.destination, r.base_price,
         v.van_number, v.total_seats
  FROM schedules s
  JOIN routes r ON s.route_id = r.id
  JOIN vans v ON s.van_id = v.id
  WHERE r.origin = $1 
    AND r.destination = $2 
    AND s.departure_date = $3
    AND s.status = 'scheduled'
    AND s.available_seats > 0
  ORDER BY s.departure_time
  ```

- [ ] `GetSeats(scheduleID int) ([]*model.Seat, error)` ⭐ สำคัญ!
  ```sql
  SELECT id, schedule_id, seat_number, status, booking_id
  FROM seats
  WHERE schedule_id = $1
  ORDER BY seat_number
  ```

- [ ] `UpdateAvailableSeats(scheduleID, seats int) error`
- [ ] `Create(schedule *model.Schedule) error` (Admin)
- [ ] `Update(id int, schedule *model.Schedule) error` (Admin)
- [ ] `Delete(id int) error` (Admin)

### 3.2 Schedule Handler
**ไฟล์**: `internal/handler/schedule.go`

- [ ] `GetAllSchedules(c *gin.Context)` - GET /api/schedules
- [ ] `SearchSchedules(c *gin.Context)` - GET /api/schedules/search ⭐ สำคัญ!
- [ ] `GetScheduleByID(c *gin.Context)` - GET /api/schedules/:id
- [ ] `GetScheduleSeats(c *gin.Context)` - GET /api/schedules/:id/seats ⭐ สำคัญ!
- [ ] `CreateSchedule(c *gin.Context)` - POST /api/admin/schedules
- [ ] `UpdateSchedule(c *gin.Context)` - PUT /api/admin/schedules/:id
- [ ] `DeleteSchedule(c *gin.Context)` - DELETE /api/admin/schedules/:id

---

## 🎫 Phase 4: Bookings (ซับซ้อนที่สุด - ต้องใช้ Transaction!)

### 4.1 Booking Repository
**ไฟล์**: `internal/repository/booking_repo.go`

- [ ] `GetByUserID(userID int) ([]*model.Booking, error)`
  ```sql
  SELECT b.id, b.booking_number, b.user_id, b.schedule_id,
         b.passenger_name, b.passenger_phone, b.passenger_email,
         b.total_seats, b.seat_numbers, b.total_price, b.status,
         b.created_at, b.updated_at,
         s.departure_date, s.departure_time,
         r.origin, r.destination
  FROM bookings b
  JOIN schedules s ON b.schedule_id = s.id
  JOIN routes r ON s.route_id = r.id
  WHERE b.user_id = $1
  ORDER BY b.created_at DESC
  ```

- [ ] `GetByID(id int) (*model.Booking, error)`
- [ ] `GetAll() ([]*model.Booking, error)` (Admin)
- [ ] `Create(booking *model.Booking) error` ⭐ ต้องใช้ Transaction!
  ```go
  // Pseudocode:
  tx, _ := db.Begin()
  // 1. Check seats availability
  // 2. Insert booking
  // 3. Update seats status to "booked"
  // 4. Update schedule available_seats
  tx.Commit() // หรือ tx.Rollback() ถ้ามีปัญหา
  ```

- [ ] `Cancel(id int) error` ⭐ ต้องใช้ Transaction!
  ```go
  // Pseudocode:
  tx, _ := db.Begin()
  // 1. Update booking status to "cancelled"
  // 2. Update seats back to "available"
  // 3. Increase schedule available_seats
  tx.Commit()
  ```

### 4.2 Booking Handler
**ไฟล์**: `internal/handler/booking.go`

- [ ] `GetUserBookings(c *gin.Context)` - GET /api/bookings
- [ ] `GetBookingByID(c *gin.Context)` - GET /api/bookings/:id
- [ ] `CreateBooking(c *gin.Context)` - POST /api/bookings ⭐ สำคัญ!
- [ ] `CancelBooking(c *gin.Context)` - PUT /api/bookings/:id/cancel
- [ ] `GetAllBookings(c *gin.Context)` - GET /api/admin/bookings (Admin)

### 4.3 Payment (Mock) - ง่ายมาก
- [ ] `CreatePayment(c *gin.Context)` - POST /api/payments
  ```go
  // Mock payment - ไม่ต้องจ่ายเงินจริง
  // 1. Get booking
  // 2. Insert payment record
  // 3. Return success
  ```

- [ ] `GetPaymentByBookingID(c *gin.Context)` - GET /api/payments/:bookingId

---

## 🚗 Phase 5: Admin - Vans Management

### 5.1 Van Repository
**ไฟล์**: `internal/repository/van_repo.go`

- [ ] `GetAll() ([]*model.Van, error)`
- [ ] `GetByID(id int) (*model.Van, error)`
- [ ] `Create(van *model.Van) error`
- [ ] `Update(id int, van *model.Van) error`
- [ ] `Delete(id int) error`

### 5.2 Van Handler
**ไฟล์**: `internal/handler/van.go`

- [ ] `GetAllVans(c *gin.Context)` - GET /api/admin/vans
- [ ] `GetVanByID(c *gin.Context)` - GET /api/admin/vans/:id
- [ ] `CreateVan(c *gin.Context)` - POST /api/admin/vans
- [ ] `UpdateVan(c *gin.Context)` - PUT /api/admin/vans/:id
- [ ] `DeleteVan(c *gin.Context)` - DELETE /api/admin/vans/:id

---

## 📊 Phase 6: Admin Dashboard

### 6.1 Admin Handler
**ไฟล์**: `internal/handler/admin.go`

- [ ] `GetDashboardStats(c *gin.Context)` - GET /api/admin/dashboard
  ```sql
  -- Count bookings
  SELECT COUNT(*) FROM bookings;
  
  -- Count users
  SELECT COUNT(*) FROM users WHERE role = 'customer';
  
  -- Count routes
  SELECT COUNT(*) FROM routes;
  
  -- Total revenue
  SELECT SUM(total_price) FROM bookings WHERE status != 'cancelled';
  
  -- Recent bookings
  SELECT * FROM bookings ORDER BY created_at DESC LIMIT 10;
  ```

---

## 🧪 Phase 7: Testing

- [ ] ทดสอบ Authentication endpoints
- [ ] ทดสอบ Routes endpoints
- [ ] ทดสอบ Schedules Search
- [ ] ทดสอบ Bookings (การจอง)
- [ ] ทดสอบ Cancel Booking
- [ ] ทดสอบ Admin endpoints
- [ ] ทดสอบ JWT middleware
- [ ] ทดสอบ Admin middleware

---

## 📚 Phase 8: Documentation (Swagger)

- [ ] เพิ่ม Swagger annotations ในทุก handler
- [ ] รัน `swag init`
- [ ] ทดสอบ Swagger UI ที่ `/swagger/index.html`

---

## 🎯 ลำดับการทำที่แนะนำ

**สัปดาห์ที่ 1:**
1. ✅ Phase 0: Setup (เสร็จแล้ว!)
2. Phase 1: Authentication (2-3 วัน)
3. Phase 2: Routes & Reviews (1 วัน)

**สัปดาห์ที่ 2:**
4. Phase 3: Schedules (2-3 วัน)
5. Phase 4: Bookings (3-4 วัน) - ใช้เวลานานที่สุด

**สัปดาห์ที่ 3:**
6. Phase 5: Vans (1 วัน)
7. Phase 6: Admin Dashboard (1 วัน)
8. Phase 7: Testing (2 วัน)
9. Phase 8: Swagger (1 วัน)

---

## 💡 Tips

### เวลาเขียน SQL Queries:
- ใช้ parameterized queries เสมอ (`$1, $2, ...`)
- ใช้ `db.QueryRow()` สำหรับดึงแถวเดียว
- ใช้ `db.Query()` สำหรับดึงหลายแถว
- อย่าลืม `defer rows.Close()`

### Transaction Pattern:
```go
tx, err := db.Begin()
if err != nil {
    return err
}
defer tx.Rollback() // จะไม่ทำอะไรถ้า commit แล้ว

// ... do work ...

if err := tx.Commit(); err != nil {
    return err
}
```

### Error Handling:
```go
if err != nil {
    utils.ErrorResponse(c, 500, "Database error")
    return
}
```

### Get User from Context:
```go
userID, _ := c.Get("user_id")
role, _ := c.Get("role")
```

---

## 🚀 การรัน

```bash
# 1. ติดตั้ง dependencies
go mod download

# 2. รัน database
docker-compose up -d postgres

# 3. รัน application
go run cmd/main.go

# 4. ทดสอบ
curl http://localhost:8080/health
```

---

**เริ่มจาก Phase 1 (Authentication) ก่อนเลยครับ! นี่คือรากฐานของทุกอย่าง** 🔥
