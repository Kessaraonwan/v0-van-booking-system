# Backend for Frontend Engineering (BEFE) - สรุปเนื้อหาทั้งหมด

## 📋 ภาพรวม
รายวิชานี้สอนการพัฒนา Full-stack Web Application โดยเน้นการสร้าง Backend API ด้วย Go และ Frontend ด้วย React พร้อมทั้ง Authentication, Database Management และ Docker Containerization

---

## 📚 Week 4-6: Go Programming Basics

### Week 4: พื้นฐาน Go
**โฟลเดอร์**: `week4-lab/week4-lab1-4/`

**เนื้อหาที่เรียน**:
- Go syntax และ data types
- Structs และ methods
- Data validation
- Error handling basics

**ตัวอย่างโค้ด**:
```go
type Book struct {
    ID     int
    Title  string
    Author string
    Price  float64
}
```

---

### Week 5: Go Fundamentals
**โฟลเดอร์**: `week5-lab/week5-lab1-3/`

**เนื้อหาที่เรียน**:
- Functions และ parameters
- Slices และ maps
- Pointers
- Interface basics

---

### Week 6: Advanced Go
**โฟลเดอร์**: `week6-lab1/`

**เนื้อหาที่เรียน**:
- Advanced data structures
- Concurrency (goroutines)
- Error handling patterns

---

## 🔧 Week 7-9: REST API Development

### Week 7: Gin Framework & REST API
**โฟลเดอร์**: `week7-lab1/` - `week7-lab4/`

**เนื้อหาที่เรียน**:
- ✅ ติดตั้งและใช้งาน Gin framework
- ✅ สร้าง REST API endpoints
- ✅ HTTP methods (GET, POST, PUT, DELETE)
- ✅ Route parameters และ query strings
- ✅ JSON request/response handling
- ✅ Health check endpoint

**API Endpoints ตัวอย่าง**:
```
GET    /health          - Health check
GET    /books           - ดึงรายการหนังสือทั้งหมด
GET    /books/:id       - ดึงหนังสือตาม ID
POST   /books           - เพิ่มหนังสือใหม่
PUT    /books/:id       - แก้ไขข้อมูลหนังสือ
DELETE /books/:id       - ลบหนังสือ
```

---

### Week 8: Database Integration
**โฟลเดอร์**: `week8-lab1/` - `week8-lab6/`

**เนื้อหาที่เรียน**:
- ✅ เชื่อมต่อ PostgreSQL database
- ✅ CRUD operations กับ database
- ✅ SQL queries (SELECT, INSERT, UPDATE, DELETE)
- ✅ Database connection pooling
- ✅ Error handling สำหรับ database operations
- ✅ Environment variables สำหรับ config

**ตัวอย่างการเชื่อมต่อ Database**:
```go
db, err := sql.Open("postgres", "postgres://user:password@localhost:5432/bookstore")
```

---

### Week 9: API Enhancement & Docker
**โฟลเดอร์**: `week9-lab1/` - `week9-lab3/`

**เนื้อหาที่เรียน**:
- ✅ Error handling แบบ advanced
- ✅ API response structure
- ✅ Docker containerization
- ✅ Docker Compose สำหรับ multi-container apps
- ✅ CORS configuration
- ✅ Nginx reverse proxy

**Docker Compose ตัวอย่าง**:
```yaml
services:
  api:
    build: .
    ports:
      - "8080:8080"
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: bookstore
```

---

## 🎨 Week 9: Frontend Development with React

### MyBookStore - React Application
**โฟลเดอร์**: `week9-lab2/MyBookStore-main/`

**เนื้อหาที่เรียน**:
- ✅ React components และ hooks
- ✅ React Router สำหรับ navigation
- ✅ State management
- ✅ API integration กับ Backend
- ✅ Tailwind CSS styling
- ✅ Responsive design

**Components ที่สร้าง**:
- `Navbar` - Navigation bar
- `Footer` - Footer component
- `BookCard` - แสดงข้อมูลหนังสือ
- `HomePage` - หน้าแรก
- `BookListPage` - รายการหนังสือทั้งหมด
- `LoginPage` - หน้า login
- `ManageBooksPage` - จัดการหนังสือ (Admin)

**Technologies**:
- React 18
- React Router v6
- Tailwind CSS
- Heroicons
- Fetch API

---

