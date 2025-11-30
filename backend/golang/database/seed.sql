-- ================================
-- Van Booking System - Seed Data
-- ================================
-- สร้างข้อมูลตัวอย่างสำหรับทดสอบระบบ

-- ลบข้อมูลเก่าทั้งหมด (เรียงตาม foreign key)
DELETE FROM payments;
DELETE FROM reviews;
DELETE FROM bookings;
DELETE FROM seats;
DELETE FROM schedules;
DELETE FROM vans;
DELETE FROM dropoff_points;
DELETE FROM pickup_points;
DELETE FROM routes;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE routes_id_seq RESTART WITH 1;
ALTER SEQUENCE pickup_points_id_seq RESTART WITH 1;
ALTER SEQUENCE dropoff_points_id_seq RESTART WITH 1;
ALTER SEQUENCE vans_id_seq RESTART WITH 1;
ALTER SEQUENCE schedules_id_seq RESTART WITH 1;
ALTER SEQUENCE seats_id_seq RESTART WITH 1;
ALTER SEQUENCE bookings_id_seq RESTART WITH 1;
ALTER SEQUENCE reviews_id_seq RESTART WITH 1;
ALTER SEQUENCE payments_id_seq RESTART WITH 1;

-- ================================
-- 1. Users (ผู้ใช้)
-- ================================
-- Password ทั้งหมด: "password123"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW
INSERT INTO users (name, email, password, phone, role, created_at, updated_at) VALUES
('ผู้ดูแลระบบ', 'admin@vanbooking.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0812345001', 'admin', NOW(), NOW()),
('สมชาย ใจดี', 'somchai@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0812345678', 'user', NOW(), NOW()),
('สมหญิง รักษ์พงษ์', 'somying@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0823456789', 'user', NOW(), NOW()),
('ประยุทธ์ มั่นคง', 'prayut@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0834567890', 'user', NOW(), NOW()),
('วิภาดา สุขสันต์', 'wiphada@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0845678901', 'user', NOW(), NOW()),
('ณัฐพล ใจกล้า', 'natthaphon@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0856789012', 'user', NOW(), NOW()),
('พิมพ์ใจ สวยงาม', 'pimjai@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0867890123', 'user', NOW(), NOW()),
('ธนากร รวยเงิน', 'thanakorn@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye1J8qCqmJ7qN3YmQqz4Nm0qcE8xqO6qW', '0878901234', 'user', NOW(), NOW());

-- เพิ่มบัญชีทดสอบที่ระบุใน COPILOT_CONTEXT.md (password: password123)
INSERT INTO users (name, email, password, phone, role, created_at, updated_at) VALUES
('เกษรา อ่อนหวาน', 'Kessaraonwan1@gmail.com', '$2a$10$BKLNRGKYM3S6vsKTo/Cd7.KbwyaxhbXqeCv0sZPZjuVL2XSmzrAYa', '0812345678', 'user', NOW(), NOW());

