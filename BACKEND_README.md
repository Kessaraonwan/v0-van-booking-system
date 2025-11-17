# 🚐 ระบบจองตั๋วรถตู้ออนไลน์ (Van Booking System)
## **Full-Stack with Custom Backend**

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Backend API](https://img.shields.io/badge/Backend-Node.js%20%7C%20Go-success?style=for-the-badge)](/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20MySQL-blue?style=for-the-badge&logo=postgresql)](/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://docker.com)

---

## 🎯 **เว็บนี้คืออะไร?**

**ระบบจองตั๋วรถตู้ออนไลน์แบบ Full-Stack** สร้างขึ้นด้วย:
- **Frontend:** Next.js 16
- **Backend:** Node.js (Express) หรือ Go (Gin)
- **Database:** PostgreSQL หรือ MySQL
- **Containerization:** Docker & Docker Compose

**ผู้โดยสารสามารถ:**
- 🔍 ค้นหาเที่ยวรถตู้
- 🪑 เลือกที่นั่งแบบ real-time
- ✅ จองตั๋วล่วงหน้า
- 📋 ดูประวัติการจอง

**ผู้ให้บริการสามารถ:**
- 📊 ดู Dashboard สถิติ
- 🚐 จัดการรถตู้ / เส้นทาง / ตารางเวลา
- 💰 ตรวจสอบการจองและการชำระเงิน

---

## 🏗️ **Architecture Overview**

```
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│              http://localhost:3000                  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API / GraphQL
                       ▼
┌─────────────────────────────────────────────────────┐
│            Backend API (Node.js / Go)               │
│              http://localhost:8000                  │
│                                                     │
│  - Authentication (JWT)                             │
│  - Business Logic                                   │
│  - Database Access                                  │
│  - File Upload (if needed)                          │
└──────────────────────┬──────────────────────────────┘
                       │ SQL Queries
                       ▼
┌─────────────────────────────────────────────────────┐
│        Database (PostgreSQL / MySQL)                │
│              localhost:5432 / 3306                  │
│                                                     │
│  - users, routes, vans, schedules                   │
│  - seats, bookings, payments                        │
└─────────────────────────────────────────────────────┘

           All wrapped in Docker Containers 🐳
```

---

## 📂 **Project Structure**

```
v0-van-booking-system/
│
├── frontend/                   # Next.js Frontend
│   ├── pages/                 # Next.js Pages
│   ├── components/            # React Components
│   ├── lib/                   # API Client, Utils
│   ├── public/                # Static Files
│   └── package.json
│
├── backend/                    # Backend API
│   ├── nodejs/                # Node.js (Express) version
│   │   ├── src/
│   │   │   ├── routes/       # API Routes
│   │   │   ├── controllers/  # Business Logic
│   │   │   ├── models/       # Database Models
│   │   │   ├── middleware/   # Auth, Validation
│   │   │   └── config/       # Database Config
│   │   ├── package.json
│   │   └── Dockerfile
│   │
│   └── go/                    # Go (Gin) version
│       ├── cmd/
│       ├── internal/
│       │   ├── handlers/     # API Handlers
│       │   ├── models/       # Data Models
│       │   ├── repository/   # Database Layer
│       │   └── middleware/   # Auth, CORS
│       ├── go.mod
│       └── Dockerfile
│
├── database/                   # Database
│   ├── migrations/            # SQL Migrations
│   ├── seeds/                 # Sample Data
│   └── schema.sql             # Database Schema
│
├── docker-compose.yml          # Docker Orchestration
├── .env.example               # Environment Template
└── README.md                  # This file
```

---

## 🚀 **Quick Start with Docker**

### **Prerequisites**
- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- Go 1.21+ (if using Go backend)

### **1. Clone Repository**
```bash
git clone https://github.com/Kessaraonwan/v0-van-booking-system.git
cd v0-van-booking-system
```

### **2. Copy Environment File**
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=vanbooking
DB_PASSWORD=your_secure_password
DB_NAME=vanbooking_db

# Backend API
API_PORT=8000
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=24h

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### **3. Start All Services with Docker**
```bash
docker-compose up -d
```

This will start:
- ✅ PostgreSQL Database (port 5432)
- ✅ Backend API (port 8000)
- ✅ Frontend (port 3000)

### **4. Run Database Migrations**
```bash
# For Node.js backend
docker-compose exec backend npm run migrate

# For Go backend
docker-compose exec backend ./migrate
```

### **5. Seed Sample Data**
```bash
# For Node.js backend
docker-compose exec backend npm run seed

# For Go backend
docker-compose exec backend ./seed
```

### **6. Access the Application**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs (Swagger)

---

## 📊 **Database Schema**

### **7 Main Tables:**

```sql
-- Users (ผู้ใช้)
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  role VARCHAR CHECK(role IN ('customer', 'admin')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Routes (เส้นทาง)
routes (
  id UUID PRIMARY KEY,
  origin VARCHAR NOT NULL,
  destination VARCHAR NOT NULL,
  distance_km DECIMAL,
  duration_minutes INT,
  base_price DECIMAL NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
)

-- Vans (รถตู้)
vans (
  id UUID PRIMARY KEY,
  van_number VARCHAR UNIQUE,
  license_plate VARCHAR UNIQUE,
  van_type VARCHAR,
  total_seats INT DEFAULT 12,
  driver_name VARCHAR,
  driver_phone VARCHAR,
  is_active BOOLEAN DEFAULT TRUE
)

-- Schedules (รอบรถ)
schedules (
  id UUID PRIMARY KEY,
  route_id UUID REFERENCES routes(id),
  van_id UUID REFERENCES vans(id),
  departure_date DATE,
  departure_time TIME,
  arrival_time TIME,
  price DECIMAL,
  available_seats INT DEFAULT 12,
  status VARCHAR CHECK(status IN ('SCHEDULED', 'DEPARTING', 'COMPLETED', 'CANCELLED', 'FULL'))
)

-- Seats (ที่นั่ง)
seats (
  id UUID PRIMARY KEY,
  schedule_id UUID REFERENCES schedules(id),
  seat_number INT CHECK(seat_number BETWEEN 1 AND 12),
  status VARCHAR CHECK(status IN ('AVAILABLE', 'BOOKED', 'RESERVED'))
)

-- Bookings (การจอง)
bookings (
  id UUID PRIMARY KEY,
  booking_number VARCHAR UNIQUE,
  user_id UUID REFERENCES users(id),
  schedule_id UUID REFERENCES schedules(id),
  seats VARCHAR, -- "1,2,3"
  total_seats INT,
  total_price DECIMAL,
  status VARCHAR CHECK(status IN ('BOOKED', 'COMPLETED', 'CANCELLED')),
  passenger_name VARCHAR,
  passenger_phone VARCHAR,
  passenger_email VARCHAR,
  booked_at TIMESTAMP,
  cancelled_at TIMESTAMP
)

-- Payments (การชำระเงิน)
payments (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL NOT NULL,
  payment_method VARCHAR CHECK(payment_method IN ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'PROMPTPAY')),
  payment_status VARCHAR CHECK(payment_status IN ('PENDING', 'PAID', 'REFUNDED')),
  transaction_id VARCHAR,
  paid_at TIMESTAMP
)
```

**Full Schema:** See `database/schema.sql`

---

## 🔌 **API Endpoints**

### **Authentication**
```
POST   /api/auth/register      # สมัครสมาชิก
POST   /api/auth/login         # เข้าสู่ระบบ
POST   /api/auth/logout        # ออกจากระบบ
GET    /api/auth/me            # ดูข้อมูลตัวเอง
```

### **Schedules (เที่ยวรถ)**
```
GET    /api/schedules          # ค้นหาเที่ยวรถ (query: origin, destination, date)
GET    /api/schedules/:id      # ดูรายละเอียดเที่ยวรถ
GET    /api/schedules/:id/seats # ดูที่นั่งว่าง
```

### **Bookings (การจอง)**
```
POST   /api/bookings           # จองที่นั่ง
GET    /api/bookings           # ดูประวัติการจอง (ของตัวเอง)
GET    /api/bookings/:id       # ดูรายละเอียดการจอง
DELETE /api/bookings/:id       # ยกเลิกการจอง
```

### **Admin - Vans**
```
GET    /api/admin/vans         # ดูรถตู้ทั้งหมด
POST   /api/admin/vans         # เพิ่มรถตู้
PUT    /api/admin/vans/:id     # แก้ไขรถตู้
DELETE /api/admin/vans/:id     # ลบรถตู้
```

### **Admin - Routes**
```
GET    /api/admin/routes       # ดูเส้นทางทั้งหมด
POST   /api/admin/routes       # เพิ่มเส้นทาง
PUT    /api/admin/routes/:id   # แก้ไขเส้นทาง
DELETE /api/admin/routes/:id   # ลบเส้นทาง
```

### **Admin - Schedules**
```
GET    /api/admin/schedules    # ดูตารางเวลาทั้งหมด
POST   /api/admin/schedules    # เพิ่มเที่ยวรถ
PUT    /api/admin/schedules/:id # แก้ไขเที่ยวรถ
DELETE /api/admin/schedules/:id # ลบเที่ยวรถ
```

### **Admin - Bookings**
```
GET    /api/admin/bookings     # ดูการจองทั้งหมด
GET    /api/admin/bookings/:id # ดูรายละเอียดการจอง
PUT    /api/admin/bookings/:id # อัพเดทสถานะการจอง
```

### **Admin - Dashboard**
```
GET    /api/admin/stats        # สถิติวันนี้
GET    /api/admin/stats/today  # การจอง/ผู้โดยสาร/เที่ยววันนี้
```

**Full API Documentation:** http://localhost:8000/docs

---

## 🔐 **Authentication**

### **JWT (JSON Web Token)**
- ใช้ JWT สำหรับ authentication
- Token expires: 24 ชั่วโมง
- Refresh token: 7 วัน

### **Password Hashing**
- ใช้ bcrypt สำหรับ hash password
- Salt rounds: 10

### **Role-based Access Control**
- `customer` - ผู้ใช้ทั่วไป (จองได้, ดูประวัติของตัวเอง)
- `admin` - ผู้ดูแลระบบ (เข้าถึงทุกอย่างได้)

### **Example: Login Request**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "customer@example.com",
      "full_name": "สมชาย ใจดี",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

---

## 🐳 **Docker Setup**

### **docker-compose.yml**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: vanbooking
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: vanbooking_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seeds:/docker-entrypoint-initdb.d/02-seeds.sql

  backend:
    build: ./backend/nodejs  # or ./backend/go
    ports:
      - "8000:8000"
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: vanbooking
      DB_PASSWORD: your_password
      DB_NAME: vanbooking_db
      JWT_SECRET: your_jwt_secret
    depends_on:
      - postgres
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:8000/api
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### **Commands**
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild
docker-compose up -d --build

# Remove everything (including volumes)
docker-compose down -v
```

---

## 🛠️ **Development**

### **Backend Development (Node.js)**
```bash
cd backend/nodejs
npm install
npm run dev  # nodemon for auto-reload
```

### **Backend Development (Go)**
```bash
cd backend/go
go mod download
air  # hot reload (install air first)
```

### **Frontend Development**
```bash
cd frontend
pnpm install
pnpm run dev
```

### **Database Migrations**
```bash
# Create new migration
npm run migrate:create add_user_avatar

# Run migrations
npm run migrate:up

# Rollback
npm run migrate:down
```

---

## 📋 **Features Checklist**

### **User Features:**
- ✅ ลงทะเบียน / Login (JWT Authentication)
- ✅ ค้นหาเที่ยวรถ (ต้นทาง, ปลายทาง, วันที่)
- ✅ ดูที่นั่งว่าง (Real-time availability)
- ✅ จองที่นั่ง (Multiple seats)
- ✅ ดูประวัติการจอง (Filter by status)
- ✅ ยกเลิกการจอง (Refund seats)

### **Admin Features:**
- ✅ Dashboard สถิติ (Real-time stats)
- ✅ จัดการรถตู้ (CRUD)
- ✅ จัดการเส้นทาง (CRUD)
- ✅ จัดการตารางเวลา (CRUD)
- ✅ ดูการจองทั้งหมด (All bookings)
- ✅ จัดการสถานะการชำระเงิน

### **Technical Features:**
- ✅ RESTful API
- ✅ JWT Authentication
- ✅ Role-based Authorization
- ✅ Input Validation
- ✅ Error Handling
- ✅ API Documentation (Swagger)
- ✅ Database Migrations
- ✅ Docker Containerization
- ✅ CORS Configuration

---

## 🧪 **Testing**

### **Backend Tests**
```bash
# Node.js
npm test
npm run test:watch
npm run test:coverage

# Go
go test ./...
go test -cover ./...
```

### **API Tests (with curl)**
```bash
# Health check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vango.com","password":"admin123"}'

# Get schedules (authenticated)
curl http://localhost:8000/api/schedules \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 **Documentation**

- **[DATABASE.md](./docs/DATABASE.md)** - Database schema & relationships
- **[API.md](./docs/API.md)** - API endpoints documentation
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment guide
- **[DOCKER.md](./docs/DOCKER.md)** - Docker setup & commands

---

## 🚢 **Production Deployment**

### **Option 1: Docker on VPS**
```bash
# On your VPS
git clone your-repo
cd v0-van-booking-system
cp .env.example .env
# Edit .env with production values
docker-compose -f docker-compose.prod.yml up -d
```

### **Option 2: Kubernetes**
```bash
kubectl apply -f k8s/
```

### **Option 3: Cloud Services**
- **Backend:** Railway, Fly.io, Render
- **Frontend:** Vercel, Netlify
- **Database:** Railway, Supabase, AWS RDS

---

## 🔧 **Technology Stack**

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React, Tailwind CSS |
| Backend | Node.js (Express) / Go (Gin) |
| Database | PostgreSQL / MySQL |
| Authentication | JWT |
| ORM | Prisma (Node.js) / GORM (Go) |
| Validation | Joi (Node.js) / validator (Go) |
| Container | Docker, Docker Compose |
| Documentation | Swagger / OpenAPI |

---

## ⚠️ **Important Notes**

### **สำคัญ: สถานะการชำระเงิน**
- ❌ ไม่เก็บ `payment_status` ใน `bookings` table
- ✅ ใช้ `payments.payment_status` แทน
  - `PENDING` - รอชำระ
  - `PAID` - ชำระแล้ว
  - `REFUNDED` - คืนเงินแล้ว

### **API Response Format**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error Response:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 **License**

MIT License - ใช้งานและแก้ไขได้ตามต้องการ

---

## 👥 **Team**

**สร้างโดย:** Van Booking System Team  
**วันที่:** November 2024  
**เวอร์ชัน:** 2.0 (Custom Backend)

---

## 📞 **Support**

- 📧 Email: support@vanbooking.com
- 📱 Line: @vanbooking
- 🌐 Website: https://vanbooking.com

---

**🎉 Full-Stack Van Booking System with Custom Backend!** 🚐✨
