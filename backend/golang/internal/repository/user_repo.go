package repository

import (
	"database/sql"
	"errors"
	"vanbooking/internal/model"
)

// UserRepository จัดการข้อมูล users
type UserRepository struct {
	db *sql.DB
}

// NewUserRepository สร้าง UserRepository ใหม่
func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create สร้าง user ใหม่ในฐานข้อมูล
func (r *UserRepository) Create(user *model.User) error {
	query := `
		INSERT INTO users (email, password, name, phone, role, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, created_at
	`

	err := r.db.QueryRow(
		query,
		user.Email,
		user.Password,
		user.Name,
		user.Phone,
		user.Role,
	).Scan(&user.ID, &user.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}

// GetByEmail ดึง user จาก email
func (r *UserRepository) GetByEmail(email string) (*model.User, error) {
	user := &model.User{}

	query := `
		SELECT id, email, password, name, phone, role, created_at
		FROM users
		WHERE email = $1
	`

	err := r.db.QueryRow(query, email).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Phone,
		&user.Role,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetByID ดึง user จาก ID
func (r *UserRepository) GetByID(id int) (*model.User, error) {
	user := &model.User{}

	query := `
		SELECT id, email, password, name, phone, role, created_at
		FROM users
		WHERE id = $1
	`

	err := r.db.QueryRow(query, id).Scan(
		&user.ID,
		&user.Email,
		&user.Password,
		&user.Name,
		&user.Phone,
		&user.Role,
		&user.CreatedAt,
	)

	if err == sql.ErrNoRows {
		return nil, errors.New("user not found")
	}

	if err != nil {
		return nil, err
	}

	return user, nil
}
