package model

// DashboardStats สำหรับ admin dashboard
type DashboardStats struct {
	TotalBookings  int                   `json:"total_bookings"`
	TotalUsers     int                   `json:"total_users"`
	TotalRoutes    int                   `json:"total_routes"`
	TotalRevenue   float64               `json:"total_revenue"`
	RecentBookings []BookingWithDetails  `json:"recent_bookings"`
}
