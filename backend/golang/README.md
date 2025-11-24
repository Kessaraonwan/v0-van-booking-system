# 🚐 Van Booking System - Go Backend

Backend API สำหรับระบบจองรถตู้ออนไลน์ พัฒนาด้วย Go + Gin Framework

## 🎓 เทคโนโลยีที่ใช้ (ตามที่เรียนมาจากวิชา BEFE)

- **Go 1.21+** - ภาษาหลัก
- **Gin** - Web framework (Week 7)
- **PostgreSQL** - Database (Week 8)
- **lib/pq** - PostgreSQL driver
- **JWT** - Authentication (Week 12 Lab 3-4)
- **bcrypt** - Password hashing (Week 12 Lab 1)
- **Docker** - Containerization (Week 9)

## 📁 โครงสร้างโปรเจกต์

```
backend/golang/
├── cmd/
│   └── main.go                    # Entry point
├── internal/
│   ├── handler/                   # API handlers (controllers)
│   │   ├── auth.go               # Authentication endpoints
│   │   ├── route.go              # Routes CRUD
│   │   ├── van.go                # Vans CRUD
│   │   ├── schedule.go           # Schedules CRUD + Search
│   │   ├── booking.go            # Bookings CRUD
│   │   ├── review.go             # Reviews endpoints
│   │   └── admin.go              # Admin Dashboard
│   ├── model/                    # Data models (structs)
│   │   ├── user.go
│   │   ├── route.go
│   │   ├── van.go
│   │   ├── schedule.go
│   │   ├── seat.go
│   │   ├── booking.go
│   │   └── review.go
│   ├── repository/               # Database layer (SQL queries)
│   │   ├── user_repo.go
│   │   ├── route_repo.go
│   │   ├── van_repo.go
│   │   ├── schedule_repo.go
│   │   ├── booking_repo.go
│   │   └── review_repo.go
│   ├── middleware/               # Middleware functions
│   │   └── auth.go              # JWT middleware
│   └── utils/                    # Helper functions
│       ├── jwt.go               # JWT token functions
│       ├── password.go          # bcrypt functions
│       └── response.go          # Standard API responses
├── migrations/                   # Database migrations
├── docs/                         # API documentation (Swagger)
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── Dockerfile                   # Docker image
├── go.mod                       # Dependencies
└── README.md                    # This file
```

## 🚀 Getting Started

### 1. ติดตั้ง Dependencies

```bash
cd backend/golang
go mod download
```

### 2. ตั้งค่า Environment Variables

```bash
cp .env.example .env
# แก้ไข .env ตามต้องการ
```

### 3. รัน Database (PostgreSQL)

```bash
# รันจาก root ของโปรเจกต์
docker-compose up -d postgres
```

### 4. รัน Application

```bash
# Development mode
go run cmd/main.go

# หรือ Build แล้วรัน
go build -o app cmd/main.go
./app
```

### 5. ทดสอบ API

```bash
# Health check
curl http://localhost:8080/health

# ผลลัพธ์:
# {"message":"Van Booking API is running","status":"ok"}
```

## 📚 API Endpoints

Base URL: `http://localhost:8080/api`

### Authentication (Public)
```
POST   /api/auth/register        - สมัครสมาชิก
POST   /api/auth/login           - Login
POST   /api/auth/refresh         - Refresh access token
```

### Routes (Public)
```
GET    /api/routes               - ดึงเส้นทางทั้งหมด
GET    /api/routes/:id           - ดึงเส้นทางเดียว
```

### Schedules (Public)
```
GET    /api/schedules            - ดึงตารางรถทั้งหมด
GET    /api/schedules/search     - ค้นหารถ (?from=X&to=Y&date=Z)
GET    /api/schedules/:id        - ดึงตารางรถเดียว
GET    /api/schedules/:id/seats  - ดึงที่นั่งของรอบรถ
```

### Bookings (Protected - ต้อง token)
```
GET    /api/bookings             - ดูการจองของตัวเอง
GET    /api/bookings/:id         - ดูการจองเดียว
POST   /api/bookings             - สร้างการจอง
PUT    /api/bookings/:id/cancel  - ยกเลิกการจอง
```

### Payments (Protected - ต้อง token)
```
POST   /api/payments             - สร้างการชำระเงิน (Mock)
GET    /api/payments/:bookingId  - ดูข้อมูลการชำระเงิน
```

