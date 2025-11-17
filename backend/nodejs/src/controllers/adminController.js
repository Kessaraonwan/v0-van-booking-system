const { Schedule, Route, Van, Booking, Payment, User, Seat } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../database/connection');

/**
 * Get dashboard statistics
 * GET /api/admin/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today's bookings count
    const todayBookingsCount = await Booking.count({
      where: {
        created_at: {
          [Op.gte]: new Date(today)
        }
      }
    });

    // Today's total passengers
    const todayPassengers = await Booking.sum('total_seats', {
      where: {
        created_at: {
          [Op.gte]: new Date(today)
        },
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    }) || 0;

    // Today's trips
    const todayTrips = await Schedule.count({
      where: {
        departure_date: today,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    // Total revenue (all time)
    const totalRevenue = await Payment.sum('amount', {
      where: {
        payment_status: 'paid'
      }
    }) || 0;

    // Today's revenue
    const todayRevenue = await Payment.sum('amount', {
      where: {
        payment_status: 'paid',
        paid_at: {
          [Op.gte]: new Date(today)
        }
      }
    }) || 0;

    res.json({
      success: true,
      data: {
        today: {
          bookings: todayBookingsCount,
          passengers: todayPassengers,
          trips: todayTrips,
          revenue: todayRevenue
        },
        total: {
          revenue: totalRevenue
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get today's schedules
 * GET /api/admin/dashboard/today-schedules
 */
exports.getTodaySchedules = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const schedules = await Schedule.findAll({
      where: {
        departure_date: today
      },
      include: [
        {
          model: Route,
          as: 'route'
        },
        {
          model: Van,
          as: 'van'
        },
        {
          model: Booking,
          as: 'bookings',
          where: {
            status: {
              [Op.notIn]: ['cancelled']
            }
          },
          required: false
        }
      ],
      order: [['departure_time', 'ASC']]
    });

    // Calculate passengers for each schedule
    const schedulesWithPassengers = schedules.map(schedule => {
      const totalPassengers = schedule.bookings.reduce((sum, booking) => {
        return sum + booking.total_seats;
      }, 0);

      return {
        ...schedule.toJSON(),
        total_passengers: totalPassengers
      };
    });

    res.json({
      success: true,
      data: schedulesWithPassengers,
      count: schedulesWithPassengers.length
    });
  } catch (error) {
    console.error('Get today schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get today schedules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get recent bookings
 * GET /api/admin/dashboard/recent-bookings?limit=10
 */
exports.getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
        {
          model: Schedule,
          as: 'schedule',
          include: [
            {
              model: Route,
              as: 'route'
            }
          ]
        },
        {
          model: Payment,
          as: 'payment'
        }
      ],
      order: [['created_at', 'DESC']],
      limit
    });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recent bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all bookings with filters
 * GET /api/admin/bookings?status=confirmed&page=1&limit=20
 */
