package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"
	"vanbooking/internal/handler"
	"vanbooking/internal/middleware"
	"vanbooking/internal/repository"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	// โหลด environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// เชื่อมต่อ database
	db, err := initDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// ทดสอบการเชื่อมต่อ
	if err := db.Ping(); err != nil {
		log.Fatal("Failed to ping database:", err)
	}
	log.Println("✅ Connected to database successfully")

	// สร้าง repositories
	userRepo := repository.NewUserRepository(db)
	routeRepo := repository.NewRouteRepository(db)
	vanRepo := repository.NewVanRepository(db)
	scheduleRepo := repository.NewScheduleRepository(db)
	bookingRepo := repository.NewBookingRepository(db)
	reviewRepo := repository.NewReviewRepository(db)
	pickupPointRepo := repository.NewPickupPointRepository(db)
	dropoffPointRepo := repository.NewDropoffPointRepository(db)

	// สร้าง handlers
	authHandler := handler.NewAuthHandler(userRepo)
	routeHandler := handler.NewRouteHandler(routeRepo, pickupPointRepo, dropoffPointRepo)
	vanHandler := handler.NewVanHandler(vanRepo)
	scheduleHandler := handler.NewScheduleHandler(scheduleRepo)
	bookingHandler := handler.NewBookingHandler(bookingRepo, scheduleRepo)
	reviewHandler := handler.NewReviewHandler(reviewRepo)
	adminHandler := handler.NewAdminHandler(db)

	// สร้าง Gin router
	router := gin.Default()

	// CORS middleware - allow all origins for local development
	// Note: when AllowOrigins contains "*", AllowCredentials must be false.
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
		MaxAge:           12 * time.Hour,
	}))

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "Van Booking API is running",
		})
	})

	// API routes
	api := router.Group("/api")
	{
		// Authentication routes (ไม่ต้องใช้ token)
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", authHandler.RefreshToken)
		}

		// Public routes (ไม่ต้องใช้ token)
		api.GET("/routes", routeHandler.GetAllRoutes)
		api.GET("/routes/:id", routeHandler.GetRouteByID)
		api.GET("/routes/:id/pickup-points", routeHandler.GetPickupPoints)
		api.GET("/routes/:id/dropoff-points", routeHandler.GetDropoffPoints)
		
		api.GET("/schedules", scheduleHandler.GetAllSchedules)
		api.GET("/schedules/search", scheduleHandler.SearchSchedules)
		api.GET("/schedules/:id", scheduleHandler.GetScheduleByID)
		api.GET("/schedules/:id/seats", scheduleHandler.GetScheduleSeats)
		
		api.GET("/reviews", reviewHandler.GetAllReviews)

		// Protected routes (ต้องใช้ token)
		protected := api.Group("")
		protected.Use(middleware.AuthMiddleware())
		{
			// Booking routes - restrict booking actions to normal users only
			protected.GET("/bookings", middleware.RequireRole("user"), bookingHandler.GetUserBookings)
			protected.GET("/bookings/:id", middleware.RequireRole("user"), bookingHandler.GetBookingByID)
			protected.POST("/bookings", middleware.RequireRole("user"), bookingHandler.CreateBooking)
			protected.PUT("/bookings/:id/cancel", middleware.RequireRole("user"), bookingHandler.CancelBooking)

			// Payment routes (Mock) - allow authenticated users (could be expanded)
			protected.POST("/payments", bookingHandler.CreatePayment)
			protected.GET("/payments/:bookingId", bookingHandler.GetPaymentByBookingID)
		}

		// Admin routes (ต้องใช้ token + role admin)
		admin := api.Group("/admin")
		// Require both a valid token and the admin role
		admin.Use(middleware.AuthMiddleware(), middleware.RequireRole("admin"))
		{
			// Dashboard
			admin.GET("/dashboard", adminHandler.GetDashboardStats)

			// Vans management
			admin.GET("/vans", vanHandler.GetAllVans)
			admin.GET("/vans/:id", vanHandler.GetVanByID)
			admin.POST("/vans", vanHandler.CreateVan)
			admin.PUT("/vans/:id", vanHandler.UpdateVan)
			admin.DELETE("/vans/:id", vanHandler.DeleteVan)

			// Routes management
			admin.GET("/routes", routeHandler.GetAllRoutes)
			admin.GET("/routes/:id", routeHandler.GetRouteByID)
			admin.POST("/routes", routeHandler.CreateRoute)
			admin.PUT("/routes/:id", routeHandler.UpdateRoute)
			admin.DELETE("/routes/:id", routeHandler.DeleteRoute)

			// Schedules management
			admin.GET("/schedules", scheduleHandler.GetAllSchedules)
			admin.GET("/schedules/:id", scheduleHandler.GetScheduleByID)
			admin.POST("/schedules", scheduleHandler.CreateSchedule)
			admin.PUT("/schedules/:id", scheduleHandler.UpdateSchedule)
			admin.DELETE("/schedules/:id", scheduleHandler.DeleteSchedule)

			// Bookings management
			admin.GET("/bookings", bookingHandler.GetAllBookings)
			admin.GET("/bookings/:id", bookingHandler.AdminGetBookingByID)
			admin.PUT("/bookings/:id/status", bookingHandler.AdminUpdateBookingStatus)
		}
	}

	// เริ่มต้น server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server is running on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

// initDB สร้างการเชื่อมต่อ database
func initDB() (*sql.DB, error) {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	// ตั้งค่า connection pool
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	return db, nil
}
