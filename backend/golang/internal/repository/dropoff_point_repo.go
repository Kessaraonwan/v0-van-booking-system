package repository

import (
	"database/sql"
	"vanbooking/internal/model"
)

type DropoffPointRepository struct {
	db *sql.DB
}

func NewDropoffPointRepository(db *sql.DB) *DropoffPointRepository {
	return &DropoffPointRepository{db: db}
}

// GetByRouteID ดึงจุดลงรถทั้งหมดของเส้นทาง (เฉพาะที่ active)
func (r *DropoffPointRepository) GetByRouteID(routeID int) ([]model.DropoffPoint, error) {
	query := `
		SELECT id, route_id, name, address, landmark, google_maps_url, 
		       estimated_arrival, contact_phone, is_active, display_order,
		       created_at, updated_at
		FROM dropoff_points
		WHERE route_id = $1 AND is_active = true
		ORDER BY display_order ASC, estimated_arrival ASC
	`

	rows, err := r.db.Query(query, routeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dropoffPoints []model.DropoffPoint
	for rows.Next() {
		var dp model.DropoffPoint
		err := rows.Scan(
			&dp.ID, &dp.RouteID, &dp.Name, &dp.Address, &dp.Landmark,
			&dp.GoogleMapsURL, &dp.EstimatedArrival, &dp.ContactPhone,
			&dp.IsActive, &dp.DisplayOrder, &dp.CreatedAt, &dp.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		dropoffPoints = append(dropoffPoints, dp)
	}

	return dropoffPoints, nil
}

// GetByID ดึงข้อมูลจุดลงรถตาม ID
func (r *DropoffPointRepository) GetByID(id int) (*model.DropoffPoint, error) {
	query := `
		SELECT id, route_id, name, address, landmark, google_maps_url, 
		       estimated_arrival, contact_phone, is_active, display_order,
		       created_at, updated_at
		FROM dropoff_points
		WHERE id = $1
	`

	var dp model.DropoffPoint
	err := r.db.QueryRow(query, id).Scan(
		&dp.ID, &dp.RouteID, &dp.Name, &dp.Address, &dp.Landmark,
		&dp.GoogleMapsURL, &dp.EstimatedArrival, &dp.ContactPhone,
		&dp.IsActive, &dp.DisplayOrder, &dp.CreatedAt, &dp.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &dp, nil
}

// Create สร้างจุดลงรถใหม่ (Admin)
func (r *DropoffPointRepository) Create(req model.CreateDropoffPointRequest) (*model.DropoffPoint, error) {
	query := `
		INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, 
		                           estimated_arrival, contact_phone, display_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, route_id, name, address, landmark, google_maps_url, 
		          estimated_arrival, contact_phone, is_active, display_order,
		          created_at, updated_at
	`

	var dp model.DropoffPoint
	err := r.db.QueryRow(
		query,
		req.RouteID, req.Name, req.Address, req.Landmark, req.GoogleMapsURL,
		req.EstimatedArrival, req.ContactPhone, req.DisplayOrder,
	).Scan(
		&dp.ID, &dp.RouteID, &dp.Name, &dp.Address, &dp.Landmark,
		&dp.GoogleMapsURL, &dp.EstimatedArrival, &dp.ContactPhone,
		&dp.IsActive, &dp.DisplayOrder, &dp.CreatedAt, &dp.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &dp, nil
}

// Update แก้ไขจุดลงรถ (Admin)
func (r *DropoffPointRepository) Update(id int, req model.UpdateDropoffPointRequest) error {
	query := `
		UPDATE dropoff_points
		SET name = COALESCE(NULLIF($1, ''), name),
		    address = COALESCE(NULLIF($2, ''), address),
		    landmark = COALESCE(NULLIF($3, ''), landmark),
		    google_maps_url = COALESCE(NULLIF($4, ''), google_maps_url),
		    estimated_arrival = COALESCE(NULLIF($5, ''), estimated_arrival),
		    contact_phone = COALESCE(NULLIF($6, ''), contact_phone),
		    is_active = COALESCE($7, is_active),
		    display_order = COALESCE(NULLIF($8, 0), display_order),
		    updated_at = NOW()
		WHERE id = $9
	`

	_, err := r.db.Exec(
		query,
		req.Name, req.Address, req.Landmark, req.GoogleMapsURL,
		req.EstimatedArrival, req.ContactPhone, req.IsActive, req.DisplayOrder, id,
	)

	return err
}

// Delete ลบจุดลงรถ (Admin) - soft delete โดยเซ็ต is_active = false
func (r *DropoffPointRepository) Delete(id int) error {
	query := `UPDATE dropoff_points SET is_active = false, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
