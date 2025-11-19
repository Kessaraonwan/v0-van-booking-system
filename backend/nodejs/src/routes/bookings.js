const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes (require authentication)
router.post('/create', authMiddleware, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.post('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.post('/:id/pay', authMiddleware, bookingController.payBooking);

module.exports = router;
