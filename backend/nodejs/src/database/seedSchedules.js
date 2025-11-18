const { Schedule, Route, Van, Seat } = require('../models');
const { Op } = require('sequelize');

async function seedSchedules() {
  try {
    console.log('🌱 Starting to seed schedules...');

    // Get all active routes and vans
    const routes = await Route.findAll({ where: { is_active: true } });
    const vans = await Van.findAll({ where: { is_active: true } });

    if (routes.length === 0) {
      console.log('❌ No routes found. Please seed routes first.');
      return;
    }

    if (vans.length === 0) {
      console.log('❌ No vans found. Please seed vans first.');
      return;
    }

    console.log(`Found ${routes.length} routes and ${vans.length} vans`);

    // Clear existing schedules
    await Seat.destroy({ where: {} });
    await Schedule.destroy({ where: {} });
    console.log('🗑️  Cleared existing schedules and seats');

    const schedules = [];
    const today = new Date();
    
    // Create schedules for next 7 days
    for (let day = 0; day < 7; day++) {
      const scheduleDate = new Date(today);
      scheduleDate.setDate(today.getDate() + day);
      const dateStr = scheduleDate.toISOString().split('T')[0];

      // For each route
      for (const route of routes) {
        // Create 3 schedules per day (morning, afternoon, evening)
        const times = ['08:00:00', '12:00:00', '16:00:00'];
        
        for (const time of times) {
          // Randomly select a van
          const van = vans[Math.floor(Math.random() * vans.length)];
          
          const departureDateTime = new Date(`${dateStr}T${time}`);
          
          // Calculate arrival time (assume 2-4 hours trip)
          const tripHours = 2 + Math.floor(Math.random() * 3);
          const arrivalDateTime = new Date(departureDateTime);
          arrivalDateTime.setHours(arrivalDateTime.getHours() + tripHours);

          // Use base price from route
          const price = route.base_price || 150;

          schedules.push({
            route_id: route.id,
            van_id: van.id,
            departure_date: dateStr,
            departure_time: departureDateTime,
            price: price,
            available_seats: van.total_seats,
            status: 'scheduled',
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }
    }

    // Bulk create schedules
    const createdSchedules = await Schedule.bulkCreate(schedules);
    console.log(`✅ Created ${createdSchedules.length} schedules`);

    // Create seats for each schedule
    let totalSeats = 0;
    for (const schedule of createdSchedules) {
      const van = await Van.findByPk(schedule.van_id);
      const seats = [];
      
      for (let seatNum = 1; seatNum <= van.total_seats; seatNum++) {
        seats.push({
          schedule_id: schedule.id,
          seat_number: seatNum,
          is_available: true,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      
      await Seat.bulkCreate(seats);
      totalSeats += seats.length;
    }

    console.log(`✅ Created ${totalSeats} seats`);
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - Schedules: ${createdSchedules.length}`);
    console.log(`   - Seats: ${totalSeats}`);
    console.log(`   - Date range: ${schedules[0].departure_date} to ${schedules[schedules.length - 1].departure_date}`);
    console.log('');
    console.log('✨ Schedule seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding schedules:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedSchedules()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedSchedules;
