# 📝 TODO: Frontend API Integration

## 🎯 จุดประสงค์
แก้ไข Frontend ให้เรียกใช้ Backend API จริง แทนการใช้ mock data

---

## ✅ สิ่งที่มีพร้อมแล้ว

- ✅ Backend API พร้อมใช้งาน (http://localhost:8000)
- ✅ API Client (`lib/api-client.js`) พร้อมใช้
- ✅ UI Components สำเร็จหมดแล้ว
- ✅ Design System พร้อม

---

## 📋 Task List (ต้องทำ 10 ไฟล์)

### 1. 🔐 Authentication Pages

#### `pages/login.jsx`
- [ ] Import `authAPI` from `@/lib/api-client`
- [ ] แก้ไข `handleLogin` function:
  ```javascript
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await authAPI.login({ email, password });
      // redirect to home or dashboard
      router.push('/');
    } catch (error) {
      // show error message
    }
  };
  ```
- [ ] เพิ่ม loading state
- [ ] เพิ่ม error handling

#### `pages/register.jsx`
- [ ] Import `authAPI` from `@/lib/api-client`
- [ ] แก้ไข `handleRegister` function:
  ```javascript
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await authAPI.register({
        email,
        password,
        full_name,
        phone
      });
      router.push('/');
    } catch (error) {
      // show error
    }
  };
  ```
- [ ] เพิ่ม loading state
- [ ] เพิ่ม error handling

---

### 2. 🔍 Search & Booking Flow

#### `pages/search.jsx`
- [ ] Import `scheduleAPI` from `@/lib/api-client`
- [ ] ใช้ `useRouter()` เพื่ออ่าน query params
- [ ] เพิ่ม `useEffect` เพื่อ fetch data:
  ```javascript
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const result = await scheduleAPI.search({
          from: router.query.from,
          to: router.query.to,
          date: router.query.date
        });
        setSchedules(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    if (router.query.from) {
      fetchSchedules();
    }
  }, [router.query]);
  ```
- [ ] ลบ mock data ออก
- [ ] เพิ่ม loading state
- [ ] เพิ่ม empty state (ไม่มีรอบรถ)

#### `pages/seats/[id].jsx`
- [ ] Import `scheduleAPI` และ `bookingAPI`
- [ ] ใช้ `router.query.id` เพื่อ fetch schedule และ seats:
  ```javascript
  useEffect(() => {
    const fetchData = async () => {
      const scheduleResult = await scheduleAPI.getById(router.query.id);
      const seatsResult = await scheduleAPI.getSeats(router.query.id);
      
      setSchedule(scheduleResult.data);
      setSeats(seatsResult.data);
    };
    
    if (router.query.id) {
      fetchData();
    }
  }, [router.query.id]);
  ```
- [ ] แก้ไข `handleConfirm` function:
  ```javascript
  const handleConfirm = async () => {
    try {
      const result = await bookingAPI.create({
        schedule_id: router.query.id,
        seat_numbers: selectedSeats,
        passenger_name: name,
        passenger_phone: phone,
        passenger_email: email,
        payment_method: 'cash'
      });
      
      router.push(`/success?booking=${result.data.booking_number}`);
    } catch (error) {
      // show error
    }
  };
  ```
- [ ] ลบ mock data
- [ ] เพิ่ม loading state

#### `pages/confirm.jsx`
- [ ] รับข้อมูลจาก router.query แทน localStorage
- [ ] หรือสร้าง booking ตรงนี้เลย (ขึ้นอยู่กับ flow)

#### `pages/success.jsx`
- [ ] รับ `booking_number` จาก `router.query.booking`
- [ ] (Optional) Fetch booking details เพื่อแสดงข้อมูลเต็ม

---

### 3. 📋 User Bookings

#### `pages/bookings.jsx`
- [ ] Import `bookingAPI` from `@/lib/api-client`
- [ ] เพิ่ม authentication check:
  ```javascript
  useEffect(() => {
    const user = getUser(); // from api-client
    if (!user) {
      router.push('/login');
      return;
    }
  }, []);
  ```
- [ ] Fetch bookings:
  ```javascript
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const result = await bookingAPI.getMyBookings(activeTab);
        setBookings(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchBookings();
  }, [activeTab]);
  ```
- [ ] ลบ mock data
- [ ] เพิ่ม loading state

#### `pages/booking-detail/[id].jsx`
- [ ] Import `bookingAPI`
- [ ] Fetch booking by ID:
  ```javascript
  useEffect(() => {
    const fetchBooking = async () => {
      const result = await bookingAPI.getById(router.query.id);
      setBooking(result.data);
    };
    
    if (router.query.id) {
      fetchBooking();
    }
  }, [router.query.id]);
  ```
- [ ] เพิ่ม Cancel booking function:
  ```javascript
  const handleCancel = async () => {
    await bookingAPI.cancel(router.query.id, reason);
    router.push('/bookings');
  };
  ```

---

### 4. 👨‍💼 Admin Pages

#### `pages/admin/dashboard.jsx`
- [ ] Import `adminAPI` from `@/lib/api-client`
- [ ] เพิ่ม admin authentication check:
  ```javascript
  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
  }, []);
  ```
- [ ] Fetch dashboard data:
  ```javascript
  useEffect(() => {
    const fetchData = async () => {
      const stats = await adminAPI.getDashboardStats();
      const schedules = await adminAPI.getTodaySchedules();
      const bookings = await adminAPI.getRecentBookings(10);
      
      setStats(stats.data);
      setTodaySchedules(schedules.data);
      setRecentBookings(bookings.data);
    };
    
    fetchData();
  }, []);
  ```
- [ ] ลบ mock data
- [ ] เพิ่ม loading state

#### `pages/admin/bookings.jsx`
- [ ] Import `adminAPI`
- [ ] Fetch all bookings with pagination:
  ```javascript
  const fetchBookings = async (page = 1) => {
    const result = await adminAPI.getAllBookings({
      page,
      limit: 20,
      status: filterStatus
    });
    
    setBookings(result.data);
    setPagination(result.pagination);
  };
  ```
- [ ] เพิ่ม filter functionality
- [ ] เพิ่ม pagination

#### `pages/admin/schedules.jsx`
- [ ] Import `adminAPI`
- [ ] Fetch schedules:
  ```javascript
  const fetchSchedules = async () => {
    const result = await adminAPI.getAllSchedules();
    setSchedules(result.data);
  };
  ```
- [ ] เพิ่ม Create schedule form:
  ```javascript
  const handleCreate = async (data) => {
    await adminAPI.createSchedule(data);
    fetchSchedules(); // refresh list
  };
  ```
- [ ] เพิ่ม Edit/Delete functions

#### `pages/admin/vans.jsx`
- [ ] Import `adminAPI`
- [ ] Fetch vans:
  ```javascript
  const fetchVans = async () => {
    const result = await adminAPI.getAllVans();
    setVans(result.data);
  };
  ```
- [ ] เพิ่ม CRUD operations

#### `pages/admin/routes.jsx`
- [ ] Import `adminAPI`
- [ ] Fetch routes:
  ```javascript
  const fetchRoutes = async () => {
    const result = await adminAPI.getAllRoutes();
    setRoutes(result.data);
  };
  ```
- [ ] เพิ่ม CRUD operations

#### `pages/admin/login.jsx`
- [ ] เหมือน `pages/login.jsx` แต่เช็ค role เป็น admin
- [ ] Redirect ไป `/admin/dashboard` เมื่อ login สำเร็จ

---

## 🔧 Common Tasks (ทุกไฟล์)

### Loading States
```javascript
const [loading, setLoading] = useState(false);

// ใน fetch function
setLoading(true);
try {
  // fetch data
} finally {
  setLoading(false);
}

// ใน JSX
{loading ? <LoadingSpinner /> : <Content />}
```

### Error Handling
```javascript
const [error, setError] = useState(null);

try {
  // fetch data
} catch (err) {
  setError(err.message);
  // หรือใช้ toast notification
}

// ใน JSX
{error && <ErrorMessage message={error} />}
```

### Authentication Check
```javascript
import { getUser, getToken } from '@/lib/api-client';

useEffect(() => {
  const token = getToken();
  if (!token) {
    router.push('/login');
  }
}, []);
```

---

## 📊 Progress Tracking

### Authentication (2 files)
- [ ] `pages/login.jsx`
- [ ] `pages/register.jsx`

### Booking Flow (5 files)
- [ ] `pages/search.jsx`
- [ ] `pages/seats/[id].jsx`
- [ ] `pages/confirm.jsx` (optional)
- [ ] `pages/success.jsx`
- [ ] `pages/bookings.jsx`
- [ ] `pages/booking-detail/[id].jsx`

### Admin (6 files)
- [ ] `pages/admin/login.jsx`
- [ ] `pages/admin/dashboard.jsx`
- [ ] `pages/admin/bookings.jsx`
- [ ] `pages/admin/schedules.jsx`
- [ ] `pages/admin/vans.jsx`
- [ ] `pages/admin/routes.jsx`

**รวม: 13 files ต้องแก้ไข**

---

## 🎯 แนวทางการทำ

### Day 1: Authentication & Basic Flow
1. แก้ `login.jsx` และ `register.jsx`
2. แก้ `search.jsx` (ค้นหารอบรถ)
3. แก้ `seats/[id].jsx` (เลือกที่นั่ง)
4. ทดสอบ flow จาก login → search → select seats → book

### Day 2: User Features
5. แก้ `bookings.jsx` (ดูการจอง)
6. แก้ `booking-detail/[id].jsx` (รายละเอียด + ยกเลิก)
7. ทดสอบ user features ครบ

### Day 3: Admin Features
8. แก้ `admin/login.jsx`
9. แก้ `admin/dashboard.jsx`
10. แก้ `admin/bookings.jsx`
11. ทดสอบ admin features

### Day 4: Admin CRUD
12. แก้ `admin/schedules.jsx`
13. แก้ `admin/vans.jsx`
14. แก้ `admin/routes.jsx`
15. ทดสอบ CRUD operations

---

## 🧪 Testing Checklist

### User Flow
- [ ] Register → Login
- [ ] Search schedules
- [ ] Select seats
- [ ] Create booking
- [ ] View bookings
- [ ] Cancel booking

### Admin Flow
- [ ] Admin login
- [ ] View dashboard
- [ ] Create schedule
- [ ] Create van
- [ ] Create route
- [ ] View all bookings
- [ ] Update booking status

---

## 💡 Tips

1. **เริ่มจากง่ายไปยาก**: Login → Search → Booking → Admin
2. **ทดสอบทีละหน้า**: แก้เสร็จ 1 หน้า ทดสอบให้ work ก่อนไปต่อ
3. **ใช้ Console**: `console.log(result)` เพื่อดู response structure
4. **Error Handling**: อย่าลืมจัดการ error ทุกที่
5. **Loading States**: ต้องมี loading ขณะ fetch data
6. **Token Management**: API client จัดการให้อัตโนมัติแล้ว

---

## 📚 References

- **API Client**: `lib/api-client.js`
- **Backend API Docs**: `backend/nodejs/README.md`
- **Quick Start**: `QUICKSTART.md`

---

**Start Date**: TBD  
**Estimated Time**: 2-3 days  
**Difficulty**: Medium  
**Priority**: High 🔥
