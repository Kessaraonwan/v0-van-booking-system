package handler

import (
	"strconv"
	"vanbooking/internal/repository"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// ReviewHandler จัดการ reviews endpoints
type ReviewHandler struct {
	reviewRepo *repository.ReviewRepository
}

// NewReviewHandler สร้าง ReviewHandler ใหม่
func NewReviewHandler(reviewRepo *repository.ReviewRepository) *ReviewHandler {
	return &ReviewHandler{reviewRepo: reviewRepo}
}

// GetAllReviews ดึงรีวิวทั้งหมด
// GET /api/reviews
func (h *ReviewHandler) GetAllReviews(c *gin.Context) {
	limit := 0
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			limit = l
		}
	}

	reviews, err := h.reviewRepo.GetAll(limit)
	if err != nil {
		utils.ErrorResponse(c, 500, "Failed to fetch reviews")
		return
	}

	utils.SuccessResponse(c, 200, "Reviews fetched successfully", reviews)
}
