package repository

import (
	"database/sql"
	"vanbooking/internal/model"
)

// ReviewRepository จัดการข้อมูล reviews
type ReviewRepository struct {
	db *sql.DB
}

// NewReviewRepository สร้าง ReviewRepository ใหม่
func NewReviewRepository(db *sql.DB) *ReviewRepository {
	return &ReviewRepository{db: db}
}

// GetAll ดึงรีวิวทั้งหมด
func (r *ReviewRepository) GetAll(limit int) ([]*model.Review, error) {
	query := `
		SELECT r.id, r.user_id, r.route_id, r.rating, r.comment,
		       u.name as user_name,
		       CONCAT(rt.origin, ' - ', rt.destination) as route_name,
		       r.created_at
		FROM reviews r
		JOIN users u ON r.user_id = u.id
		JOIN routes rt ON r.route_id = rt.id
		ORDER BY r.created_at DESC
	`

	if limit > 0 {
		query += " LIMIT $1"
	}

	var rows *sql.Rows
	var err error

	if limit > 0 {
		rows, err = r.db.Query(query, limit)
	} else {
		rows, err = r.db.Query(query)
	}

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []*model.Review
	for rows.Next() {
		var review model.Review
		err := rows.Scan(
			&review.ID,
			&review.UserID,
			&review.RouteID,
			&review.Rating,
			&review.Comment,
			&review.UserName,
			&review.RouteName,
			&review.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		reviews = append(reviews, &review)
	}

	return reviews, nil
}
