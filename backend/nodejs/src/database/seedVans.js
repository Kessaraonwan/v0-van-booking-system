const { Van } = require('../models');

async function seedVans() {
  try {
    console.log('🌱 Starting to seed vans...');

    // Clear existing vans
    await Van.destroy({ where: {} });
    console.log('🗑️  Cleared existing vans');

    const vans = [
      {
        van_number: 'V001',
        license_plate: 'กข-1234',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V002',
        license_plate: 'กค-5678',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V003',
        license_plate: 'กง-9012',
        total_seats: 9,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V004',
        license_plate: 'กจ-3456',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V005',
        license_plate: 'กฉ-7890',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V006',
        license_plate: 'กช-2468',
        total_seats: 9,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V007',
        license_plate: 'กซ-1357',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        van_number: 'V008',
        license_plate: 'กฌ-9753',
        total_seats: 12,
        status: 'available',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    const createdVans = await Van.bulkCreate(vans);
    
    console.log(`✅ Created ${createdVans.length} vans`);
    console.log('');
    console.log('📊 Vans:');
    createdVans.forEach(van => {
      console.log(`   - ${van.van_number} (${van.license_plate}): ${van.total_seats} ที่นั่ง`);
    });
    console.log('');
    console.log('✨ Van seeding completed successfully!');

    return createdVans;
  } catch (error) {
    console.error('❌ Error seeding vans:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedVans()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedVans;
