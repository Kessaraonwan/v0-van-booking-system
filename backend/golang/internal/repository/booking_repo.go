package repository

import (
	"database/sql"
	"fmt"
	"time"
	"vanbooking/internal/model"
)

// BookingRepository จัดการข้อมูล bookings
type BookingRepository struct {
	db *sql.DB
}

// NewBookingRepository สร้าง BookingRepository ใหม่
func NewBookingRepository(db *sql.DB) *BookingRepository {
	return &BookingRepository{db: db}
}

// GetByUserID ดึง bookings ของ user พร้อม schedule info + pickup/dropoff details
func (r *BookingRepository) GetByUserID(userID int) ([]model.BookingWithDetails, error) {
	query := `
		SELECT 
			b.id, b.user_id, b.schedule_id, b.seat_number, b.passenger_name,
			b.passenger_phone, b.passenger_email, b.pickup_point_id, b.dropoff_point_id,
			b.booking_number, b.special_requests, b.booking_status, b.total_price, 
			b.created_at, b.updated_at,
			s.departure_time, s.arrival_time,
			rt.origin, rt.destination,
			v.van_number, v.license_plate,
			pp.name AS pickup_name, pp.address AS pickup_address, pp.pickup_time,
			dp.name AS dropoff_name, dp.address AS dropoff_address, dp.estimated_arrival
		FROM bookings b
		JOIN schedules s ON b.schedule_id = s.id
		JOIN routes rt ON s.route_id = rt.id
		JOIN vans v ON s.van_id = v.id
		LEFT JOIN pickup_points pp ON b.pickup_point_id = pp.id
		LEFT JOIN dropoff_points dp ON b.dropoff_point_id = dp.id
		WHERE b.user_id = $1
		ORDER BY b.created_at DESC
	`

	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []model.BookingWithDetails
	for rows.Next() {
		var b model.BookingWithDetails

		// nullable fields
		var passengerEmail sql.NullString
		var specialRequests sql.NullString
		var pickupName sql.NullString
		var pickupAddress sql.NullString
		var pickupTime sql.NullString
		var dropoffName sql.NullString
		var dropoffAddress sql.NullString
		var estimatedArrival sql.NullString

		// timestamps
		var departureTime time.Time
		var arrivalTime time.Time

		err := rows.Scan(
			&b.ID, &b.UserID, &b.ScheduleID, &b.SeatNumber, &b.PassengerName,
			&b.PassengerPhone, &passengerEmail, &b.PickupPointID, &b.DropoffPointID,
			&b.BookingNumber, &specialRequests, &b.BookingStatus, &b.TotalPrice,
			&b.CreatedAt, &b.UpdatedAt,
			&departureTime, &arrivalTime,
			&b.Origin, &b.Destination,
			&b.VanNumber, &b.LicensePlate,
			&pickupName, &pickupAddress, &pickupTime,
			&dropoffName, &dropoffAddress, &estimatedArrival,
		)
		if err != nil {
			return nil, err
		}

		// map nullable and time fields to strings as expected by model
		b.PassengerEmail = passengerEmail.String
		b.SpecialRequests = specialRequests.String
		b.DepartureTime = departureTime.Format(time.RFC3339)
		b.ArrivalTime = arrivalTime.Format(time.RFC3339)
		b.PickupPointName = pickupName.String
		b.PickupPointAddress = pickupAddress.String
		b.PickupTime = pickupTime.String
		b.DropoffPointName = dropoffName.String
		b.DropoffPointAddress = dropoffAddress.String
		b.EstimatedArrival = estimatedArrival.String

		bookings = append(bookings, b)
	}

	return bookings, nil
}

