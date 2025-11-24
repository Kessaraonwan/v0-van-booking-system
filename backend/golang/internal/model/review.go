package model

import "time"

// Review represents a review for a route
type Review struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	RouteID   int       `json:"route_id"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	UserName  string    `json:"user_name"`
	RouteName string    `json:"route_name"`
	CreatedAt time.Time `json:"created_at"`
}
