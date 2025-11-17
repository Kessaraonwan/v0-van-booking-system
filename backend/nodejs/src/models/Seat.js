const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Seat = sequelize.define('Seat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  schedule_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schedules',
      key: 'id'
    }
  },
  seat_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'reserved'),
    defaultValue: 'available',
    allowNull: false
  },
  booking_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'bookings',
      key: 'id'
    }
  }
}, {
  tableName: 'seats',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['schedule_id', 'seat_number']
    }
  ]
});

module.exports = Seat;
