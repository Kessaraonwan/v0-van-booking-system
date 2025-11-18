const { Review, Booking } = require('../models');

// GET /api/reviews - ดึงรีวิวทั้งหมด (สำหรับแสดงหน้าแรก)
exports.getReviews = async (req, res) => {
  try {
    const { limit = 6, sort = 'latest' } = req.query;
    
    const orderBy = sort === 'latest' 
      ? [['created_at', 'DESC']]
      : [['rating', 'DESC'], ['created_at', 'DESC']];

    const reviews = await Review.findAll({
      where: {
        is_visible: true
      },
      limit: parseInt(limit),
      order: orderBy,
      attributes: [
        'id',
        'user_name',
        'avatar_color',
        'rating',
        'comment',
        'route_name',
        'created_at'
      ]
    });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลรีวิว'
    });
  }
};

// POST /api/reviews - สร้างรีวิวใหม่ (ต้อง login)
exports.createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    const user_id = req.user.id; // จาก middleware auth

    // ตรวจสอบว่า booking นี้เป็นของ user นี้หรือไม่
    const booking = await Booking.findOne({
      where: { id: booking_id, user_id }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลการจอง'
      });
    }

    // ตรวจสอบว่าเดินทางเสร็จแล้วหรือยัง
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'ไม่สามารถรีวิวได้ กรุณารอเดินทางเสร็จก่อน'
      });
    }

    // ตรวจสอบว่ารีวิวแล้วหรือยัง
    const existingReview = await Review.findOne({
      where: { booking_id }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'คุณได้รีวิวการเดินทางนี้แล้ว'
      });
    }

    // สุ่มสี avatar
    const avatarColors = [
      '#EF4444', // red
      '#F59E0B', // orange
      '#10B981', // green
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899'  // pink
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    // สร้างรีวิว
    const review = await Review.create({
      booking_id,
      user_id,
      route_id: booking.route_id,
      rating,
      comment,
      user_name: req.user.name,
      avatar_color: randomColor,
      route_name: `${booking.origin} - ${booking.destination}`
    });

    res.status(201).json({
      success: true,
      message: 'บันทึกรีวิวเรียบร้อยแล้ว',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการบันทึกรีวิว'
    });
  }
};