// GetByID ดึง booking ตาม ID พร้อม details + pickup/dropoff
func (r *BookingRepository) GetByID(id int) (*model.BookingWithDetails, error) {
	query := `
		SELECT 
			b.id, b.user_id, b.schedule_id, b.seat_number, b.passenger_name,
			b.passenger_phone, b.passenger_email, b.pickup_point_id, b.dropoff_point_id,
			b.booking_number, b.special_requests, b.booking_status, b.total_price, 
			b.created_at, b.updated_at,
			s.departure_time, s.arrival_time,
			rt.origin, rt.destination,
			v.van_number, v.license_plate,
			pp.name AS pickup_name, pp.address AS pickup_address, pp.pickup_time,
			dp.name AS dropoff_name, dp.address AS dropoff_address, dp.estimated_arrival
		FROM bookings b
		JOIN schedules s ON b.schedule_id = s.id
		JOIN routes rt ON s.route_id = rt.id
		JOIN vans v ON s.van_id = v.id
		LEFT JOIN pickup_points pp ON b.pickup_point_id = pp.id
		LEFT JOIN dropoff_points dp ON b.dropoff_point_id = dp.id
		WHERE b.id = $1
	`

	var b model.BookingWithDetails

		var passengerEmail sql.NullString
	var specialRequests sql.NullString
	var pickupName sql.NullString
	var pickupAddress sql.NullString
	var pickupTime sql.NullString
	var dropoffName sql.NullString
	var dropoffAddress sql.NullString
	var estimatedArrival sql.NullString

	var departureTime time.Time
	var arrivalTime time.Time

	err := r.db.QueryRow(query, id).Scan(
		&b.ID, &b.UserID, &b.ScheduleID, &b.SeatNumber, &b.PassengerName,
		&b.PassengerPhone, &passengerEmail, &b.PickupPointID, &b.DropoffPointID,
		&b.BookingNumber, &specialRequests, &b.BookingStatus, &b.TotalPrice,
		&b.CreatedAt, &b.UpdatedAt,
		&departureTime, &arrivalTime,
		&b.Origin, &b.Destination,
		&b.VanNumber, &b.LicensePlate,
		&pickupName, &pickupAddress, &pickupTime,
		&dropoffName, &dropoffAddress, &estimatedArrival,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("booking not found")
	}
	if err != nil {
		return nil, err
	}

	b.PassengerEmail = passengerEmail.String
	b.SpecialRequests = specialRequests.String
	b.DepartureTime = departureTime.Format(time.RFC3339)
	b.ArrivalTime = arrivalTime.Format(time.RFC3339)
	b.PickupPointName = pickupName.String
	b.PickupPointAddress = pickupAddress.String
	b.PickupTime = pickupTime.String
	b.DropoffPointName = dropoffName.String
	b.DropoffPointAddress = dropoffAddress.String
	b.EstimatedArrival = estimatedArrival.String

	return &b, nil
}

