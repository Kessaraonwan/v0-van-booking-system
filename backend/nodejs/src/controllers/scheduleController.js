const { Schedule, Route, Van, Seat, Booking } = require('../models');
const { Op } = require('sequelize');

/**
 * Search schedules
 * GET /api/schedules/search?from=Bangkok&to=Pattaya&date=2024-02-01
 */
exports.searchSchedules = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({
        success: false,
        message: 'Origin, destination, and date are required'
      });
    }

    // Find schedules
    const schedules = await Schedule.findAll({
      where: {
        departure_date: date,
        status: 'scheduled',
        available_seats: {
          [Op.gt]: 0
        }
      },
      include: [
        {
          model: Route,
          as: 'route',
          where: {
            origin: { [Op.iLike]: `%${from}%` },
            destination: { [Op.iLike]: `%${to}%` },
            is_active: true
          }
        },
        {
          model: Van,
          as: 'van',
          where: {
            is_active: true
          }
        }
      ],
      order: [['departure_time', 'ASC']]
    });

    res.json({
      success: true,
      data: schedules,
      count: schedules.length
    });
  } catch (error) {
    console.error('Search schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search schedules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get schedule by ID
 * GET /api/schedules/:id
 */
exports.getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findByPk(id, {
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
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedule',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get schedule seats
 * GET /api/schedules/:id/seats
 */
exports.getScheduleSeats = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if schedule exists
    const schedule = await Schedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    // Get all seats for this schedule
    const seats = await Seat.findAll({
      where: {
        schedule_id: id
      },
      order: [['seat_number', 'ASC']],
      include: [
        {
          model: Booking,
          as: 'booking',
          attributes: ['booking_number', 'status']
        }
      ]
    });

    // If no seats exist, create them
    if (seats.length === 0) {
      const newSeats = [];
      for (let i = 1; i <= 12; i++) {
        newSeats.push({
          schedule_id: id,
          seat_number: i,
          status: 'available'
        });
      }
      await Seat.bulkCreate(newSeats);

      // Fetch newly created seats
      const createdSeats = await Seat.findAll({
        where: { schedule_id: id },
        order: [['seat_number', 'ASC']]
      });

      return res.json({
        success: true,
        data: createdSeats
      });
    }

    res.json({
      success: true,
      data: seats
    });
  } catch (error) {
    console.error('Get schedule seats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get schedule seats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
