const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  booking_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  route_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  user_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'ชื่อผู้รีวิว (คัดลอกมาจาก users.name)'
  },
  avatar_color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#EF4444',
    comment: 'สีของ avatar แบบ hex code'
  },
  route_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'ชื่อเส้นทาง เช่น "กรุงเทพฯ - พัทยา"'
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'แสดงรีวิวหรือไม่ (สำหรับ admin ซ่อน)'
  }
}, {
  tableName: 'reviews',
  timestamps: true,
  underscored: true
});

module.exports = Review;
