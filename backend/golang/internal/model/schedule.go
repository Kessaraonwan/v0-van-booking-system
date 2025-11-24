package model

import "time"

// Schedule represents a scheduled trip (ตาม database schema ที่แท้จริง)
type Schedule struct {
	ID             int       `json:"id"`
	RouteID        int       `json:"route_id"`
	VanID          int       `json:"van_id"`
	DepartureTime  time.Time `json:"departure_time"` // TIMESTAMP in database
	ArrivalTime    time.Time `json:"arrival_time"`   // TIMESTAMP in database
	Price          float64   `json:"price"`
	AvailableSeats int       `json:"available_seats"`
	Status         string    `json:"status"` // "active", "cancelled", "completed"
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

// ScheduleWithDetails schedule พร้อมข้อมูล route และ van (สำหรับ JOIN queries)
type ScheduleWithDetails struct {
	ID             int       `json:"id"`
	RouteID        int       `json:"route_id"`
	VanID          int       `json:"van_id"`
	DepartureTime  time.Time `json:"departure_time"`
	ArrivalTime    time.Time `json:"arrival_time"`
	Price          float64   `json:"price"`
	AvailableSeats int       `json:"available_seats"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	
	// Joined fields from routes table
	Origin          string  `json:"origin"`
	Destination     string  `json:"destination"`
	DurationMinutes int     `json:"duration_minutes"`
	DistanceKM      float64 `json:"distance_km"`
	
	// Joined fields from vans table
	VanNumber    string `json:"van_number"`
	LicensePlate string `json:"license_plate"`
	Driver       string `json:"driver"`
	TotalSeats   int    `json:"total_seats"`
}

// CreateScheduleRequest สำหรับสร้างตารางเวลา
type CreateScheduleRequest struct {
	RouteID        int    `json:"route_id" binding:"required"`
	VanID          int    `json:"van_id" binding:"required"`
	DepartureTime  string `json:"departure_time" binding:"required"` // ISO 8601 format
	ArrivalTime    string `json:"arrival_time" binding:"required"`   // ISO 8601 format
	Price          float64 `json:"price" binding:"required"`
	AvailableSeats int    `json:"available_seats" binding:"required"`
	Status         string `json:"status" binding:"required,oneof=active cancelled completed"`
}

// UpdateScheduleRequest สำหรับแก้ไขตารางเวลา
type UpdateScheduleRequest struct {
	RouteID        int     `json:"route_id"`
	VanID          int     `json:"van_id"`
	DepartureTime  string  `json:"departure_time"`
	ArrivalTime    string  `json:"arrival_time"`
	Price          float64 `json:"price"`
	AvailableSeats int     `json:"available_seats"`
	Status         string  `json:"status" binding:"omitempty,oneof=active cancelled completed"`
}
