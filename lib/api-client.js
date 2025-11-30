// API Client for Van Booking System
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Token management
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
};

export const setRefreshToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', token);
  }
};

export const removeTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      // response is not JSON (could be HTML error page or plain text)
      data = text
    }

    if (!response.ok) {
      // Handle token expiration
      if (response.status === 401 && token) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          // Retry request with new token
          return apiRequest(endpoint, options);
        } else {
          removeTokens();
          window.location.href = '/login';
        }
      }

      const message = (data && typeof data === 'object' && data.message) ? data.message : (typeof data === 'string' ? data : 'API request failed');
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Refresh access token
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      data = text
    }

    if (response.ok && data && data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Token refresh error:', error);
    return false;
  }
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      setUser(data.data.user);
    }
    
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (data.success) {
      setToken(data.data.accessToken);
      setRefreshToken(data.data.refreshToken);
      setUser(data.data.user);
    }
    
    return data;
  },

  logout: () => {
    removeTokens();
  },

  getProfile: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (userData) => {
    return apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  changePassword: async (passwords) => {
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  },
};

// Schedule API
export const scheduleAPI = {
  search: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/schedules/search?${queryString}`);
  },

  getById: async (id) => {
    return apiRequest(`/schedules/${id}`);
  },

  getSeats: async (id) => {
    return apiRequest(`/schedules/${id}/seats`);
  },
  
  getAll: async () => {
    return apiRequest('/schedules');
  },
};

// Booking API
export const bookingAPI = {

  create: async (bookingData) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async (status = 'all') => {
    const q = status && status !== 'all' ? `?status=${status}` : '';
    return apiRequest(`/bookings${q}`);
  },

  getById: async (id) => {
    return apiRequest(`/bookings/${id}`);
  },

  cancel: async (id, reason) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// Payments API (mock/payment endpoints)
export const paymentsAPI = {
  create: async (paymentData) => {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  },

  getByBookingId: async (bookingId) => {
    return apiRequest(`/payments/${bookingId}`)
  }
}

// Route API
export const routeAPI = {
  getAll: async () => {
    return apiRequest('/routes');
  },

  getById: async (id) => {
    return apiRequest(`/routes/${id}`);
  },

  getPickupPoints: async (routeId) => {
    return apiRequest(`/routes/${routeId}/pickup-points`);
  },

  getDropoffPoints: async (routeId) => {
    return apiRequest(`/routes/${routeId}/dropoff-points`);
  },
};

// Review API
export const reviewAPI = {
  getAll: async (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    const suffix = qs ? `?${qs}` : ''
    return apiRequest(`/reviews${suffix}`)
  }
}

// Van API
export const vanAPI = {
  getAll: async () => {
    return apiRequest('/vans');
  },

  getById: async (id) => {
    return apiRequest(`/vans/${id}`);
  },
};

// Admin API
export const adminAPI = {
  // Dashboard
  getDashboardStats: async () => {
    return apiRequest('/admin/dashboard');
  },
  getTodaySchedules: async () => {
    // kept for compatibility; frontend uses scheduleAPI.search for today schedules
    return apiRequest('/admin/schedules');
  },

  getRecentBookings: async (limit = 10) => {
    // recent bookings are returned inside /admin/dashboard
    return apiRequest('/admin/dashboard');
  },

  // Bookings
  getAllBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/bookings?${queryString}`);
  },

  getBookingDetails: async (id) => {
    return apiRequest(`/admin/bookings/${id}`);
  },

  updateBookingStatus: async (id, status) => {
    return apiRequest(`/admin/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Schedules
  getAllSchedules: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/schedules?${queryString}`);
  },

  createSchedule: async (scheduleData) => {
    return apiRequest('/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(scheduleData),
    });
  },

  updateSchedule: async (id, scheduleData) => {
    return apiRequest(`/admin/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  },

  deleteSchedule: async (id) => {
    return apiRequest(`/admin/schedules/${id}`, {
      method: 'DELETE',
    });
  },

  // Vans
  getAllVans: async () => {
    return apiRequest('/admin/vans');
  },

  createVan: async (vanData) => {
    return apiRequest('/admin/vans', {
      method: 'POST',
      body: JSON.stringify(vanData),
    });
  },

  updateVan: async (id, vanData) => {
    return apiRequest(`/admin/vans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vanData),
    });
  },

  deleteVan: async (id) => {
    return apiRequest(`/admin/vans/${id}`, {
      method: 'DELETE',
    });
  },

  // Routes
  getAllRoutes: async () => {
    return apiRequest('/admin/routes');
  },

  createRoute: async (routeData) => {
    return apiRequest('/admin/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  updateRoute: async (id, routeData) => {
    return apiRequest(`/admin/routes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(routeData),
    });
  },

  deleteRoute: async (id) => {
    return apiRequest(`/admin/routes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  authAPI,
  scheduleAPI,
  bookingAPI,
  routeAPI,
  vanAPI,
  adminAPI,
};