## 📖 Week 10: API Documentation

### Week 10 Lab 1: Swagger/OpenAPI Basics
**โฟลเดอร์**: `week10-lab1/`

**เนื้อหาที่เรียน**:
- ✅ OpenAPI Specification (swagger.yaml)
- ✅ API documentation structure
- ✅ ReDoc static HTML
- ✅ API endpoints documentation

---

### Week 10 Lab 2: Swagger Integration with Go
**โฟลเดอร์**: `week10-lab2/`

**เนื้อหาที่เรียน**:
- ✅ Swaggo library (`swag init`)
- ✅ Swagger annotations ใน Go code
- ✅ Auto-generate documentation
- ✅ Swagger UI endpoint

**ตัวอย่าง Annotations**:
```go
// @Summary Get all books
// @Description Get a list of all books
// @Tags books
// @Produce json
// @Success 200 {array} Book
// @Router /books [get]
```

---

### Week 10 Lab 3: Complete API with Docker
**โฟลเดอร์**: `week10-lab3/`

**เนื้อหาที่เรียน**:
- ✅ Complete API documentation
- ✅ Docker integration with Swagger
- ✅ Production-ready documentation

---

## 🗄️ Week 11: Database Migrations & Advanced Features

### Week 11 Lab 1: Database Migrations
**โฟลเดอร์**: `week11-lab1/migrations/`

**เนื้อหาที่เรียน**:
- ✅ Migration scripts (up/down)
- ✅ Schema evolution
- ✅ Seed data scripts
- ✅ Database versioning

**Migration Files**:
- `002_add_book_fields_up.sql` - เพิ่ม columns
- `002_add_book_fields_down.sql` - ลบ columns (rollback)
- `003_seed_books_data.sql` - เพิ่มข้อมูลตัวอย่าง (15 books)

---

### Week 11 Assignment: Complete Bookstore API
**โฟลเดอร์**: `week11-assignment/`

**เนื้อหาที่เรียน**:
- ✅ Categories endpoint
- ✅ Search functionality
- ✅ Featured books
- ✅ New arrivals
- ✅ Discounted books
- ✅ Advanced filtering

**API Endpoints เพิ่มเติม**:
```
GET /books/featured      - หนังสือแนะนำ
GET /books/new           - หนังสือใหม่
GET /books/discounted    - หนังสือลดราคา
GET /books/search?q=...  - ค้นหาหนังสือ
GET /categories          - รายการหมวดหมู่
```

---

## 🔐 Week 12: Authentication & Authorization

### Week 12 Lab 1: Authentication Basics
**โฟลเดอร์**: `week12-lab1/`

**เนื้อหาที่เรียน**:
- ✅ Password hashing (bcrypt)
- ✅ User registration
- ✅ Login endpoint
- ✅ Authentication basics

---

### Week 12 Lab 2: Session-based Authentication
**โฟลเดอร์**: `week12-lab2/`

**เนื้อหาที่เรียน**:
- ✅ HTTP Cookies
- ✅ Session management
- ✅ Session storage
- ✅ Cookie attributes (HttpOnly, Secure, SameSite)

**Cookie Management**:
```go
c.SetCookie("session_id", sessionID, 3600, "/", "", false, true)
```

---

### Week 12 Lab 3: JWT (JSON Web Tokens)
**โฟลเดอร์**: `week12-lab3/`

**เนื้อหาที่เรียน**:
- ✅ JWT structure (Header, Payload, Signature)
- ✅ Token generation
- ✅ Token validation
- ✅ Role-based access control (RBAC)
- ✅ Middleware สำหรับ authentication

**JWT Example**:
```go
token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
    "user_id": userID,
    "role": "admin",
    "exp": time.Now().Add(time.Hour * 24).Unix(),
})
```

**User Tokens**:
- `alice_token.txt` - Alice's JWT token
- `bob_token.txt` - Bob's JWT token

---

### Week 12 Lab 4: Refresh Tokens
**โฟลเดอร์**: `week12-lab4/`

**เนื้อหาที่เรียน**:
- ✅ Access token + Refresh token pattern
- ✅ Token rotation
- ✅ Token revocation
- ✅ Secure token storage
- ✅ Cookie-based token management

**Token Strategy**:
- **Access Token**: อายุสั้น (15 นาที) สำหรับ API calls
- **Refresh Token**: อายุยาว (7 วัน) สำหรับขอ access token ใหม่

