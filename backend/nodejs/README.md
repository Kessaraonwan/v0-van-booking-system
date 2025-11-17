# Van Booking System - Backend (Node.js + Express)

Backend API สำหรับระบบจองรถตู้ ใช้ Node.js, Express, Sequelize และ PostgreSQL

## 🚀 เทคโนโลยีที่ใช้

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator

## 📁 โครงสร้างโปรเจค

```
backend/nodejs/
├── src/
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── scheduleController.js
│   │   ├── bookingController.js
│   │   └── adminController.js
│   ├── models/              # Database models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Route.js
│   │   ├── Van.js
│   │   ├── Schedule.js
│   │   ├── Seat.js
│   │   ├── Booking.js
│   │   └── Payment.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── schedules.js
│   │   ├── bookings.js
│   │   ├── admin.js
│   │   ├── routes.js
│   │   └── vans.js
│   ├── middleware/          # Custom middleware
│   │   └── auth.js
│   ├── database/            # Database utilities
│   │   ├── connection.js
│   │   ├── migrate.js
│   │   └── seed.js
│   └── server.js            # Entry point
├── package.json
├── Dockerfile
└── .dockerignore
```

## 🔧 การติดตั้งและรัน

### 1. ติดตั้ง Dependencies

```bash
cd backend/nodejs
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env`:

```env
NODE_ENV=development
PORT=8000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=vanbooking
DB_PASSWORD=vanbooking123
DB_NAME=vanbooking_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=24h
JWT_REFRESH_EXPIRY=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. รัน PostgreSQL (ด้วย Docker)

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=vanbooking \
  -e POSTGRES_PASSWORD=vanbooking123 \
  -e POSTGRES_DB=vanbooking_db \
  -p 5432:5432 \
  postgres:15-alpine
```

### 4. รัน Development Server

```bash
npm run dev
```

Backend จะรันที่ `http://localhost:8000`

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint              | Description          | Auth Required |
|--------|----------------------|----------------------|---------------|
| POST   | `/register`          | ลงทะเบียนผู้ใช้ใหม่  | ❌             |
| POST   | `/login`             | เข้าสู่ระบบ          | ❌             |
| POST   | `/refresh`           | Refresh token        | ❌             |
| GET    | `/me`                | ข้อมูลผู้ใช้ปัจจุบัน | ✅             |
| PUT    | `/me`                | อัพเดทโปรไฟล์        | ✅             |
| POST   | `/change-password`   | เปลี่ยนรหัสผ่าน      | ✅             |

### Schedules (`/api/schedules`)

| Method | Endpoint          | Description            | Auth Required |
|--------|------------------|------------------------|---------------|
| GET    | `/search`        | ค้นหารอบรถ             | ❌             |
| GET    | `/:id`           | ข้อมูลรอบรถ            | ❌             |
| GET    | `/:id/seats`     | ที่นั่งของรอบรถ        | ❌             |

### Bookings (`/api/bookings`)

| Method | Endpoint            | Description           | Auth Required |
|--------|--------------------|-----------------------|---------------|
| POST   | `/create`          | สร้างการจอง           | ✅             |
| GET    | `/my-bookings`     | การจองของฉัน          | ✅             |
| GET    | `/:id`             | รายละเอียดการจอง      | ✅             |
| POST   | `/:id/cancel`      | ยกเลิกการจอง          | ✅             |

### Admin (`/api/admin`) - ต้อง Admin Role

#### Dashboard
- `GET /dashboard/stats` - สถิติ dashboard
- `GET /dashboard/today-schedules` - รอบรถวันนี้
- `GET /dashboard/recent-bookings` - การจองล่าสุด

#### Booking Management
- `GET /bookings` - การจองทั้งหมด
- `GET /bookings/:id` - รายละเอียดการจอง
- `PUT /bookings/:id/status` - อัพเดทสถานะ

#### Schedule Management
- `GET /schedules` - รอบรถทั้งหมด
- `POST /schedules` - สร้างรอบรถ
- `PUT /schedules/:id` - แก้ไขรอบรถ
- `DELETE /schedules/:id` - ลบรอบรถ

#### Van Management
- `GET /vans` - รถตู้ทั้งหมด
- `POST /vans` - เพิ่มรถตู้
- `PUT /vans/:id` - แก้ไขรถตู้
- `DELETE /vans/:id` - ลบรถตู้

#### Route Management
- `GET /routes` - เส้นทางทั้งหมด
- `POST /routes` - เพิ่มเส้นทาง
- `PUT /routes/:id` - แก้ไขเส้นทาง
- `DELETE /routes/:id` - ลบเส้นทาง

