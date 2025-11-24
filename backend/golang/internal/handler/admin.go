package handler

import (
	"database/sql"
	"vanbooking/internal/model"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// AdminHandler จัดการ admin endpoints
type AdminHandler struct {
	db *sql.DB
}

// NewAdminHandler สร้าง AdminHandler ใหม่
func NewAdminHandler(db *sql.DB) *AdminHandler {
	return &AdminHandler{db: db}
}

// GetDashboardStats ดึงสถิติสำหรับ dashboard
// GET /api/admin/dashboard
func (h *AdminHandler) GetDashboardStats(c *gin.Context) {
	stats := model.DashboardStats{}

	// 1. Count total bookings
	err := h.db.QueryRow("SELECT COUNT(*) FROM bookings").Scan(&stats.TotalBookings)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to count bookings")
		return
	}

	// 2. Count total users
	err = h.db.QueryRow("SELECT COUNT(*) FROM users WHERE role = 'user'").Scan(&stats.TotalUsers)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to count users")
		return
	}

	// 3. Count total routes
	err = h.db.QueryRow("SELECT COUNT(*) FROM routes").Scan(&stats.TotalRoutes)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to count routes")
		return
	}

	// 4. Calculate total revenue (SUM ของ total_price จาก bookings ที่ไม่ใช่ cancelled)
	err = h.db.QueryRow(`
		SELECT COALESCE(SUM(total_price), 0) 
		FROM bookings 
		WHERE booking_status != 'cancelled'
	`).Scan(&stats.TotalRevenue)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to calculate revenue")
		return
	}

	// 5. Get recent bookings (10 รายการล่าสุด)
	rows, err := h.db.Query(`
		SELECT 
			b.id, b.user_id, b.schedule_id, b.seat_number, b.passenger_name,
			b.passenger_phone, b.booking_status, b.total_price, b.created_at, b.updated_at,
			s.departure_time, s.arrival_time,
			rt.origin, rt.destination,
			v.van_number, v.license_plate
		FROM bookings b
		JOIN schedules s ON b.schedule_id = s.id
		JOIN routes rt ON s.route_id = rt.id
		JOIN vans v ON s.van_id = v.id
		ORDER BY b.created_at DESC
		LIMIT 10
	`)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch recent bookings")
		return
	}
	defer rows.Close()

	var recentBookings []model.BookingWithDetails
	for rows.Next() {
		var b model.BookingWithDetails
		err := rows.Scan(
			&b.ID, &b.UserID, &b.ScheduleID, &b.SeatNumber, &b.PassengerName,
			&b.PassengerPhone, &b.BookingStatus, &b.TotalPrice, &b.CreatedAt, &b.UpdatedAt,
			&b.DepartureTime, &b.ArrivalTime,
			&b.Origin, &b.Destination,
			&b.VanNumber, &b.LicensePlate,
		)
		if err != nil {
			utils.ErrorResponse(c, 500, "Failed to parse bookings")
			return
		}
		recentBookings = append(recentBookings, b)
	}

	stats.RecentBookings = recentBookings

	utils.SuccessResponse(c, 200, "Dashboard stats fetched successfully", stats)
}
