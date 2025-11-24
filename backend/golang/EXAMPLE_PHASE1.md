# 🎯 Phase 1: Authentication - ตัวอย่างการเขียน

## ⚡ Quick Start - เริ่มทำ Authentication

### 📁 ไฟล์ที่ต้องแก้ (2 files)
1. `internal/repository/user_repo.go` - Database operations
2. `internal/handler/auth.go` - API endpoints

---

## 📝 ตัวอย่าง: user_repo.go

### Method 1: Create() - สร้าง user ใหม่

```go
// Create สร้าง user ใหม่ในฐานข้อมูล
func (r *UserRepository) Create(user *model.User) error {
	query := `
		INSERT INTO users (email, password, full_name, phone, role, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, created_at
	`
	
	err := r.db.QueryRow(
		query,
		user.Email,
		user.Password, // ต้อง hash แล้ว!
		user.FullName,
		user.Phone,
		user.Role,
	).Scan(&user.ID, &user.CreatedAt)
	
	if err != nil {
		return err
	}
	
	return nil
}
```

### Method 2: GetByEmail() - ดึง user จาก email

```go
// GetByEmail ดึง user จาก email
func (r *UserRepository) GetByEmail(email string) (*model.User, error) {
	user := &model.User{}
	
	query := `
		SELECT id, email, password, full_name, phone, role, created_at
		FROM users
		WHERE email = $1
	`
	
	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.FullName,
		&user.Phone,
		&user.Role,
		&user.CreatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	
	if err != nil {
		return nil, err
	}
	
	return user, nil
}
```

### Method 3: GetByID() - ดึง user จาก ID

```go
// GetByID ดึง user จาก ID
func (r *UserRepository) GetByID(id int) (*model.User, error) {
	user := &model.User{}
	
	query := `
		SELECT id, email, password, full_name, phone, role, created_at
		FROM users
		WHERE id = $1
	`
	
	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.FullName,
		&user.Phone,
		&user.Role,
		&user.CreatedAt,
	)
	
	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}
	
	if err != nil {
		return nil, err
	}
	
	return user, nil
}
```

---

## 📝 ตัวอย่าง: auth.go

### Endpoint 1: Register - สมัครสมาชิก

```go
// Register สมัครสมาชิก
// POST /api/auth/register
func (h *AuthHandler) Register(c *gin.Context) {
	var req model.RegisterRequest
	
	// 1. Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}
	
	// 2. Check if email exists
	existingUser, _ := h.userRepo.GetByEmail(req.Email)
	if existingUser != nil {
		utils.ErrorResponse(c, 400, "Email already exists")
		return
	}
	
	// 3. Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to hash password")
		return
	}
	
	// 4. Create user
	user := &model.User{
		Email:    req.Email,
		Password: hashedPassword,
		FullName: req.FullName,
		Phone:    req.Phone,
		Role:     "customer", // default role
	}
	
	if err := h.userRepo.Create(user); err != nil {
		utils.ErrorResponse(c, 500, "Failed to create user")
		return
	}
	
	// 5. Return success (ไม่ส่ง password กลับไป)
	user.Password = ""
	utils.SuccessResponse(c, 201, "User registered successfully", user)
}
```

### Endpoint 2: Login - เข้าสู่ระบบ

```go
// Login เข้าสู่ระบบ
// POST /api/auth/login
func (h *AuthHandler) Login(c *gin.Context) {
	var req model.LoginRequest
	
	// 1. Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}
	
	// 2. Get user by email
	user, err := h.userRepo.GetByEmail(req.Email)
	if err != nil {
		utils.ErrorResponse(c, 401, "Invalid email or password")
		return
	}
	
	// 3. Check password
	if !utils.CheckPassword(req.Password, user.Password) {
		utils.ErrorResponse(c, 401, "Invalid email or password")
		return
	}
	
	// 4. Generate access token (อายุ 15 นาที)
	accessToken, err := utils.GenerateAccessToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate access token")
		return
	}
	
	// 5. Generate refresh token (อายุ 7 วัน)
	refreshToken, err := utils.GenerateRefreshToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate refresh token")
		return
	}
	
	// 6. Return tokens + user info (ไม่ส่ง password)
	user.Password = ""
	response := model.LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		User:         *user,
	}
	
	utils.SuccessResponse(c, 200, "Login successful", response)
}
```

### Endpoint 3: RefreshToken - ขอ access token ใหม่

```go
// RefreshToken ขอ access token ใหม่
// POST /api/auth/refresh
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req model.RefreshTokenRequest
	
	// 1. Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}
	
	// 2. Validate refresh token
	claims, err := utils.ValidateToken(req.RefreshToken)
	if err != nil {
		utils.ErrorResponse(c, 401, "Invalid or expired refresh token")
		return
	}
	
	// 3. Generate new access token
	newAccessToken, err := utils.GenerateAccessToken(claims.UserID, claims.Email, claims.Role)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate access token")
		return
	}
	
	// 4. Return new access token
	utils.SuccessResponse(c, 200, "Token refreshed successfully", gin.H{
		"accessToken": newAccessToken,
	})
}
```

---

## 🧪 วิธีทดสอบ

### 1. เริ่ม server
```bash
cd /workspaces/v0-van-booking-system/backend/golang
go run cmd/main.go
```

### 2. ทดสอบ Register
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

**Response ที่คาดหวัง:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 5,
    "email": "test@example.com",
    "full_name": "Test User",
    "phone": "0812345678",
    "role": "customer",
    "created_at": "2025-11-24T15:30:00Z"
  }
}
```

### 3. ทดสอบ Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response ที่คาดหวัง:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 5,
      "email": "test@example.com",
      "full_name": "Test User",
      "phone": "0812345678",
      "role": "customer",
      "created_at": "2025-11-24T15:30:00Z"
    }
  }
}
```

