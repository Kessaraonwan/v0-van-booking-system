#!/bin/bash

# ==============================================
# Van Booking System - Database Setup Script
# ==============================================

echo "🚀 Starting database setup..."

# ตรวจสอบว่ามี PostgreSQL container รันอยู่หรือไม่
if ! docker ps | grep -q postgres; then
    echo "❌ PostgreSQL container is not running!"
    echo "Please start it with: docker-compose up -d postgres"
    exit 1
fi

# รอให้ PostgreSQL พร้อม
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 3

# รัน schema.sql
echo "📋 Creating database schema..."
docker exec -i $(docker ps -qf "name=postgres") psql -U postgres -d vanbooking < database/schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully!"
else
    echo "❌ Failed to create schema"
    exit 1
fi

# รัน seed.sql
echo "🌱 Seeding database..."
docker exec -i $(docker ps -qf "name=postgres") psql -U postgres -d vanbooking < database/seed.sql

if [ $? -eq 0 ]; then
    echo "✅ ✅ ✅ Database พร้อมใช้งาน! (สมจริง 100%)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔐 Admin Account:"
    echo "   Email: admin@vanbooking.com"
    echo "   Password: password123"
    echo ""
    echo "👤 Test User Accounts:"
    echo "   Email: somchai@gmail.com"
    echo "   Email: somying@gmail.com"
    echo "   Email: prayut@gmail.com"
    echo "   Password: password123 (ทุกบัญชี)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📈 Data Summary:"
    echo "   👥 8 Users (1 admin, 7 users)"
    echo "   🛣️  8 Routes (เส้นทางยอดนิยม)"
    echo "   📍 18 Pickup Points (จุดขึ้นรถ)"
    echo "   📍 18 Dropoff Points (จุดลงรถ)"
    echo "   🚐 8 Vans"
    echo "   📅 17 Schedules"
    echo "   💺 221 Seats (13 seats × 17 schedules)"
    echo "   🎫 8 Sample Bookings (มีจุดขึ้น-ลงรถครบ)"
    echo "   💳 4 Sample Payments"
    echo "   ⭐ 7 Sample Reviews (รีวิวสมจริง)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🎯 สิ่งที่ต่างจากเดิม:"
    echo "   ✅ มีจุดขึ้นรถหลายจุด (pickup_points)"
    echo "   ✅ มีจุดลงรถหลายจุด (dropoff_points)"
    echo "   ✅ ผู้โดยสารเลือกจุดขึ้น-ลงได้"
    echo "   ✅ มี booking_number (BK001, BK002, ...)"
    echo "   ✅ มี special_requests (คำขอพิเศษ)"
    echo "   ✅ ข้อมูลเป็นภาษาไทยทั้งหมด"
    echo "   ✅ รีวิวสมจริงจากผู้ใช้จริง"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "🎉 Setup complete! You can now start the Go backend."
