const User = require('./User');
const Route = require('./Route');
const Van = require('./Van');
const Schedule = require('./Schedule');
const Seat = require('./Seat');
const Booking = require('./Booking');
const Payment = require('./Payment');

// Define relationships

// User -> Bookings (One-to-Many)
User.hasMany(Booking, {
  foreignKey: 'user_id',
  as: 'bookings'
});
Booking.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Route -> Schedules (One-to-Many)
Route.hasMany(Schedule, {
  foreignKey: 'route_id',
  as: 'schedules'
});
Schedule.belongsTo(Route, {
  foreignKey: 'route_id',
  as: 'route'
});

// Van -> Schedules (One-to-Many)
Van.hasMany(Schedule, {
  foreignKey: 'van_id',
  as: 'schedules'
});
Schedule.belongsTo(Van, {
  foreignKey: 'van_id',
  as: 'van'
});

// Schedule -> Seats (One-to-Many)
Schedule.hasMany(Seat, {
  foreignKey: 'schedule_id',
  as: 'seats'
});
Seat.belongsTo(Schedule, {
  foreignKey: 'schedule_id',
  as: 'schedule'
});

// Schedule -> Bookings (One-to-Many)
Schedule.hasMany(Booking, {
  foreignKey: 'schedule_id',
  as: 'bookings'
});
Booking.belongsTo(Schedule, {
  foreignKey: 'schedule_id',
  as: 'schedule'
});

// Booking -> Seats (One-to-Many)
Booking.hasMany(Seat, {
  foreignKey: 'booking_id',
  as: 'seats'
});
Seat.belongsTo(Booking, {
  foreignKey: 'booking_id',
  as: 'booking'
});

// Booking -> Payment (One-to-One)
Booking.hasOne(Payment, {
  foreignKey: 'booking_id',
  as: 'payment'
});
Payment.belongsTo(Booking, {
  foreignKey: 'booking_id',
  as: 'booking'
});

module.exports = {
  User,
  Route,
  Van,
  Schedule,
  Seat,
  Booking,
  Payment
};