### 4. ทดสอบ Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### 5. ทดสอบ Protected Endpoint
```bash
curl http://localhost:8080/api/bookings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

## ✅ Checklist

### user_repo.go
- [ ] เพิ่ม `import "errors"` ถ้ายังไม่มี
- [ ] เพิ่ม `import "database/sql"` ถ้ายังไม่มี
- [ ] Implement `Create()`
- [ ] Implement `GetByEmail()`
- [ ] Implement `GetByID()`

### auth.go
- [ ] ลบ TODO comments
- [ ] Implement `Register()`
- [ ] Implement `Login()`
- [ ] Implement `RefreshToken()`

### Testing
- [ ] ทดสอบ Register ด้วย curl
- [ ] ทดสอบ Login ด้วย curl
- [ ] ทดสอบ Refresh Token ด้วย curl
- [ ] ทดสอบ Protected endpoint ด้วย JWT token
- [ ] ทดสอบ Admin endpoint ด้วย admin token

---

## 🎯 หลังจากทำ Phase 1 เสร็จ

1. ✅ Authentication ทำงานได้
2. ✅ สามารถ Register, Login, Refresh ได้
3. ✅ JWT middleware ทำงานได้
4. ✅ Admin middleware ทำงานได้

**ก็พร้อมไปต่อ Phase 2: Routes & Reviews แล้ว!**

---

## 💡 Tips สำคัญ

### 1. Error Handling
```go
if err == sql.ErrNoRows {
    return nil, errors.New("user not found")
}
```

### 2. Password Safety
```go
// ✅ ถูกต้อง - hash password ก่อน save
hashedPassword, _ := utils.HashPassword(password)

// ❌ ผิด - save password แบบ plain text
user.Password = password
```

### 3. JWT Token Response
```go
// ✅ ถูกต้อง - ส่ง camelCase
{
  "accessToken": "...",
  "refreshToken": "..."
}

// ❌ ผิด - ส่ง snake_case (frontend ต้องการ camelCase)
{
  "access_token": "...",
  "refresh_token": "..."
}
```

### 4. Don't Send Password
```go
// ✅ ถูกต้อง - ลบ password ก่อนส่ง
user.Password = ""
c.JSON(200, user)

// ❌ ผิด - ส่ง password ไปด้วย
c.JSON(200, user)
```

---

**เริ่มเขียนได้เลยครับ! มีตัวอย่างครบแล้ว** 🚀
