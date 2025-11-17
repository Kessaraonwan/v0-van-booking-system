const express = require('express');
const router = express.Router();
const { Van } = require('../models');

/**
 * Get all active vans
 * GET /api/vans
 */
router.get('/', async (req, res) => {
  try {
    const vans = await Van.findAll({
      where: {
        is_active: true,
        status: 'available'
      },
      order: [['van_number', 'ASC']]
    });

    res.json({
      success: true,
      data: vans,
      count: vans.length
    });
  } catch (error) {
    console.error('Get vans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get vans',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * Get van by ID
 * GET /api/vans/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const van = await Van.findByPk(id);

    if (!van) {
      return res.status(404).json({
        success: false,
        message: 'Van not found'
      });
    }

    res.json({
      success: true,
      data: van
    });
  } catch (error) {
    console.error('Get van error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get van',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
