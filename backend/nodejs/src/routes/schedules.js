const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { optionalAuth } = require('../middleware/auth');

// Public routes
router.get('/search', optionalAuth, scheduleController.searchSchedules);
router.get('/:id', optionalAuth, scheduleController.getScheduleById);
router.get('/:id/seats', optionalAuth, scheduleController.getScheduleSeats);

module.exports = router;
