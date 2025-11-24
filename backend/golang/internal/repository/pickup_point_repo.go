package repository

import (
	"database/sql"
	"vanbooking/internal/model"
)

type PickupPointRepository struct {
	db *sql.DB
}

func NewPickupPointRepository(db *sql.DB) *PickupPointRepository {
	return &PickupPointRepository{db: db}
}

// GetByRouteID ดึงจุดขึ้นรถทั้งหมดของเส้นทาง (เฉพาะที่ active)
func (r *PickupPointRepository) GetByRouteID(routeID int) ([]model.PickupPoint, error) {
	query := `
		SELECT id, route_id, name, address, landmark, google_maps_url, 
		       pickup_time, contact_phone, is_active, display_order,
		       created_at, updated_at
		FROM pickup_points
		WHERE route_id = $1 AND is_active = true
		ORDER BY display_order ASC, pickup_time ASC
	`

	rows, err := r.db.Query(query, routeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var pickupPoints []model.PickupPoint
	for rows.Next() {
		var pp model.PickupPoint
		err := rows.Scan(
			&pp.ID, &pp.RouteID, &pp.Name, &pp.Address, &pp.Landmark,
			&pp.GoogleMapsURL, &pp.PickupTime, &pp.ContactPhone,
			&pp.IsActive, &pp.DisplayOrder, &pp.CreatedAt, &pp.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		pickupPoints = append(pickupPoints, pp)
	}

	return pickupPoints, nil
}

// GetByID ดึงข้อมูลจุดขึ้นรถตาม ID
func (r *PickupPointRepository) GetByID(id int) (*model.PickupPoint, error) {
	query := `
		SELECT id, route_id, name, address, landmark, google_maps_url, 
		       pickup_time, contact_phone, is_active, display_order,
		       created_at, updated_at
		FROM pickup_points
		WHERE id = $1
	`

	var pp model.PickupPoint
	err := r.db.QueryRow(query, id).Scan(
		&pp.ID, &pp.RouteID, &pp.Name, &pp.Address, &pp.Landmark,
		&pp.GoogleMapsURL, &pp.PickupTime, &pp.ContactPhone,
		&pp.IsActive, &pp.DisplayOrder, &pp.CreatedAt, &pp.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &pp, nil
}

// Create สร้างจุดขึ้นรถใหม่ (Admin)
func (r *PickupPointRepository) Create(req model.CreatePickupPointRequest) (*model.PickupPoint, error) {
	query := `
		INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, 
		                          pickup_time, contact_phone, display_order)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, route_id, name, address, landmark, google_maps_url, 
		          pickup_time, contact_phone, is_active, display_order,
		          created_at, updated_at
	`

	var pp model.PickupPoint
	err := r.db.QueryRow(
		query,
		req.RouteID, req.Name, req.Address, req.Landmark, req.GoogleMapsURL,
		req.PickupTime, req.ContactPhone, req.DisplayOrder,
	).Scan(
		&pp.ID, &pp.RouteID, &pp.Name, &pp.Address, &pp.Landmark,
		&pp.GoogleMapsURL, &pp.PickupTime, &pp.ContactPhone,
		&pp.IsActive, &pp.DisplayOrder, &pp.CreatedAt, &pp.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &pp, nil
}

// Update แก้ไขจุดขึ้นรถ (Admin)
func (r *PickupPointRepository) Update(id int, req model.UpdatePickupPointRequest) error {
	query := `
		UPDATE pickup_points
		SET name = COALESCE(NULLIF($1, ''), name),
		    address = COALESCE(NULLIF($2, ''), address),
		    landmark = COALESCE(NULLIF($3, ''), landmark),
		    google_maps_url = COALESCE(NULLIF($4, ''), google_maps_url),
		    pickup_time = COALESCE(NULLIF($5, ''), pickup_time),
		    contact_phone = COALESCE(NULLIF($6, ''), contact_phone),
		    is_active = COALESCE($7, is_active),
		    display_order = COALESCE(NULLIF($8, 0), display_order),
		    updated_at = NOW()
		WHERE id = $9
	`

	_, err := r.db.Exec(
		query,
		req.Name, req.Address, req.Landmark, req.GoogleMapsURL,
		req.PickupTime, req.ContactPhone, req.IsActive, req.DisplayOrder, id,
	)

	return err
}

// Delete ลบจุดขึ้นรถ (Admin) - soft delete โดยเซ็ต is_active = false
func (r *PickupPointRepository) Delete(id int) error {
	query := `UPDATE pickup_points SET is_active = false, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}
