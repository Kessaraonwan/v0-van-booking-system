const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/', optionalAuth, scheduleController.searchSchedules); // Get all or search
router.get('/search', optionalAuth, scheduleController.searchSchedules);
router.get('/:id/seats', optionalAuth, scheduleController.getScheduleSeats);
router.get('/:id', optionalAuth, scheduleController.getScheduleById);

module.exports = router;
