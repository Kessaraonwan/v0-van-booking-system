package handler

import (
	"strconv"
	"vanbooking/internal/model"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// RouteHandler จัดการ routes endpoints
type RouteHandler struct {
	routeRepo        *repository.RouteRepository
	pickupPointRepo  *repository.PickupPointRepository
	dropoffPointRepo *repository.DropoffPointRepository
}

// NewRouteHandler สร้าง RouteHandler ใหม่
func NewRouteHandler(routeRepo *repository.RouteRepository, pickupPointRepo *repository.PickupPointRepository, dropoffPointRepo *repository.DropoffPointRepository) *RouteHandler {
	return &RouteHandler{
		routeRepo:        routeRepo,
		pickupPointRepo:  pickupPointRepo,
		dropoffPointRepo: dropoffPointRepo,
	}
}

// GetAllRoutes ดึงเส้นทางทั้งหมด
// GET /api/routes
func (h *RouteHandler) GetAllRoutes(c *gin.Context) {
	routes, err := h.routeRepo.GetAll()
	if err != nil {
		c.Error(err)
		utils.ErrorResponse(c, 500, "Failed to fetch routes")
		return
	}

	utils.SuccessResponse(c, 200, "Routes fetched successfully", routes)
}

// GetRouteByID ดึงเส้นทางตาม ID
// GET /api/routes/:id
func (h *RouteHandler) GetRouteByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid route ID")
		return
	}

	route, err := h.routeRepo.GetByID(id)
	if err != nil {
		utils.ErrorResponse(c, 404, "Route not found")
		return
	}

	utils.SuccessResponse(c, 200, "Route fetched successfully", route)
}

// CreateRoute สร้างเส้นทางใหม่ (Admin only)
// POST /api/admin/routes
func (h *RouteHandler) CreateRoute(c *gin.Context) {
	var req model.CreateRouteRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	route := &model.Route{
		Origin:          req.Origin,
		Destination:     req.Destination,
		BasePrice:       req.BasePrice,
		DurationMinutes: req.DurationMinutes,
		DistanceKM:      req.DistanceKM,
		ImageURL:        req.ImageURL,
	}

	if err := h.routeRepo.Create(route); err != nil {
		utils.ErrorResponse(c, 500, "Failed to create route")
		return
	}

	utils.SuccessResponse(c, 201, "Route created successfully", route)
}

// UpdateRoute แก้ไขเส้นทาง (Admin only)
// PUT /api/admin/routes/:id
func (h *RouteHandler) UpdateRoute(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid route ID")
		return
	}

	var req model.UpdateRouteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, 400, "Invalid request data")
		return
	}

	route := &model.Route{
		ID:              id,
		Origin:          req.Origin,
		Destination:     req.Destination,
		BasePrice:       req.BasePrice,
		DurationMinutes: req.DurationMinutes,
		DistanceKM:      req.DistanceKM,
		ImageURL:        req.ImageURL,
	}

	if err := h.routeRepo.Update(route); err != nil {
		utils.ErrorResponse(c, 500, "Failed to update route")
		return
	}
	utils.SuccessResponse(c, 200, "Route updated successfully", route)
}

// DeleteRoute ลบเส้นทาง (Admin only)
// DELETE /api/admin/routes/:id
func (h *RouteHandler) DeleteRoute(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid route ID")
		return
	}

	if err := h.routeRepo.Delete(id); err != nil {
		utils.ErrorResponse(c, 404, "Route not found")
		return
	}

	utils.SuccessResponse(c, 200, "Route deleted successfully", nil)
}

// GetPickupPoints ดึงจุดขึ้นรถทั้งหมดของเส้นทาง
// GET /api/routes/:id/pickup-points
func (h *RouteHandler) GetPickupPoints(c *gin.Context) {
	routeID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid route ID")
		return
	}

	pickupPoints, err := h.pickupPointRepo.GetByRouteID(routeID)
	if err != nil {
		c.Error(err)  // Log the error
		utils.ErrorResponse(c, 500, "Failed to fetch pickup points")
		return
	}

	utils.SuccessResponse(c, 200, "Pickup points fetched successfully", pickupPoints)
}

// GetDropoffPoints ดึงจุดลงรถทั้งหมดของเส้นทาง
// GET /api/routes/:id/dropoff-points
func (h *RouteHandler) GetDropoffPoints(c *gin.Context) {
	routeID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, 400, "Invalid route ID")
		return
	}

	dropoffPoints, err := h.dropoffPointRepo.GetByRouteID(routeID)
	if err != nil {
		c.Error(err)  // Log the error
		utils.ErrorResponse(c, 500, "Failed to fetch dropoff points")
		return
	}

	utils.SuccessResponse(c, 200, "Dropoff points fetched successfully", dropoffPoints)
}