**Multiple Cookie Files**:
- `cookies.txt` - User 1 cookies
- `cookies2.txt` - User 2 cookies
- `cookies3.txt` - User 3 cookies

---

## 🐳 Docker & Database Setup

### Bookstore Database
**โฟลเดอร์**: `bookstoredatabase/`

**เนื้อหา**:
- ✅ PostgreSQL setup
- ✅ Docker Compose configuration
- ✅ Database initialization script (`init.sql`)
- ✅ Environment variables

**Database Schema**:
```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    isbn VARCHAR(20),
    published_year INT,
    description TEXT,
    image_url VARCHAR(500),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    discount_percentage INT DEFAULT 0
);
```

---

## 🛠️ เทคโนโลยีที่ใช้ทั้งหมด

### Backend Technologies
| เทคโนโลยี | จุดประสงค์ | Version |
|----------|-----------|---------|
| **Go (Golang)** | ภาษาหลักสำหรับ Backend | 1.20+ |
| **Gin** | Web framework สำหรับสร้าง API | v1.9+ |
| **PostgreSQL** | Relational database | 15 |
| **lib/pq** | PostgreSQL driver for Go | - |
| **Swaggo** | API documentation generator | - |
| **JWT-go** | JWT authentication | v5 |
| **bcrypt** | Password hashing | - |

### Frontend Technologies
| เทคโนโลยี | จุดประสงค์ | Version |
|----------|-----------|---------|
| **React** | UI library | 18 |
| **React Router** | Client-side routing | v6 |
| **Tailwind CSS** | Utility-first CSS framework | v3 |
| **Heroicons** | Icon library | - |
| **Fetch API** | HTTP requests | Native |

### DevOps & Tools
| เทคโนโลยี | จุดประสงค์ |
|----------|-----------|
| **Docker** | Containerization |
| **Docker Compose** | Multi-container orchestration |
| **Nginx** | Reverse proxy |
| **Swagger/OpenAPI** | API documentation |
| **ReDoc** | API documentation viewer |
| **Git** | Version control |

---

## 📝 สิ่งที่เรียนรู้ทั้งหมด (Learning Outcomes)

### 1. Backend Development
- [x] สร้าง REST API ด้วย Go และ Gin framework
- [x] ออกแบบ API endpoints ตาม RESTful principles
- [x] จัดการ HTTP methods (GET, POST, PUT, DELETE)
- [x] Validate request data
- [x] Error handling และ response structure

### 2. Database Management
- [x] เชื่อมต่อและใช้งาน PostgreSQL
- [x] เขียน SQL queries (CRUD operations)
- [x] Database migrations และ schema evolution
- [x] Seed data scripts
- [x] Database connection pooling

### 3. Authentication & Security
- [x] Password hashing ด้วย bcrypt
- [x] Session-based authentication
- [x] JWT (JSON Web Tokens)
- [x] Refresh token pattern
- [x] Role-based access control (RBAC)
- [x] Secure cookie management

### 4. API Documentation
- [x] เขียน OpenAPI Specification (swagger.yaml)
- [x] ใช้ Swaggo สำหรับ auto-generate docs
- [x] Swagger UI integration
- [x] API versioning

### 5. Frontend Development
- [x] สร้าง React application
- [x] Component-based architecture
- [x] React Router สำหรับ navigation
- [x] State management
- [x] API integration กับ Backend
- [x] Styling ด้วย Tailwind CSS

### 6. DevOps & Deployment
- [x] Docker containerization
- [x] Docker Compose สำหรับ multi-container apps
- [x] Environment variables management
- [x] Nginx reverse proxy
- [x] CORS configuration

### 7. Software Engineering Practices
- [x] Project structure และ organization
- [x] Error handling patterns
- [x] Code documentation
- [x] Version control (Git)
- [x] Environment configuration

---

## 🎯 Project Case Study: Bookstore API

ตลอดคอร์สใช้ **Bookstore API** เป็น use case หลักในการเรียนรู้

### Features ที่พัฒนา:

#### 📚 Book Management
- ดูรายการหนังสือทั้งหมด
- ดูรายละเอียดหนังสือ
- เพิ่ม/แก้ไข/ลบหนังสือ (Admin only)
- ค้นหาหนังสือ
- กรองตามหมวดหมู่

