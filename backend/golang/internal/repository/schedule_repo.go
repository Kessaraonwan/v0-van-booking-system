package repository

import (
	"database/sql"
	"fmt"
	"vanbooking/internal/model"
)

// ScheduleRepository จัดการข้อมูล schedules
//
// Repository Pattern (Week 9):
// - แยก database logic ออกจาก HTTP handler
// - ใช้ interface-based design
// - Dependency Injection (inject *sql.DB)
//
// เทียบกับ Course:
// - BookRepository (Course) → ScheduleRepository (Final Project)
// - GetAll(), GetByID(), Create(), Update(), Delete() (รูปแบบเดียวกัน)
//
// Database Operations (Week 8):
// - db.Query() สำหรับ SELECT หลายแถว
// - db.QueryRow() สำหรับ SELECT แถวเดียว
// - db.Exec() สำหรับ INSERT/UPDATE/DELETE
// - JOIN queries (Week 9) สำหรับ combine data จากหลาย tables
type ScheduleRepository struct {
	db *sql.DB
}

// NewScheduleRepository สร้าง ScheduleRepository ใหม่
func NewScheduleRepository(db *sql.DB) *ScheduleRepository {
	return &ScheduleRepository{db: db}
}

// GetAll ดึง schedules ทั้งหมด พร้อม route และ van info
func (r *ScheduleRepository) GetAll() ([]model.ScheduleWithDetails, error) {
	query := `
		SELECT 
			s.id, s.route_id, s.van_id, s.departure_time, s.arrival_time, 
			s.price, s.available_seats, s.status, s.created_at, s.updated_at,
			r.origin, r.destination, r.distance_km, r.duration_minutes,
			v.van_number, v.license_plate, v.driver, v.total_seats
		FROM schedules s
		JOIN routes r ON s.route_id = r.id
		JOIN vans v ON s.van_id = v.id
		ORDER BY s.departure_time DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schedules []model.ScheduleWithDetails
	for rows.Next() {
		var s model.ScheduleWithDetails
		err := rows.Scan(
			&s.ID, &s.RouteID, &s.VanID, &s.DepartureTime, &s.ArrivalTime,
			&s.Price, &s.AvailableSeats, &s.Status, &s.CreatedAt, &s.UpdatedAt,
			&s.Origin, &s.Destination, &s.DistanceKM, &s.DurationMinutes,
			&s.VanNumber, &s.LicensePlate, &s.Driver, &s.TotalSeats,
		)
		if err != nil {
			return nil, err
		}
		schedules = append(schedules, s)
	}

	return schedules, nil
}

// GetByID ดึง schedule ตาม ID พร้อม route และ van info
func (r *ScheduleRepository) GetByID(id int) (*model.ScheduleWithDetails, error) {
	query := `
		SELECT 
			s.id, s.route_id, s.van_id, s.departure_time, s.arrival_time, 
			s.price, s.available_seats, s.status, s.created_at, s.updated_at,
			r.origin, r.destination, r.distance_km, r.duration_minutes,
			v.van_number, v.license_plate, v.driver, v.total_seats
		FROM schedules s
		JOIN routes r ON s.route_id = r.id
		JOIN vans v ON s.van_id = v.id
		WHERE s.id = $1
	`

	var s model.ScheduleWithDetails
	err := r.db.QueryRow(query, id).Scan(
		&s.ID, &s.RouteID, &s.VanID, &s.DepartureTime, &s.ArrivalTime,
		&s.Price, &s.AvailableSeats, &s.Status, &s.CreatedAt, &s.UpdatedAt,
		&s.Origin, &s.Destination, &s.DistanceKM, &s.DurationMinutes,
		&s.VanNumber, &s.LicensePlate, &s.Driver, &s.TotalSeats,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("schedule not found")
	}
	if err != nil {
		return nil, err
	}

	return &s, nil
}

// Search ค้นหา schedules ตาม origin, destination, departure date
func (r *ScheduleRepository) Search(origin, destination string, departureDate string) ([]model.ScheduleWithDetails, error) {
	query := `
		SELECT 
			s.id, s.route_id, s.van_id, s.departure_time, s.arrival_time, 
			s.price, s.available_seats, s.status, s.created_at, s.updated_at,
			r.origin, r.destination, r.distance_km, r.duration_minutes,
			v.van_number, v.license_plate, v.driver, v.total_seats
		FROM schedules s
		JOIN routes r ON s.route_id = r.id
		JOIN vans v ON s.van_id = v.id
		WHERE r.origin = $1 AND r.destination = $2
		AND DATE(s.departure_time) = $3
		AND s.status = 'active'
		AND s.available_seats > 0
		ORDER BY s.departure_time ASC
	`

	rows, err := r.db.Query(query, origin, destination, departureDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var schedules []model.ScheduleWithDetails
	for rows.Next() {
		var s model.ScheduleWithDetails
		err := rows.Scan(
			&s.ID, &s.RouteID, &s.VanID, &s.DepartureTime, &s.ArrivalTime,
			&s.Price, &s.AvailableSeats, &s.Status, &s.CreatedAt, &s.UpdatedAt,
			&s.Origin, &s.Destination, &s.DistanceKM, &s.DurationMinutes,
			&s.VanNumber, &s.LicensePlate, &s.Driver, &s.TotalSeats,
		)
		if err != nil {
			return nil, err
		}
		schedules = append(schedules, s)
	}

	return schedules, nil
}

// GetSeats ดึง seats ของ schedule พร้อม booking info
func (r *ScheduleRepository) GetSeats(scheduleID int) ([]model.SeatWithBooking, error) {
	query := `
		SELECT 
			s.id, s.schedule_id, s.seat_number, s.status, s.booking_id,
			COALESCE(b.passenger_name, '') as passenger_name
		FROM seats s
		LEFT JOIN bookings b ON s.booking_id = b.id
		WHERE s.schedule_id = $1
		ORDER BY s.seat_number ASC
	`

	rows, err := r.db.Query(query, scheduleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var seats []model.SeatWithBooking
	for rows.Next() {
		var s model.SeatWithBooking
		var bookingID sql.NullInt64

		err := rows.Scan(
			&s.ID, &s.ScheduleID, &s.SeatNumber, &s.Status, &bookingID,
			&s.PassengerName,
		)
		if err != nil {
			return nil, err
		}

		if bookingID.Valid {
			s.BookingID = &bookingID.Int64
		}

		seats = append(seats, s)
	}

	return seats, nil
}

// Create สร้าง schedule ใหม่
func (r *ScheduleRepository) Create(schedule *model.Schedule) error {
	query := `
		INSERT INTO schedules (route_id, van_id, departure_time, arrival_time, price, available_seats, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		schedule.RouteID,
		schedule.VanID,
		schedule.DepartureTime,
		schedule.ArrivalTime,
		schedule.Price,
		schedule.AvailableSeats,
		schedule.Status,
	).Scan(&schedule.ID, &schedule.CreatedAt, &schedule.UpdatedAt)

	return err
}

// Update แก้ไข schedule
func (r *ScheduleRepository) Update(id int, schedule *model.Schedule) error {
	query := `
		UPDATE schedules 
		SET route_id = $1, van_id = $2, departure_time = $3, arrival_time = $4,
		    price = $5, available_seats = $6, status = $7, updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
	`

	result, err := r.db.Exec(
		query,
		schedule.RouteID,
		schedule.VanID,
		schedule.DepartureTime,
		schedule.ArrivalTime,
		schedule.Price,
		schedule.AvailableSeats,
		schedule.Status,
		id,
	)

	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("schedule not found")
	}

	return nil
}

// Delete ลบ schedule
func (r *ScheduleRepository) Delete(id int) error {
	query := `DELETE FROM schedules WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("schedule not found")
	}

	return nil
}

// UpdateAvailableSeats อัพเดท available_seats (delta เป็น +1 หรือ -1)
func (r *ScheduleRepository) UpdateAvailableSeats(scheduleID int, delta int) error {
	query := `
		UPDATE schedules 
		SET available_seats = available_seats + $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`

	result, err := r.db.Exec(query, delta, scheduleID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("schedule not found")
	}

	return nil
}
