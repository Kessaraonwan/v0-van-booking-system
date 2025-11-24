package model

import "time"

// Booking represents a booking (ตาม database schema ที่แท้จริง)
type Booking struct {
	ID              int       `json:"id"`
	UserID          int       `json:"user_id"`
	ScheduleID      int       `json:"schedule_id"`
	SeatNumber      int       `json:"seat_number"`       // เก็บที่นั่งเดี่ยว (1 booking = 1 seat)
	PassengerName   string    `json:"passenger_name"`
	PassengerPhone  string    `json:"passenger_phone"`
	PassengerEmail  string    `json:"passenger_email"`
	PickupPointID   int       `json:"pickup_point_id"`
	DropoffPointID  int       `json:"dropoff_point_id"`
	BookingNumber   string    `json:"booking_number"`   // เลขที่การจอง (BK001, BK002)
	SpecialRequests string    `json:"special_requests"` // คำขอพิเศษ
	BookingStatus   string    `json:"booking_status"`   // "pending", "confirmed", "cancelled"
	TotalPrice      float64   `json:"total_price"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// BookingWithDetails booking พร้อมข้อมูล schedule, route, van, pickup/dropoff points
type BookingWithDetails struct {
	ID              int       `json:"id"`
	UserID          int       `json:"user_id"`
	ScheduleID      int       `json:"schedule_id"`
	SeatNumber      int       `json:"seat_number"`
	PassengerName   string    `json:"passenger_name"`
	PassengerPhone  string    `json:"passenger_phone"`
	PassengerEmail  string    `json:"passenger_email"`
	PickupPointID   int       `json:"pickup_point_id"`
	DropoffPointID  int       `json:"dropoff_point_id"`
	BookingNumber   string    `json:"booking_number"`
	SpecialRequests string    `json:"special_requests"`
	BookingStatus   string    `json:"booking_status"`
	TotalPrice      float64   `json:"total_price"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	
	// Joined fields from schedule, route, van
	DepartureTime string  `json:"departure_time"`
	ArrivalTime   string  `json:"arrival_time"`
	Origin        string  `json:"origin"`
	Destination   string  `json:"destination"`
	VanNumber     string  `json:"van_number"`
	LicensePlate  string  `json:"license_plate"`
	
	// Joined fields from pickup/dropoff points
	PickupPointName     string `json:"pickup_point_name"`
	PickupPointAddress  string `json:"pickup_point_address"`
	PickupTime          string `json:"pickup_time"`
	DropoffPointName    string `json:"dropoff_point_name"`
	DropoffPointAddress string `json:"dropoff_point_address"`
	EstimatedArrival    string `json:"estimated_arrival"`
}

// CreateBookingRequest สำหรับสร้างการจอง
type CreateBookingRequest struct {
	ScheduleID      int     `json:"schedule_id" binding:"required"`
	SeatNumber      int     `json:"seat_number" binding:"required"`
	PassengerName   string  `json:"passenger_name" binding:"required"`
	PassengerPhone  string  `json:"passenger_phone" binding:"required"`
	PassengerEmail  string  `json:"passenger_email" binding:"required,email"`
	PickupPointID   int     `json:"pickup_point_id" binding:"required"`
	DropoffPointID  int     `json:"dropoff_point_id" binding:"required"`
	SpecialRequests string  `json:"special_requests"` // optional
	TotalPrice      float64 `json:"total_price" binding:"required"`
}

// Payment represents a payment record
type Payment struct {
	ID            int       `json:"id"`
	BookingID     int       `json:"booking_id"`
	PaymentMethod string    `json:"payment_method"` // "cash", "credit_card", "promptpay"
	PaymentStatus string    `json:"payment_status"` // "pending", "completed", "refunded"
	Amount        float64   `json:"amount"`
	PaymentDate   time.Time `json:"payment_date"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// CreatePaymentRequest สำหรับสร้างการชำระเงิน (Mock)
type CreatePaymentRequest struct {
	BookingID     int     `json:"booking_id" binding:"required"`
	PaymentMethod string  `json:"payment_method" binding:"required,oneof=cash credit_card promptpay"`
	Amount        float64 `json:"amount" binding:"required"`
}