#### 🏷️ Special Collections
- หนังสือแนะนำ (Featured books)
- หนังสือใหม่ (New arrivals)
- หนังสือลดราคา (Discounted books)

#### 👤 User Management
- สมัครสมาชิก
- Login/Logout
- Authentication ด้วย JWT
- Role-based access (User/Admin)

#### 📱 Frontend Features
- หน้าแรก (Landing page)
- รายการหนังสือ (Book listing)
- รายละเอียดหนังสือ (Book details)
- หน้า Login
- หน้า Admin (จัดการหนังสือ)
- Responsive design

---

## 📂 โครงสร้างโปรเจกต์มาตรฐาน

```
project/
├── cmd/
│   └── main.go              # Entry point
├── internal/
│   ├── handler/             # HTTP handlers
│   ├── model/               # Data models
│   ├── repository/          # Database layer
│   └── middleware/          # Middleware functions
├── docs/                    # Swagger documentation
├── migrations/              # Database migrations
├── docker-compose.yml       # Docker configuration
├── Dockerfile              # Docker image
├── go.mod                  # Go dependencies
└── README.md               # Project documentation
```

---

## 🚀 การรัน Application

### Backend (Go + Gin)
```bash
# ติดตั้ง dependencies
go mod download

# รัน application
go run main.go

# หรือ build แล้วรัน
go build -o app
./app
```

### Frontend (React)
```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm start

# Build for production
npm run build
```

### Docker
```bash
# รัน ด้วย Docker Compose
docker-compose up -d

# ดู logs
docker-compose logs -f

# หยุดการทำงาน
docker-compose down
```

---

## 🔗 API Endpoints สำคัญ

### Books API
```
GET    /api/books              - ดึงรายการหนังสือทั้งหมด
GET    /api/books/:id          - ดึงหนังสือตาม ID
POST   /api/books              - เพิ่มหนังสือใหม่ (Admin)
PUT    /api/books/:id          - แก้ไขข้อมูลหนังสือ (Admin)
DELETE /api/books/:id          - ลบหนังสือ (Admin)
GET    /api/books/featured     - หนังสือแนะนำ
GET    /api/books/new          - หนังสือใหม่
GET    /api/books/discounted   - หนังสือลดราคา
GET    /api/books/search       - ค้นหาหนังสือ
```

### Authentication API
```
POST   /api/auth/register      - สมัครสมาชิก
POST   /api/auth/login         - Login
POST   /api/auth/logout        - Logout
POST   /api/auth/refresh       - Refresh access token
GET    /api/auth/me            - ดูข้อมูลผู้ใช้ปัจจุบัน
```

### Categories API
```
GET    /api/categories         - ดึงรายการหมวดหมู่ทั้งหมด
```

---

## 🎓 สรุป

คอร์ส Backend for Frontend Engineering นี้ครอบคลุม:

1. **พื้นฐาน Go Programming** - จาก basics จนถึง advanced concepts
2. **REST API Development** - สร้าง API ด้วย Gin framework
3. **Database Management** - PostgreSQL, migrations, และ best practices
4. **Frontend Development** - React application ที่เชื่อมต่อกับ Backend
5. **API Documentation** - Swagger/OpenAPI specification
6. **Authentication & Security** - Session, JWT, และ Refresh tokens
7. **DevOps** - Docker, Docker Compose, และ deployment

**ทักษะที่ได้จากคอร์ส**:
- พัฒนา Full-stack web application ได้เองตั้งแต่ต้นจนจบ
- เข้าใจ RESTful API design principles
- ใช้งาน Database ได้อย่างมีประสิทธิภาพ
- Implement authentication และ authorization
- Deploy application ด้วย Docker
- เขียน API documentation ที่ดี

---

## 📚 Resources

### Official Documentation
- [Go Documentation](https://golang.org/doc/)
- [Gin Web Framework](https://gin-gonic.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)

### Tools
- [Swagger Editor](https://editor.swagger.io/)
- [JWT.io](https://jwt.io/)
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database GUI

---

**หมายเหตุ**: ไฟล์นี้สรุปเนื้อหาทั้งหมดที่เรียนในรายวิชา Backend for Frontend Engineering จากโครงสร้างโปรเจกต์ใน repository นี้

**สร้างเมื่อ**: 24 พฤศจิกายน 2025
