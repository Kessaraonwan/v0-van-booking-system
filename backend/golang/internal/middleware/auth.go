package middleware

import (
	"strings"
	"vanbooking/internal/utils"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware middleware สำหรับตรวจสอบ JWT token
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// ดึง token จาก header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			utils.ErrorResponse(c, 401, "Authorization header required")
			c.Abort()
			return
		}

		// ตรวจสอบ format: Bearer <token>
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			utils.ErrorResponse(c, 401, "Invalid authorization header format")
			c.Abort()
			return
		}

		token := parts[1]

		// Validate token
		claims, err := utils.ValidateToken(token)
		if err != nil {
			utils.ErrorResponse(c, 401, "Invalid or expired token")
			c.Abort()
			return
		}

		// เก็บข้อมูล user ใน context
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("role", claims.Role)

		c.Next()
	}
}

// AdminMiddleware middleware สำหรับตรวจสอบว่าเป็น admin
func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get("role")
		if !exists {
			utils.ErrorResponse(c, 403, "Admin access required")
			c.Abort()
			return
		}

		// ensure role is a string and compare case-insensitively
		roleStr, ok := roleVal.(string)
		if !ok || strings.ToLower(roleStr) != "admin" {
			utils.ErrorResponse(c, 403, "Admin access required")
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireRole returns a middleware that allows access only when the user's role
// (from context set by AuthMiddleware) matches one of the allowed roles.
func RequireRole(allowed ...string) gin.HandlerFunc {
	// normalize allowed roles to lowercase for comparison
	norm := make(map[string]struct{}, len(allowed))
	for _, r := range allowed {
		norm[strings.ToLower(r)] = struct{}{}
	}

	return func(c *gin.Context) {
		roleVal, exists := c.Get("role")
		if !exists {
			utils.ErrorResponse(c, 403, "Role required")
			c.Abort()
			return
		}

		roleStr, ok := roleVal.(string)
		if !ok {
			utils.ErrorResponse(c, 403, "Invalid role")
			c.Abort()
			return
		}

		if _, ok := norm[strings.ToLower(roleStr)]; !ok {
			utils.ErrorResponse(c, 403, "Insufficient role privileges")
			c.Abort()
			return
		}

		c.Next()
	}
}
