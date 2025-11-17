const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Schedule = sequelize.define('Schedule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  route_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routes',
      key: 'id'
    }
  },
  van_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'vans',
      key: 'id'
    }
  },
  departure_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  available_seats: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'departed', 'completed', 'cancelled'),
    defaultValue: 'scheduled',
    allowNull: false
  }
}, {
  tableName: 'schedules',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['departure_date', 'route_id']
    }
  ]
});

module.exports = Schedule;
