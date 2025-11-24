package model

import "time"

// Van represents a van/vehicle
type Van struct {
	ID           int       `json:"id"`
	VanNumber    string    `json:"van_number"`
	LicensePlate string    `json:"license_plate"`
	Driver       string    `json:"driver"`
	TotalSeats   int       `json:"total_seats"`
	Status       string    `json:"status"` // "active" หรือ "inactive"
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// CreateVanRequest สำหรับสร้างรถใหม่
type CreateVanRequest struct {
	VanNumber    string `json:"van_number" binding:"required"`
	LicensePlate string `json:"license_plate" binding:"required"`
	Driver       string `json:"driver" binding:"required"`
	TotalSeats   int    `json:"total_seats" binding:"required,min=1,max=20"`
	Status       string `json:"status" binding:"required,oneof=active inactive"`
}

// UpdateVanRequest สำหรับแก้ไขข้อมูลรถ
type UpdateVanRequest struct {
	VanNumber    string `json:"van_number"`
	LicensePlate string `json:"license_plate"`
	Driver       string `json:"driver"`
	TotalSeats   int    `json:"total_seats" binding:"min=1,max=20"`
	Status       string `json:"status" binding:"oneof=active inactive"`
}
