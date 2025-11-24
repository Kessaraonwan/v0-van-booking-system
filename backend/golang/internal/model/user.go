package model

import "time"

// User represents a user in the system
type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // ไม่ส่งใน JSON response
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"` // "user" หรือ "admin"
	CreatedAt time.Time `json:"created_at"`
}

// RegisterRequest สำหรับการสมัครสมาชิก
type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
	Phone    string `json:"phone" binding:"required"`
}

// LoginRequest สำหรับการ login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse response หลัง login สำเร็จ
type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
	User         User   `json:"user"`
}

// RefreshTokenRequest สำหรับขอ access token ใหม่
type RefreshTokenRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}
