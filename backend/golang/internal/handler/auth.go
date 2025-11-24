package handler

import (
	"vanbooking/internal/model"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthHandler จัดการ authentication endpoints
//
// เทคนิคที่ใช้จาก Course (Week 12 - Lab 3-4):
// - bcrypt.GenerateFromPassword() สำหรับ hash password
// - bcrypt.CompareHashAndPassword() สำหรับ verify password
// - jwt.NewWithClaims() สำหรับสร้าง JWT token
// - jwt.Parse() สำหรับ verify JWT token
// - Gin middleware สำหรับ protected routes
//
// ส่วนเสริม (ไม่ได้เรียนใน Course):
// - Refresh Token mechanism
type AuthHandler struct {
	userRepo *repository.UserRepository
}

// NewAuthHandler สร้าง AuthHandler ใหม่
func NewAuthHandler(userRepo *repository.UserRepository) *AuthHandler {
	return &AuthHandler{userRepo: userRepo}
}

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
		Name:     req.Name,
		Phone:    req.Phone,
		Role:     "user", // default role
	}

	if err := h.userRepo.Create(user); err != nil {
		c.Error(err) // Log error for debugging
		utils.ErrorResponse(c, 500, "Failed to create user")
		return
	}

	// 5. Generate JWT tokens
	accessToken, err := utils.GenerateAccessToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate access token")
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.ID, user.Email, user.Role)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to generate refresh token")
		return
	}

	// 6. Return success with tokens
	user.Password = ""
	response := model.LoginResponse{
		User:         *user,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}
	utils.SuccessResponse(c, 201, "User registered successfully", response)
}

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
