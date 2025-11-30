-- ================================
-- Van Booking System - Database Schema
-- ================================
-- PostgreSQL Database Schema
--
-- เทคนิคที่ใช้จาก Course (Week 8 - Database Integration):
-- - CREATE TABLE statements (เรียนใน Week 8 Lab 1)
-- - Foreign Key Constraints (REFERENCES ... ON DELETE CASCADE)
-- - UNIQUE constraints (ป้องกันข้อมูลซ้ำ)
-- - INDEX creation (เพิ่มความเร็วการค้นหา)
-- - ENUM types (CHECK ... IN ...)
-- - DEFAULT values (TIMESTAMP, BOOLEAN)
--
-- การประยุกต์:
-- - Course: 2 tables (books, users)
-- - Final Project: 10 tables (ใช้หลักการเดียวกัน แค่มีจำนวนมากขึ้น)
--
-- Normalization (Week 8):
-- - Third Normal Form (3NF) - แยกข้อมูลไม่ให้ซ้ำซ้อน
-- - One-to-Many Relationships (1 Route → Many Schedules)
-- - One-to-One Relationships (1 Booking → 1 Payment)
--
-- ================================

-- Drop existing tables (if any)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS seats CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS vans CASCADE;
DROP TABLE IF EXISTS dropoff_points CASCADE;
DROP TABLE IF EXISTS pickup_points CASCADE;
DROP TABLE IF EXISTS routes CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ================================
-- 1. Users Table (ผู้ใช้)
-- ================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาด้วย email (ใช้บ่อยใน login)
CREATE INDEX idx_users_email ON users(email);

-- ================================
-- 2. Routes Table (เส้นทาง)
-- ================================
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    -- distance_km kept for compatibility with repository fields
    distance DECIMAL(10,2) NOT NULL,
    -- duration stored as TIME for human-friendly format;
    -- duration_minutes is used by the backend for numeric computations
    duration TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 0,
    base_price DECIMAL(10,2) NOT NULL,
    -- duplicate distance column used by code expects 'distance_km'
    distance_km DECIMAL(10,2) DEFAULT 0,
    -- optional image URL for the route
    image_url TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาเส้นทาง
CREATE INDEX idx_routes_origin_destination ON routes(origin, destination);

-- ================================
-- 3. Pickup Points Table (จุดขึ้นรถ)
-- ================================
CREATE TABLE pickup_points (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(255),
    google_maps_url TEXT,
    pickup_time TIME,
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pickup_points_route_id ON pickup_points(route_id);
CREATE INDEX idx_pickup_points_active ON pickup_points(is_active);

-- ================================
-- 4. Dropoff Points Table (จุดลงรถ)
-- ================================
CREATE TABLE dropoff_points (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    landmark VARCHAR(255),
    google_maps_url TEXT,
    estimated_arrival TIME,
    contact_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dropoff_points_route_id ON dropoff_points(route_id);
CREATE INDEX idx_dropoff_points_active ON dropoff_points(is_active);

-- ================================
-- 5. Vans Table (รถตู้)
-- ================================
CREATE TABLE vans (
    id SERIAL PRIMARY KEY,
    van_number VARCHAR(50) UNIQUE NOT NULL,
    license_plate VARCHAR(50) UNIQUE NOT NULL,
    driver VARCHAR(255),
    total_seats INTEGER DEFAULT 13 NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- 6. Schedules Table (ตารางเวลา)
-- ================================
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    van_id INTEGER NOT NULL REFERENCES vans(id) ON DELETE CASCADE,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    available_seats INTEGER DEFAULT 13 NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาตาราง
CREATE INDEX idx_schedules_route_id ON schedules(route_id);
CREATE INDEX idx_schedules_van_id ON schedules(van_id);
CREATE INDEX idx_schedules_departure_time ON schedules(departure_time);
CREATE INDEX idx_schedules_status ON schedules(status);

-- ================================
-- 7. Seats Table (ที่นั่ง)
-- ================================
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'reserved')),
    booking_id INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(schedule_id, seat_number)
);

-- Index สำหรับค้นหาที่นั่งของแต่ละตาราง
CREATE INDEX idx_seats_schedule_id ON seats(schedule_id);
CREATE INDEX idx_seats_booking_id ON seats(booking_id);

-- ================================
-- 8. Bookings Table (การจอง)
-- ================================
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    schedule_id INTEGER NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
    seat_number INTEGER NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    passenger_phone VARCHAR(20) NOT NULL,
    passenger_email VARCHAR(255),
    pickup_point_id INTEGER NOT NULL REFERENCES pickup_points(id),
    dropoff_point_id INTEGER NOT NULL REFERENCES dropoff_points(id),
    special_requests TEXT,
    booking_status VARCHAR(20) DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
    total_price DECIMAL(10,2) NOT NULL,
    booking_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาการจองของ user
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_number ON bookings(booking_number);

-- ================================
-- 9. Payments Table (การชำระเงิน)
-- ================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'credit_card', 'promptpay')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหาการชำระเงินของแต่ละ booking
CREATE INDEX idx_payments_booking_id ON payments(booking_id);

-- ================================
-- 10. Reviews Table (รีวิว)
-- ================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    route_id INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index สำหรับค้นหารีวิว
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_route_id ON reviews(route_id);

-- ================================
-- Triggers สำหรับ updated_at
-- ================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง trigger สำหรับทุกตาราง
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pickup_points_updated_at BEFORE UPDATE ON pickup_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dropoff_points_updated_at BEFORE UPDATE ON dropoff_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vans_updated_at BEFORE UPDATE ON vans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_seats_updated_at BEFORE UPDATE ON seats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- แสดงตารางทั้งหมด
-- ================================
SELECT 
    'Schema created successfully!' as status,
    COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
