package model

import "time"

// Route represents a route between two locations
type Route struct {
ID              int       `json:"id"`
Origin          string    `json:"origin"`
Destination     string    `json:"destination"`
BasePrice       float64   `json:"base_price"`
DurationMinutes int       `json:"duration_minutes"`
DistanceKM      float64   `json:"distance_km"`
ImageURL        string    `json:"image_url"`
CreatedAt       time.Time `json:"created_at"`
UpdatedAt       time.Time `json:"updated_at"`
}

// CreateRouteRequest สำหรับสร้างเส้นทางใหม่
type CreateRouteRequest struct {
Origin          string  `json:"origin" binding:"required"`
Destination     string  `json:"destination" binding:"required"`
BasePrice       float64 `json:"base_price" binding:"required,gt=0"`
DurationMinutes int     `json:"duration_minutes" binding:"required,gt=0"`
DistanceKM      float64   `json:"distance_km" binding:"required,gt=0"`
ImageURL        string    `json:"image_url"`
}

// UpdateRouteRequest สำหรับแก้ไขเส้นทาง
type UpdateRouteRequest struct {
Origin          string  `json:"origin"`
Destination     string  `json:"destination"`
BasePrice       float64 `json:"base_price" binding:"gt=0"`
DurationMinutes int     `json:"duration_minutes" binding:"gt=0"`
DistanceKM      float64 `json:"distance_km" binding:"gt=0"`
ImageURL        string    `json:"image_url"`
}
