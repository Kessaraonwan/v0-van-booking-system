const { Booking, Schedule, Route, Van, Seat, Payment, User } = require('../models');
const { sequelize } = require('../database/connection');

/**
 * Generate booking number (format: BK20240201001)
 */
const generateBookingNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `BK${year}${month}${day}${random}`;
};

/**
 * Create new booking
 * POST /api/bookings/create
 */
exports.createBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      schedule_id,
      seat_numbers, // Array of seat numbers [1, 2, 3]
      passenger_name,
      passenger_phone,
      passenger_email,
      payment_method
    } = req.body;

    const user_id = req.user.id;

    // Validate input
    if (!schedule_id || !seat_numbers || !Array.isArray(seat_numbers) || seat_numbers.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Schedule ID and seat numbers are required'
      });
    }

    if (!passenger_name || !passenger_phone) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Passenger name and phone are required'
      });
    }

    // Get schedule with route info
    const schedule = await Schedule.findByPk(schedule_id, {
      include: [
        {
          model: Route,
          as: 'route'
        },
        {
          model: Van,
          as: 'van'
        }
      ],
      transaction
    });

    if (!schedule) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    if (schedule.status !== 'scheduled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Schedule is not available for booking'
      });
    }

    // Check seat availability
    if (schedule.available_seats < seat_numbers.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    // Check if seats are available
    const seats = await Seat.findAll({
      where: {
        schedule_id,
        seat_number: seat_numbers,
        status: 'available'
      },
      transaction
    });

    if (seats.length !== seat_numbers.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'One or more seats are not available'
      });
    }

    // Calculate total price
    const total_price = schedule.price * seat_numbers.length;

    // Generate booking number
    let booking_number;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      booking_number = generateBookingNumber();
      const existing = await Booking.findOne({
        where: { booking_number },
        transaction
      });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique booking number'
      });
    }

    // Create booking
    const booking = await Booking.create({
      booking_number,
      user_id,
      schedule_id,
      passenger_name,
      passenger_phone,
      passenger_email,
      total_seats: seat_numbers.length,
      seat_numbers,
      total_price,
      status: 'confirmed' // or 'pending' if payment gateway is integrated
    }, { transaction });

    // Update seats
    await Seat.update(
      {
        status: 'booked',
        booking_id: booking.id
      },
      {
        where: {
          schedule_id,
          seat_number: seat_numbers
        },
        transaction
      }
    );

    // Update schedule available seats
    await schedule.decrement('available_seats', {
      by: seat_numbers.length,
      transaction
    });

    // Create payment record
    const payment = await Payment.create({
      booking_id: booking.id,
      amount: total_price,
      payment_method: payment_method || 'cash',
      payment_status: 'pending'
    }, { transaction });

    // Commit transaction
    await transaction.commit();

    // Fetch complete booking with relations
    const completeBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              model: Route,
              as: 'route'
            },
            {
              model: Van,
              as: 'van'
            }
          ]
        },
        {
          model: Payment,
          as: 'payment'
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: completeBooking
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user's bookings
 * GET /api/bookings/my-bookings
 */
exports.getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.query;

    const whereClause = { user_id };
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              model: Route,
              as: 'route'
            },
            {
              model: Van,
              as: 'van'
            }
          ]
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get booking by ID
 * GET /api/bookings/:id
 */
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const booking = await Booking.findOne({
      where: {
        id,
        user_id // Ensure user can only see their own bookings
      },
      include: [
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              model: Route,
              as: 'route'
            },
            {
              model: Van,
              as: 'van'
            }
          ]
        },
        {
          model: Payment,
          as: 'payment'
        },
        {
          model: Seat,
          as: 'seats'
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Cancel booking
 * POST /api/bookings/:id/cancel
 */
exports.cancelBooking = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const user_id = req.user.id;

    // Get booking
    const booking = await Booking.findOne({
      where: {
        id,
        user_id
      },
      include: [
        {
          model: Schedule,
          as: 'schedule'
        }
      ],
      transaction
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelled_at = new Date();
    booking.cancellation_reason = reason || 'Customer cancellation';
    await booking.save({ transaction });

    // Release seats
    await Seat.update(
      {
        status: 'available',
        booking_id: null
      },
      {
        where: {
          booking_id: id
        },
        transaction
      }
    );

    // Update schedule available seats
    await booking.schedule.increment('available_seats', {
      by: booking.total_seats,
      transaction
    });

    // Update payment status if exists
    await Payment.update(
      {
        payment_status: 'refunded',
        refunded_at: new Date()
      },
      {
        where: {
          booking_id: id
        },
        transaction
      }
    );

    await transaction.commit();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
