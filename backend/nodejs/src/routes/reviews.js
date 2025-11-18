const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { getReviews, createReview } = require('../controllers/reviewController');

// Public routes
router.get('/', getReviews);

// Protected routes (ต้อง login)
router.post('/', authMiddleware, createReview);

module.exports = router;
