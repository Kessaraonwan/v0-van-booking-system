# ✅ Backend Architecture Decision

## 🎯 โปรเจคนี้ใช้ Backend อะไร?

### ตอบ: **Node.js + Express + PostgreSQL**

---

## 📦 Stack ที่ใช้

```
Frontend:  Next.js 16 + React 19 + Tailwind CSS v4
Backend:   Node.js + Express + Sequelize ORM
Database:  PostgreSQL (via Docker)
Auth:      JWT (JSON Web Token)
Deploy:    Docker Compose
```

---

## ✅ ทำไมเลือก Node.js Backend?

1. **Full Control** - ควบคุมทุกอย่างได้เอง
2. **No Vendor Lock-in** - ไม่ผูกกับ Cloud Provider
3. **Free** - ไม่ต้องจ่ายเงิน
4. **Docker Ready** - รันง่าย `docker-compose up -d`
5. **Complete API** - มี 40+ endpoints พร้อมใช้แล้ว

---

## ❌ ไม่ได้ใช้ Supabase

เอกสารเก่าอาจจะยังบอกว่าใช้ Supabase แต่ **ตอนนี้ไม่ใช้แล้ว**

### ✅ เอกสารที่อัปเดตแล้ว:
- `README.md` - บอกว่าใช้ Node.js + Docker
- `DATABASE_SUMMARY.md` - บอกว่าใช้ PostgreSQL + Sequelize
- `QUICKSTART.md` - วิธีรัน docker-compose
- `BACKEND_README.md` - API Documentation

---

## 🚀 วิธีรัน Backend

```bash
# 1. รัน Backend + Database
docker-compose up -d postgres backend

# 2. ตรวจสอบ
curl http://localhost:5000/health
# Response: {"status":"ok"}

# 3. ดู API
# Backend API: http://localhost:5000/api
# Database: localhost:5432
```

---

## 📚 เอกสารเพิ่มเติม

- **[README.md](./README.md)** - Overview โปรเจค
- **[BACKEND_README.md](./BACKEND_README.md)** - API Documentation (40+ endpoints)
- **[QUICKSTART.md](./QUICKSTART.md)** - วิธีรัน Docker
- **[DATABASE_SUMMARY.md](./DATABASE_SUMMARY.md)** - Database schema

---

## 🔧 API Client

Frontend เชื่อมกับ Backend ผ่าน `lib/api-client.js`:

```javascript
import api from '@/lib/api-client'

// Login
const response = await api.login(email, password)

// Search schedules
const schedules = await api.searchSchedules(origin, destination, date)

// Create booking
const booking = await api.createBooking(bookingData)
```

---

**Updated:** November 17, 2024  
**Backend:** Node.js + Express + PostgreSQL  
**Status:** ✅ Production Ready
