package repository

import (
"database/sql"
"errors"
"vanbooking/internal/model"
)

type RouteRepository struct {
db *sql.DB
}

func NewRouteRepository(db *sql.DB) *RouteRepository {
return &RouteRepository{db: db}
}

func (r *RouteRepository) GetAll() ([]*model.Route, error) {
query := `SELECT id, origin, destination, base_price, duration_minutes, distance_km, 
          COALESCE(image_url, '') as image_url, created_at, updated_at 
          FROM routes ORDER BY id`

rows, err := r.db.Query(query)
if err != nil {
return nil, err
}
defer rows.Close()

var routes []*model.Route
for rows.Next() {
route := &model.Route{}
err := rows.Scan(
&route.ID,
&route.Origin,
&route.Destination,
&route.BasePrice,
&route.DurationMinutes,
&route.DistanceKM,
&route.ImageURL,
&route.CreatedAt,
&route.UpdatedAt,
)
if err != nil {
return nil, err
}
routes = append(routes, route)
}

return routes, nil
}

func (r *RouteRepository) GetByID(id int) (*model.Route, error) {
route := &model.Route{}
query := `SELECT id, origin, destination, base_price, duration_minutes, distance_km,
          COALESCE(image_url, '') as image_url, created_at, updated_at 
          FROM routes WHERE id = $1`

err := r.db.QueryRow(query, id).Scan(
&route.ID,
&route.Origin,
&route.Destination,
&route.BasePrice,
&route.DurationMinutes,
&route.DistanceKM,
&route.ImageURL,
&route.CreatedAt,
&route.UpdatedAt,
)

if err == sql.ErrNoRows {
return nil, errors.New("route not found")
}
if err != nil {
return nil, err
}

return route, nil
}

func (r *RouteRepository) Create(route *model.Route) error {
query := `INSERT INTO routes (origin, destination, base_price, duration_minutes, distance_km, image_url)
          VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at, updated_at`

return r.db.QueryRow(
query,
route.Origin,
route.Destination,
route.BasePrice,
route.DurationMinutes,
route.DistanceKM,
route.ImageURL,
).Scan(&route.ID, &route.CreatedAt, &route.UpdatedAt)
}

func (r *RouteRepository) Update(route *model.Route) error {
query := `UPDATE routes SET origin = $1, destination = $2, base_price = $3,
          duration_minutes = $4, distance_km = $5, image_url = $6, updated_at = NOW()
          WHERE id = $7`

result, err := r.db.Exec(
query,
route.Origin,
route.Destination,
route.BasePrice,
route.DurationMinutes,
route.DistanceKM,
route.ImageURL,
route.ID,
)
if err != nil {
return err
}

rows, err := result.RowsAffected()
if err != nil {
return err
}
if rows == 0 {
return errors.New("route not found")
}

return nil
}

func (r *RouteRepository) Delete(id int) error {
query := `DELETE FROM routes WHERE id = $1`
result, err := r.db.Exec(query, id)
if err != nil {
return err
}

rows, err := result.RowsAffected()
if err != nil {
return err
}
if rows == 0 {
return errors.New("route not found")
}

return nil
}
