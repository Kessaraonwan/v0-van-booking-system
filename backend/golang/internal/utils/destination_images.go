package utils

// GetDestinationImage คืนรูปภาพตามชื่อจังหวัดปลายทาง
// แต่ละจังหวัดจะมีรูปเดียวกันหมด ไม่ว่าจะเป็นเส้นทางไหน
func GetDestinationImage(destination string) string {
	destinationImages := map[string]string{
		"เชียงใหม่":     "https://images.unsplash.com/photo-1528127269322-539801943592?w=800",
		"ภูเก็ต":       "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800",
		"พัทยา":       "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
		"หัวหิน":       "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
		"นครราชสีมา":   "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
		"เชียงราย":     "https://images.unsplash.com/photo-1598968410076-4037e9c4efd6?w=800",
		"อยุธยา":       "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
		"กาญจนบุรี":     "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800",
		"กรุงเทพมหานคร": "https://images.unsplash.com/photo-1563532743-00f748edf47a?w=800",
		"กรุงเทพฯ":     "https://images.unsplash.com/photo-1563532743-00f748edf47a?w=800",
	}

	if image, exists := destinationImages[destination]; exists {
		return image
	}

	// Fallback: ถ้าไม่เจอจังหวัด ใช้รูปทั่วไป
	return "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800"
}
