const express = require('express');
const router = express.Router();
const { Route } = require('../models');

/**
 * Get all active routes
 * GET /api/routes
 */
router.get('/', async (req, res) => {
  try {
    const routes = await Route.findAll({
      where: {
        is_active: true
      },
      order: [['origin', 'ASC'], ['destination', 'ASC']]
    });

    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get routes',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get route by ID
 * GET /api/routes/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findByPk(id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get route',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
