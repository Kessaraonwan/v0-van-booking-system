package handler

import (
	"strconv"
	"time"

	"vanbooking/internal/model"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// BookingHandler จัดการ bookings endpoints
type BookingHandler struct {
	bookingRepo  *repository.BookingRepository
	scheduleRepo *repository.ScheduleRepository
}

// NewBookingHandler สร้าง BookingHandler ใหม่
func NewBookingHandler(bookingRepo *repository.BookingRepository, scheduleRepo *repository.ScheduleRepository) *BookingHandler {
	return &BookingHandler{
		bookingRepo:  bookingRepo,
		scheduleRepo: scheduleRepo,
	}
}

// GetUserBookings ดูการจองของตัวเอง
// GET /api/bookings
func (h *BookingHandler) GetUserBookings(c *gin.Context) {
	// ดึง user_id จาก context (ตั้งไว้ใน auth middleware)
	userID, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, 401, "Unauthorized")
		return
	}

	bookings, err := h.bookingRepo.GetByUserID(userID.(int))
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch bookings")
		return
	}

	utils.SuccessResponse(c, 200, "Bookings fetched successfully", bookings)
}

// GetBookingByID ดูการจองตาม ID
// GET /api/bookings/:id
func (h *BookingHandler) GetBookingByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid booking ID")
		return
	}

	booking, err := h.bookingRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Booking not found")
		return
	}

	// เช็คว่า booking นี้เป็นของ user นี้หรือไม่
	userID, _ := c.Get("user_id")
	if booking.UserID != userID.(int) {
		utils.ErrorResponse(c, 403, "Access denied")
		return
	}

	utils.SuccessResponse(c, 200, "Booking fetched successfully", booking)
}

// CreateBooking สร้างการจอง (CRITICAL - uses Transaction)
// POST /api/bookings
func (h *BookingHandler) CreateBooking(c *gin.Context) {
	var req model.CreateBookingRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	// ดึง user_id จาก context
	userID, exists := c.Get("user_id")
	if !exists {
		utils.ErrorResponse(c, 401, "Unauthorized")
		return
	}

	booking := &model.Booking{
		UserID:         userID.(int),
		ScheduleID:     req.ScheduleID,
		SeatNumber:     req.SeatNumber,
		PassengerName:  req.PassengerName,
		PassengerPhone: req.PassengerPhone,
		PassengerEmail: req.PassengerEmail,
		PickupPointID:  req.PickupPointID,
		DropoffPointID: req.DropoffPointID,
		SpecialRequests: req.SpecialRequests,
		BookingStatus:  "pending",
		TotalPrice:     req.TotalPrice,
	}

	// Validate schedule exists and is in the future (prevent booking past schedules)
	schedule, err := h.scheduleRepo.GetByID(req.ScheduleID)
	if err != nil {
		utils.ErrorResponse(c, 404, "Schedule not found")
		return
	}

	// Compare schedule departure time with current time
	if !schedule.DepartureTime.After(time.Now()) {
		utils.ErrorResponse(c, 400, "Cannot create booking for past or current departures")
		return
	}

	// Create booking with transaction (จะ check seat + create booking + update seat + update schedule)
	if err := h.bookingRepo.Create(booking); err != nil {
		// Error อาจเป็น "seat already booked" หรือ error อื่นๆ
		utils.ErrorResponse(c, 400, err.Error())
		return
	}

	utils.SuccessResponse(c, 201, "Booking created successfully", booking)
}

// CancelBooking ยกเลิกการจอง (CRITICAL - uses Transaction)
// PUT /api/bookings/:id/cancel
func (h *BookingHandler) CancelBooking(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid booking ID")
		return
	}

	// ดึงข้อมูล booking เพื่อเช็ค ownership
	booking, err := h.bookingRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Booking not found")
		return
	}

	// เช็คว่า booking นี้เป็นของ user นี้หรือไม่
	userID, _ := c.Get("user_id")
	if booking.UserID != userID.(int) {
		utils.ErrorResponse(c, 403, "Access denied")
		return
	}

	// Cancel booking with transaction
	if err := h.bookingRepo.Cancel(id); err != nil {
		utils.ErrorResponse(c, 400, err.Error())
		return
	}

	utils.SuccessResponse(c, 200, "Booking cancelled successfully", nil)
}

// GetAllBookings ดูการจองทั้งหมด (Admin only)
// GET /api/admin/bookings
func (h *BookingHandler) GetAllBookings(c *gin.Context) {
	bookings, err := h.bookingRepo.GetAll()
	if err != nil {
		// Return underlying error message in dev to aid debugging
		utils.ErrorResponse(c, 500, err.Error())
		return
	}

	utils.SuccessResponse(c, 200, "Bookings fetched successfully", bookings)
}

// AdminUpdateBookingStatus สำหรับให้แอดมินเปลี่ยนสถานะการจอง
// PUT /api/admin/bookings/:id/status
func (h *BookingHandler) AdminUpdateBookingStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid booking ID")
		return
	}

	var body struct{
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request body")
		return
	}

	if body.Status == "" {
		utils.ErrorResponse(c, 400, "Status is required")
		return
	}

	// Use repository UpdateStatus (Cancel will be handled transactionally)
	if err := h.bookingRepo.UpdateStatus(id, body.Status); err != nil {
		utils.ErrorResponse(c, 400, err.Error())
		return
	}

	utils.SuccessResponse(c, 200, "Booking status updated successfully", nil)
}

// AdminGetBookingByID ดูการจองตาม ID สำหรับแอดมิน (ไม่ตรวจ ownership)
// GET /api/admin/bookings/:id
func (h *BookingHandler) AdminGetBookingByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid booking ID")
		return
	}

	booking, err := h.bookingRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Booking not found")
		return
	}

	utils.SuccessResponse(c, 200, "Booking fetched successfully", booking)
}

// CreatePayment สร้างการชำระเงิน (Mock Payment)
// POST /api/payments
func (h *BookingHandler) CreatePayment(c *gin.Context) {
	var req model.CreatePaymentRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	// เช็คว่า booking มีอยู่จริง
	booking, err := h.bookingRepo.GetByID(req.BookingID)
	if err != nil {
		utils.ErrorResponse(c, 404, "Booking not found")
		return
	}

	// เช็ค ownership
	userID, _ := c.Get("user_id")
	if booking.UserID != userID.(int) {
		utils.ErrorResponse(c, 403, "Access denied")
		return
	}

	payment := &model.Payment{
		BookingID:     req.BookingID,
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "completed", // Mock payment - ตั้งเป็น completed เลย
		Amount:        req.Amount,
	}

	if err := h.bookingRepo.CreatePayment(payment); err != nil {
		utils.ErrorResponse(c, 500, "Failed to create payment")
		return
	}

	utils.SuccessResponse(c, 201, "Payment created successfully", payment)
}

// GetPaymentByBookingID ดูข้อมูลการชำระเงิน
// GET /api/payments/:bookingId
func (h *BookingHandler) GetPaymentByBookingID(c *gin.Context) {
	bookingID, err := strconv.Atoi(c.Param("bookingId"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid booking ID")
		return
	}

	payment, err := h.bookingRepo.GetPaymentByBookingID(bookingID)
	if err != nil {
		utils.ErrorResponse(c, 404, "Payment not found")
		return
	}

	utils.SuccessResponse(c, 200, "Payment fetched successfully", payment)
}
