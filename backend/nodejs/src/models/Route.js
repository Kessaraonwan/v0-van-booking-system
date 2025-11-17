const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  distance_km: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'routes',
  timestamps: true,
  underscored: true
});

module.exports = Route;
