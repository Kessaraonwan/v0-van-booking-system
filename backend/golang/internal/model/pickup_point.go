package model

import "time"

// PickupPoint represents a pickup location for a route
type PickupPoint struct {
	ID            int       `json:"id"`
	RouteID       int       `json:"route_id"`
	Name          string    `json:"name"`
	Address       string    `json:"address"`
	Landmark      *string   `json:"landmark"`       // nullable
	GoogleMapsURL *string   `json:"google_maps_url"` // nullable
	PickupTime    *string   `json:"pickup_time"`    // nullable TIME format (HH:MM:SS)
	ContactPhone  *string   `json:"contact_phone"`  // nullable
	IsActive      bool      `json:"is_active"`
	DisplayOrder  int       `json:"display_order"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CreatePickupPointRequest สำหรับสร้างจุดขึ้นรถ (Admin)
type CreatePickupPointRequest struct {
	RouteID       int    `json:"route_id" binding:"required"`
	Name          string `json:"name" binding:"required"`
	Address       string `json:"address" binding:"required"`
	Landmark      string `json:"landmark"`
	GoogleMapsURL string `json:"google_maps_url"`
	PickupTime    string `json:"pickup_time" binding:"required"` // HH:MM:SS
	ContactPhone  string `json:"contact_phone"`
	DisplayOrder  int    `json:"display_order"`
}

// UpdatePickupPointRequest สำหรับแก้ไขจุดขึ้นรถ (Admin)
type UpdatePickupPointRequest struct {
	Name          string `json:"name"`
	Address       string `json:"address"`
	Landmark      string `json:"landmark"`
	GoogleMapsURL string `json:"google_maps_url"`
	PickupTime    string `json:"pickup_time"`
	ContactPhone  string `json:"contact_phone"`
	IsActive      *bool  `json:"is_active"` // pointer เพื่อรองรับ true/false
	DisplayOrder  int    `json:"display_order"`
}
