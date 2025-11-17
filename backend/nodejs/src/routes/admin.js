const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// Dashboard stats
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/dashboard/today-schedules', adminController.getTodaySchedules);
router.get('/dashboard/recent-bookings', adminController.getRecentBookings);

// Bookings management
router.get('/bookings', adminController.getAllBookings);
router.get('/bookings/:id', adminController.getBookingDetails);
router.put('/bookings/:id/status', adminController.updateBookingStatus);

// Schedules management
router.get('/schedules', adminController.getAllSchedules);
router.post('/schedules', adminController.createSchedule);
router.put('/schedules/:id', adminController.updateSchedule);
router.delete('/schedules/:id', adminController.deleteSchedule);

// Vans management
router.get('/vans', adminController.getAllVans);
router.post('/vans', adminController.createVan);
router.put('/vans/:id', adminController.updateVan);
router.delete('/vans/:id', adminController.deleteVan);

// Routes management
router.get('/routes', adminController.getAllRoutes);
router.post('/routes', adminController.createRoute);
router.put('/routes/:id', adminController.updateRoute);
router.delete('/routes/:id', adminController.deleteRoute);

module.exports = router;