### Reviews (Public)
```
GET    /api/reviews              - ดึงรีวิวทั้งหมด
```

### Admin (Protected - ต้อง token + admin role)
```
GET    /api/admin/dashboard      - สถิติ Dashboard

# Vans
GET    /api/admin/vans           - CRUD รถตู้
POST   /api/admin/vans
GET    /api/admin/vans/:id
PUT    /api/admin/vans/:id
DELETE /api/admin/vans/:id

# Routes
GET    /api/admin/routes         - CRUD เส้นทาง
POST   /api/admin/routes
GET    /api/admin/routes/:id
PUT    /api/admin/routes/:id
DELETE /api/admin/routes/:id

# Schedules
GET    /api/admin/schedules      - CRUD ตารางรถ
POST   /api/admin/schedules
GET    /api/admin/schedules/:id
PUT    /api/admin/schedules/:id
DELETE /api/admin/schedules/:id

# Bookings
GET    /api/admin/bookings       - ดูการจองทั้งหมด
```

## 🔐 Authentication Flow

### 1. Register (สมัครสมาชิก)
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "0812345678"
  }'
```

### 2. Login (เข้าสู่ระบบ)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Response:
# {
#   "accessToken": "eyJhbGc...",
#   "refreshToken": "eyJhbGc...",
#   "user": { ... }
# }
```

### 3. ใช้ Access Token ในการเรียก Protected APIs
```bash
curl http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. Refresh Token (เมื่อ Access Token หมดอายุ)
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🗄️ Database Schema

ใช้ Database Schema เดียวกับที่มีอยู่แล้ว (8 tables):

1. **users** - ผู้ใช้งาน
2. **routes** - เส้นทาง
3. **vans** - รถตู้
4. **schedules** - ตารางรถ
5. **seats** - ที่นั่ง
6. **bookings** - การจอง
7. **payments** - การชำระเงิน
8. **reviews** - รีวิว

## 🐳 Docker Support

### Build Docker Image
```bash
docker build -t vanbooking-go:latest .
```

### Run with Docker Compose
```bash
docker-compose up -d
```

## 📝 สิ่งที่ต้องทำต่อ (TODO)

### Phase 1: Core Repositories & Handlers ⏳
- [ ] `internal/repository/user_repo.go` - User CRUD
- [ ] `internal/repository/route_repo.go` - Route CRUD
- [ ] `internal/repository/van_repo.go` - Van CRUD
- [ ] `internal/repository/schedule_repo.go` - Schedule CRUD + Search
- [ ] `internal/repository/booking_repo.go` - Booking CRUD
- [ ] `internal/repository/review_repo.go` - Review queries

### Phase 2: Handlers Implementation ⏳
- [ ] `internal/handler/auth.go` - Register, Login, Refresh
- [ ] `internal/handler/route.go` - Routes endpoints
- [ ] `internal/handler/van.go` - Vans endpoints
- [ ] `internal/handler/schedule.go` - Schedules endpoints
- [ ] `internal/handler/booking.go` - Bookings endpoints
- [ ] `internal/handler/review.go` - Reviews endpoints
- [ ] `internal/handler/admin.go` - Admin dashboard

### Phase 3: Testing & Documentation 📋
- [ ] Unit tests
- [ ] Integration tests
- [ ] Swagger documentation (Week 10)
- [ ] API testing with Postman

### Phase 4: Deployment 🚀
- [ ] Dockerfile optimization
- [ ] Docker Compose setup
- [ ] Environment configuration
- [ ] Production deployment

## 🎓 Learning Resources

เนื้อหาที่เกี่ยวข้องจากวิชา BEFE:

- **Week 7**: Gin Framework & REST API
- **Week 8**: Database Integration (PostgreSQL)
- **Week 9**: Docker & Error Handling
- **Week 10**: Swagger Documentation
- **Week 11**: Database Migrations
- **Week 12**: Authentication (JWT, Refresh Token, bcrypt)

## 📞 Support

หากมีปัญหาหรือคำถาม:
1. ตรวจสอบ logs: `docker-compose logs -f`
2. ตรวจสอบ database: `docker exec -it vanbooking_postgres psql -U vanbooking -d vanbooking_db`
3. ตรวจสอบ environment variables ใน `.env`

---

**Created**: November 24, 2025  
**Version**: 1.0.0  
**Developer**: Kessaraonwan (เกษรา อ่อนหวาน)
