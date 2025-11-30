package repository

import (
	"database/sql"
	"errors"
	"vanbooking/internal/model"
)

// VanRepository จัดการข้อมูล vans
type VanRepository struct {
	db *sql.DB
}

// NewVanRepository สร้าง VanRepository ใหม่
func NewVanRepository(db *sql.DB) *VanRepository {
	return &VanRepository{db: db}
}

// GetAll ดึงรถตู้ทั้งหมด
func (r *VanRepository) GetAll() ([]*model.Van, error) {
	query := `
		SELECT id, van_number, license_plate, driver, total_seats, status, created_at, updated_at
		FROM vans
		ORDER BY id
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vans []*model.Van
	for rows.Next() {
		var van model.Van
		err := rows.Scan(
			&van.ID,
			&van.VanNumber,
			&van.LicensePlate,
			&van.Driver,
			&van.TotalSeats,
			&van.Status,
			&van.CreatedAt,
			&van.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		vans = append(vans, &van)
	}

	return vans, nil
}

// GetByID ดึงรถตู้ตาม ID
func (r *VanRepository) GetByID(id int) (*model.Van, error) {
	van := &model.Van{}

	query := `
		SELECT id, van_number, license_plate, driver, total_seats, status, created_at, updated_at
		FROM vans
		WHERE id = $1
	`

	err := r.db.QueryRow(query, id).Scan(
		&van.ID,
		&van.VanNumber,
		&van.LicensePlate,
		&van.Driver,
		&van.TotalSeats,
		&van.Status,
		&van.CreatedAt,
		&van.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("van not found")
	}

	if err != nil {
		return nil, err
	}

	return van, nil
}

// Create สร้างรถตู้ใหม่
func (r *VanRepository) Create(van *model.Van) error {
	query := `
		INSERT INTO vans (van_number, license_plate, driver, total_seats, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	err := r.db.QueryRow(
		query,
		van.VanNumber,
		van.LicensePlate,
		van.Driver,
		van.TotalSeats,
		van.Status,
	).Scan(&van.ID, &van.CreatedAt, &van.UpdatedAt)

	return err
}

// Update แก้ไขรถตู้
func (r *VanRepository) Update(id int, van *model.Van) error {
	query := `
		UPDATE vans
		SET van_number = $1, license_plate = $2, driver = $3, total_seats = $4, status = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING updated_at
	`

	err := r.db.QueryRow(
		query,
		van.VanNumber,
		van.LicensePlate,
		van.Driver,
		van.TotalSeats,
		van.Status,
		id,
	).Scan(&van.UpdatedAt)

	if err == sql.ErrNoRows {
		return errors.New("van not found")
	}

	return err
}

// Delete ลบรถตู้
func (r *VanRepository) Delete(id int) error {
	query := `DELETE FROM vans WHERE id = $1`

	result, err := r.db.Exec(query, id)
	if err != nil {
		return err
	}

	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rows == 0 {
		return errors.New("van not found")
	}

	return nil
}

// GetTripsTodayCounts คืน mapping van_id -> trips_today (จำนวนรอบวันนี้)
func (r *VanRepository) GetTripsTodayCounts() (map[int]int, error) {
	query := `
		SELECT van_id, COUNT(*) as trips
		FROM schedules
		WHERE DATE(departure_time) = CURRENT_DATE
		GROUP BY van_id
	`

	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	counts := make(map[int]int)
	for rows.Next() {
		var vanID int
		var trips int
		if err := rows.Scan(&vanID, &trips); err != nil {
			return nil, err
		}
		counts[vanID] = trips
	}

	return counts, nil
}
