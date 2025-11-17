# 🚀 Quick Start Guide - Van Booking System

คู่มือเริ่มต้นใช้งาน Backend + Frontend พร้อมกัน ด้วย Docker Compose

## 📋 Prerequisites

- Docker & Docker Compose
- Node.js 18+ (สำหรับ local development)
- pnpm (สำหรับ frontend)

## ⚡ วิธีรัน (แบบง่าย - Docker Compose)

### 1. Clone โปรเจค

```bash
git clone <repository-url>
cd v0-van-booking-system
```

### 2. สร้างไฟล์ `.env`

```bash
cp .env.example .env
```

แก้ไข `.env` ตามต้องการ (ค่า default ก็ใช้งานได้เลย)

### 3. รัน Docker Compose

```bash
# รันทุก services (postgres + backend + frontend)
docker-compose up -d

# หรือรันเฉพาะ service ที่ต้องการ
docker-compose up -d postgres backend
```

### 4. รอให้ services พร้อม

```bash
# ดู logs
docker-compose logs -f

# ตรวจสอบสถานะ
docker-compose ps
```

### 5. เข้าใช้งาน

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Database**: localhost:5432
- **Adminer** (Database UI): http://localhost:8080

### 6. สร้างข้อมูลตัวอย่าง (Optional)

```bash
# เข้า backend container
docker-compose exec backend sh

# รัน seed
npm run seed
```

## 🛠 Development (แบบแยก - ไม่ใช้ Docker)

### 1. รัน PostgreSQL ด้วย Docker

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=vanbooking \
  -e POSTGRES_PASSWORD=vanbooking123 \
  -e POSTGRES_DB=vanbooking_db \
  -p 5432:5432 \
  postgres:15-alpine
```

### 2. รัน Backend

```bash
cd backend/nodejs

# ติดตั้ง dependencies
npm install

# สร้าง .env
cp .env.example .env

# รัน development server
npm run dev
```

Backend จะรันที่ `http://localhost:8000`

### 3. รัน Frontend

```bash
# กลับไปที่ root directory
cd ../..

# ติดตั้ง dependencies
pnpm install

# สร้าง .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# รัน development server
pnpm run dev
```

Frontend จะรันที่ `http://localhost:3000`

## 📊 ข้อมูลตัวอย่าง

### Admin Account (หลังจากรัน seed)
```
Email: admin@vanbooking.com
Password: admin123456
```

### Customer Account
```
Email: customer@test.com
Password: password123
```

## 🧪 ทดสอบ API

### 1. Register User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123",
    "full_name": "Test User",
    "phone": "0812345678"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "password123"
  }'
```

จะได้ `accessToken` กลับมา

### 3. Get Profile

```bash
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

### 4. Search Schedules

```bash
curl "http://localhost:8000/api/schedules/search?from=Bangkok&to=Pattaya&date=2024-02-01"
```

## 🐳 Docker Commands

```bash
# ดู logs ทั้งหมด
docker-compose logs -f

# ดู logs เฉพาะ service
docker-compose logs -f backend

# Stop services
docker-compose stop

# Start services
docker-compose start

# Restart service
docker-compose restart backend

# ลบ containers (ไม่ลบ volumes)
docker-compose down

# ลบทุกอย่างรวม volumes
docker-compose down -v

# Rebuild images
docker-compose build

# Rebuild และรันใหม่
docker-compose up -d --build
```

## 📁 โครงสร้างโปรเจค

```
v0-van-booking-system/
├── backend/
│   └── nodejs/              # Node.js Backend
│       ├── src/
│       ├── package.json
│       └── Dockerfile
├── frontend/                # Symlink to root (Next.js Frontend)
│   └── Dockerfile
├── database/
│   ├── schema.sql          # Database schema (สำหรับ reference)
│   └── seeds/
│       └── init.sql        # Sample data
├── pages/                  # Next.js pages
├── components/             # React components
├── lib/
│   └── api-client.js       # API client for frontend
├── docker-compose.yml      # Docker Compose configuration
├── .env.example            # Environment variables template
└── README.md
```

## 🔧 Troubleshooting

### Backend ไม่เชื่อมต่อ Database

```bash
# ตรวจสอบว่า postgres รันอยู่หรือไม่
docker-compose ps postgres

# ดู logs ของ postgres
docker-compose logs postgres

# ตรวจสอบ environment variables
docker-compose exec backend env | grep DB_
```

### Frontend ไม่เรียก API ได้

```bash
# ตรวจสอบ NEXT_PUBLIC_API_URL
echo $NEXT_PUBLIC_API_URL

# หรือดูใน browser console
# หากรันด้วย docker-compose ต้องใช้ http://backend:8000/api
# หากรันแยกใช้ http://localhost:8000/api
```

### Port ถูกใช้งานแล้ว

```bash
# เปลี่ยน port ใน docker-compose.yml หรือ .env
# เช่น
FRONTEND_PORT=3001
API_PORT=8001
DB_PORT=5433
```

### Database migrations

```bash
# Sequelize จะ sync models อัตโนมัติใน development mode
# หากต้องการ reset database
docker-compose down -v
docker-compose up -d
```

## 📚 เอกสารเพิ่มเติม

- [Backend README](backend/nodejs/README.md) - รายละเอียด Backend API
- [BACKEND_README.md](BACKEND_README.md) - สถาปัตยกรรมแบบเต็ม
- [DATABASE_SUMMARY.md](DATABASE_SUMMARY.md) - รายละเอียด Database
- [DESIGN_GUIDE.md](DESIGN_GUIDE.md) - UI/UX Design

## 🎯 Next Steps

1. **Frontend Integration**: แก้ไข pages ใช้ `lib/api-client.js` แทน mock data
2. **Seed Data**: สร้างข้อมูลตัวอย่างสำหรับ development
3. **Tests**: เขียน unit tests และ integration tests
4. **CI/CD**: Setup GitHub Actions สำหรับ automated testing และ deployment
5. **Production**: Deploy บน VPS หรือ Cloud Platform

## 🆘 ต้องการความช่วยเหลือ?

- Check logs: `docker-compose logs -f`
- Restart services: `docker-compose restart`
- Clean install: `docker-compose down -v && docker-compose up -d --build`

---

**Happy Coding! 🚀**
