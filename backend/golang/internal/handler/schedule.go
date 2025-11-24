package handler

import (
	"strconv"
	"time"
	"vanbooking/internal/model"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// ScheduleHandler จัดการ schedules endpoints
//
// เทียบกับ Course: ScheduleHandler ≈ BookHandler ใน Bookstore API
//
// เทคนิคที่ใช้จาก Course:
// - Week 7: RESTful API design (GET, POST, PUT, DELETE)
// - Week 9: Repository Pattern (แยก DB logic ออกจาก handler)
// - Week 10: Request Validation (validate ทุก request body)
// - Week 11: Query Parameters (c.Query() สำหรับ filter/search)
//
// การประยุกต์:
// - Books CRUD → Schedules CRUD (ใช้รูปแบบเดียวกัน)
// - Search by title → Search by origin/destination/date
type ScheduleHandler struct {
	scheduleRepo *repository.ScheduleRepository
}

// NewScheduleHandler สร้าง ScheduleHandler ใหม่
func NewScheduleHandler(scheduleRepo *repository.ScheduleRepository) *ScheduleHandler {
	return &ScheduleHandler{scheduleRepo: scheduleRepo}
}

// GetAllSchedules ดึงตารางรถทั้งหมด
// GET /api/schedules
func (h *ScheduleHandler) GetAllSchedules(c *gin.Context) {
	schedules, err := h.scheduleRepo.GetAll()
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch schedules")
		return
	}

	utils.SuccessResponse(c, 200, "Schedules fetched successfully", schedules)
}

// SearchSchedules ค้นหาตารางรถ (สำคัญสุดสำหรับ search.jsx)
// GET /api/schedules/search?from=X&to=Y&date=Z
func (h *ScheduleHandler) SearchSchedules(c *gin.Context) {
	origin := c.Query("from")
	destination := c.Query("to")
	date := c.Query("date")

	if origin == "" || destination == "" || date == "" {
		utils.ErrorResponse(c, 400, "from, to, and date are required")
		return
	}

	schedules, err := h.scheduleRepo.Search(origin, destination, date)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to search schedules")
		return
	}

	utils.SuccessResponse(c, 200, "Schedules found successfully", schedules)
}

// GetScheduleByID ดึงตารางรถตาม ID
// GET /api/schedules/:id
func (h *ScheduleHandler) GetScheduleByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid schedule ID")
		return
	}

	schedule, err := h.scheduleRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Schedule not found")
		return
	}

	utils.SuccessResponse(c, 200, "Schedule fetched successfully", schedule)
}

// GetScheduleSeats ดึงที่นั่งของรอบรถ (สำคัญสำหรับ seats/[id].jsx)
// GET /api/schedules/:id/seats
func (h *ScheduleHandler) GetScheduleSeats(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid schedule ID")
		return
	}

	seats, err := h.scheduleRepo.GetSeats(id)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch seats")
		return
	}

	utils.SuccessResponse(c, 200, "Seats fetched successfully", seats)
}

// CreateSchedule สร้างตารางรถใหม่ (Admin only)
// POST /api/admin/schedules
func (h *ScheduleHandler) CreateSchedule(c *gin.Context) {
	var req model.CreateScheduleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	// Parse time strings to time.Time
	departureTime, err := time.Parse(time.RFC3339, req.DepartureTime)
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid departure_time format (use ISO 8601)")
		return
	}

	arrivalTime, err := time.Parse(time.RFC3339, req.ArrivalTime)
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid arrival_time format (use ISO 8601)")
		return
	}

	schedule := &model.Schedule{
		RouteID:        req.RouteID,
		VanID:          req.VanID,
		DepartureTime:  departureTime,
		ArrivalTime:    arrivalTime,
		Price:          req.Price,
		AvailableSeats: req.AvailableSeats,
		Status:         req.Status,
	}

	if err := h.scheduleRepo.Create(schedule); err != nil {
		utils.ErrorResponse(c, 500, "Failed to create schedule")
		return
	}

	utils.SuccessResponse(c, 201, "Schedule created successfully", schedule)
}

// UpdateSchedule แก้ไขตารางรถ (Admin only)
// PUT /api/admin/schedules/:id
func (h *ScheduleHandler) UpdateSchedule(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid schedule ID")
		return
	}

	var req model.UpdateScheduleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	// Parse time strings to time.Time
	departureTime, err := time.Parse(time.RFC3339, req.DepartureTime)
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid departure_time format (use ISO 8601)")
		return
	}

	arrivalTime, err := time.Parse(time.RFC3339, req.ArrivalTime)
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid arrival_time format (use ISO 8601)")
		return
	}

	schedule := &model.Schedule{
		RouteID:        req.RouteID,
		VanID:          req.VanID,
		DepartureTime:  departureTime,
		ArrivalTime:    arrivalTime,
		Price:          req.Price,
		AvailableSeats: req.AvailableSeats,
		Status:         req.Status,
	}

	if err := h.scheduleRepo.Update(id, schedule); err != nil {
		utils.ErrorResponse(c, 500, "Failed to update schedule")
		return
	}

	schedule.ID = id
	utils.SuccessResponse(c, 200, "Schedule updated successfully", schedule)
}

// DeleteSchedule ลบตารางรถ (Admin only)
// DELETE /api/admin/schedules/:id
func (h *ScheduleHandler) DeleteSchedule(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid schedule ID")
		return
	}

	if err := h.scheduleRepo.Delete(id); err != nil {
		utils.ErrorResponse(c, 404, "Schedule not found")
		return
	}

	utils.SuccessResponse(c, 200, "Schedule deleted successfully", nil)
}
