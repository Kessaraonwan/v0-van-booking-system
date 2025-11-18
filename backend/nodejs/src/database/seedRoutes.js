const { Route } = require('../models');

const routes = [
  {
    origin: 'กรุงเทพฯ',
    destination: 'พัทยา',
    distance_km: 147,
    duration_minutes: 120,
    base_price: 150,
    image_url: 'https://i0.wp.com/www.iurban.in.th/wp-content/uploads/2019/12/trave-pattaya-beach-2.jpg?ssl=1',
    is_active: true
  },
  {
    origin: 'กรุงเทพฯ',
    destination: 'หัวหิน',
    distance_km: 200,
    duration_minutes: 180,
    base_price: 200,
    image_url: 'https://th.bing.com/th/id/R.1ddae54299839062b7d07ed01f121813?rik=O8e%2b2qwrhcZI3A&riu=http%3a%2f%2fwww.chillnaid.com%2fwp-content%2fuploads%2f2018%2f03%2f%e0%b8%8a%e0%b8%b2%e0%b8%a2%e0%b8%ab%e0%b8%b2%e0%b8%94%e0%b8%ab%e0%b8%b1%e0%b8%a7%e0%b8%ab%e0%b8%b4%e0%b8%99.jpg&ehk=XY%2fff2s%2bDBVI3M7lyBMXCMHhzsmfePn0UMRkbcJLCNo%3d&risl=&pid=ImgRaw&r=0',
    is_active: true
  },
  {
    origin: 'กรุงเทพฯ',
    destination: 'เชียงใหม่',
    distance_km: 696,
    duration_minutes: 600,
    base_price: 650,
    image_url: 'https://ik.imagekit.io/tvlk/blog/2018/07/Doi-Inthanon-ChiangMai-Traveloka-1.jpg?tr=dpr-2,w-675',
    is_active: true
  },
  {
    origin: 'กรุงเทพฯ',
    destination: 'ภูเก็ต',
    distance_km: 862,
    duration_minutes: 720,
    base_price: 800,
    image_url: 'https://a.cdn-hotels.com/gdcs/production143/d432/708ca73b-6b7b-4919-9374-b41a0f0fb3fb.jpg?impolicy=fcrop&w=800&h=533',
    is_active: true
  },
  {
    origin: 'กรุงเทพฯ',
    destination: 'ขอนแก่น',
    distance_km: 445,
    duration_minutes: 360,
    base_price: 450,
    image_url: 'https://th.bing.com/th/id/R.cb6be0731ee8b7e3d3bf2597d9a4ade1?rik=438IEqXLRBZbJQ&pid=ImgRaw&r=0',
    is_active: true
  },
  {
    origin: 'พัทยา',
    destination: 'กรุงเทพฯ',
    distance_km: 147,
    duration_minutes: 120,
    base_price: 150,
    image_url: 'https://cdn.pixabay.com/photo/2020/04/24/22/05/bangkok-5088795_960_720.jpg',
    is_active: true
  },
  {
    origin: 'หัวหิน',
    destination: 'กรุงเทพฯ',
    distance_km: 200,
    duration_minutes: 180,
    base_price: 200,
    image_url: 'https://cdn.pixabay.com/photo/2020/04/24/22/05/bangkok-5088795_960_720.jpg',
    is_active: true
  },
  {
    origin: 'เชียงใหม่',
    destination: 'กรุงเทพฯ',
    distance_km: 696,
    duration_minutes: 600,
    base_price: 650,
    image_url: 'https://cdn.pixabay.com/photo/2020/04/24/22/05/bangkok-5088795_960_720.jpg',
    is_active: true
  },
  {
    origin: 'ภูเก็ต',
    destination: 'กรุงเทพฯ',
    distance_km: 862,
    duration_minutes: 720,
    base_price: 800,
    image_url: 'https://cdn.pixabay.com/photo/2020/04/24/22/05/bangkok-5088795_960_720.jpg',
    is_active: true
  },
  {
    origin: 'ขอนแก่น',
    destination: 'กรุงเทพฯ',
    distance_km: 445,
    duration_minutes: 360,
    base_price: 450,
    image_url: 'https://cdn.pixabay.com/photo/2020/04/24/22/05/bangkok-5088795_960_720.jpg',
    is_active: true
  }
];

async function seedRoutes() {
  try {
    console.log('🌱 Starting to seed routes...');
    
    // ลบข้อมูลเดิมทั้งหมด
    await Route.destroy({ where: {} });
    console.log('✅ Cleared existing routes');
    
    // เพิ่มข้อมูลใหม่
    const createdRoutes = await Route.bulkCreate(routes);
    console.log(`✅ Created ${createdRoutes.length} routes`);
    
    console.log('\n📊 Routes Summary:');
    createdRoutes.forEach(route => {
      console.log(`  - ${route.origin} → ${route.destination}: ฿${route.base_price} (${Math.round(route.duration_minutes / 60)} ชม.)`);
    });
    
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding routes:', error);
    process.exit(1);
  }
}

// รันถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  seedRoutes();
}

module.exports = seedRoutes;
