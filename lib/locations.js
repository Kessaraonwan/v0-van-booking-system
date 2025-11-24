// ข้อมูลจุดขึ้นรถ-ลงรถสำหรับแต่ละจังหวัด

export const PICKUP_LOCATIONS = {
  'กรุงเทพฯ': {
    name: 'หมอชิตใหม่',
    full: 'ท่ารถตู้หมอชิตใหม่ - กรุงเทพฯ',
    address: 'อาคารจอดรถ ฝั่งทิศเหนือ หมอชิตใหม่',
    province: 'กรุงเทพฯ'
  },
  'กรุงเทพมหานคร': {
    name: 'หมอชิตใหม่',
    full: 'ท่ารถตู้หมอชิตใหม่ - กรุงเทพฯ',
    address: 'อาคารจอดรถ ฝั่งทิศเหนือ หมอชิตใหม่',
    province: 'กรุงเทพฯ'
  },
  'พัทยา': {
    name: 'พัทยากลาง',
    full: 'ท่ารถตู้พัทยากลาง - ชลบุรี',
    address: 'ใกล้เซ็นทรัลพัทยา ถนนพัทยากลาง',
    province: 'ชลบุรี'
  },
  'หัวหิน': {
    name: 'หัวหินตลาดฉัตรไชย',
    full: 'ท่ารถตู้หัวหิน - ประจวบคีรีขันธ์',
    address: 'ใกล้ตลาดฉัตรไชย ถนนเพชรเกษม',
    province: 'ประจวบคีรีขันธ์'
  },
  'เชียงใหม่': {
    name: 'อาเขต',
    full: 'ท่ารถตู้อาเขต - เชียงใหม่',
    address: 'ใกล้สนามบินเชียงใหม่ หน้าโลตัสอาเขต',
    province: 'เชียงใหม่'
  },
  'ขอนแก่น': {
    name: 'เซ็นทรัลขอนแก่น',
    full: 'ท่ารถตู้ขอนแก่น - ขอนแก่น',
    address: 'หน้าเซ็นทรัลพลาซ่า ขอนแก่น',
    province: 'ขอนแก่น'
  },
  'ภูเก็ต': {
    name: 'ตลาดสดภูเก็ต',
    full: 'ท่ารถตู้ภูเก็ต - ภูเก็ต',
    address: 'ใกล้ตลาดสดภูเก็ต ถนนรังสิต',
    province: 'ภูเก็ต'
  },
  'อยุธยา': {
    name: 'สถานีรถอยุธยา',
    full: 'ท่ารถตู้อยุธยา - พระนครศรีอยุธยา',
    address: 'ใกล้สถานีรถไฟอยุธยา',
    province: 'พระนครศรีอยุธยา'
  },
  'นครราชสีมา': {
    name: 'เทอร์มินัลโคราช',
    full: 'ท่ารถตู้โคราช - นครราชสีมา',
    address: 'สถานีขนส่งผู้โดยสารจังหวัดนครราชสีมา',
    province: 'นครราชสีมา'
  },
  'เชียงราย': {
    name: 'หอนาฬิกาเชียงราย',
    full: 'ท่ารถตู้เชียงราย - เชียงราย',
    address: 'ใกล้หอนาฬิกา ถนนพหลโยธิน',
    province: 'เชียงราย'
  },
  'กาญจนบุรี': {
    name: 'สะพานข้ามแม่น้ำแคว',
    full: 'ท่ารถตู้กาญจนบุรี - กาญจนบุรี',
    address: 'ใกล้สะพานข้ามแม่น้ำแคว',
    province: 'กาญจนบุรี'
  }
}

// Helper Functions

/**
 * ดึงข้อมูลจุดขึ้นรถ
 * @param {string} city - ชื่อเมือง เช่น "กรุงเทพฯ"
 * @returns {object} - {name, full, address, province}
 */
export function getPickupLocation(city) {
  return PICKUP_LOCATIONS[city] || {
    name: city,
    full: `จุดขึ้นรถใน${city}`,
    address: '',
    province: city
  }
}

/**
 * ดึงข้อมูลจุดลงรถ (เหมือนกับจุดขึ้นรถ)
 * @param {string} city - ชื่อเมือง เช่น "พัทยา"
 * @returns {object} - {name, full, address, province}
 */
export function getDropoffLocation(city) {
  return PICKUP_LOCATIONS[city] || {
    name: city,
    full: `จุดลงรถใน${city}`,
    address: '',
    province: city
  }
}

/**
 * แสดงข้อความเส้นทางแบบสั้น
 * @param {string} origin - ต้นทาง
 * @param {string} destination - ปลายทาง
 * @returns {string} - "หมอชิตใหม่ → พัทยากลาง"
 */
export function getRouteShortText(origin, destination) {
  const pickup = getPickupLocation(origin)
  const dropoff = getDropoffLocation(destination)
  return `${pickup.name} → ${dropoff.name}`
}

/**
 * แสดงข้อความเส้นทางแบบเต็ม
 * @param {string} origin - ต้นทาง
 * @param {string} destination - ปลายทาง
 * @returns {string} - "หมอชิตใหม่ - กรุงเทพฯ → พัทยากลาง - ชลบุรี"
 */
export function getRouteFullText(origin, destination) {
  const pickup = getPickupLocation(origin)
  const dropoff = getDropoffLocation(destination)
  return `${pickup.name} - ${pickup.province} → ${dropoff.name} - ${dropoff.province}`
}

/**
 * แปลงรูปแบบวันที่เป็นภาษาไทย
 * @param {string} dateStr - วันที่ในรูปแบบ "YYYY-MM-DD"
 * @returns {string} - "19 พ.ย. 2568"
 */
export function formatThaiDate(dateStr) {
  if (!dateStr) return 'N/A'
  const [year, month, day] = dateStr.split('-')
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  return `${parseInt(day)} ${thaiMonths[parseInt(month)-1]} ${parseInt(year)+543}`
}

/**
 * แปลงเวลา 24hr เป็น 12hr
 * @param {string} timeStr - เวลาในรูปแบบ "08:00:00" หรือ "08:00"
 * @returns {string} - "08:00 น."
 */
export function formatTime(timeStr) {
  if (!timeStr) return 'N/A'
  const time = timeStr.split(':')
  return `${time[0]}:${time[1]} น.`
}
