package model

// Seat represents a seat in a schedule
type Seat struct {
	ID         int    `json:"id"`
	ScheduleID int    `json:"schedule_id"`
	SeatNumber int    `json:"seat_number"`
	Status     string `json:"status"` // "available", "booked", "reserved"
	BookingID  *int   `json:"booking_id,omitempty"`
}

// SeatWithBooking seat พร้อมข้อมูล booking (สำหรับ seat selection page)
type SeatWithBooking struct {
	ID            int    `json:"id"`
	ScheduleID    int    `json:"schedule_id"`
	SeatNumber    int    `json:"seat_number"`
	Status        string `json:"status"`
	BookingID     *int64 `json:"booking_id,omitempty"`
	PassengerName string `json:"passenger_name,omitempty"` // จาก booking JOIN
}
