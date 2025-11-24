# 📋 Quick Reference - Go Backend Cheat Sheet

## 🚀 การรัน

```bash
# Development
cd /workspaces/v0-van-booking-system/backend/golang
go run cmd/main.go

# Build
go build -o vanbooking cmd/main.go

# Test compile
go build cmd/main.go

# Install dependencies
go mod download

# Clean dependencies
go mod tidy
```

---

## 🗄️ Database Operations

### Connect to Database
```bash
docker exec -it vanbooking_postgres psql -U vanbooking -d vanbooking_db
```

### Query Database
```sql
-- ดู users
SELECT * FROM users;

-- ดู bookings
SELECT * FROM bookings;

-- Count schedules
SELECT COUNT(*) FROM schedules;
```

---

## 🔧 Common SQL Patterns

### Query Single Row
```go
var user model.User
err := db.QueryRow("SELECT id, email FROM users WHERE id = $1", userID).Scan(&user.ID, &user.Email)
if err == sql.ErrNoRows {
    return nil, errors.New("not found")
}
```

### Query Multiple Rows
```go
rows, err := db.Query("SELECT id, name FROM routes")
if err != nil {
    return nil, err
}
defer rows.Close()

var routes []*model.Route
for rows.Next() {
    var route model.Route
    if err := rows.Scan(&route.ID, &route.Name); err != nil {
        return nil, err
    }
    routes = append(routes, &route)
}
```

### Insert with RETURNING
```go
query := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`
var id int
err := db.QueryRow(query, email, password).Scan(&id)
```

### Update
```go
query := `UPDATE users SET full_name = $1 WHERE id = $2`
_, err := db.Exec(query, fullName, userID)
```

### Delete
```go
query := `DELETE FROM users WHERE id = $1`
_, err := db.Exec(query, userID)
```

### Transaction
```go
tx, err := db.Begin()
if err != nil {
    return err
}
defer tx.Rollback() // จะไม่ทำอะไรถ้า commit แล้ว

// Do work...
_, err = tx.Exec("INSERT INTO bookings ...")
if err != nil {
    return err // tx.Rollback() will be called
}

return tx.Commit()
```

---

## 🎮 Gin Handler Patterns

### Get JSON Body
```go
var req model.CreateRequest
if err := c.ShouldBindJSON(&req); err != nil {
    utils.ErrorResponse(c, 400, "Invalid request")
    return
}
```

### Get URL Parameter
```go
id := c.Param("id") // from /api/users/:id
scheduleID, err := strconv.Atoi(id)
```

### Get Query String
```go
from := c.Query("from")        // /api/search?from=Bangkok
limit := c.DefaultQuery("limit", "10") // default value
```

### Get User from Context (after middleware)
```go
userID, _ := c.Get("user_id")
role, _ := c.Get("role")
email, _ := c.Get("email")

// Convert to int
userIDInt := userID.(int)
```

### Success Response
```go
utils.SuccessResponse(c, 200, "Success message", data)
```

### Error Response
```go
utils.ErrorResponse(c, 400, "Error message")
```

---

## 🔐 JWT Operations

### Generate Access Token
```go
token, err := utils.GenerateAccessToken(userID, email, role)
```

### Generate Refresh Token
```go
token, err := utils.GenerateRefreshToken(userID, email, role)
```

### Validate Token
```go
claims, err := utils.ValidateToken(tokenString)
if err != nil {
    // Invalid token
}
userID := claims.UserID
```

---

## 🔒 Password Operations

### Hash Password
```go
hashedPassword, err := utils.HashPassword("plain-password")
```

### Check Password
```go
isValid := utils.CheckPassword("plain-password", hashedPassword)
```

---

## 📝 Testing with curl

### Register
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

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Protected Endpoint (with token)
```bash
curl http://localhost:8080/api/bookings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Search Schedules
```bash
curl "http://localhost:8080/api/schedules/search?from=Bangkok&to=Pattaya&date=2025-11-25"
```

---

## 🐛 Debugging

### Check Server Running
```bash
curl http://localhost:8080/health
```

### View Logs
```bash
# If using Docker
docker-compose logs -f backend

# If running locally
# Logs will appear in terminal
```

### Check Database Connection
```bash
docker ps | grep postgres
docker exec vanbooking_postgres pg_isready
```

### Common Errors

#### Port Already in Use
```bash
# Change port in .env
PORT=8081

# Or stop other service
docker-compose down backend
```

#### Database Connection Error
```bash
# Check .env
cat .env

# Check database running
docker ps | grep postgres

# Restart database
docker-compose restart postgres
```

#### Import Errors
```bash
go mod tidy
```

---

## 📊 Database Schema Quick Reference

### users
```sql
id, email, password, full_name, phone, role, created_at
```

### routes
```sql
id, origin, destination, base_price, duration_minutes, distance_km
```

### vans
```sql
id, van_number, license_plate, driver, total_seats, status
```

### schedules
```sql
id, route_id, van_id, departure_date, departure_time, available_seats, status
```

### seats
```sql
id, schedule_id, seat_number, status, booking_id
```

### bookings
```sql
id, booking_number, user_id, schedule_id, passenger_name, 
passenger_phone, passenger_email, total_seats, seat_numbers, 
total_price, status
```

### payments
```sql
id, booking_id, amount, payment_method, payment_status, 
transaction_id, payment_date
```

### reviews
```sql
id, user_id, route_id, rating, comment, created_at
```

---

## 🎯 Common Tasks

### Add New Endpoint
1. เพิ่ม method ใน handler
2. เพิ่ม route ใน `cmd/main.go`
3. ทดสอบด้วย curl

### Add Database Query
1. เพิ่ม method ใน repository
2. เรียกใช้ใน handler
3. Test SQL ใน psql ก่อน

### Fix Import Error
```bash
go mod tidy
```

### Update Dependencies
```bash
go get -u all
go mod tidy
```

---

## 📁 File Locations

```
backend/golang/
├── cmd/main.go                    # Routes definition
├── internal/
│   ├── handler/                   # API endpoints logic
│   ├── repository/                # Database queries
│   ├── model/                     # Data structures
│   ├── middleware/                # Auth, Admin
│   └── utils/                     # JWT, Password, Response
├── .env                          # Environment variables
├── TODO.md                       # What to do next
├── EXAMPLE_PHASE1.md             # Code examples
└── PROJECT_SUMMARY.md            # Overview
```

---

## 🔗 Useful Links

- **Go Docs**: https://golang.org/doc/
- **Gin Docs**: https://gin-gonic.com/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT**: https://jwt.io/

---

## ⚡ Quick Commands

```bash
# Check if compiles
go build cmd/main.go

# Format code
go fmt ./...

# Run tests
go test ./...

# View routes
go run cmd/main.go | grep "GIN-debug"

# Database backup
docker exec vanbooking_postgres pg_dump -U vanbooking vanbooking_db > backup.sql
```

---

**สิ่งที่ต้องจำ:**
- ใช้ `$1, $2, ...` ใน SQL (parameterized queries)
- อย่าลืม `defer rows.Close()` เมื่อใช้ `Query()`
- Hash password ก่อน save ด้วย `utils.HashPassword()`
- เช็ค error จาก database operation ทุกครั้ง
- ใช้ Transaction สำหรับ operations หลายขั้นตอน
