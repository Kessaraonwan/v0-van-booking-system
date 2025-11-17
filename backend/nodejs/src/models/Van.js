const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Van = sequelize.define('Van', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  van_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  license_plate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  total_seats: {
    type: DataTypes.INTEGER,
    defaultValue: 12,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'in_service', 'maintenance'),
    defaultValue: 'available',
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'vans',
  timestamps: true,
  underscored: true
});

module.exports = Van;
