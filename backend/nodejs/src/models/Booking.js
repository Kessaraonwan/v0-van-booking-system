const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  schedule_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'schedules',
      key: 'id'
    }
  },
  passenger_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  passenger_phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  passenger_email: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seat_numbers: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'bookings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['booking_number']
    },
    {
      fields: ['user_id', 'created_at']
    }
  ]
});

module.exports = Booking;