-- ================================
-- 2. Routes (เส้นทาง)
-- ================================
-- เพิ่มคอลัมน์ `duration_minutes`, `distance_km`, และ `image_url` ใน seed เพื่อให้สอดคล้องกับ schema/runtime
INSERT INTO routes (origin, destination, distance, duration, duration_minutes, base_price, distance_km, image_url, created_at, updated_at) VALUES
('กรุงเทพมหานคร', 'เชียงใหม่', 696.5, '09:30:00', 570, 580.00, 696.5, 'https://www.chillpainai.com/src/wewakeup/scoop/images/25bc90fdb9424287e7ae65bb6ede5439bc3bd113.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'ภูเก็ต', 862.0, '12:00:00', 720, 850.00, 862.0, 'https://www.pullmanphuketkaron.com/wp-content/uploads/sites/292/2023/11/Beach-in-Phuket.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'พัทยา', 147.0, '02:30:00', 150, 280.00, 147.0, 'https://img.kapook.com/u/2017/Tanapol/travel/september/pattaya/pattaya1.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'หัวหิน', 199.0, '03:30:00', 210, 350.00, 199.0, 'https://www.chillnaid.com/wp-content/uploads/2018/03/%E0%B8%8A%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%B2%E0%B8%94%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B8%AB%E0%B8%B4%E0%B8%99.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'นครราชสีมา', 259.0, '04:00:00', 240, 380.00, 259.0, 'https://img.wongnai.com/p/1920x0/2019/03/17/c49c7fd11bba4320b2c9a991f7ff0127.jpg', NOW(), NOW()),
('เชียงใหม่', 'เชียงราย', 180.0, '03:00:00', 180, 300.00, 180.0, 'https://www.chillpainai.com/src/wewakeup/scoop/images/22a2b012172165e1e41d55589f75f8408a84b275.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'อยุธยา', 76.0, '01:30:00', 90, 180.00, 76.0, 'https://www.chillpainai.com/src/wewakeup/scoop/images/3b41deda88de099d869e637b9ce3f1ee04d4f3bc.jpg', NOW(), NOW()),
('กรุงเทพมหานคร', 'กาญจนบุรี', 128.0, '02:30:00', 150, 250.00, 128.0, 'https://lh6.googleusercontent.com/lsV5-UG9WZSG9irR9pPnUnE1K6xCIjS7aR4lMh0YfcOYJrL6BTj-08zpqHwHZFkruNj5mJszUGE3uh49mXu1GT5_wuC58e2i9BTl_YdQP3USyEVTyY9YGFvL85Gq6ev8h9hyWIwfSf-ig9vAIKwRwmM', NOW(), NOW());

-- ================================
-- 3. Pickup Points (จุดขึ้นรถ) - สมจริง!
-- ================================

-- Route 1: กรุงเทพ → เชียงใหม่
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(1, 'สถานีขนส่งหมอชิต 2', '99 ถนนกำแพงเพชร 2 จตุจักร กรุงเทพมหานคร 10900', 'ใกล้ BTS หมอชิต', 'https://maps.google.com/?q=13.8104,100.5528', '06:00:00', '092-xxx-xxxx', 1),
(1, 'อนุสาวรีย์ชัยสมรภูมิ', 'ถนนพระราม 5 แยกถนนพหลโยธิน', 'หน้าอนุสาวรีย์', 'https://maps.google.com/?q=13.7633,100.5378', '06:30:00', '092-xxx-xxxx', 2),
(1, 'สายใต้ใหม่', 'เพชรบุรีตัดใหม่ ข้างดินแดง', 'ป้ายรถตู้สายใต้ใหม่', NULL, '07:00:00', '092-xxx-xxxx', 3);

-- Route 2: กรุงเทพ → ภูเก็ต
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(2, 'สถานีขนส่งสายใต้ใหม่', '171 ถนนบรมราชชนนี บางพลัด', 'สถานีขนส่งหลัก', 'https://maps.google.com/?q=13.7851,100.4801', '19:00:00', '093-xxx-xxxx', 1),
(2, 'อนุสาวรีย์ชัยสมรภูมิ', 'ถนนพหลโยธิน', 'หน้าอนุสาวรีย์', NULL, '19:30:00', '093-xxx-xxxx', 2);

-- Route 3: กรุงเทพ → พัทยา
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(3, 'สถานีขนส่งเอกมัย', 'ถนนสุขุมวิท แขวงคลองตันเหนือ', 'ใกล้ BTS เอกมัย', 'https://maps.google.com/?q=13.7307,100.5838', '07:00:00', '094-xxx-xxxx', 1),
(3, 'อนุสาวรีย์ชัยสมรภูมิ', 'ถนนพหลโยธิน', 'หน้าอนุสาวรีย์', NULL, '07:30:00', '094-xxx-xxxx', 2);

-- Route 4: กรุงเทพ → หัวหิน
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(4, 'สถานีขนส่งสายใต้ใหม่', '171 ถนนบรมราชชนนี', 'สถานีขนส่งหลัก', NULL, '08:00:00', '095-xxx-xxxx', 1),
(4, 'โรงพยาบาลพระมงกุฎเกล้า', 'ถนนเพชรบุรีตัดใหม่', 'หน้าโรงพยาบาล', NULL, '08:30:00', '095-xxx-xxxx', 2);

-- Route 5: กรุงเทพ → นครราชสีมา
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(5, 'สถานีขนส่งหมอชิต 2', '99 ถนนกำแพงเพชร 2', 'ใกล้ BTS หมอชิต', NULL, '07:00:00', '096-xxx-xxxx', 1),
(5, 'อนุสาวรีย์ชัยสมรภูมิ', 'ถนนพหลโยธิน', 'หน้าอนุสาวรีย์', NULL, '07:30:00', '096-xxx-xxxx', 2);

-- Route 6: เชียงใหม่ → เชียงราย
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(6, 'สถานีขนส่งอาเขต เชียงใหม่', 'ถนนกาญจนวนิช ช้างเผือก', 'สถานีขนส่งหลักเชียงใหม่', NULL, '08:00:00', '097-xxx-xxxx', 1),
(6, 'เซ็นทรัล เชียงใหม่ แอร์พอร์ต', 'ถนนมหิดล ช้างเผือก', 'หน้าห้างเซ็นทรัล', NULL, '08:30:00', '097-xxx-xxxx', 2);

-- Route 7: กรุงเทพ → อยุธยา
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(7, 'สถานีขนส่งหมอชิต 2', '99 ถนนกำแพงเพชร 2', 'ใกล้ BTS หมอชิต', NULL, '07:00:00', '098-xxx-xxxx', 1),
(7, 'ด่านโทล มอเตอร์เวย์', 'ทางพิเศษเอกมัย-รามอินทรา', 'จุดพักรถหน้าด่านโทล', NULL, '07:30:00', '098-xxx-xxxx', 2);

-- Route 8: กรุงเทพ → กาญจนบุรี
INSERT INTO pickup_points (route_id, name, address, landmark, google_maps_url, pickup_time, contact_phone, display_order) VALUES
(8, 'สถานีขนส่งสายใต้ใหม่', '171 ถนนบรมราชชนนี', 'สถานีขนส่งหลัก', NULL, '08:00:00', '099-xxx-xxxx', 1),
(8, 'เซ็นทรัล ปิ่นเกล้า', 'ถนนบรมราชชนนี', 'หน้าห้างเซ็นทรัล', NULL, '08:30:00', '099-xxx-xxxx', 2);

-- ================================
-- 4. Dropoff Points (จุดลงรถ) - สมจริง!
-- ================================

-- Route 1: กรุงเทพ → เชียงใหม่
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(1, 'สถานีขนส่งอาเขต เชียงใหม่', 'ถนนกาญจนวนิช ช้างเผือก', 'สถานีขนส่งหลักเชียงใหม่', NULL, '16:30:00', '092-xxx-xxxx', 1),
(1, 'เซ็นทรัล เชียงใหม่ แอร์พอร์ต', 'ถนนมหิดล', 'หน้าห้างเซ็นทรัล', NULL, '17:00:00', '092-xxx-xxxx', 2),
(1, 'ประตูท่าแพ', 'ถนนท่าแพ ช้างม่อย', 'ใจกลางเมืองเก่า', NULL, '17:30:00', '092-xxx-xxxx', 3);

-- Route 2: กรุงเทพ → ภูเก็ต
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(2, 'สถานีขนส่งภูเก็ต', 'ถนนพังงา ตำบลตลาดใหญ่', 'สถานีขนส่งหลักภูเก็ต', NULL, '07:00:00', '093-xxx-xxxx', 1),
(2, 'หาดป่าตอง', 'ถนนทวีวงศ์ ป่าตอง กะทู้', 'ใกล้ชายหาด', NULL, '07:30:00', '093-xxx-xxxx', 2),
(2, 'หาดกะตะ', 'ถนนกะตะ เมืองภูเก็ต', 'ริมชายหาด', NULL, '08:00:00', '093-xxx-xxxx', 3);

-- Route 3: กรุงเทพ → พัทยา
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(3, 'พัทยาเหนือ', 'ถนนพัทยาเหนือ', 'หน้าเซ็นทรัล พัทยา', NULL, '09:30:00', '094-xxx-xxxx', 1),
(3, 'พัทยากลาง', 'ถนนพัทยาสาย 2', 'ตรงข้าม Big C', NULL, '10:00:00', '094-xxx-xxxx', 2),
(3, 'พัทยาใต้-จอมเทียน', 'ถนนจอมเทียน', 'ใกล้หาดจอมเทียน', NULL, '10:30:00', '094-xxx-xxxx', 3);

-- Route 4: กรุงเทพ → หัวหิน
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(4, 'หัวหิน ตัวเมือง', 'ถนนเพชรเกษม ใกล้ตลาดฉัตรไชย', 'ใจกลางหัวหิน', NULL, '11:30:00', '095-xxx-xxxx', 1),
(4, 'บลูพอร์ต หัวหิน', 'ถนนเพชรเกษม', 'หน้าบลูพอร์ต', NULL, '12:00:00', '095-xxx-xxxx', 2);

-- Route 5: กรุงเทพ → นครราชสีมา
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(5, 'เทอมินอล 21 โคราช', 'ถนนมิตรภาพ', 'หน้าห้าง Terminal 21', NULL, '11:00:00', '096-xxx-xxxx', 1),
(5, 'ประตูชุมพล', 'ถนนชุมพล ใจกลางเมือง', 'จุดสังเกตประตูชุมพล', NULL, '11:30:00', '096-xxx-xxxx', 2);

-- Route 6: เชียงใหม่ → เชียงราย
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(6, 'สถานีขนส่งเชียงราย', 'ถนนประสาทราษฎร์', 'สถานีขนส่งหลัก', NULL, '11:00:00', '097-xxx-xxxx', 1),
(6, 'หอนาฬิกา เชียงราย', 'ถนนพหลโยธิน ใจกลางเมือง', 'จุดสังเกตหอนาฬิกา', NULL, '11:30:00', '097-xxx-xxxx', 2);

-- Route 7: กรุงเทพ → อยุธยา
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(7, 'ตลาดโต้รุ่ง อยุธยา', 'ถนนจิกสี ใจกลางเมือง', 'ตลาดโต้รุ่ง', NULL, '08:30:00', '098-xxx-xxxx', 1),
(7, 'วัดมหาธาตุ', 'ถนนเจ้าพ่อ', 'ใกล้วัดมหาธาตุ', NULL, '08:45:00', '098-xxx-xxxx', 2);

-- Route 8: กรุงเทพ → กาญจนบุรี
INSERT INTO dropoff_points (route_id, name, address, landmark, google_maps_url, estimated_arrival, contact_phone, display_order) VALUES
(8, 'แก่งทองปาร์ค กาญจนบุรี', 'ถนนแสงชูโต', 'หน้าแก่งทองปาร์ค', NULL, '10:30:00', '099-xxx-xxxx', 1),
(8, 'สะพานข้ามแม่น้ำแคว', 'ถนนแม่น้ำแคว', 'จุดท่องเที่ยวสะพานข้ามแม่น้ำแคว', NULL, '11:00:00', '099-xxx-xxxx', 2);

-- ================================
-- 5. Vans (รถตู้)
-- ================================
INSERT INTO vans (van_number, license_plate, driver, total_seats, status, created_at, updated_at) VALUES
('VAN001', 'กก-1234 กรุงเทพ', 'สมศักดิ์ ขับรถดี', 13, 'active', NOW(), NOW()),
('VAN002', 'กข-5678 กรุงเทพ', 'สมพงษ์ มั่นคง', 13, 'active', NOW(), NOW()),
('VAN003', 'กค-9012 กรุงเทพ', 'สมบูรณ์ ใจเย็น', 13, 'active', NOW(), NOW()),
('VAN004', 'กง-3456 เชียงใหม่', 'สมหมาย ปลอดภัย', 13, 'active', NOW(), NOW()),
('VAN005', 'กจ-7890 กรุงเทพ', 'สมชาติ ซื่อสัตย์', 13, 'active', NOW(), NOW()),
('VAN006', 'กฉ-2468 ภูเก็ต', 'สมศรี รักสะอาด', 13, 'active', NOW(), NOW()),
('VAN007', 'กช-1357 กรุงเทพ', 'สมนึก ใส่ใจ', 13, 'maintenance', NOW(), NOW()),
('VAN008', 'กซ-9753 กรุงเทพ', 'สมหวัง เจริญ', 13, 'active', NOW(), NOW());

-- ================================
-- 4. Schedules (ตารางเวลา)
-- ================================
-- วันนี้และพรุ่งนี้
-- สร้าง schedules ให้เริ่มต้นในอนาคต (เลื่อนออกไป 7 วัน) เพื่อให้ data ตัวอย่างเป็นวันข้างหน้า
-- Base start: CURRENT_DATE + 7 days
INSERT INTO schedules (route_id, van_id, departure_time, arrival_time, price, available_seats, status, created_at, updated_at) VALUES
-- กรุงเทพ - เชียงใหม่ (วันเริ่มต้น + 2h, +6h)  และ วันถัดไป
(1, 1, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '2 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '11 hours 30 minutes', 550.00, 13, 'active', NOW(), NOW()),
(1, 2, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '6 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '15 hours 30 minutes', 550.00, 13, 'active', NOW(), NOW()),
-- กรุงเทพ - เชียงใหม่ (วันถัดไป)
(1, 1, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '8 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '17 hours 30 minutes', 550.00, 13, 'active', NOW(), NOW()),
(1, 3, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '14 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '23 hours 30 minutes', 550.00, 13, 'active', NOW(), NOW()),

-- กรุงเทพ - ภูเก็ต (วันเริ่มต้น และ วันถัดไป)
(2, 6, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '3 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '15 hours', 750.00, 13, 'active', NOW(), NOW()),
(2, 6, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '9 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '21 hours', 750.00, 13, 'active', NOW(), NOW()),

-- กรุงเทพ - พัทยา (วันเริ่มต้น และ วันถัดไป)
(3, 5, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '1 hour', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '3 hours 30 minutes', 250.00, 13, 'active', NOW(), NOW()),
(3, 8, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '4 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '6 hours 30 minutes', 250.00, 13, 'active', NOW(), NOW()),
(3, 5, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '7 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '9 hours 30 minutes', 250.00, 13, 'active', NOW(), NOW()),
(3, 8, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '16 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '18 hours 30 minutes', 250.00, 13, 'active', NOW(), NOW()),

-- กรุงเทพ - หัวหิน (วันเริ่มต้น และ วันถัดไป)
(4, 4, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '2 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '5 hours 30 minutes', 300.00, 13, 'active', NOW(), NOW()),
(4, 4, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '10 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '13 hours 30 minutes', 300.00, 13, 'active', NOW(), NOW()),

-- กรุงเทพ - นครราชสีมา (วันเริ่มต้น และ วันถัดไป)
(5, 2, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '5 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '9 hours', 350.00, 13, 'active', NOW(), NOW()),
(5, 3, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '11 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '15 hours', 350.00, 13, 'active', NOW(), NOW()),

-- กรุงเทพ - อยุธยา (วันเริ่มต้น และ วันถัดไป)
(7, 8, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '30 minutes', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '2 hours', 150.00, 13, 'active', NOW(), NOW()),
(7, 5, (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '3 hours', (CURRENT_DATE + INTERVAL '7 days') + INTERVAL '4 hours 30 minutes', 150.00, 13, 'active', NOW(), NOW()),
(7, 8, (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '6 hours', (CURRENT_DATE + INTERVAL '8 days') + INTERVAL '7 hours 30 minutes', 150.00, 13, 'active', NOW(), NOW());

-- ================================
-- 5. Seats (ที่นั่ง) - สร้างให้ทุก Schedule
-- ================================
-- สร้างที่นั่ง 13 ที่สำหรับแต่ละ schedule (schedule_id 1-17)
DO $$
DECLARE
    schedule_record RECORD;
    seat_num INT;
BEGIN
    FOR schedule_record IN SELECT id FROM schedules LOOP
        FOR seat_num IN 1..13 LOOP
            INSERT INTO seats (schedule_id, seat_number, status, booking_id, created_at, updated_at)
            VALUES (schedule_record.id, seat_num, 'available', NULL, NOW(), NOW());
        END LOOP;
    END LOOP;
END $$;

-- ================================
-- 6. Sample Bookings (ตัวอย่างการจอง) - มีจุดขึ้น-ลงรถ!
-- ================================
INSERT INTO bookings (user_id, schedule_id, seat_number, passenger_name, passenger_phone, passenger_email, pickup_point_id, dropoff_point_id, special_requests, booking_status, total_price, booking_number, created_at, updated_at) VALUES
-- Schedule 1: กรุงเทพ-เชียงใหม่ (คน 2 คนขึ้นจุดต่างกัน)
(2, 1, 1, 'สมชาย ใจดี', '0812345678', 'somchai@gmail.com', 1, 1, 'ขอนั่งแถวหน้าครับ', 'confirmed', 580.00, 'BK001', NOW(), NOW()),
(3, 1, 2, 'สมหญิง รักษ์พงษ์', '0823456789', 'somying@gmail.com', 2, 2, NULL, 'confirmed', 580.00, 'BK002', NOW(), NOW()),
-- Schedule 3: กรุงเทพ-เชียงใหม่ (พรุ่งนี้ เวลา +32 ชม)
(4, 3, 5, 'ประยุทธ์ มั่นคง', '0834567890', 'prayut@gmail.com', 1, 3, 'กรุณาปลุกตื่นตอนถึง', 'pending', 580.00, 'BK003', NOW(), NOW()),
-- Schedule 7: กรุงเทพ-พัทยา (วันนี้ คู่รักไปเที่ยว)
(5, 7, 3, 'วิภาดา สุขสันต์', '0845678901', 'wiphada@gmail.com', 7, 10, 'ไปกับแฟน ขอนั่งข้างกัน', 'confirmed', 280.00, 'BK004', NOW(), NOW()),
(6, 7, 4, 'ณัฐพล ใจกล้า', '0856789012', 'natthaphon@gmail.com', 7, 10, NULL, 'confirmed', 280.00, 'BK005', NOW(), NOW()),
-- Schedule 11: กรุงเทพ-หัวหิน (คนเดียว ไปพักผ่อน)
(7, 11, 7, 'พิมพ์ใจ สวยงาม', '0867890123', 'pimjai@gmail.com', 11, 13, 'มีกระเป๋าใหญ่ ขอฝากใต้รถ', 'pending', 350.00, 'BK006', NOW(), NOW()),
-- Schedule 7: กรุงเทพ-พัทยา อีก 2 ที่นั่ง (เพื่อนไปด้วยกัน)
(8, 7, 5, 'ธนากร รวยเงิน', '0878901234', 'thanakorn@gmail.com', 8, 11, 'ไปประชุมธุรกิจ', 'confirmed', 280.00, 'BK007', NOW(), NOW()),
(2, 7, 6, 'สมชาย ใจดี', '0812345678', 'somchai@gmail.com', 8, 11, NULL, 'confirmed', 280.00, 'BK008', NOW(), NOW());

-- อัพเดทที่นั่งที่ถูกจองแล้ว
UPDATE seats SET status = 'booked', booking_id = 1 WHERE schedule_id = 1 AND seat_number = 1;
UPDATE seats SET status = 'booked', booking_id = 2 WHERE schedule_id = 1 AND seat_number = 2;
UPDATE seats SET status = 'booked', booking_id = 3 WHERE schedule_id = 3 AND seat_number = 5;
UPDATE seats SET status = 'booked', booking_id = 4 WHERE schedule_id = 7 AND seat_number = 3;
UPDATE seats SET status = 'booked', booking_id = 5 WHERE schedule_id = 7 AND seat_number = 4;
UPDATE seats SET status = 'booked', booking_id = 6 WHERE schedule_id = 11 AND seat_number = 7;
UPDATE seats SET status = 'booked', booking_id = 7 WHERE schedule_id = 7 AND seat_number = 5;
UPDATE seats SET status = 'booked', booking_id = 8 WHERE schedule_id = 7 AND seat_number = 6;

-- อัพเดท available_seats ของ schedules
UPDATE schedules SET available_seats = 11 WHERE id = 1;  -- จอง 2 ที่
UPDATE schedules SET available_seats = 12 WHERE id = 3;  -- จอง 1 ที่
UPDATE schedules SET available_seats = 9 WHERE id = 7;   -- จอง 4 ที่ (คู่รัก + เพื่อน 2 คน)
UPDATE schedules SET available_seats = 12 WHERE id = 11; -- จอง 1 ที่

-- ================================
-- 7. Payments (ตัวอย่างการชำระเงิน)
-- ================================
INSERT INTO payments (booking_id, payment_method, payment_status, amount, payment_date, created_at, updated_at) VALUES
(1, 'credit_card', 'completed', 550.00, NOW(), NOW(), NOW()),
(2, 'promptpay', 'completed', 550.00, NOW(), NOW(), NOW()),
(4, 'cash', 'completed', 250.00, NOW(), NOW(), NOW()),
(5, 'credit_card', 'completed', 250.00, NOW(), NOW(), NOW());

-- ================================
-- 8. Reviews (รีวิว) - สมจริงจากประสบการณ์จริง
-- ================================
INSERT INTO reviews (user_id, route_id, rating, comment, created_at, updated_at) VALUES
(2, 1, 5, 'ไปเชียงใหม่กับครอบครัว ขึ้นที่หมอชิตตรงเวลามาก รถสะอาด พนักงานบริการดี คนขับระมัดระวัง แวะพัก 2 ครั้ง ถึงเชียงใหม่ไม่เหนื่อยเลย แนะนำเลยครับ 👍', NOW(), NOW()),
(3, 1, 4, 'โดยรวมดีมากค่ะ แต่น่าจะมี WiFi บนรถด้วยจะดียิ่งขึ้น แล้วก็อยากให้มีน้ำดื่มแจกบริการด้วยน้า', NOW(), NOW()),
(5, 3, 5, 'ไปพัทยาวันเสาร์-อาทิตย์กับแฟน ขึ้นที่เอกมัยสะดวกมาก ลงที่พัทยากลางก็ใกล้โรงแรม รถใหม่มาก แอร์เย็นฉ่ำ เดินทางสบายดี แนะนำค่า 💕', NOW(), NOW()),
(7, 4, 4, 'ไปพักผ่อนที่หัวหินคนเดียว บรรยากาศดี ขับปลอดภัย ถึงตรงเวลา แต่ถ้ามีบริการรับส่งถึงโรงแรมจะดีมาก', NOW(), NOW()),
(2, 7, 5, 'พาครอบครัวไปเที่ยวอยุธยาวันเดียวกลับ บริการเยี่ยมมากครับ คนขับอธิบายประวัติศาสตร์ให้ฟังด้วย ประทับใจมากๆ', NOW(), NOW()),
(8, 3, 5, 'ไปประชุมที่พัทยา ใช้บริการบ่อยมากเพราะสะดวกดี ไม่ต้องขับรถเอง ประหยัดค่าน้ำมัน แถมทำงานในรถได้ด้วย ดีครับ', NOW(), NOW()),
(4, 1, 5, 'ครั้งแรกที่ลองนั่งรถตู้ไกลๆ กังวลตอนแรกว่าจะเมื่อยมั้ย แต่สบายมากจริงๆ ที่นั่งนุ่ม มีที่วางเท้า แวะพักกินข้าวระหว่างทาง ชอบมากเลยครับ แนะนำ 100%', NOW(), NOW());

-- ================================
-- สรุปข้อมูลที่สร้าง
-- ================================
-- จำนวนข้อมูล:
SELECT 
    'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Routes', COUNT(*) FROM routes
UNION ALL
SELECT 'Pickup Points', COUNT(*) FROM pickup_points
UNION ALL
SELECT 'Dropoff Points', COUNT(*) FROM dropoff_points
UNION ALL
SELECT 'Vans', COUNT(*) FROM vans
UNION ALL
SELECT 'Schedules', COUNT(*) FROM schedules
UNION ALL
SELECT 'Seats', COUNT(*) FROM seats
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews;

-- แสดงข้อความสำเร็จ
SELECT 
    '✅ ✅ ✅ Seed data สมจริงถูกสร้างเรียบร้อย!' as status,
    '🔐 Admin: admin@vanbooking.com / password123' as admin,
    '👤 User: somchai@gmail.com / password123' as test_user,
    '📍 มีจุดขึ้น-ลงรถครบทุกเส้นทาง!' as pickup_dropoff,
    '💼 การจองมีข้อมูลสมจริง (ชื่อ, เบอร์, อีเมล, คำขอพิเศษ)' as booking_detail;