## 🔐 Authentication

API ใช้ JWT (JSON Web Tokens) สำหรับ authentication

### การใช้งาน

1. **Register หรือ Login** เพื่อรับ `accessToken` และ `refreshToken`
2. ส่ง `accessToken` ใน header ของทุก request:
   ```
   Authorization: Bearer <accessToken>
   ```
3. เมื่อ `accessToken` หมดอายุ ให้ใช้ `refreshToken` เพื่อขอ token ใหม่

### Token Expiry
- **Access Token**: 24 ชั่วโมง
- **Refresh Token**: 7 วัน

## 📊 Database Models

### Users
- `id` (UUID)
- `email` (unique)
- `password` (hashed)
- `full_name`
- `phone`
- `role` (customer, admin)
- `is_active`

### Routes
- `id` (UUID)
- `origin`
- `destination`
- `distance_km`
- `duration_minutes`
- `base_price`
- `is_active`

### Vans
- `id` (UUID)
- `van_number` (unique)
- `license_plate` (unique)
- `total_seats` (default: 12)
- `status` (available, in_service, maintenance)
- `is_active`

### Schedules
- `id` (UUID)
- `route_id` (FK)
- `van_id` (FK)
- `departure_date`
- `departure_time`
- `price`
- `available_seats`
- `status` (scheduled, departed, completed, cancelled)

### Seats
- `id` (UUID)
- `schedule_id` (FK)
- `seat_number` (1-12)
- `status` (available, booked, reserved)
- `booking_id` (FK, nullable)

### Bookings
- `id` (UUID)
- `booking_number` (unique, BK20240201001)
- `user_id` (FK)
- `schedule_id` (FK)
- `passenger_name`
- `passenger_phone`
- `passenger_email`
- `total_seats`
- `seat_numbers` (array)
- `total_price`
- `status` (pending, confirmed, cancelled, completed)

### Payments
- `id` (UUID)
- `booking_id` (FK)
- `amount`
- `payment_method` (cash, bank_transfer, credit_card, promptpay)
- `payment_status` (pending, paid, refunded)
- `transaction_id`
- `paid_at`
- `refunded_at`

## 🛠 Development Commands

```bash
# รัน development server (hot reload)
npm run dev

# รัน production server
npm start

# รัน migrations (ถ้ามี)
npm run migrate

# รัน seeds (ข้อมูลตัวอย่าง)
npm run seed

# รัน tests
npm test

# Lint code
npm run lint
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t vanbooking-backend .

# Run container
docker run -d \
  --name vanbooking-backend \
  -p 8000:8000 \
  --env-file .env \
  vanbooking-backend

# Run with docker-compose (recommended)
docker-compose up -d backend
```

## 📝 Environment Variables

| Variable             | Description                  | Default              |
|---------------------|------------------------------|----------------------|
| NODE_ENV            | Environment                  | development          |
| PORT                | Server port                  | 8000                 |
| DB_HOST             | Database host                | localhost            |
| DB_PORT             | Database port                | 5432                 |
| DB_USER             | Database user                | vanbooking           |
| DB_PASSWORD         | Database password            | vanbooking123        |
| DB_NAME             | Database name                | vanbooking_db        |
| JWT_SECRET          | JWT secret key               | (required)           |
| JWT_EXPIRY          | Access token expiry          | 24h                  |
| JWT_REFRESH_EXPIRY  | Refresh token expiry         | 7d                   |
| CORS_ORIGIN         | CORS allowed origin          | http://localhost:3000|

## 🔍 Error Handling

API ส่ง response ในรูปแบบ:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

```bash
# รัน tests
npm test

# รัน tests with coverage
npm test -- --coverage

# รัน specific test file
npm test -- authController.test.js
```

## 📦 Production Deployment

1. ตั้งค่า environment variables ที่เหมาะสม
2. ตั้งค่า `NODE_ENV=production`
3. ใช้ PostgreSQL production instance
4. เปลี่ยน JWT_SECRET เป็นค่าที่ปลอดภัย
5. Enable HTTPS
6. ตั้งค่า CORS_ORIGIN ให้ตรงกับ frontend domain
7. Setup database backup
8. Monitor logs และ performance

## 🤝 Contributing

เมื่อเพิ่ม feature ใหม่:
1. สร้าง branch ใหม่
2. เขียน code และ tests
3. Update documentation
4. Submit pull request

## 📄 License

MIT
