package model

import "time"

// DropoffPoint represents a dropoff location for a route
type DropoffPoint struct {
	ID               int       `json:"id"`
	RouteID          int       `json:"route_id"`
	Name             string    `json:"name"`
	Address          string    `json:"address"`
	Landmark         *string   `json:"landmark"`          // nullable
	GoogleMapsURL    *string   `json:"google_maps_url"`   // nullable
	EstimatedArrival *string   `json:"estimated_arrival"` // nullable TIME format (HH:MM:SS)
	ContactPhone     *string   `json:"contact_phone"`     // nullable
	IsActive         bool      `json:"is_active"`
	DisplayOrder     int       `json:"display_order"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

// CreateDropoffPointRequest สำหรับสร้างจุดลงรถ (Admin)
type CreateDropoffPointRequest struct {
	RouteID          int    `json:"route_id" binding:"required"`
	Name             string `json:"name" binding:"required"`
	Address          string `json:"address" binding:"required"`
	Landmark         string `json:"landmark"`
	GoogleMapsURL    string `json:"google_maps_url"`
	EstimatedArrival string `json:"estimated_arrival" binding:"required"` // HH:MM:SS
	ContactPhone     string `json:"contact_phone"`
	DisplayOrder     int    `json:"display_order"`
}

// UpdateDropoffPointRequest สำหรับแก้ไขจุดลงรถ (Admin)
type UpdateDropoffPointRequest struct {
	Name             string `json:"name"`
	Address          string `json:"address"`
	Landmark         string `json:"landmark"`
	GoogleMapsURL    string `json:"google_maps_url"`
	EstimatedArrival string `json:"estimated_arrival"`
	ContactPhone     string `json:"contact_phone"`
	IsActive         *bool  `json:"is_active"` // pointer เพื่อรองรับ true/false
	DisplayOrder     int    `json:"display_order"`
}