exports.getAllBookings = async (req, res) => {
  try {
    const {
      status,
      from_date,
      to_date,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (from_date && to_date) {
      whereClause.created_at = {
        [Op.between]: [new Date(from_date), new Date(to_date)]
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { booking_number: { [Op.iLike]: `%${search}%` } },
        { passenger_name: { [Op.iLike]: `%${search}%` } },
        { passenger_phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (page - 1) * limit;

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'full_name', 'email', 'phone']
        },
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
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get booking details
 * GET /api/admin/bookings/:id
 */
exports.getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] }
        },
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
    console.error('Get booking details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update booking status
 * PUT /api/admin/bookings/:id/status
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    booking.status = status;
    if (status === 'cancelled') {
      booking.cancelled_at = new Date();
    }
    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated',
      data: booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all schedules
 * GET /api/admin/schedules?page=1&limit=20
 */
exports.getAllSchedules = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, from_date, to_date } = req.query;
    const whereClause = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (from_date && to_date) {
      whereClause.departure_date = {
        [Op.between]: [from_date, to_date]
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: schedules } = await Schedule.findAndCountAll({
      where: whereClause,
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
      order: [['departure_date', 'DESC'], ['departure_time', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      success: true,
      data: schedules,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create schedule
 * POST /api/admin/schedules
 */
exports.createSchedule = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { route_id, van_id, departure_date, departure_time, price } = req.body;

    if (!route_id || !van_id || !departure_date || !departure_time || !price) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if route and van exist
    const route = await Route.findByPk(route_id);
    const van = await Van.findByPk(van_id);

    if (!route || !van) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Route or Van not found'
      });
    }

    // Create schedule
    const schedule = await Schedule.create({
      route_id,
      van_id,
      departure_date,
      departure_time,
      price,
      available_seats: van.total_seats,
      status: 'scheduled'
    }, { transaction });

    // Create 12 seats for this schedule
    const seats = [];
    for (let i = 1; i <= van.total_seats; i++) {
      seats.push({
        schedule_id: schedule.id,
        seat_number: i,
        status: 'available'
      });
    }
    await Seat.bulkCreate(seats, { transaction });

    await transaction.commit();

    // Fetch complete schedule
    const completeSchedule = await Schedule.findByPk(schedule.id, {
      include: [
        { model: Route, as: 'route' },
        { model: Van, as: 'van' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: completeSchedule
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update schedule
 * PUT /api/admin/schedules/:id
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { departure_date, departure_time, price, status } = req.body;

    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    if (departure_date) schedule.departure_date = departure_date;
    if (departure_time) schedule.departure_time = departure_time;
    if (price) schedule.price = price;
    if (status) schedule.status = status;

    await schedule.save();

    const updatedSchedule = await Schedule.findByPk(id, {
      include: [
        { model: Route, as: 'route' },
        { model: Van, as: 'van' }
      ]
    });

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete schedule
 * DELETE /api/admin/schedules/:id
 */
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Check if there are bookings
    const bookingCount = await Booking.count({
      where: {
        schedule_id: id,
        status: {
          [Op.notIn]: ['cancelled']
        }
      }
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete schedule with active bookings'
      });
    }

    await schedule.destroy();

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all vans
 * GET /api/admin/vans
 */
exports.getAllVans = async (req, res) => {
  try {
    const vans = await Van.findAll({
      order: [['van_number', 'ASC']]
    });

    res.json({
      success: true,
      data: vans,
      count: vans.length
    });
  } catch (error) {
    console.error('Get all vans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vans',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create van
 * POST /api/admin/vans
 */
exports.createVan = async (req, res) => {
  try {
    const { van_number, license_plate, total_seats = 12, status = 'available' } = req.body;

    if (!van_number || !license_plate) {
      return res.status(400).json({
        success: false,
        message: 'Van number and license plate are required'
      });
    }

    const van = await Van.create({
      van_number,
      license_plate,
      total_seats,
      status
    });

    res.status(201).json({
      success: true,
      message: 'Van created successfully',
      data: van
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Van number or license plate already exists'
      });
    }
    
    console.error('Create van error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create van',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update van
 * PUT /api/admin/vans/:id
 */
exports.updateVan = async (req, res) => {
  try {
    const { id } = req.params;
    const { van_number, license_plate, status } = req.body;

    const van = await Van.findByPk(id);
    if (!van) {
      return res.status(404).json({
        success: false,
        message: 'Van not found'
      });
    }

    if (van_number) van.van_number = van_number;
    if (license_plate) van.license_plate = license_plate;
    if (status) van.status = status;

    await van.save();

    res.json({
      success: true,
      message: 'Van updated successfully',
      data: van
    });
  } catch (error) {
    console.error('Update van error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update van',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete van
 * DELETE /api/admin/vans/:id
 */
exports.deleteVan = async (req, res) => {
  try {
    const { id } = req.params;

    const van = await Van.findByPk(id);
    if (!van) {
      return res.status(404).json({
        success: false,
        message: 'Van not found'
      });
    }

    // Check if van has schedules
    const scheduleCount = await Schedule.count({
      where: { van_id: id }
    });

    if (scheduleCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete van with existing schedules'
      });
    }

    await van.destroy();

    res.json({
      success: true,
      message: 'Van deleted successfully'
    });
  } catch (error) {
    console.error('Delete van error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete van',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all routes
 * GET /api/admin/routes
 */
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      order: [['origin', 'ASC'], ['destination', 'ASC']]
    });

    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Get all routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get routes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create route
 * POST /api/admin/routes
 */
exports.createRoute = async (req, res) => {
  try {
    const { origin, destination, distance_km, duration_minutes, base_price } = req.body;

    if (!origin || !destination || !distance_km || !duration_minutes || !base_price) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const route = await Route.create({
      origin,
      destination,
      distance_km,
      duration_minutes,
      base_price
    });

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update route
 * PUT /api/admin/routes/:id
 */
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { origin, destination, distance_km, duration_minutes, base_price, is_active } = req.body;

    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (origin) route.origin = origin;
    if (destination) route.destination = destination;
    if (distance_km) route.distance_km = distance_km;
    if (duration_minutes) route.duration_minutes = duration_minutes;
    if (base_price) route.base_price = base_price;
    if (is_active !== undefined) route.is_active = is_active;

    await route.save();

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: route
    });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update route',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete route
 * DELETE /api/admin/routes/:id
 */
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByPk(id);
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check if route has schedules
    const scheduleCount = await Schedule.count({
      where: { route_id: id }
    });

    if (scheduleCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete route with existing schedules'
      });
    }

    await route.destroy();

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
