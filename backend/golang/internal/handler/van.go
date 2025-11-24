package handler

import (
	"strconv"
	"vanbooking/internal/model"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// VanHandler จัดการ vans endpoints
type VanHandler struct {
	vanRepo *repository.VanRepository
}

// NewVanHandler สร้าง VanHandler ใหม่
func NewVanHandler(vanRepo *repository.VanRepository) *VanHandler {
	return &VanHandler{vanRepo: vanRepo}
}

// GetAllVans ดึงรถตู้ทั้งหมด (Admin only)
// GET /api/admin/vans
func (h *VanHandler) GetAllVans(c *gin.Context) {
	vans, err := h.vanRepo.GetAll()
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch vans")
		return
	}

	utils.SuccessResponse(c, 200, "Vans fetched successfully", vans)
}

// GetVanByID ดึงรถตู้ตาม ID (Admin only)
// GET /api/admin/vans/:id
func (h *VanHandler) GetVanByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid van ID")
		return
	}

	van, err := h.vanRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Van not found")
		return
	}

	utils.SuccessResponse(c, 200, "Van fetched successfully", van)
}

// CreateVan สร้างรถตู้ใหม่ (Admin only)
// POST /api/admin/vans
func (h *VanHandler) CreateVan(c *gin.Context) {
	var req model.CreateVanRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	van := &model.Van{
		VanNumber:    req.VanNumber,
		LicensePlate: req.LicensePlate,
		Driver:       req.Driver,
		TotalSeats:   req.TotalSeats,
		Status:       req.Status,
	}

	if err := h.vanRepo.Create(van); err != nil {
		utils.ErrorResponse(c, 500, "Failed to create van")
		return
	}

	utils.SuccessResponse(c, 201, "Van created successfully", van)
}

// UpdateVan แก้ไขข้อมูลรถตู้ (Admin only)
// PUT /api/admin/vans/:id
func (h *VanHandler) UpdateVan(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid van ID")
		return
	}

	var req model.UpdateVanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	van := &model.Van{
		VanNumber:    req.VanNumber,
		LicensePlate: req.LicensePlate,
		Driver:       req.Driver,
		TotalSeats:   req.TotalSeats,
		Status:       req.Status,
	}

	if err := h.vanRepo.Update(id, van); err != nil {
		utils.ErrorResponse(c, 500, "Failed to update van")
		return
	}

	van.ID = id
	utils.SuccessResponse(c, 200, "Van updated successfully", van)
}

// DeleteVan ลบรถตู้ (Admin only)
// DELETE /api/admin/vans/:id
func (h *VanHandler) DeleteVan(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid van ID")
		return
	}

	if err := h.vanRepo.Delete(id); err != nil {
		utils.ErrorResponse(c, 404, "Van not found")
		return
	}

	utils.SuccessResponse(c, 200, "Van deleted successfully", nil)
}
