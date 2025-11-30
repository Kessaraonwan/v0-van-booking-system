package model

// DashboardStats สำหรับ admin dashboard
type DashboardStats struct {
	TotalBookings  int                   `json:"total_bookings"`
	BookingsToday  int                   `json:"bookings_today"`
	PendingToday   int                   `json:"pending_today"`
	PassengersToday int                  `json:"passengers_today"`
	TripsToday     int                   `json:"trips_today"`
	TotalUsers     int                   `json:"total_users"`
	TotalRoutes    int                   `json:"total_routes"`
	TotalRevenue   float64               `json:"total_revenue"`
	RecentBookings []BookingWithDetails  `json:"recent_bookings"`
}