// GetAll ดึง bookings ทั้งหมด (สำหรับ admin) + pickup/dropoff details
func (r *BookingRepository) GetAll() ([]model.BookingWithDetails, error) {
	query := `
		SELECT 
			b.id, b.user_id, b.schedule_id, b.seat_number, b.passenger_name,
			b.passenger_phone, b.passenger_email, b.pickup_point_id, b.dropoff_point_id,
			b.booking_number, b.special_requests, b.booking_status, b.total_price, 
			b.created_at, b.updated_at,
			s.departure_time, s.arrival_time,
			rt.origin, rt.destination,
			v.van_number, v.license_plate,
			pp.name AS pickup_name, pp.address AS pickup_address, pp.pickup_time,
			dp.name AS dropoff_name, dp.address AS dropoff_address, dp.estimated_arrival
		FROM bookings b
		JOIN schedules s ON b.schedule_id = s.id
		JOIN routes rt ON s.route_id = rt.id
		JOIN vans v ON s.van_id = v.id
		LEFT JOIN pickup_points pp ON b.pickup_point_id = pp.id
		LEFT JOIN dropoff_points dp ON b.dropoff_point_id = dp.id
		ORDER BY b.created_at DESC
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []model.BookingWithDetails
	for rows.Next() {
		var b model.BookingWithDetails

		var passengerEmail sql.NullString
		var specialRequests sql.NullString
		var pickupName sql.NullString
		var pickupAddress sql.NullString
		var pickupTime sql.NullString
		var dropoffName sql.NullString
		var dropoffAddress sql.NullString
		var estimatedArrival sql.NullString

		var departureTime time.Time
		var arrivalTime time.Time

		err := rows.Scan(
			&b.ID, &b.UserID, &b.ScheduleID, &b.SeatNumber, &b.PassengerName,
			&b.PassengerPhone, &passengerEmail, &b.PickupPointID, &b.DropoffPointID,
			&b.BookingNumber, &specialRequests, &b.BookingStatus, &b.TotalPrice,
			&b.CreatedAt, &b.UpdatedAt,
			&departureTime, &arrivalTime,
			&b.Origin, &b.Destination,
			&b.VanNumber, &b.LicensePlate,
			&pickupName, &pickupAddress, &pickupTime,
			&dropoffName, &dropoffAddress, &estimatedArrival,
		)
		if err != nil {
			return nil, err
		}

		b.PassengerEmail = passengerEmail.String
		b.SpecialRequests = specialRequests.String
		b.DepartureTime = departureTime.Format(time.RFC3339)
		b.ArrivalTime = arrivalTime.Format(time.RFC3339)
		b.PickupPointName = pickupName.String
		b.PickupPointAddress = pickupAddress.String
		b.PickupTime = pickupTime.String
		b.DropoffPointName = dropoffName.String
		b.DropoffPointAddress = dropoffAddress.String
		b.EstimatedArrival = estimatedArrival.String

		bookings = append(bookings, b)
	}

	return bookings, nil
}

// Create สร้าง booking พร้อม Transaction (CRITICAL - ต้อง atomic)
// Steps: 1) Check seat available, 2) Create booking, 3) Update seat status, 4) Update schedule available_seats
func (r *BookingRepository) Create(booking *model.Booking) error {
	// เริ่ม transaction
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback() // Rollback ถ้าเกิด error

	// 1. เช็คว่า seat ว่างอยู่ไหม
	var seatStatus string
	err = tx.QueryRow(`
		SELECT status FROM seats 
		WHERE schedule_id = $1 AND seat_number = $2
	`, booking.ScheduleID, booking.SeatNumber).Scan(&seatStatus)

	if err == sql.ErrNoRows {
		return fmt.Errorf("seat not found")
	}
	if err != nil {
		return err
	}
	if seatStatus != "available" {
		return fmt.Errorf("seat already booked")
	}

	// 2. สร้าง booking (พร้อม pickup/dropoff + booking_number generation)
	err = tx.QueryRow(`
		INSERT INTO bookings (
			user_id, schedule_id, seat_number, passenger_name, passenger_phone, passenger_email,
			pickup_point_id, dropoff_point_id, booking_number, special_requests,
			booking_status, total_price
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 
		        CONCAT('BK', LPAD(nextval('bookings_id_seq')::text, 6, '0')), 
		        $9, $10, $11)
		RETURNING id, booking_number, created_at, updated_at
	`, booking.UserID, booking.ScheduleID, booking.SeatNumber, booking.PassengerName, 
	   booking.PassengerPhone, booking.PassengerEmail, booking.PickupPointID, booking.DropoffPointID,
	   booking.SpecialRequests, booking.BookingStatus, booking.TotalPrice).Scan(
		&booking.ID, &booking.BookingNumber, &booking.CreatedAt, &booking.UpdatedAt,
	)

	if err != nil {
		return err
	}

	// 3. อัพเดท seat status เป็น 'booked' และเก็บ booking_id
	_, err = tx.Exec(`
		UPDATE seats 
		SET status = 'booked', booking_id = $1
		WHERE schedule_id = $2 AND seat_number = $3
	`, booking.ID, booking.ScheduleID, booking.SeatNumber)

	if err != nil {
		return err
	}

	// 4. ลด available_seats ของ schedule ลง 1
	_, err = tx.Exec(`
		UPDATE schedules 
		SET available_seats = available_seats - 1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`, booking.ScheduleID)

	if err != nil {
		return err
	}

	// Commit transaction
	return tx.Commit()
}

// Cancel ยกเลิก booking พร้อม Transaction (CRITICAL - ต้อง atomic)
// Steps: 1) Update booking status, 2) Update seat status back to available, 3) Increase schedule available_seats
func (r *BookingRepository) Cancel(id int) error {
	// เริ่ม transaction
	tx, err := r.db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// ดึงข้อมูล booking
	var scheduleID, seatNumber int
	var bookingStatus string
	err = tx.QueryRow(`
		SELECT schedule_id, seat_number, booking_status 
		FROM bookings WHERE id = $1
	`, id).Scan(&scheduleID, &seatNumber, &bookingStatus)

	if err == sql.ErrNoRows {
		return fmt.Errorf("booking not found")
	}
	if err != nil {
		return err
	}

	if bookingStatus == "cancelled" {
		return fmt.Errorf("booking already cancelled")
	}

	// 1. อัพเดท booking status เป็น 'cancelled'
	_, err = tx.Exec(`
		UPDATE bookings 
		SET booking_status = 'cancelled', updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`, id)

	if err != nil {
		return err
	}

	// 2. คืน seat กลับเป็น 'available'
	_, err = tx.Exec(`
		UPDATE seats 
		SET status = 'available', booking_id = NULL
		WHERE schedule_id = $1 AND seat_number = $2
	`, scheduleID, seatNumber)

	if err != nil {
		return err
	}

	// 3. เพิ่ม available_seats กลับ 1
	_, err = tx.Exec(`
		UPDATE schedules 
		SET available_seats = available_seats + 1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $1
	`, scheduleID)

	if err != nil {
		return err
	}

	// Commit transaction
	return tx.Commit()
}

// UpdateStatus อัพเดทสถานะการจอง (ถ้าเป็น 'cancelled' จะเรียก Cancel transactional flow)
func (r *BookingRepository) UpdateStatus(id int, status string) error {
	if status == "cancelled" || status == "CANCELLED" {
		// Reuse Cancel transactional logic to ensure seat & schedule are restored
		return r.Cancel(id)
	}

	// Simple update for other statuses
	_, err := r.db.Exec(`
		UPDATE bookings
		SET booking_status = $1, updated_at = CURRENT_TIMESTAMP
		WHERE id = $2
	`, status, id)

	return err
}

// CreatePayment สร้าง payment record
func (r *BookingRepository) CreatePayment(payment *model.Payment) error {
	query := `
		INSERT INTO payments (booking_id, payment_method, payment_status, amount)
		VALUES ($1, $2, $3, $4)
		RETURNING id, payment_date, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		payment.BookingID,
		payment.PaymentMethod,
		payment.PaymentStatus,
		payment.Amount,
	).Scan(&payment.ID, &payment.PaymentDate, &payment.CreatedAt, &payment.UpdatedAt)

	return err
}

// GetPaymentByBookingID ดึง payment ของ booking
func (r *BookingRepository) GetPaymentByBookingID(bookingID int) (*model.Payment, error) {
	query := `
		SELECT id, booking_id, payment_method, payment_status, amount, payment_date, created_at, updated_at
		FROM payments
		WHERE booking_id = $1
	`

	var p model.Payment
	err := r.db.QueryRow(query, bookingID).Scan(
		&p.ID, &p.BookingID, &p.PaymentMethod, &p.PaymentStatus,
		&p.Amount, &p.PaymentDate, &p.CreatedAt, &p.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("payment not found")
	}
	if err != nil {
		return nil, err
	}

	return &p, nil
}
